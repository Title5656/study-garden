// Run with Playwright installed, or set STUDY_GARDEN_PLAYWRIGHT to its index.mjs.
// Optional STUDY_GARDEN_OUTPUT stores screenshots for visual review.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.STUDY_GARDEN_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.ttf': 'font/ttf' };
const server = createServer(async (req, res) => {
  const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) return res.writeHead(403).end();
  try {
    const bytes = await readFile(path.endsWith(sep) ? resolve(path, 'index.html') : path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: process.env.STUDY_GARDEN_BROWSER || 'chrome', headless: true });
const newLocalPage = async options => useLocalFiles(await browser.newPage(options),root);
let passed = 0;
let caseIndex = 0;
const shard = process.env.STUDY_GARDEN_SHARD?.split('/').map(Number);
if (shard) assert.ok(shard.length === 2 && Number.isInteger(shard[0]) && Number.isInteger(shard[1]) && shard[0] >= 0 && shard[0] < shard[1], 'STUDY_GARDEN_SHARD must be index/count, zero-based');
const failures = [];
async function test(name, callback) {
  const index = caseIndex++;
  if (shard && index % shard[1] !== shard[0]) return;
  if (process.env.STUDY_GARDEN_TEST && !name.includes(process.env.STUDY_GARDEN_TEST)) return;
  try { await callback(); passed++; console.log('PASS:', name); }
  catch (error) { failures.push(name); console.error('FAIL:', name, error.message); }
}
async function settle(page) { await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))); }
async function reveal(page) {
  await page.locator('.footer-reveal-link').click();
  await settle(page);
}
async function screenshot(page, name) { if (output) await page.screenshot({ path: resolve(output, name + '.png') }); }
async function trackPaints(page) {
  await page.addInitScript(() => {
    window.gardenPaints = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.classList.contains('garden-wordmark-canvas')) window.gardenPaints++;
      return clear.apply(this, args);
    };
  });
}
async function frames(page, count = 10) {
  await page.evaluate(count => new Promise(resolve => {
    const tick = () => --count > 0 ? requestAnimationFrame(tick) : resolve();
    requestAnimationFrame(tick);
  }), count);
}
async function subjectAssertions(page) {
  const footer = page.locator('.motion-footer');
  assert.equal(await footer.locator('.footer-wordmark').innerText(), 'Garden');
  assert.equal(await footer.locator('.footer-contact-title').innerText(), 'GitHub');
  assert.equal(await footer.locator('.footer-contact').getAttribute('href'), 'https://github.com/Title5656');
  assert.equal(await footer.locator('.footer-pill').count(), 4);
  assert.equal(await footer.locator('.footer-ribbon, .sg-hwf-top').count(), 0);
  assert.equal(await footer.locator('[src*="creation-of-adam"], [data-src*="creation-of-adam"]').count(), 0);
  assert.match(await footer.locator('.footer-art img').getAttribute('src'), /ink-garden/);
  assert.match(await footer.locator('.footer-art video').getAttribute('data-src'), /ink-garden/);
  assert.equal(await footer.locator('.footer-wordmark canvas').count(), 1);
}

