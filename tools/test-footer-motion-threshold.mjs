// Exercise native video playback and reverse-scroll races around the 80% gate.
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const root = fileURLToPath(new URL('../', import.meta.url));
try {
  for (const [path, viewport] of [
    ['index.html', { width: 1920, height: 1000 }],
    ['subjects/itds241/index.html', { width: 390, height: 844 }],
  ]) {
    const page = await useLocalFiles(await browser.newPage({ viewport }), root);
    await page.addInitScript(() => {
      window.gardenPaints = 0;
      const clear = CanvasRenderingContext2D.prototype.clearRect;
      CanvasRenderingContext2D.prototype.clearRect = function (...args) {
        if (this.canvas.classList.contains('garden-wordmark-canvas')) window.gardenPaints++;
        return clear.apply(this, args);
      };
    });
    await page.goto('http://study-garden.test/' + path);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      window.motionEvents = 0;
      document.querySelector('.motion-footer').addEventListener('footer-motion-change', () => window.motionEvents++);
    });
    const move = async progress => {
      await page.evaluate(async p => {
        const r = document.querySelector('.footer-reveal').getBoundingClientRect();
        scrollTo({ top: Math.floor(scrollY + r.top + (r.height - innerHeight) * p), behavior: 'instant' });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, progress);
      return page.evaluate(() => ({
        progress: Number(document.querySelector('.footer-reveal').style.getPropertyValue('--reveal-progress')),
        active: document.querySelector('.motion-footer').classList.contains('is-motion-active'),
        playing: document.querySelector('.footer-art').classList.contains('is-playing'),
        paused: document.querySelector('video').paused,
        src: document.querySelector('video').getAttribute('src'),
        events: window.motionEvents,
      }));
    };
    for (const progress of [.2, .5, .799, .8]) {
      const state = await move(progress);
      assert.ok(state.progress <= .8);
      assert.equal(state.paused, true, `${path}: video must pause at ${state.progress}`);
      assert.equal(state.active, false, 'ambient motion must stay paused');
      assert.equal(state.playing, false, 'original still image must be visible');
      assert.equal(state.src, null, 'video must not load before the first >80% opening');
    }
    await move(.82);
    await page.waitForFunction(() => !document.querySelector('video').paused && document.querySelector('.footer-art').classList.contains('is-playing'));
    if (path.startsWith('subjects/')) {
      assert.equal(await page.locator('.garden-wordmark-canvas').count(), 1);
      const mark = page.locator('.footer-wordmark');
      const bounds = await mark.boundingBox();
      const beforeBurst = await page.evaluate(() => window.gardenPaints);
      await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      await page.mouse.move(0, 0);
      await page.waitForFunction(count => window.gardenPaints > count, beforeBurst);
      await move(.79);
      const stopped = await page.evaluate(() => window.gardenPaints);
      await page.evaluate(async () => {
        for (let i = 0; i < 10; i++) await new Promise(requestAnimationFrame);
      });
      assert.equal(await page.evaluate(() => window.gardenPaints), stopped, 'canvas must stop drawing below 80%');
      await move(.82);
      await page.waitForFunction(count => window.gardenPaints > count, stopped);
    }
    await page.locator('.footer-motion-toggle').click();
    assert.equal((await move(.9)).paused, true, 'manual pause takes priority');
    await page.locator('.footer-motion-toggle').click();
    await page.waitForFunction(() => !document.querySelector('video').paused);
    const reversed = await move(.5);
    assert.equal(reversed.paused, true);
    assert.equal(reversed.playing, false);
    // A queued media event from an earlier play cannot reveal video below 80%.
    await page.evaluate(() => document.querySelector('video').dispatchEvent(new Event('playing')));
    assert.equal(await page.locator('.footer-art').evaluate(el => el.classList.contains('is-playing')), false);
    const count = (await move(.3)).events;
    assert.equal((await move(.4)).events, count, 'unchanged inactive motion must not notify canvas repeatedly');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    assert.equal(await page.locator('video').evaluate(el => el.paused), true);
    console.log('PASS:', path, '80% gate, reverse scroll, delayed event, pause and reduced motion');
    await page.close();
  }
} finally { await browser.close(); }
