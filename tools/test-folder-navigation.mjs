// Removing eligibility, locking, or lifecycle reset must break these user flows.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.STUDY_GARDEN_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const path = resolve(root, '.' + decodeURIComponent(pathname).replace(/\/$/, '/index.html'));
  if (!path.startsWith(resolve(root) + sep)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--disable-back-forward-cache'] });
const errors = [];
async function fresh(options = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, ...options });
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(15000);
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => window.addEventListener('pageshow', event => { window.__fromBFCache = event.persisted; }));
  await page.goto(base + '/index.html');
  await page.evaluate(() => document.fonts.ready);
  return page;
}
async function restored(page, original) {
  await page.waitForFunction(() => !document.body.classList.contains('folder-navigating'));
  assert.equal(await page.locator('.is-navigating').count(), 0);
  assert.equal(await page.locator('.folder-meta').first().textContent(), original);
  assert.equal(await page.locator('.folder-navigation-progress').isVisible(), false);
  assert.equal(await page.locator('.folder-navigation-status').textContent(), '');
  assert.equal(await page.locator('.folder-card[aria-busy], .folder-card[aria-disabled]').count(), 0);
  assert.equal(await page.locator('.folder-front[style], .folder-sheet[style]').count(), 0);
}
async function holdNavigationFrames(page) {
  // Visual-only fixtures keep the outgoing document inspectable. CSS animations
  // still run; real render callbacks and navigation are exercised below.
  await page.evaluate(() => {
    window.__folderTestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = () => -1;
  });
}
async function restoreAnimationFrames(page) {
  await page.evaluate(() => {
    window.requestAnimationFrame = window.__folderTestAnimationFrame;
    delete window.__folderTestAnimationFrame;
  });
}
try {
  const page = await fresh();
  const destination = '/subjects/itds241/index.html';
  const original = await page.locator('.folder-meta').first().textContent();
  await holdNavigationFrames(page);
  await page.evaluate(() => window.addEventListener('click', event => {
    window.__spinnerAtClick = getComputedStyle(document.querySelector('.folder-key'), '::after').opacity;
  }, { once: true }));
  await page.locator('.subject-folder').first().hover();
  await page.locator('.folder-key').first().click({ noWaitAfter: true });
  await page.waitForFunction(() => document.body.classList.contains('folder-navigating'), null, { timeout: 1500, polling: 20 });
  assert.equal(await page.locator('.folder-card.is-navigating').count(), 1);
  assert.equal(await page.locator('.folder-meta').first().textContent(), 'กำลังเปิดบทเรียน…');
  assert.equal(await page.evaluate(() => window.__spinnerAtClick), '1', 'Spinner is visible on the activation itself');
  await page.waitForTimeout(450);
  const visual = await page.locator('.folder-card').first().evaluate(el => {
    const key = el.querySelector('.folder-key'), front = el.querySelector('.folder-front');
    return { scale: getComputedStyle(el).transform, front: getComputedStyle(front).transform,
      ring: getComputedStyle(key, '::after').opacity, rotation: getComputedStyle(key, '::after').animationDuration,
      arrow: getComputedStyle(key.querySelector('.folder-key-arrow')).opacity };
  });
  assert.match(visual.scale, /^matrix\(0\.98,/);
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.folder-front').first().evaluate(el => getComputedStyle(el).transform), visual.front);
  assert.equal(visual.ring, '1'); assert.equal(visual.rotation, '0.7s'); assert.equal(visual.arrow, '0');
  for (const opacity of await page.locator('.folder-card:not(.is-navigating)').evaluateAll(cards => cards.map(el => Number(getComputedStyle(el).opacity)))) assert.equal(opacity, .38);
  const duplicates = await page.evaluate(() => [...document.querySelectorAll('.folder-card a, .folder-card summary')].every(link =>
    !link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })) &&
    !link.dispatchEvent(new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }))));
  assert.equal(duplicates, true, 'All repeated link activations are canceled');
  const progress = await page.locator('.folder-navigation-progress').evaluate(el => {
    const animation = el.getAnimations()[0];
    return [400, 12000, 60000].map(time => { animation.currentTime = time; return new DOMMatrix(getComputedStyle(el).transform).a; });
  });
  assert.ok(progress[0] >= .4 && progress[0] < .5);
  assert.equal(progress[1], .9); assert.equal(progress[2], .9, 'Progress never completes itself');
  if (output) await page.screenshot({ path: resolve(output, 'loading-desktop.png'), fullPage: true });
  await restoreAnimationFrames(page);
  await page.goto(base + destination);
  await page.goBack({ waitUntil: 'commit' });
  await restored(page, original);
  assert.equal(await page.evaluate(() => window.__fromBFCache), true, 'Exercise an actual BFCache restore');
  console.log('PASS: nested arrow feedback, hover freeze, duplicate lock, progress cap, real BFCache reset');

  // Test exclusions at the window boundary, after the real document handler.
  const exclusions = await page.evaluate(() => {
    const link = document.querySelector('.subject-folder'), original = link.getAttribute('href');
    const cases = [
      ['ctrl', { ctrlKey: true }], ['cmd', { metaKey: true }], ['shift', { shiftKey: true }], ['alt', { altKey: true }],
      ['middle', { button: 1 }], ['blank', {}, 'target', '_blank'], ['named target', {}, 'target', 'reader'],
      ['external', {}, 'href', 'https://example.com/course'], ['hash', {}, 'href', '#subjects'],
      ['same-document hash', {}, 'href', location.pathname + '#subjects'], ['download', {}, 'download', 'course.html'],
    ];
    return cases.map(([name, options, attribute, value]) => {
      link.setAttribute('href', original); link.removeAttribute('target'); link.removeAttribute('download');
      if (attribute) link.setAttribute(attribute, value);
      let loading;
      window.addEventListener('click', event => { loading = document.body.classList.contains('folder-navigating'); event.preventDefault(); }, { once: true });
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...options }));
      link.setAttribute('href', original); link.removeAttribute('target'); link.removeAttribute('download');
      return [name, loading];
    });
  });
  for (const [name, loading] of exclusions) assert.equal(loading, false, name + ' must not start loading');
  const popup = page.context().waitForEvent('page');
  await page.locator('.subject-folder').first().click({ modifiers: ['Control'] });
  await (await popup).close();
  assert.equal(await page.locator('body.folder-navigating').count(), 0, 'Actual Ctrl+click leaves original page idle');
  console.log('PASS: modified/middle clicks, targets, external URLs, hashes, downloads, actual new-tab navigation');

  for (const [selector, activation] of [['.folder-object', 'click'], ['.folder-caption a', 'click'], ['.subject-folder', 'keyboard'], ['.folder-caption a', 'keyboard']]) {
    await holdNavigationFrames(page);
    if (activation === 'click') {
      await page.locator(selector).first().click();
    } else {
      await page.locator(selector).first().focus();
      await page.keyboard.press('Enter');
    }
    await page.waitForFunction(() => document.body.classList.contains('folder-navigating'), null, { polling: 20 });
    assert.equal(await page.locator('.folder-card').first().getAttribute('aria-busy'), 'true');
    await restoreAnimationFrames(page);
    await page.goto(base + destination); await page.goBack({ waitUntil: 'commit' }); await restored(page, original);
  }
  await page.goto(base + '/subjects/itds241/final.html');
  await page.locator('.glass-folder summary').first().click();
  assert.equal(await page.locator('body.folder-navigating').count(), 0, 'Expanding a folder is local interaction');
  const lesson = '/subjects/itds241/chapter-09.html';
  await holdNavigationFrames(page);
  await page.locator('.folder-files a').first().click({ noWaitAfter: true });
  await page.waitForFunction(() => document.body.classList.contains('folder-navigating'), null, { polling: 20 });
  assert.equal(await page.locator('.folder-card').first().getAttribute('aria-busy'), 'true');
  assert.equal(await page.locator('.folder-meta').first().textContent(), 'กำลังเปิดบทเรียน…');
  await restoreAnimationFrames(page);
  await page.goto(base + lesson); await page.close();
  console.log('PASS: keyboard folder/caption navigation, local details expansion, lesson links share the owner feedback');

  const mobile = await fresh({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await holdNavigationFrames(mobile);
  const tap = mobile.locator('.subject-folder').first().tap({ noWaitAfter: true });
  await mobile.waitForFunction(() => document.body.classList.contains('folder-navigating'), null, { polling: 20 });
  const reduced = await mobile.locator('.folder-key').first().evaluate(el => ({
    spinner: getComputedStyle(el, '::after').animationDuration.split(',')[0],
    progress: getComputedStyle(document.querySelector('.folder-navigation-progress')).animationName,
    pulse: getComputedStyle(document.querySelector('.is-navigating .folder-meta')).animationName,
  }));
  assert.equal(reduced.spinner, '1.8s'); assert.equal(reduced.progress, 'none'); assert.equal(reduced.pulse, 'none');
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (output) await mobile.screenshot({ path: resolve(output, 'loading-mobile-reduced-motion.png'), fullPage: true });
  await tap; await restoreAnimationFrames(mobile); await mobile.goto(base + destination); await mobile.goBack({ waitUntil: 'commit' });
  await restored(mobile, original); await mobile.close();
  console.log('PASS: native touch, responsive layout, reduced motion, restoration');

  const fast = await fresh();
  await fast.evaluate(() => {
    let started, samples = [];
    document.addEventListener('click', event => {
      if (!event.target.closest('.subject-folder')) return;
      started = performance.now();
      const sample = () => { samples.push(Number(getComputedStyle(document.querySelector('.folder-key'), '::after').opacity)); requestAnimationFrame(sample); };
      requestAnimationFrame(sample);
    });
    window.addEventListener('pagehide', () => sessionStorage.setItem('navigation-flash', JSON.stringify({ duration: performance.now() - started, samples })));
  });
  await fast.locator('.subject-folder').first().click(); await fast.waitForURL(base + destination);
  const flash = await fast.evaluate(() => JSON.parse(sessionStorage.getItem('navigation-flash')));
  assert.ok(flash.duration < 250, `Fast fixture proceeds after its rendered acknowledgement (${flash.duration}ms)`);
  assert.ok(flash.samples.some(opacity => opacity === 1), 'Fast native navigation renders the spinner before leaving');
  await fast.goBack({ waitUntil: 'commit' });
  await restored(fast, original);
  assert.equal(await fast.evaluate(() => window.__fromBFCache), true, 'Native click also returns through BFCache');
  const cdp = await fast.context().newCDPSession(fast);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, connectionType: 'cellular3g' });
  await fast.evaluate(() => {
    let started, samples = [];
    window.addEventListener('click', () => {
      sessionStorage.setItem('slow-feedback', JSON.stringify({ active: !!document.querySelector('.folder-card.is-navigating'), text: document.querySelector('.is-navigating .folder-meta')?.textContent }));
      started = performance.now();
      const sample = () => { samples.push(Number(getComputedStyle(document.querySelector('.folder-key'), '::after').opacity)); requestAnimationFrame(sample); };
      requestAnimationFrame(sample);
    }, { once: true });
    window.addEventListener('pagehide', () => sessionStorage.setItem('slow-paint', JSON.stringify({ duration: performance.now() - started, samples })), { once: true });
  });
  await fast.locator('.subject-folder').first().click(); await fast.waitForURL(base + destination, { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.deepEqual(await fast.evaluate(() => JSON.parse(sessionStorage.getItem('slow-feedback'))), { active: true, text: 'กำลังเปิดบทเรียน…' });
  const slowPaint = await fast.evaluate(() => JSON.parse(sessionStorage.getItem('slow-paint')));
  assert.ok(slowPaint.duration > 400, 'Throttled navigation remains pending for a real network interval');
  assert.ok(slowPaint.samples.some(opacity => opacity >= .9), 'Spinner reaches painted frames while actual navigation is pending');
  if (output) await writeFile(resolve(output, 'slow-navigation-frames.json'), JSON.stringify(slowPaint));
  await cdp.detach();
  await fast.close();
  assert.deepEqual(errors, []);
  console.log(`PASS: native fast navigation (${Math.round(flash.duration)}ms), rendered spinner acknowledgement, BFCache, DevTools Slow 3G emulation; no browser errors`);
} finally {
  await browser.close();
  server.closeAllConnections();
  await new Promise(done => server.close(done));
}
