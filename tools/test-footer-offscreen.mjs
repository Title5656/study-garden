// Regression: scrolling lessons/folders must not schedule invisible footer work.
// Removing the offscreen guard fails the geometry/frame assertions; skipping all
// updates fails the jump, resize, search, accessibility and playback assertions.
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser = await chromium.launch({ channel: process.env.STUDY_GARDEN_BROWSER || 'msedge', headless: true });
const root = fileURLToPath(new URL('../', import.meta.url));
try {
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 390, height: 844 }]) {
    const page = await useLocalFiles(await browser.newPage({ viewport }), root);
    await page.addInitScript(() => {
      window.footerWork = { geometry: 0, activity: 0, frames: 0 };
      const bounds = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function (...args) {
        if (this.closest('.footer-reveal')) window.footerWork.geometry++;
        return bounds.apply(this, args);
      };
      const frame = window.requestAnimationFrame.bind(window);
      window.nextTestFrame = () => new Promise(resolve => frame(() => frame(resolve)));
      window.requestAnimationFrame = callback => { window.footerWork.frames++; return frame(callback); };
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.motion-footer').addEventListener('footer-motion-change', () => window.footerWork.activity++);
      });
    });
    await page.goto('http://study-garden.test/index.html');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const work = await page.evaluate(async () => {
      scrollTo({ top: 1, behavior: 'instant' });
      await window.nextTestFrame();
      await window.nextTestFrame();
      window.footerWork = { geometry: 0, activity: 0, frames: 0 };
      for (let i = 0; i < 30; i++) {
        scrollTo({ top: 5 + (i % 15) * 8, behavior: 'instant' });
        await window.nextTestFrame();
      }
      return window.footerWork;
    });
    console.log(`${viewport.width}px: offscreen work`, work);
    assert.deepEqual(work, { geometry: 0, activity: 0, frames: 0 });
    // Instant jumps must bypass the cached offscreen guard immediately.
    await page.evaluate(async () => {
      scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      await window.nextTestFrame();
    });
    assert.ok(await page.locator('.footer-reveal').evaluate(el => Number(el.style.getPropertyValue('--reveal-progress')) >= .999), 'instant jump must fully reveal the footer despite rounded scroll offsets');
    assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), false);
    await page.waitForFunction(() => !document.querySelector('.footer-art video').paused);
    await page.evaluate(async () => { scrollTo({ top: 0, behavior: 'instant' }); await window.nextTestFrame(); });
    assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), true);
    assert.equal(await page.locator('.footer-art video').evaluate(el => el.paused), true);
    await page.waitForTimeout(100);
    // Search can move the reveal without changing the scroll position.
    await page.locator('#subject-search').fill('no matching course');
    await page.waitForTimeout(150);
    await page.locator('.footer-reveal-link').click();
    assert.equal(await page.locator('.footer-contact').evaluate(el => el === document.activeElement && !el.inert), true);
    await page.locator('#subject-search').fill('');
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.setViewportSize({ width: viewport.width, height: 560 });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.footer-reveal').evaluate(el => el.classList.contains('reveal-enabled')), false);
    await page.setViewportSize(viewport);
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), true);
    await page.close();
  }
  // Without layout observation, retain live reads instead of a stale cache.
  const fallback = await useLocalFiles(await browser.newPage({ viewport: { width: 1440, height: 900 } }), root);
  const errors = [];
  fallback.on('pageerror', error => errors.push(error.message));
  await fallback.addInitScript(() => { delete window.ResizeObserver; });
  await fallback.goto('http://study-garden.test/index.html');
  await fallback.locator('.footer-reveal-link').click();
  assert.equal(await fallback.locator('.footer-contact').evaluate(el => el === document.activeElement && !el.inert), true);
  assert.deepEqual(errors, []);
  await fallback.close();
  console.log('PASS: invisible footer work is skipped; jumps, search and resize still update.');
} finally { await browser.close(); }
