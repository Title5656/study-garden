// Browser regression: a fully covered footer must not do per-control work on scroll.
// Run with STUDY_GARDEN_PLAYWRIGHT pointing to Playwright's index.mjs if needed.
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser = await chromium.launch({ channel: process.env.STUDY_GARDEN_BROWSER || 'chrome', headless: true });
const root = fileURLToPath(new URL('../', import.meta.url));
try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await useLocalFiles(await browser.newPage({ viewport: { width, height } }), root);
    await page.addInitScript(() => {
      window.footerWork = { geometry: 0, activity: 0 };
      const original = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function (...args) {
        if (this.closest('.footer-reveal')) window.footerWork.geometry++;
        return original.apply(this, args);
      };
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.motion-footer').addEventListener('footer-motion-change', () => window.footerWork.activity++);
      });
    });
    await page.goto('http://study-garden.test/index.html');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const work = await page.evaluate(async () => {
      window.footerWork = { geometry: 0, activity: 0 };
      // All these positions precede the reveal; nothing inside the footer can be seen.
      for (let i = 0; i < 30; i++) {
        scrollTo({ top: 5 + (i % 15) * 8, behavior: 'instant' });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      return { ...window.footerWork, progress: document.querySelector('.footer-reveal').style.getPropertyValue('--reveal-progress'),
        inert: document.querySelector('.motion-footer').inert, videoSrc: document.querySelector('.footer-art video').getAttribute('src') };
    });
    console.log(`${width}: covered footer work`, work);
    assert.equal(work.progress, '0.0000');
    assert.equal(work.inert, true, 'covered footer must remain unfocusable');
    assert.equal(work.videoSrc, null, 'covered art must remain unloaded');
    assert.ok(work.geometry <= 60, `covered footer should need at most two geometry reads per scroll, got ${work.geometry}`);
    assert.equal(work.activity, 0, 'covered scrolling must not notify unchanged artwork');

    // Trace actual browser style work: progress must not invalidate the entire
    // footer subtree (including video, SVG paths and unrelated controls).
    const client = await page.context().newCDPSession(page);
    const events = [];
    client.on('Tracing.dataCollected', data => events.push(...data.value));
    await client.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline.stack', transferMode: 'ReportEvents' });
    await page.evaluate(async () => {
      const rect = document.querySelector('.footer-reveal').getBoundingClientRect();
      const top = scrollY + rect.top;
      const distance = rect.height - innerHeight;
      for (const progress of [.2, .3, .4, .5, .6, .7, .6, .5, .4, .3, .2]) {
        scrollTo({ top: top + distance * progress, behavior: 'instant' });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
    });
    const traceComplete = new Promise(resolve => client.once('Tracing.tracingComplete', resolve));
    await client.send('Tracing.end');
    await traceComplete;
    const updates = events.filter(event => event.name === 'UpdateLayoutTree' &&
      event.args?.beginData?.stackTrace?.some(frame => frame.url?.includes('/assets/reader.js')));
    assert.ok(updates.length >= 8, 'capture style updates throughout the reveal in both directions');
    const largestUpdate = Math.max(...updates.map(event => event.args.elementCount || 0));
    console.log(`${width}: largest synchronous reveal style update: ${largestUpdate} elements`);
    assert.ok(largestUpdate <= 20, `reveal should avoid restyling the whole footer subtree, got ${largestUpdate} elements`);

    const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    for (const media of [{ reducedMotion: 'reduce' }, { reducedMotion: 'no-preference', media: 'print' }]) {
      await page.emulateMedia(media);
      await settle();
      assert.equal(await page.locator('.footer-reveal').evaluate(el => el.classList.contains('reveal-enabled')), false);
      assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), false);
      assert.equal(await page.locator('.footer-art video').evaluate(el => el.paused), true);
    }
    await page.emulateMedia({ reducedMotion: 'no-preference', media: 'screen' });
    await page.setViewportSize({ width, height: 560 });
    await settle();
    assert.equal(await page.locator('.footer-reveal').evaluate(el => el.classList.contains('reveal-enabled')), false);
    await page.setViewportSize({ width, height });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await settle();
    await page.evaluate(() => { window.footerWork.activity = 0; document.querySelector('main').style.paddingBottom = '80px'; });
    await page.waitForFunction(() => window.footerWork.activity > 0);
    assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), true,
      'body resize must refresh covered footer state without requiring scroll');
    await page.evaluate(() => document.querySelector('main').style.removeProperty('padding-bottom'));
    await settle();
    await page.locator('.footer-reveal-link').click();
    await settle();
    assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), false,
      'opening the reveal must reactivate controls immediately after covered scrolling');
    assert.equal(await page.locator('.footer-contact').evaluate(el => el === document.activeElement), true);
    await page.close();
  }
  console.log('PASS: covered scrolling and reveal style work stay bounded on desktop and mobile.');
} finally { await browser.close(); }
