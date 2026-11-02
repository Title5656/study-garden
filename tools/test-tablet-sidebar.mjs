import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const paths = ['itds241/chapter-09', 'itds241/chapter-10', 'itds241/chapter-13', 'itds211/chapter-01', 'itds261/chapter-01', 'itds294/chapter-01'];
try {
  const page = await useLocalFiles(await browser.newPage({ reducedMotion: 'reduce' }), root);
  page.on('pageerror', error => errors.push(error.message));
  let checked = 0;
  for (const width of [820, 834, 768, 1024, 1100, 390, 1101, 1440]) {
    await page.setViewportSize({ width, height: 1180 });
    for (const path of paths) {
      await page.goto(`https://study-garden.test/subjects/${path}.html`);
      const toggle = page.locator('.reader-menu-toggle');
      const topics = page.locator('.reader-topics');
      const sidebar = page.locator('.reader-sidebar');
      const article = page.locator('.lesson-content');
      if (width <= 1100) {
        assert.ok(await toggle.isVisible(), `${width}px ${path}: collapsible TOC`);
        assert.equal(await topics.isVisible(), false, 'TOC starts closed');
        const navBounds = await sidebar.boundingBox();
        const articleBounds = await article.boundingBox();
        assert.ok(navBounds.height < 90, 'closed TOC takes only one compact row');
        assert.ok(articleBounds.y >= navBounds.y + navBounds.height, 'TOC above reading surface');
        assert.ok(Math.abs(articleBounds.width - navBounds.width) < 2, 'article uses full column');
        await toggle.click();
        assert.ok(await topics.isVisible());
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.ok(await topics.evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'no sideways TOC scrolling');
        await toggle.press('Escape');
        assert.equal(await topics.isVisible(), false);
        await toggle.click();
        const link = page.locator('.reader-topic').nth(1);
        const href = await link.getAttribute('href');
        await link.click();
        assert.equal(new URL(page.url()).hash, href);
        assert.equal(await topics.isVisible(), false, 'selecting a topic closes TOC');
        assert.equal(await page.locator('.lesson-section:visible').count(), 1);
      } else {
        assert.equal(await toggle.isVisible(), false, 'desktop retains sidebar');
        assert.ok(await topics.isVisible());
        const navBounds = await sidebar.boundingBox();
        const articleBounds = await article.boundingBox();
        assert.ok(articleBounds.x >= navBounds.x + navBounds.width, 'desktop columns do not overlap');
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px ${path}: no page overflow`);
      checked++;
    }
    console.log(`Checked ${width}px`);
  }
  // Rotating the same page must switch layouts without a reload.
  await page.setViewportSize({ width: 820, height: 1180 });
  assert.ok(await page.locator('.reader-menu-toggle').isVisible());
  await page.setViewportSize({ width: 1180, height: 820 });
  assert.ok(await page.locator('.reader-topics').isVisible());
  await page.setViewportSize({ width: 820, height: 1180 });
  assert.equal(await page.locator('.reader-topics').isVisible(), false);
  if (process.env.STUDY_GARDEN_OUTPUT) {
    await page.goto('https://study-garden.test/subjects/itds241/chapter-09.html');
    await page.screenshot({ path: process.env.STUDY_GARDEN_OUTPUT });
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checked} tablet/mobile/desktop layouts; compact TOC, full-width reading, open/close, Escape, topic selection and rotation.`);
} finally { await browser.close(); }
