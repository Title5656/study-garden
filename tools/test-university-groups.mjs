// Missing group filtering would leave unrelated university headings in search results.
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
const errors = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await useLocalFiles(page, root);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('https://study-garden.test/index.html');
  const search = page.locator('#subject-search');
  for (const [query, groups, courses] of [
    ['มหิดล', 1, 3], ['MAHIDOL', 1, 3], ['ศิลปากร', 1, 1], ['Silpakorn', 1, 1],
    ['Thermodynamics', 1, 1], ['ITDS261', 1, 1], ['Electronic Commerce', 1, 1],
    ['ไม่มีวิชานี้', 0, 0], ['', 2, 4],
  ]) {
    await search.fill(query);
    assert.equal(await page.locator('.university-group:visible').count(), groups, `${query}: visible universities`);
    assert.equal(await page.locator('.subject-folder:visible').count(), courses, `${query}: visible courses`);
    assert.equal(await page.locator('#search-empty').isVisible(), courses === 0, `${query}: empty state`);
  }
  console.log('PASS: university/course search, empty results, and clearing search.');
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    for (const width of [1440, 844, 620, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.university-logo').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        groups: [...document.querySelectorAll('.university-group')].map(group => {
          const box = group.getBoundingClientRect();
          return [...group.querySelectorAll('.folder-card, .university-heading')].every(node => {
            const child = node.getBoundingClientRect();
            return child.left >= box.left && child.right <= box.right + 1;
          });
        }),
      }));
      assert.ok(layout.overflow <= 1, `${width}px ${theme}: page overflow ${layout.overflow}`);
      assert.ok(layout.groups.every(Boolean), `${width}px ${theme}: group contains its courses and heading`);
      if (output) await page.screenshot({ path: resolve(output, `universities-${width}-${theme}.png`), fullPage: true });
    }
  }
  // Follow a filtered course to confirm existing navigation still works.
  await search.fill('611201');
  await page.locator('.subject-folder:visible').click();
  assert.equal(await page.locator('.thermo-course-card').count(), 9);
  assert.deepEqual(errors, []);
  console.log('PASS: 10 responsive/theme layouts, local emblems, and Thermodynamics navigation.');
} finally {
  await browser.close();
}
