// Removing availability handling would let unfinished courses navigate or animate as links.
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const base = 'https://study-garden.test/index.html';
const output = process.env.STUDY_GARDEN_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];

function fixture(variant) {
  let index = 0;
  return home.replace(/<article\b[\s\S]*?<\/article>/g, card => {
    const course = index++;
    if (course === 0) {
      if (variant === 'missing') return card.replace(/ href="[^"]*"/g, '');
      if (variant === 'empty') return card.replace(/ href="[^"]*"/g, ' href="  "');
      return card.replace('<article ', '<article data-course-status="in-progress" ');
    }
    if (course === 1) return card.replace('<article ', '<article data-course-status="coming-soon" ');
    if (course === 2) return card.replace(/ href="[^"]*"/g, ' href="#"');
    return card;
  });
}

try {
  const page = await useLocalFiles(await browser.newPage({ reducedMotion: 'reduce' }), root);
  page.on('pageerror', error => errors.push(error.message));
  for (const variant of ['explicit', 'empty', 'missing']) {
    await page.route(base, route => route.fulfill({ body: fixture(variant), contentType: 'text/html; charset=utf-8' }));
    await page.goto(base);
    const cards = page.locator('.subject-grid .folder-card');
    for (const [index, label] of [[0, variant === 'explicit' ? 'In Progress' : 'Coming Soon'], [1, 'Coming Soon'], [2, 'Coming Soon']]) {
      const card = cards.nth(index);
      assert.equal(await card.locator('a[href], button, [tabindex]:not([tabindex="-1"])').count(), 0,
        `${variant}: unfinished course cannot be clicked or reached as a keyboard action`);
      assert.equal(await card.locator('.course-status').innerText(), label);
      assert.ok((await card.getAttribute('aria-label')).includes(label), 'Assistive technology can identify the unavailable course and its status');
      assert.equal(await card.locator('[data-course-read-count], .folder-key').count(), 0,
        'Unavailable course must not promise reading progress or opening a folder');
      const before = page.url();
      await card.locator('.subject-folder').click();
      await card.locator('.folder-caption h3').click();
      assert.equal(page.url(), before, 'Clicking either former course link does not navigate or change the hash');
    }
    await page.locator('#subject-search').fill('ITDS261');
    assert.equal(await page.locator('.folder-card:visible').count(), 1, 'Upcoming courses remain searchable');
    assert.equal(await page.locator('#search-empty').isVisible(), false);
    await page.locator('#subject-search').fill('ไม่มีวิชานี้');
    assert.equal(await page.locator('#search-empty').isVisible(), true);
    await page.locator('#subject-search').fill('');
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 1100 });
        const card = cards.first();
        const opacity = await card.locator('.subject-folder').evaluate(el => Number(getComputedStyle(el).opacity));
        assert.ok(opacity < 1 && opacity >= 0.5, 'Unavailable folder is visibly muted');
        const front = card.locator('.folder-front');
        const transform = await front.evaluate(el => getComputedStyle(el).transform);
        await card.locator('.subject-folder').hover();
        assert.equal(await front.evaluate(el => getComputedStyle(el).transform), transform, 'Unavailable folder does not animate open on hover');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme}/${width}: no overflow`);
        if (output && variant === 'explicit') await page.screenshot({ path: resolve(output, `availability-${theme}-${width}.png`), fullPage: true });
      }
    }
    await page.locator('#subject-search').focus();
    await page.keyboard.press('Tab');
    assert.equal(await cards.nth(3).locator('a.subject-folder').evaluate(el => el === document.activeElement), true,
      'Tab skips unavailable courses and reaches the next available course');
    await Promise.all([
      page.waitForURL('**/subjects/thermo-chemical/index.html'),
      page.keyboard.press('Enter'),
    ]);
    assert.match(page.url(), /subjects\/thermo-chemical\/index\.html$/);
    await page.unroute(base);
    console.log(`PASS: ${variant} availability, inert links, status, search, 6 theme/viewport combinations, available course navigation`);
  }
  await page.goto(base);
  assert.equal(await page.locator('.subject-grid a.subject-folder[href]').count(), 4, 'All four current courses stay available');
  assert.equal(await page.locator('.course-status').count(), 0);
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await useLocalFiles(await noJS.newPage(), root);
  await staticPage.goto(base);
  assert.equal(await staticPage.locator('a.subject-folder[href]').count(), 4);
  await staticPage.locator('a.subject-folder').first().click();
  assert.match(staticPage.url(), /subjects\/itds241\/index\.html$/);
  // Authors use non-link markup from the outset for unpublished courses.
  await staticPage.route(base, route => route.fulfill({
    body: home.replace(/<article\b[\s\S]*?<\/article>/, `<article class="folder-card" data-course-status="in-progress" aria-disabled="true" data-search-text="FUTURE">
      <span class="folder-category">วิชาใหม่</span><span class="subject-folder"><span class="folder-object" aria-hidden="true"></span></span>
      <div class="folder-caption"><h3>FUTURE · วิชาใหม่</h3><span class="course-status" lang="en">In Progress</span></div>
      <p class="folder-topics">กำลังจัดทำเนื้อหา · ยังไม่เปิดให้เรียน</p></article>`),
    contentType: 'text/html; charset=utf-8',
  }));
  await staticPage.goto(base);
  const staticCard = staticPage.locator('[data-course-status="in-progress"]');
  assert.equal(await staticCard.locator('.course-status').isVisible(), true);
  assert.equal(await staticCard.getByRole('link').count(), 0);
  assert.equal(await staticCard.locator('.subject-folder').evaluate(el => Number(getComputedStyle(el).opacity)), 0.6);
  await noJS.close();
  assert.deepEqual(errors, []);
  console.log('PASS: current courses stay available; authored status markup and existing navigation work without JavaScript');
} finally {
  await browser.close();
}
