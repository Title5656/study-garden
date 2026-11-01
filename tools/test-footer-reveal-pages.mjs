// Catch missing/disabled curtains, including paged readers and Node-specific CSS.
import assert from 'node:assert/strict';
import { readdir, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const paths = ['index.html'];
for (const subject of await readdir(resolve(root, 'subjects'))) {
  for (const name of await readdir(resolve(root, 'subjects', subject))) {
    if (/^(index|midterm|final|chapter-.*)\.html$/.test(name)) paths.push(`subjects/${subject}/${name}`);
  }
}
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const failures = [];
const output = process.env.STUDY_GARDEN_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const settle = page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const move = async (page, progress) => {
  await page.evaluate(p => {
    const r = document.querySelector('.footer-reveal').getBoundingClientRect();
    const target = scrollY + r.top + (r.height - innerHeight) * p;
    // scrollTo rounds to device pixels; stay on the covered side of the boundary.
    scrollTo({ top: p === 0 ? Math.floor(target) : target, behavior: 'instant' });
  }, progress);
  await settle(page);
};
let passed = 0;
try {
  for (const width of [1440, 390]) {
    const page = await useLocalFiles(await browser.newPage({ viewport: { width, height: 900 } }), root);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of paths) {
      try {
        await page.goto('http://study-garden.test/' + path);
        await settle(page);
        assert.equal(await page.locator('.footer-curtain').count(), 1, `${path}: one curtain`);
        assert.equal(await page.locator('.reveal-enabled').count(), 1, `${path}: reveal enabled`);
        const curtainColor = () => page.locator('.footer-curtain').evaluate(el => getComputedStyle(el).backgroundColor);
        const beforeTheme = await curtainColor();
        await page.getByRole('switch', { name: 'โหมดมืด', exact: true }).click();
        assert.notEqual(await curtainColor(), beforeTheme, `${path}: switching theme recolors curtain`);
        await page.getByRole('switch', { name: 'โหมดมืด', exact: true }).click();
        assert.equal(await curtainColor(), beforeTheme, `${path}: switching back restores curtain color`);
        await move(page, 0);
        const closed = await page.locator('.footer-curtain').boundingBox();
        assert.ok(closed && closed.height >= 899 && Math.abs(closed.y) <= 1, `${path}: closed curtain fills viewport`);
        assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), true, `${path}: covered footer stays inert`);
        await move(page, .5);
        const half = await page.locator('.footer-curtain').boundingBox();
        assert.ok(half.y < -400 && half.y > -550, `${path}: curtain slides halfway`);
        await move(page, 1);
        assert.ok((await page.locator('.footer-curtain').boundingBox()).y <= -900);
        assert.equal(await page.locator('.footer-contact').evaluate(el => el.inert || !!el.closest('[inert]')), false);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}: no overflow`);
        await move(page, 0);
        assert.equal(await page.locator('.motion-footer').evaluate(el => el.inert), true, 'reverse scroll closes curtain');
        await page.locator('.footer-reveal-link').click();
        assert.equal(await page.locator('.footer-contact').evaluate(el => el === document.activeElement), true, 'reveal link opens and focuses contact');
        assert.deepEqual(errors, [], `${path}: no runtime errors`);
        passed++;
      } catch (error) { failures.push(`${width}px ${path}: ${error.stack}`); }
    }
    // Theme changes must also update the opaque cover, without a reload.
    for (const theme of ['dark', 'light']) {
      await page.goto('http://study-garden.test/index.html');
      await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
      await move(page, 0);
      const color = await page.locator('.footer-curtain').evaluate(el => getComputedStyle(el).backgroundColor);
      assert.notEqual(color, theme === 'dark' ? 'rgb(13, 13, 13)' : 'rgb(245, 245, 247)', 'curtain uses wallpaper palette');
      if (output) {
        await page.evaluate(() => {
          const r = document.querySelector('.footer-reveal').getBoundingClientRect();
          scrollTo({ top: scrollY + r.top - innerHeight * .55, behavior: 'instant' });
        });
        await settle(page);
        await page.screenshot({ path: resolve(output, `${width}-${theme}-seam.png`) });
      }
      if (output) for (const progress of [0, .5, 1]) {
        await move(page, progress);
        await page.screenshot({ path: resolve(output, `${width}-${theme}-${progress}.png`) });
      }
    }
    await page.close();
  }
  for (const options of [{ reducedMotion: 'reduce' }, { javaScriptEnabled: false }, { viewport: { width: 844, height: 390 } }]) {
    const page = await useLocalFiles(await browser.newPage({ viewport: { width: 390, height: 844 }, ...options }), root);
    await page.goto('http://study-garden.test/subjects/itds241/chapter-09.html');
    assert.equal(await page.locator('.reveal-enabled').count(), 0, 'accessible static fallback');
    await page.locator('.footer-contact').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('.footer-contact').evaluate(el => el.inert || !!el.closest('[inert]')), false);
    await page.close();
  }
} finally { await browser.close(); }
console.log(`${passed}/${paths.length * 2} page/viewport reveal cases passed; 3 fallback cases passed.`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
