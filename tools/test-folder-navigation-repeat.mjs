// A cached destination must still paint its selected folder on every activation.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const output = process.env.STUDY_GARDEN_OUTPUT;
const requests = new Map();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.webp': 'image/webp', '.mp4': 'video/mp4' };
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  requests.set(pathname, (requests.get(pathname) || 0) + 1);
  const path = resolve(root, '.' + pathname.replace(/\/$/, '/index.html'));
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(path);
    // Network latency belongs to the fixture; subsequent clicks use HTTP cache.
    if (pathname.includes('/subjects/') && pathname.endsWith('/index.html')) await new Promise(done => setTimeout(done, 350));
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--disable-back-forward-cache'] });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    let record, frame;
    window.addEventListener('pageshow', event => { window.__restored = event.persisted; });
    window.addEventListener('click', event => {
      const link = event.target.closest('.folder-card a');
      if (!link) return;
      cancelAnimationFrame(frame);
      record = { href: link.href, activeAtClick: !!document.querySelector('.is-navigating'), frames: [], start: performance.now() };
      const sample = () => {
        if (!record) return;
        const card = document.querySelector('.is-navigating');
        record.frames.push({
          active: !!card,
          ring: card ? Number(getComputedStyle(card.querySelector('.folder-key'), '::after').opacity) : 0,
          scale: card ? new DOMMatrix(getComputedStyle(card).transform).a : 1,
          siblings: [...document.querySelectorAll('.folder-card:not(.is-navigating)')].map(el => Number(getComputedStyle(el).opacity)),
          text: card?.querySelector('.folder-meta').textContent,
        });
        frame = requestAnimationFrame(sample);
      };
      frame = requestAnimationFrame(sample);
    });
    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(frame);
      if (!record) return;
      record.duration = performance.now() - record.start;
      sessionStorage.setItem('repeat-navigation', JSON.stringify(record));
      record = null;
    }, true);
  });
  await page.goto(base + '/index.html');
  const traces = [];
  for (const [index, selector, action] of [
    [0, '.subject-folder', 'click'], [0, '.folder-key', 'click'], [0, '.folder-caption a', 'keyboard'],
    [1, '.subject-folder', 'click'], [1, '.folder-caption a', 'click'], [1, '.subject-folder', 'keyboard'],
    [0, '.subject-folder', 'click'], [1, '.folder-key', 'click'],
  ]) {
    const link = page.locator('.folder-card').nth(index).locator(selector);
    if (action === 'keyboard') { await link.focus(); await page.keyboard.press('Enter'); }
    else await link.click();
    await page.waitForURL('**/subjects/*/index.html');
    const trace = await page.evaluate(() => JSON.parse(sessionStorage.getItem('repeat-navigation')));
    traces.push(trace);
    console.log(JSON.stringify({ index, selector, action, duration: Math.round(trace.duration), frames: trace.frames.length, ringPainted: trace.frames.some(frame => frame.ring >= .9) }));
    await page.goBack({ waitUntil: 'commit' });
    assert.equal(await page.evaluate(() => window.__restored), true, 'Return through actual BFCache');
    assert.equal(await page.locator('body.folder-navigating, .is-navigating, .folder-card[aria-disabled], .folder-card[aria-busy]').count(), 0);
    assert.equal(await page.locator('.folder-meta').first().textContent(), '5 บทเรียน · บทที่ 6–10');
  }
  if (output) { await mkdir(output, { recursive: true }); await writeFile(resolve(output, 'repeat-navigation.json'), JSON.stringify({ traces, requests: [...requests] }, null, 2)); }
  assert.ok(traces.every(trace => trace.activeAtClick), 'No activation handler is lost after Back');
  assert.equal(requests.get('/subjects/itds241/index.html'), 1, 'Revisited course uses the browser cache');
  assert.equal(requests.get('/subjects/itds261/index.html'), 1, 'Second course is cached independently');
  assert.ok(traces.every(trace => trace.frames.some(frame => frame.active && frame.ring >= .9 && frame.scale === .98 && frame.siblings.every(opacity => opacity <= .4) && frame.text === 'กำลังเปิดบทเรียน…')),
    'Every activation, including cached revisits, paints the selected folder and loading feedback before leaving');
  // A lifecycle reset in the interval before the render callback must cancel
  // the queued redirect, including when a later click selects another folder.
  await page.evaluate(() => {
    document.querySelector('.subject-folder').click();
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await page.waitForTimeout(100);
  assert.equal(page.url(), base + '/index.html', 'Reset cancels the queued navigation');
  assert.equal(await page.locator('body.folder-navigating, .is-navigating').count(), 0);
  await page.evaluate(() => {
    document.querySelectorAll('.subject-folder')[1].click();
    // The initial pageshow may arrive after an early click when images are slow.
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
  });
  await page.waitForURL('**/subjects/itds261/index.html', { timeout: 1500 });
  await page.goBack({ waitUntil: 'commit' });
  await page.locator('.subject-folder').nth(2).click();
  await page.waitForURL('**/subjects/itds294/index.html');
  assert.equal(new URL(page.url()).pathname, '/subjects/itds294/index.html', 'Next activation cannot reuse a canceled destination');
  for (const becomesHidden of [false, true]) {
    const background = await browser.newPage();
    background.on('pageerror', error => errors.push(error.message));
    await background.goto(base + '/index.html');
    await background.evaluate(becomesHidden => {
      const originalFrame = window.requestAnimationFrame;
      // Model paused background rendering without pausing the native navigation.
      window.requestAnimationFrame = () => 0;
      const hide = () => Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      if (!becomesHidden) hide();
      document.querySelector('.subject-folder').click();
      if (becomesHidden) { hide(); document.dispatchEvent(new Event('visibilitychange')); }
      window.requestAnimationFrame = originalFrame;
      delete document.hidden;
    }, becomesHidden);
    await background.waitForURL('**/subjects/itds241/index.html', { timeout: 3000 });
    await background.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: eight native mouse/arrow/caption/keyboard navigations, cached revisits, rendered feedback, lifecycle reset and background completion');
} finally {
  await browser.close();
  server.closeAllConnections();
  await new Promise(done => server.close(done));
}
