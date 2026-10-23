// Run with Playwright installed, or set STUDY_GARDEN_PLAYWRIGHT to its file URL.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.STUDY_GARDEN_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let checks = 0;
try {
  for (const [width, path] of [
    [1440, '/index.html'], [320, '/index.html'],
    [390, '/subjects/itds241/index.html'],
    [320, '/subjects/itds261/chapter-01.html'],
    [320, '/subjects/thermo-chemical/chapter-01.html'],
    [390, '/subjects/thermo-chemical/chapter-01.html'],
  ]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
    const page = await useLocalFiles(await context.newPage(), root);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://study-garden.test' + path);
    const toggle = page.getByRole('switch', { name: 'โหมดมืด', exact: true });
    assert.equal(await toggle.count(), 1, 'Theme control must expose its on/off state to assistive technology');
    assert.equal(await toggle.getAttribute('aria-checked'), 'false');
    const box = await toggle.boundingBox();
    assert.ok(box.height >= 44 && box.width >= 44, 'Touch target is at least 44px');
    assert.ok(box.x >= 0 && box.x + box.width <= width, 'Toggle fits within the header');
    assert.ok(await page.locator('.nav').evaluate(nav => {
      const children = [...nav.children].map(el => el.getBoundingClientRect()).filter(rect => rect.width > 0);
      return children.every((rect, i) => i === 0 || rect.left >= children[i - 1].right);
    }), 'Header controls do not overlap');
    await toggle.focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    assert.equal(await toggle.getAttribute('aria-checked'), 'true');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('study-garden:theme'))), 'dark');
    if (output) await page.screenshot({ path: resolve(output, `dark-${width}-${path.includes('chapter') ? 'lesson' : 'index'}.png`) });
    await page.reload();
    assert.equal(await toggle.getAttribute('aria-checked'), 'true', 'Saved theme restores switch state');
    await toggle.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    assert.equal(await toggle.getAttribute('aria-checked'), 'false');
    if (output) await page.screenshot({ path: resolve(output, `light-${width}-${path.includes('chapter') ? 'lesson' : 'index'}.png`) });
    assert.deepEqual(errors, []);
    console.log(`PASS: ${width}px ${path}: keyboard, persisted theme, switch state, header layout`);
    checks++;
    await context.close();
  }
  const page = await useLocalFiles(await browser.newPage({ colorScheme: 'dark' }), root);
  await page.goto('http://study-garden.test/index.html');
  const toggle = page.getByRole('switch', { name: 'โหมดมืด', exact: true });
  assert.equal(await toggle.getAttribute('aria-checked'), 'true', 'First visit follows system dark theme');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-checked'), 'false');
  console.log('PASS: system dark theme and pointer toggle');
  checks++;
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  const contrast = await toggle.evaluate(button => {
    const scene = getComputedStyle(button.querySelector('.sky-toggle__scene'));
    const thumb = getComputedStyle(button.querySelector('.sky-toggle__sun'));
    return { border: parseFloat(scene.borderTopWidth), track: scene.backgroundColor, thumb: thumb.backgroundColor };
  });
  assert.ok(contrast.border >= 1, 'High contrast mode keeps a visible switch outline');
  assert.notEqual(contrast.track, contrast.thumb, 'High contrast thumb remains distinguishable from its track');
  const position = await toggle.locator('.sky-toggle__halo').evaluate(el => el.getBoundingClientRect().x);
  await toggle.click();
  assert.ok(await toggle.locator('.sky-toggle__halo').evaluate(el => el.getBoundingClientRect().x) > position, 'High contrast mode indicates the changed state with thumb position');
  console.log('PASS: forced colors preserves outline, contrasting thumb, and state');
  checks++;
  await page.close();
} finally {
  await browser.close();
}
console.log(`PASS: ${checks} theme toggle scenarios.`);
