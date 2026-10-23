import assert from 'node:assert/strict';
import { readdir, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = 'https://study-garden.test';
const errors = [];
let checked = 0;
const settle = page => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
const chapters = [];
for (const subject of await readdir(resolve(root, 'subjects'))) {
  for (const file of await readdir(resolve(root, 'subjects', subject))) {
    if (/^chapter-.*\.html$/.test(file)) chapters.push(`/subjects/${subject}/${file}`);
  }
}
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await useLocalFiles(page, root);
    page.on('pageerror', error => errors.push(error.message));
    for (const path of chapters) {
      await page.goto(base + path);
      const sections = page.locator('.lesson-content > .lesson-section');
      const ids = await sections.evaluateAll(nodes => nodes.map(node => node.id));
      assert.ok(ids.length > 1);
      assert.equal(await page.locator('.lesson-content > .lesson-section:visible').count(), 1, `${width}px ${path}: show one topic on entry`);
      assert.ok(await sections.first().isVisible());
      assert.equal(await page.locator('[data-reader-previous]').isVisible(), false);
      assert.equal(await page.locator('.chapter-end').isVisible(), false);
      await page.locator('[data-reader-next]').click();
      assert.ok(await sections.nth(1).isVisible());
      assert.equal(await page.locator('.lesson-content > .lesson-section:visible').count(), 1);
      await page.locator('[data-reader-previous]').click();
      assert.ok(await sections.first().isVisible());
      await page.goBack();
      await settle(page);
      assert.ok(await sections.nth(1).isVisible(), `${path}: browser Back restores topic`);
      await page.goForward();
      await settle(page);
      assert.ok(await sections.first().isVisible());
      await page.goto(base + path + '#' + ids.at(-1));
      assert.ok(await sections.last().isVisible(), `${path}: direct link opens topic`);
      assert.ok(await page.locator('.chapter-end').isVisible());
      assert.ok(await page.locator('[data-mark-read]').isVisible());
      await page.locator('.reader-category[data-reader-category="learn"]').click();
      assert.ok(await sections.first().isVisible());
      if (width === 390) await page.locator('.reader-menu-toggle').click();
      await page.locator(`.reader-topic[href="#${ids[1]}"]`).click();
      assert.ok(await sections.nth(1).isVisible());
      assert.equal(await page.locator('.lesson-content > .lesson-section:visible').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}: no horizontal overflow`);
      await page.emulateMedia({ media: 'print' });
      assert.equal(await page.locator('.lesson-content > .lesson-section:visible').count(), ids.length, `${path}: print includes all topics`);
      await page.emulateMedia({ media: 'screen' });
      checked++;
    }
    if (process.env.STUDY_GARDEN_OUTPUT) {
      await mkdir(process.env.STUDY_GARDEN_OUTPUT, { recursive: true });
      await page.goto(base + '/subjects/itds261/chapter-01.html');
      await page.locator('[data-reader-next]').click();
      await page.screenshot({ path: resolve(process.env.STUDY_GARDEN_OUTPUT, `reader-paged-${width}.png`), fullPage: false });
    }
    await page.close();
  }
  const fallback = await browser.newPage({ javaScriptEnabled: false });
  await useLocalFiles(fallback, root);
  await fallback.goto(base + chapters[0]);
  assert.equal(await fallback.locator('.lesson-section[hidden]').count(), 0, 'without JavaScript the full lesson remains available');
  assert.deepEqual(errors, [], 'no runtime errors');
  console.log(`PASS: ${chapters.length} chapters, ${checked} desktop/mobile checks; next/previous, history, links, categories, TOC, print and no-JS fallback`);
} finally {
  await browser.close();
}
