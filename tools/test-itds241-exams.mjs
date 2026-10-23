import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
try {
 for(const width of [320,390,1440]) for(const theme of ['light','dark']) {
  const p=await useLocalFiles(await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),root);
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);
  await p.goto('https://study-garden.test/subjects/itds241/index.html');
  assert.equal(await p.locator('.folder-grid > .folder-card').count(),2,'course groups lessons into two exam folders');
  const mid=p.locator('[data-exam-folder="midterm"]'),final=p.locator('[data-exam-folder="final"]');
  await mid.locator('summary').press('Enter');
  assert.equal(await mid.locator('.folder-files a:visible').count(),3);
  assert.deepEqual(await mid.locator('.folder-files a').evaluateAll(as=>as.map(a=>a.getAttribute('href'))),['chapter-06.html','chapter-07.html','chapter-08.html']);
  await final.locator('summary').press('Enter');
  assert.equal(await final.locator('.folder-files a:visible').count(),1);
  assert.equal(await final.locator('.folder-files a').getAttribute('href'),'chapter-09.html');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(process.argv.includes('--capture')) {mkdirSync(resolve(root,'docs/screenshots/exam-folders'),{recursive:true});await p.screenshot({path:resolve(root,`docs/screenshots/exam-folders/${width}-${theme}.png`),fullPage:false});}
  await p.locator('#subject-search').fill('Promise');
  assert.equal(await mid.isVisible(),true);assert.equal(await final.isVisible(),false);
  await p.locator('#subject-search').fill('Node.js');
  assert.equal(await mid.isVisible(),false);assert.equal(await final.isVisible(),true);
  await p.locator('#subject-search').fill('ไม่มีหัวข้อนี้');assert.equal(await p.locator('#search-empty').isVisible(),true);
  await p.locator('#subject-search').fill('');assert.equal(await p.locator('.folder-grid > .folder-card:visible').count(),2);
  await final.locator('summary').click();
  if(!(await final.locator('.folder-files a').isVisible()))await final.locator('summary').click();
  await final.locator('.folder-files a').click();
  await p.waitForFunction(()=>document.body.classList.contains('reader-ready'));
  assert.equal(await p.locator('.lesson-section:visible').count(),1,'Final opens the paginated Part I lesson');
  await p.goto('https://study-garden.test/subjects/itds241/index.html');
  await p.evaluate(()=>localStorage.setItem('study-garden:itds241',JSON.stringify({'06':{read:true},'09':{last:8,best:8}})));
  await p.reload();assert.equal(await p.locator('[data-read-count]').innerText(),'1');
  await p.locator('[data-exam-folder="midterm"] summary').click();
  assert.match(await p.locator('[data-chapter-status="06"]').innerText(),/อ่านแล้ว/);
  await p.locator('[data-exam-folder="final"] summary').click();
  assert.match(await p.locator('[data-chapter-status="09"]').innerText(),/8\/10/);
  await p.close();
 }
 const plain=await useLocalFiles(await browser.newPage({javaScriptEnabled:false}),root);
 await plain.goto('https://study-garden.test/subjects/itds241/index.html');
 await plain.locator('[data-exam-folder="midterm"] summary').click();
 assert.equal(await plain.locator('[data-exam-folder="midterm"] .folder-files a:visible').count(),3);
 assert.deepEqual(errors,[]);
 console.log('PASS: Midterm/Final folders, chapter links, keyboard, search, progress, no-JS and responsive themes.');
} finally {await browser.close();}
