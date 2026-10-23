import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),base='https://study-garden.test/subjects/itds241/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
try {
 for(const width of [320,390,1440]) for(const theme of ['light','dark']) {
  const p=await useLocalFiles(await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),root);
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);
  await p.goto(base+'index.html');
  assert.equal(await p.locator('.folder-grid > .folder-card').count(),2);
  assert.equal(await p.locator('[data-exam-folder="final"] .subject-folder').count(),1,'exam folder must navigate to chapter folders');
  for(const [id,title] of [['midterm','Midterm'],['final','Final']]) {
   const folder=p.locator(`[data-exam-folder="${id}"]`);
   assert.equal(await folder.locator('.folder-front .folder-label strong').innerText(),title,'exam name stays inside the folder face');
   assert.equal(await folder.locator('.folder-caption,.folder-topics').count(),0,'no repeated titles or chapter list below exam folders');
   assert.ok(await folder.locator('.folder-front').evaluate(front=>{const a=front.getBoundingClientRect(),b=front.querySelector('strong').getBoundingClientRect();return b.top>=a.top&&b.bottom<=a.bottom;}));
  }
  if(process.argv.includes('--capture')) {mkdirSync(resolve(root,'docs/screenshots/exam-folders'),{recursive:true});await p.screenshot({path:resolve(root,`docs/screenshots/exam-folders/exams-${width}-${theme}.png`)});}
  await p.locator('[data-exam-folder="midterm"] .subject-folder').press('Enter');await p.waitForURL('**/midterm.html');
  assert.equal(await p.locator('.glass-folder').count(),3);
  await p.locator('.glass-folder').first().locator('summary').press('Enter');
  assert.equal(await p.locator('.folder-files a:visible').count(),3);
  assert.ok(await p.locator('a[href="chapter-06.html#quiz"]').isVisible());
  await p.locator('.breadcrumb a[href="index.html"]').click();
  await p.locator('[data-exam-folder="final"] .subject-folder').click();await p.waitForURL('**/final.html');
  assert.equal(await p.locator('.glass-folder').count(),2);
  assert.match(await p.locator('.folder-label strong').first().innerText(),/Node.js Part I/);
  await p.locator('.glass-folder summary').first().click();assert.equal(await p.locator('.folder-files a:visible').count(),3);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(process.argv.includes('--capture')) {mkdirSync(resolve(root,'docs/screenshots/exam-folders'),{recursive:true});await p.screenshot({path:resolve(root,`docs/screenshots/exam-folders/chapters-${width}-${theme}.png`)});}
  await p.locator('#subject-search').fill('ไม่มีหัวข้อนี้');assert.equal(await p.locator('#search-empty').isVisible(),true);
  await p.locator('#subject-search').fill('Node');assert.equal(await p.locator('.folder-card:visible').count(),2);
  await p.locator('.folder-files a[href="chapter-09.html"]').click();await p.waitForFunction(()=>document.body.classList.contains('reader-ready'));
  assert.equal(await p.locator('.lesson-section:visible').count(),1);
  await p.goto(base+'final.html');await p.evaluate(()=>localStorage.setItem('study-garden:itds241',JSON.stringify({'06':{read:true},'09':{read:true,best:8}})));
  await p.reload();assert.equal(await p.locator('[data-read-count]').innerText(),'1');assert.match(await p.locator('[data-chapter-status="09"]').innerText(),/8\/10/);
  await p.goto(base+'midterm.html');assert.equal(await p.locator('[data-read-count]').innerText(),'1');await p.close();
 }
 const plain=await useLocalFiles(await browser.newPage({javaScriptEnabled:false}),root);
 await plain.goto(base+'index.html');await plain.locator('[data-exam-folder="final"] .subject-folder').click();await plain.waitForURL('**/final.html');
 await plain.locator('.glass-folder summary').first().click();assert.equal(await plain.locator('.folder-files a:visible').count(),3);
 assert.deepEqual(errors,[]);console.log('PASS: exam → chapter folders → summary/flashcards/quiz, progress, search, keyboard, no-JS and six responsive themes.');
} finally {await browser.close();}
