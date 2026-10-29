import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.STUDY_GARDEN_OUTPUT;
if (out) await mkdir(out, {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const errors = [];
let chapterChecks = 0;
try {
 for (const width of (process.env.STUDY_GARDEN_DIAGRAMS_ONLY ? [] : [375,768,1440])) for (const theme of ['light','dark']) {
  const page = await useLocalFiles(await browser.newPage({viewport:{width,height:1000}, reducedMotion:'reduce'}), root);
  page.on('pageerror', e=>errors.push(e.message));
  page.on('response', r=>{if(r.status()===404)errors.push(r.url());});
  await page.goto('https://study-garden.test/subjects/itds261/index.html');
  await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  assert.equal(await page.locator('.folder-card').count(),11);
  assert.equal(await page.locator('.folder-card').evaluateAll(cards => cards.filter(card => {
    const front = card.querySelector('.folder-front').getBoundingClientRect();
    const title = card.querySelector('.folder-label strong').getBoundingClientRect();
    return title.bottom > front.bottom - 12 || title.left < front.left || title.right > front.right - 16;
  }).length), 0, 'Long lecture titles fit inside their folder fronts');
  assert.equal(await page.locator('.se-guide,.folder-topics,.se-scope-badge,.badge-extra,.se-scope-note').count(),0);
  assert.equal(await page.locator('[data-chapter-status]').count(),11);
  assert.equal(await page.locator('.footer-reveal, footer video, .garden-wordmark-canvas').count(),3,'Course footer restores the shared artwork and Garden wordmark');
  assert.equal(await page.locator('#footer a[href="#main"]').count(),1,'Keep back-to-top navigation');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#subject-search').fill('Requirements');
  assert.ok(await page.locator('.folder-card:visible').count()>0);
  await page.locator('#subject-search').fill('');
  if(out) {
   await page.screenshot({path:resolve(out,`index-${width}-${theme}.png`)});
   if(width===375) {
    await page.locator('.folder-card').nth(4).screenshot({path:resolve(out,`folder-l6-${theme}.png`)});
    await page.locator('.folder-card').nth(10).screenshot({path:resolve(out,`folder-recap-${theme}.png`)});
   }
  }
  for (let n=1;n<=11;n++) {
   await page.goto(`https://study-garden.test/subjects/itds261/chapter-${String(n).padStart(2,'0')}.html`);
   assert.equal(await page.locator('.badge-extra,.se-scope-badge,.se-scope-note').count(),0);
   const ids = await page.locator('[id]').evaluateAll(xs=>xs.map(x=>x.id));
   assert.equal(new Set(ids).size,ids.length,`chapter ${n}: unique ids`);
   assert.ok(ids.indexOf('key-takeaways')>ids.indexOf('common-confusions'));
   assert.equal(await page.locator('.se-source-note').count(),1);
   assert.equal(await page.locator('#starting-point').count(),1,`chapter ${n}: beginner starting point`);
   assert.equal(await page.locator('.footer-reveal, footer video, .garden-wordmark-canvas').count(),3,'Chapter footer restores the shared artwork and Garden wordmark');
   assert.equal(await page.locator('#quiz .quiz-question').count(),10);
   chapterChecks++;
  }
  await page.goto('https://study-garden.test/subjects/itds261/chapter-03.html#requirement-types');
  await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  await page.locator('#w-requirements').scrollIntoViewIfNeeded();
  if(out) await page.locator('#w-requirements').screenshot({path:resolve(out,`requirements-${width}-${theme}.png`)});
  await page.close();
 }
 for(const file of ['04-dental-role-views.svg','04-pos-role-views.svg']) {
  const page=await useLocalFiles(await browser.newPage({viewport:{width:1000,height:1000}}),root);
  await page.goto(`https://study-garden.test/assets/software-visuals/${file}`);
  const clipped=await page.locator('text').evaluateAll(xs=>xs.filter(t=>{
   const r=t.getBoundingClientRect(); return r.left<0 || r.right>innerWidth+1;
  }).map(t=>t.textContent));
  assert.deepEqual(clipped,[]);
  // Chrome's full-page screenshot can stall on a standalone SVG document.
  // Capture the same resource as an HTML image, as it is displayed in lessons.
  if(out) {
   await page.goto('about:blank');
   await page.setContent(`<html><body style="margin:0"><img style="display:block;width:1000px" src="https://study-garden.test/assets/software-visuals/${file}"></body></html>`);
   await page.locator('img').screenshot({path:resolve(out,file.replace('.svg','.png'))});
  }
  await page.close();
 }
 assert.deepEqual(errors,[]);
 console.log(`PASS: ${chapterChecks} chapter DOM checks${chapterChecks ? '; course search/status; 375/768/1440 light/dark' : ''}; two source-derived diagrams.`);
} finally { await browser.close(); }
