import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const base='https://study-garden.test/subjects/itds261/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
try {
 for(const width of [320,1440]) for(const theme of ['light','dark']) {
  const page=await useLocalFiles(await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),root);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()===404)errors.push(r.url());});
  await page.addInitScript(theme=>{
   localStorage.setItem('study-garden:theme',JSON.stringify(theme));
   localStorage.setItem('study-garden:itds261',JSON.stringify({'01':{read:true},'12':{read:true,best:10},'13':{read:true,best:8}}));
  },theme);
  await page.goto(base+'index.html');
  assert.equal(await page.locator('[data-read-count]').innerText(),'2');
  for(const [exam,count,label] of [['midterm',8,'Midterm'],['final',4,'Final']]) {
   await page.goto(base+'index.html');
   assert.equal(await page.locator(`[data-exam-folder="${exam}"] strong`).innerText(),label);
   await page.locator(`[data-exam-folder="${exam}"] a.subject-folder`).click();
   await page.waitForURL(`**/${exam}.html`);
   assert.equal(await page.locator('.glass-folder').count(),count);
   assert.equal(await page.locator('[data-read-count]').innerText(),'1');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.equal(await page.locator('.folder-label strong').evaluateAll(xs=>xs.filter(x=>x.getBoundingClientRect().bottom>x.closest('.folder-front').getBoundingClientRect().bottom-10).length),0);
   if(process.env.STUDY_GARDEN_OUTPUT){
    mkdirSync(process.env.STUDY_GARDEN_OUTPUT,{recursive:true});
    await page.screenshot({path:resolve(process.env.STUDY_GARDEN_OUTPUT,`${exam}-${width}-${theme}.png`)});
   }
  }
  assert.match(await page.locator('#score-summary').innerText(),/L12: 8\/10/);
  await page.locator('[data-chapter-status="13"]').locator('..').locator('a').click();
  await page.waitForURL('**/chapter-13.html');
  assert.match(await page.locator('.breadcrumb').innerText(),/Final.*L12/s);
  assert.equal(await page.locator('#quiz .quiz-question').count(),10);
  await page.goto(base+'chapter-13.html#find-largest');
  assert.ok(await page.locator('#find-largest').isVisible());
  await page.close();
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: Midterm/Final navigation, twelve folders, saved progress, L12 quiz and activity, mobile/desktop light/dark.');
} finally {await browser.close();}
