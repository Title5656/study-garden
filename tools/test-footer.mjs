// Run with Playwright installed, or set STUDY_GARDEN_PLAYWRIGHT to its index.mjs.
// Optional STUDY_GARDEN_OUTPUT stores screenshots for visual review.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
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
try {
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
