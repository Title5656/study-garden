import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';

const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = 'https://study-garden.test/subjects/';
const errors = [];
const failures = [];
let checked = 0;
async function appearance(page) {
  return page.evaluate(() => Object.fromEntries(
    ['.reader-sidebar', '.reader-course', '.reader-back', '.reader-menu-toggle', '.reader-topic'].map(selector => {
      const style = getComputedStyle(document.querySelector(selector));
      return [selector, Object.fromEntries([
        'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderLeftWidth',
        'borderRadius', 'boxShadow', 'paddingLeft', 'paddingRight', 'display', 'fontSize',
      ].map(property => [property, style[property]]))];
    })
  ));
}
try {
  for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
    const page = await useLocalFiles(await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' }), root);
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(value => localStorage.setItem('study-garden:theme', JSON.stringify(value)), theme);
    await page.goto(base + 'itds241/chapter-13.html');
    const reference = await appearance(page);
    for (const subject of ['itds241', 'itds211', 'itds261', 'itds294']) {
      for (const file of (await readdir(new URL(`../subjects/${subject}/`, import.meta.url))).filter(file => /^chapter-\d+\.html$/.test(file))) {
        const path = subject + '/' + file;
        if (process.env.STUDY_GARDEN_FAIL_FAST && path !== 'itds241/chapter-09.html') continue;
        await page.goto(base + path);
        try { assert.deepEqual(await appearance(page), reference); }
        catch (error) { failures.push(`${width}px ${theme} ${path}: ${error.message}`); if (process.env.STUDY_GARDEN_FAIL_FAST) throw new Error(failures.at(-1)); }
        if (width === 390) {
          await page.locator('.reader-menu-toggle').click();
          assert.equal(await page.locator('.reader-menu-toggle').getAttribute('aria-expanded'), 'true');
        }
        const topic = page.locator('.reader-topic').nth(1);
        const href = await topic.getAttribute('href');
        await topic.click();
        assert.equal(new URL(page.url()).hash, href);
        assert.equal(await page.locator('.reader-topic[aria-current]').getAttribute('href'), href);
        assert.equal(await page.locator('.lesson-section:visible').count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path + ': no horizontal overflow');
        if (width === 390) assert.equal(await page.locator('.reader-menu-toggle').getAttribute('aria-expanded'), 'false');
        checked++;
        if (process.env.STUDY_GARDEN_VERBOSE) console.log(`Checked ${width}px ${theme} ${path}`);
      }
    }
    console.log(`Checked ${width}px ${theme}: ${checked} lessons so far.`);
    await page.close();
  }
  assert.deepEqual(errors, [], 'no runtime errors');
  assert.deepEqual(failures, [], 'all Mahidol sidebars match Webtech L13');
  console.log(`PASS: ${checked} shared sidebar checks across all Mahidol lessons, desktop/mobile, light/dark, topic selection and mobile menu.`);
} finally { await browser.close(); }