try {
  const paths = [];
  for (const subject of ['itds241', 'itds294', 'itds261']) {
    for (const name of await readdir(resolve(root, 'subjects', subject))) {
      if (name === 'index.html' || /^chapter-.*\.html$/.test(name)) paths.push(`subjects/${subject}/${name}`);
    }
  }
  for (const path of paths) await test(`Garden footer: ${path}`, async () => {
    const page = await newLocalPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(`${base}/${path}`);
      await subjectAssertions(page);
      await reveal(page);
      assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), false);
      assert.equal(await page.locator('.footer-contact').evaluate(el => el.inert), false);
      assert.equal(await page.locator('.footer-contact').evaluate(el => el === document.activeElement), true);
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  });

  for (const [width, height] of [[1440, 900], [1920, 698], [390, 844], [320, 568], [844, 390]]) {
    for (const theme of ['dark', 'light']) await test(`${width}x${height} ${theme}: layout and ink`, async () => {
      const page = await newLocalPage({ viewport: { width, height } });
      try {
        await page.goto(`${base}/subjects/itds261/index.html`);
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
        await reveal(page);
        await subjectAssertions(page);
        const geometry = await page.evaluate(() => {
          const nav = document.querySelector('.footer-actions').getBoundingClientRect();
          const mark = document.querySelector('.footer-wordmark').getBoundingClientRect();
          const footer = document.querySelector('.motion-footer').getBoundingClientRect();
          const canvas = document.querySelector('.footer-wordmark canvas');
          const pixels = canvas?.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
          let ink = 0;
          for (let i = 3; pixels && i < pixels.length; i += 4) if (pixels[i] > 0) ink++;
          return { navBottom: nav.bottom, markTop: mark.top, markBottom: mark.bottom, footerBottom: footer.bottom, ink, overflow: document.documentElement.scrollWidth - innerWidth };
        });
        assert.ok(geometry.ink > 100, 'wordmark must contain painted dots');
        assert.ok(geometry.navBottom + 12 <= geometry.markTop, JSON.stringify(geometry));
        assert.ok(geometry.markBottom <= geometry.footerBottom - 55, JSON.stringify(geometry));
        assert.ok(geometry.overflow <= 1, 'horizontal overflow');
        await screenshot(page, `garden-${width}-${theme}`);
      } finally { await page.close(); }
    });
  }

  await test('Idle Garden stays painted without redrawing while scrolling and reopening', async () => {
    const page = await newLocalPage({ viewport: { width: 1440, height: 900 } });
    try {
      await trackPaints(page);
      await page.goto(`${base}/subjects/itds241/index.html`);
      await page.evaluate(() => document.fonts.ready);
      await reveal(page);
      await page.mouse.move(0, 0);
      await frames(page);
      const before = await page.evaluate(() => ({
        count: window.gardenPaints,
        pixels: document.querySelector('.garden-wordmark-canvas').toDataURL(),
      }));
      await page.evaluate(async () => {
        const rect = document.querySelector('.footer-reveal').getBoundingClientRect();
        const top = scrollY + rect.top;
        const distance = rect.height - innerHeight;
        for (const progress of [0.9, 0.8, 0.7, 0.6, 0.5, 0.12, 0, 0.5, 0.8, 1]) {
          scrollTo({ top: top + distance * progress, behavior: 'instant' });
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }
      });
      await frames(page);
      assert.equal(await page.evaluate(() => window.gardenPaints), before.count,
        'scrolling must reuse the settled canvas instead of repainting it');
      assert.equal(await page.locator('.garden-wordmark-canvas').evaluate(el => el.toDataURL()), before.pixels,
        'the existing wordmark pixels must stay unchanged');
      // Sleeping must not disable interaction after the curtain reopens.
      await page.locator('.garden-wordmark-canvas').click({ position: { x: 100, y: 60 }, force: true });
      await page.waitForFunction(count => window.gardenPaints > count, before.count);
    } finally { await page.close(); }
  });

  await test('Pending Garden motion resumes after pause, curtain and visibility without new pointer input', async () => {
    const page = await newLocalPage({ viewport: { width: 1440, height: 900 } });
    try {
      await trackPaints(page);
      await page.goto(`${base}/subjects/itds241/index.html`);
      await reveal(page);
      const root = page.locator('.footer-wordmark');
      const bounds = await root.boundingBox();
      for (const reason of ['pause', 'curtain', 'visibility']) {
        await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        await page.mouse.move(0, 0);
        await frames(page, 2);
        await page.evaluate(reason => {
          if (reason === 'pause') document.querySelector('.footer-motion-toggle').click();
          if (reason === 'curtain') {
            const rect = document.querySelector('.footer-reveal').getBoundingClientRect();
            scrollTo({ top: scrollY + rect.top, behavior: 'instant' });
          }
          if (reason === 'visibility') {
            Object.defineProperty(document, 'hidden', { configurable: true, value: true });
            document.dispatchEvent(new Event('visibilitychange'));
          }
        }, reason);
        await settle(page);
        const stopped = await page.evaluate(() => window.gardenPaints);
        await frames(page);
        assert.equal(await page.evaluate(() => window.gardenPaints), stopped, `${reason} must stop drawing`);
        await page.evaluate(reason => {
          if (reason === 'pause') document.querySelector('.footer-motion-toggle').click();
          if (reason === 'curtain') {
            const rect = document.querySelector('.footer-reveal').getBoundingClientRect();
            scrollTo({ top: scrollY + rect.top + rect.height - innerHeight, behavior: 'instant' });
          }
          if (reason === 'visibility') {
            delete document.hidden;
            document.dispatchEvent(new Event('visibilitychange'));
          }
        }, reason);
        await page.waitForFunction(count => window.gardenPaints > count, stopped);
      }
    } finally { await page.close(); }
  });

  await test('Pointer displaces real dots; pause and covered curtain stop canvas/video', async () => {
    const page = await newLocalPage({ viewport: { width: 1440, height: 900 } });
    try {
      await trackPaints(page);
      await page.goto(`${base}/subjects/itds241/index.html`);
      await reveal(page);
      const canvas = page.locator('.garden-wordmark-canvas');
      const before = await canvas.evaluate(el => el.toDataURL());
      const point = await canvas.evaluate(el => {
        const data = el.getContext('2d').getImageData(0, 0, el.width, el.height).data;
        const rect = el.getBoundingClientRect();
        for (let y = 20; y < el.height - 20; y += 5) for (let x = 20; x < el.width - 20; x += 5) {
          if (data[(y * el.width + x) * 4 + 3] > 200) return {
            x: rect.left + x * rect.width / el.width,
            y: rect.top + y * rect.height / el.height,
          };
        }
      });
      assert.ok(point, 'find a real painted dot');
      await page.mouse.move(point.x, point.y);
      await page.waitForFunction(before => document.querySelector('.garden-wordmark-canvas').toDataURL() !== before, before);
      await page.mouse.click(point.x, point.y);
      await screenshot(page, 'garden-pointer');
      await page.locator('.footer-motion-toggle').click();
      const paused = await page.evaluate(() => ({ count: window.gardenPaints, pixels: document.querySelector('.garden-wordmark-canvas').toDataURL() }));
      await page.mouse.move(point.x + 5, point.y + 5);
      await frames(page);
      assert.equal(await page.locator('.footer-art video').evaluate(el => el.paused), true);
      assert.equal(await page.locator('.footer-motion-toggle').getAttribute('aria-pressed'), 'true');
      assert.deepEqual(await page.evaluate(() => ({ count: window.gardenPaints, pixels: document.querySelector('.garden-wordmark-canvas').toDataURL() })), paused);
      await page.locator('.footer-motion-toggle').click();
      await page.mouse.move(point.x + 12, point.y + 5);
      await page.waitForFunction(count => window.gardenPaints > count, paused.count);
      await page.mouse.move(10, 10);
      await page.evaluate(() => {
        const reveal = document.querySelector('.footer-reveal');
        const rect = reveal.getBoundingClientRect();
        scrollTo({ top: scrollY + rect.top + (rect.height - innerHeight) * 0.12, behavior: 'instant' });
      });
      await settle(page);
      const covered = await page.evaluate(() => {
        const mark = document.querySelector('.footer-wordmark').getBoundingClientRect();
        const curtain = document.querySelector('.footer-curtain').getBoundingClientRect();
        return { hidden: mark.bottom < curtain.bottom, markBottom: mark.bottom, curtainBottom: curtain.bottom, count: window.gardenPaints };
      });
      assert.equal(covered.hidden, true, JSON.stringify(covered));
      await frames(page);
      assert.equal(await page.evaluate(() => window.gardenPaints), covered.count, 'covered dots must stop rendering');
      assert.equal(await page.locator('.footer-art video').evaluate(el => el.paused), true);
    } finally { await page.close(); }
  });

  await test('Reduced motion keeps static dots, no video download, and accessible links', async () => {
    const page = await newLocalPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await trackPaints(page);
      await page.goto(`${base}/subjects/itds294/chapter-01.html`);
      await reveal(page);
      await subjectAssertions(page);
      assert.equal(await page.locator('.footer-reveal').evaluate(el => el.classList.contains('reveal-enabled')), false);
      assert.equal(await page.locator('.footer-art video').getAttribute('src'), null);
      assert.equal(await page.locator('.footer-motion-toggle').isVisible(), false);
      await page.locator('.footer-contact').focus();
      assert.equal(await page.locator('.footer-contact').evaluate(el => el === document.activeElement), true);
      await settle(page);
      const before = await page.evaluate(() => window.gardenPaints);
      const rect = await page.locator('.footer-wordmark').boundingBox();
      await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
      await frames(page);
      assert.equal(await page.evaluate(() => window.gardenPaints), before);
      await screenshot(page, 'garden-reduced-motion');
    } finally { await page.close(); }
  });

  for (const mode of ['no JavaScript', 'no Canvas']) await test(`${mode}: static Garden fallback and working GitHub link`, async () => {
    const page = await newLocalPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: mode !== 'no JavaScript' });
    try {
      if (mode === 'no Canvas') await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (...args) {
          return this.classList.contains('garden-wordmark-canvas') ? null : getContext.apply(this, args);
        };
      });
      await page.goto(`${base}/subjects/itds241/index.html`);
      if (mode === 'no JavaScript') await page.locator('.footer-reveal-link').click();
      else await reveal(page);
      assert.equal(await page.locator('.garden-wordmark-canvas').count(), 0);
      assert.equal(await page.locator('.garden-wordmark-label').innerText(), 'Garden');
      assert.equal(await page.locator('.garden-wordmark-label').evaluate(el => getComputedStyle(el).opacity), '1');
      await page.locator('.footer-contact').focus();
      assert.equal(await page.locator('.footer-contact').evaluate(el => el === document.activeElement), true);
    } finally { await page.close(); }
  });

  for (const [width, height] of [[1440, 900], [1920, 698], [390, 844], [320, 568], [844, 390]]) {
    for (const theme of ['dark', 'light']) await test(`Home ${width}x${height} ${theme}: original footer and arm framing`, async () => {
    const page = await newLocalPage({ viewport: { width, height } });
    try {
      await page.goto(`${base}/index.html`);
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
      await reveal(page);
      await screenshot(page, `home-${width}-${theme}`);
      assert.equal(await page.locator('.footer-wordmark').innerText(), 'Study Garden');
      assert.equal(await page.locator('.footer-ribbon').count(), 0);
      assert.equal(await page.locator('.footer-wordmark canvas').count(), 0);
      assert.match(await page.locator('.footer-art img').getAttribute('src'), /creation-of-adam/);
      const geometry = await page.evaluate(() => {
        const art = document.querySelector('.footer-art').getBoundingClientRect();
        const mark = document.querySelector('.footer-wordmark').getBoundingClientRect();
        return { width: art.width, bottom: art.bottom, wordmarkTop: mark.top, viewport: innerWidth };
      });
      assert.ok(geometry.width >= geometry.viewport * 1.3, JSON.stringify(geometry));
      assert.ok(geometry.bottom <= geometry.wordmarkTop, JSON.stringify(geometry));
    } finally { await page.close(); }
    });
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
console.log(`${passed} passed; ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;
