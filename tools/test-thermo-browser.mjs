import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.STUDY_GARDEN_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const base = 'https://study-garden.test/study-garden';
const errors = [], missing = [];
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
// Keep the GitHub Pages project prefix, while serving real files without network.
await context.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.hostname !== 'study-garden.test') return route.abort();
  if (!url.pathname.startsWith('/study-garden/')) {
    missing.push(url.pathname);
    return route.fulfill({ status: 404, body: 'Missing project prefix' });
  }
  const path = resolve(root, '.' + decodeURIComponent(url.pathname.slice('/study-garden'.length)).replace(/\/$/, '/index.html'));
  if (!path.startsWith(resolve(root) + sep)) return route.abort();
  try { await route.fulfill({ body: await readFile(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
  catch { missing.push(url.pathname); await route.fulfill({ status: 404, body: 'Missing asset' }); }
});
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
const settle = () => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
async function topic(id) {
  if (!await page.locator(`.reader-topic[href="#${id}"]`).isVisible()) await page.locator('.reader-menu-toggle').click();
  await page.locator(`.reader-topic[href="#${id}"]`).click();
  await settle();
  assert.ok(await page.locator(`.lesson-section[id="${id}"]`).isVisible());
}
let topics = 0, labs = 0, quizzes = 0;
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + '/index.html');
    await page.locator('#subject-search').fill('611201');
    assert.equal(await page.locator('.subject-folder:visible').count(), 1);
    await page.locator('.subject-folder:visible').click();
    assert.equal(await page.locator('.thermo-course-card').count(), 9);
    assert.ok(await page.locator('body').evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    if (output) await page.screenshot({ path: resolve(output, `thermo-index-${width}.png`) });
    for (let chapter = 1; chapter <= 9; chapter++) {
      const id = String(chapter).padStart(2, '0');
      await page.goto(`${base}/subjects/thermo-chemical/chapter-${id}.html`);
      const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
      assert.equal(new Set(ids).size, ids.length, `${id}: unique initialized IDs`);
      const sections = await page.locator('.lesson-content > .lesson-section').evaluateAll(nodes => nodes.map(node => node.id));
      for (const section of sections) {
        await topic(section);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        assert.ok(overflow <= 1, `${width}px chapter ${id}#${section}: overflow ${overflow}`);
        topics++;
      }
      await topic('experiment');
      const inputs = page.locator('[data-thermo-input]');
      for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i);
        await input.fill(await input.getAttribute('min'));
        const minimum = await page.locator('#thermo-output').innerText();
        await input.fill(await input.getAttribute('max'));
        const maximum = await page.locator('#thermo-output').innerText();
        assert.notEqual(minimum, maximum, `${id}: slider changes result`);
        assert.ok(!/NaN|Infinity|undefined/.test(minimum + maximum));
      }
      labs++;
      if (output && [1, 5, 9].includes(chapter)) {
        await page.locator('.thermo-experiment').screenshot({ path: resolve(output, `thermo-${id}-lab-${width}.png`) });
        if (width === 390) await page.locator('[data-theme-toggle]').click();
        await topic('concept-map');
        await page.screenshot({ path: resolve(output, `thermo-${id}-${width}.png`) });
      }
      if (width === 1440 || [1, 5, 9].includes(chapter)) {
        await topic('flashcards');
        const front = await page.locator('#flash-text').innerText();
        await page.locator('#flashcard').click();
        assert.notEqual(await page.locator('#flash-text').innerText(), front);
        await page.locator('#flash-next').click();
        await topic('quiz');
        assert.equal(await page.locator('.quiz-question').count(), 10);
        await page.locator('#quiz-submit').click();
        assert.match(await page.locator('#quiz-error').innerText(), /10/);
        const answers = await page.evaluate(id => window.StudyContent['thermo-chemical'][id].quiz.map(question => question.answer), id);
        for (const [index, answer] of answers.entries()) await page.locator(`input[name="q${index}"][value="${answer}"]`).check();
        await page.locator('#quiz-submit').click();
        assert.match(await page.locator('#quiz-score').innerText(), /10 \/ 10/);
        assert.equal(await page.locator('.explanation:visible').count(), 10);
        await page.locator('#quiz-retry').click();
        assert.equal(await page.locator('.quiz-option input:checked').count(), 0);
        quizzes++;
      }
      if (width === 1440) {
        await topic('sources');
        await page.locator('[data-mark-read]').click();
        await page.reload();
        assert.equal(await page.locator('[data-mark-read]').getAttribute('aria-pressed'), 'true');
      }
    }
    console.log(`PASS: ${width}px all 9 chapters, every topic, labs and Pages project paths.`);
  }
  await page.goto(base + '/subjects/thermo-chemical/index.html');
  assert.equal(await page.locator('[data-read-count]').innerText(), '9');
  await page.goto(base + '/index.html');
  assert.equal(await page.locator('[data-course-read-count="thermo-chemical"]').innerText(), '9');
  assert.equal(await page.locator('[data-read-count]').innerText(), '9');
  for (const course of ['itds241', 'itds261', 'itds294']) assert.equal(await page.locator(`[data-course-read-count="${course}"]`).innerText(), '0');
  assert.deepEqual(errors, [], 'No browser runtime errors');
  assert.deepEqual(missing, [], 'No missing local assets or invalid project paths');
  console.log(`PASS: ${topics} topic checks / ${labs} lab checks / ${quizzes} quiz and flashcard flows / persisted independent course progress.`);
} finally {
  await context.close();
  await browser.close();
}
