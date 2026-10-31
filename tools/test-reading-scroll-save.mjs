import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await useLocalFiles(await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' }), fileURLToPath(new URL('../', import.meta.url)));
    await page.addInitScript(() => {
      window.positionSaves = 0;
      const replace = history.replaceState.bind(history);
      history.replaceState = (...args) => { window.positionSaves++; return replace(...args); };
    });
    await page.goto('http://study-garden.test/subjects/itds241/chapter-06.html');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    const saves = await page.evaluate(async () => {
      window.positionSaves = 0;
      for (let i = 0; i < 24; i++) {
        scrollTo({ top: 200 + i % 2 * 100, behavior: 'instant' });
        await new Promise(requestAnimationFrame);
      }
      return window.positionSaves;
    });
    assert.ok(saves <= 2, `continuous scrolling should coalesce saves, got ${saves}`);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => history.state.studyGardenReading.y), await page.evaluate(() => scrollY));
    // Browser traversal can happen before the idle save, without clicking a
    // topic link (and without pagehide). The latest entry must survive it.
    await page.locator('[data-reader-next]').evaluate(el => el.click());
    const pending = await page.evaluate(async () => {
      scrollTo({ top: 420, behavior: 'instant' });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { url: location.href, y: scrollY };
    });
    await page.goBack();
    await page.goForward();
    await page.waitForTimeout(200);
    assert.equal(page.url(), pending.url);
    assert.equal(await page.evaluate(() => scrollY), pending.y, 'pending position survives immediate Back/Forward');
    // Topic navigation must synchronously save the outgoing entry, even before idle.
    const old = await page.evaluate(() => { scrollTo({ top: 450, behavior: 'instant' }); return { url: location.href, y: scrollY }; });
    await page.locator('[data-reader-next]').evaluate(el => el.click());
    await page.goBack();
    await page.waitForTimeout(250);
    assert.equal(page.url(), old.url);
    assert.equal(await page.evaluate(() => scrollY), old.y);
    await page.evaluate(() => { location.hash = 'main'; });
    await page.waitForFunction(() => location.hash === '#main' && !!history.state?.studyGardenReading?.entry);
    const native = await page.evaluate(async () => {
      scrollTo({ top: 380, behavior: 'instant' });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { url: location.href, y: scrollY };
    });
    await page.goBack();
    await page.goForward();
    await page.waitForTimeout(200);
    assert.equal(page.url(), native.url);
    assert.equal(await page.evaluate(() => scrollY), native.y, 'native fragment entry preserves pending position');
    // Leaving/hidden tabs flush the final position rather than wait for a timer.
    for (const event of ['visibilitychange', 'pagehide']) {
      const saved = await page.evaluate(event => {
        scrollTo({ top: event === 'pagehide' ? 350 : 300, behavior: 'instant' });
        if (event === 'visibilitychange') {
          Object.defineProperty(document, 'hidden', { configurable: true, value: true });
          document.dispatchEvent(new Event(event));
          delete document.hidden;
        } else window.dispatchEvent(new Event(event));
        return { saved: history.state.studyGardenReading.y, y: scrollY };
      }, event);
      assert.equal(saved.saved, saved.y, `${event} flushes position`);
    }
    console.log(`PASS ${width}: coalesced history writes, idle save, navigation/Back and lifecycle flush`);
    await page.close();
  }
} finally { await browser.close(); }
