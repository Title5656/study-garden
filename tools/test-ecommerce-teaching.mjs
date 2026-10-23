import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
try {
 const page=await useLocalFiles(await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),root);
 page.on('pageerror',e=>errors.push(e.message));
 for(let i=1;i<=10;i++) {
  const chapter=String(i).padStart(2,'0');
  await page.goto(`https://study-garden.test/subjects/itds294/chapter-${chapter}.html`);
  for(const explorer of await page.locator('.ec-explorer').all()) {
   const choices=explorer.locator('.ec-choice button');
   const initial=await explorer.locator('.ec-stage').textContent();
   await choices.last().click();
   await explorer.locator('[data-activity-reset]').focus();await page.keyboard.press('Enter');
   assert.equal(await explorer.locator('.ec-stage').textContent(),initial);
   assert.equal(await choices.first().getAttribute('aria-pressed'),'true');
  }
  for(const id of ['funnel-lab','location-lab','finance-lab']) {
   const lab=page.locator('#'+id);if(!await lab.count())continue;
   const fields=lab.locator('input');const defaults=await fields.evaluateAll(xs=>xs.map(x=>({value:x.value,checked:x.checked})));
   const output=lab.locator('[id$="-output"]');const initial=await output.textContent();
   if(id==='location-lab') await page.locator('#location-consent').uncheck();
   else {await fields.first().fill('');assert.match(await output.textContent(),/กรอกค่าที่ถูกต้อง/);}
   await lab.locator('[data-activity-reset]').focus();await page.keyboard.press('Space');
   assert.deepEqual(await fields.evaluateAll(xs=>xs.map(x=>({value:x.value,checked:x.checked}))),defaults);
   assert.equal(await output.textContent(),initial);
  }
  for(const worksheet of await page.locator('.ec-worksheet').all()) {
   await worksheet.locator('textarea').first().fill('ร่างทดสอบ');
   await worksheet.locator('[data-activity-reset]').click();
   assert.ok((await worksheet.locator('textarea').evaluateAll(xs=>xs.map(x=>x.value))).every(x=>x===''));
  }
  const answers=await page.evaluate(id=>window.StudyContent.itds294[id].quiz.map(q=>q.answer),chapter);
  for(const [q,answer] of answers.entries()) await page.locator(`input[name="q${q}"][value="${answer}"]`).check();
  await page.locator('#quiz-submit').click();
  assert.match(await page.locator('#quiz-score').textContent(),/10 \/ 10/);
  assert.equal(await page.locator('.explanation:visible').count(),10);
  await page.locator('#quiz-retry').click();
  assert.equal(await page.locator('.quiz-option input:checked').count(),0);
 }
 const plain=await useLocalFiles(await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}}),root);
 for(const chapter of ['06','07','08','09','10']) {
  await plain.goto(`https://study-garden.test/subjects/itds294/chapter-${chapter}.html`);
  const fallback=plain.locator('details').filter({has:plain.locator('summary', {hasText:'อ่านผลและวิธีคิดโดยไม่ต้องเปิดกิจกรรม'})}).first();
  await fallback.locator('summary').click();assert.notEqual(await fallback.getAttribute('open'),null);
  assert.ok((await fallback.textContent()).length>100);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: 10 ecommerce quiz/retry flows; explorers/calculators/worksheets reset actual state; keyboard controls; five no-JS activity alternatives.');
} finally {await browser.close();}
