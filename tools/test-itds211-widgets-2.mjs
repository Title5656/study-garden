import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const root=fileURLToPath(new URL('../',import.meta.url));
const errors=[];
try {
 const page=await browser.newPage();
 await useLocalFiles(page,root);
 page.on('pageerror',e=>errors.push(e.message));
 const open=chapter=>page.goto(`https://study-garden.test/subjects/itds211/chapter-${chapter}.html#interactive`);
 await open('02');
 await page.locator('[name=instructions]').fill('500000000');
 await page.locator('[name=cpiB]').fill('2.6');
 await page.locator('[name=ghzB]').fill('3');
 assert.match(await page.locator('.itds211-output').innerText(),/0.4333333/);
 await page.locator('[name=cpiB]').fill('2');await page.locator('[name=ghzB]').fill('2');
 assert.match(await page.locator('.itds211-output').innerText(),/เท่ากัน/);
 await open('04');
 assert.equal(await page.locator('[data-bit]').count(),8);
 assert.match(await page.locator('[data-bit-result]').innerText(),/200.*−56/s);
 await page.locator('[data-bit="0"]').click();
 assert.match(await page.locator('[data-bit-result]').innerText(),/72/);
 await page.locator('[name=unsigned]').fill('-128');
 await page.locator('[data-negate]').click();
 assert.match(await page.locator('[data-bit-result]').innerText(),/overflow/i);
 await open('08');
 assert.match(await page.locator('.itds211-output').innerText(),/9 รอบ/);
 await page.locator('[name=code]').fill('add x1,x2,x3\nsub x4,x1,x5');
 assert.match(await page.locator('.itds211-output').innerText(),/6 รอบ/);
 await page.locator('[name=forwarding]').uncheck();
 assert.match(await page.locator('.itds211-output').innerText(),/8 รอบ/);
 await page.locator('[name=code]').fill('<img src=x onerror=alert(1)>');
 assert.equal(await page.locator('.itds211-error').count(),1);
 assert.equal(await page.locator('.itds211-output img').count(),0);
 await open('09');
 assert.equal(await page.locator('input[type=range]').count(),2);
 assert.match(await page.locator('.itds211-output').innerText(),/4.705882/);
 await open('12');
 assert.equal(await page.locator('[data-schedule-result]').count(),4);
 assert.match(await page.locator('[data-schedule-result="FCFS"]').innerText(),/8.75/);
 assert.match(await page.locator('[data-schedule-result="STCF"]').innerText(),/6.5/);
 const widths=await page.locator('[data-schedule-result="STCF"] .itds211-gantt-block').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width));
 assert.ok(Math.abs(widths[1]/widths[0]-4)<0.01,'Gantt widths show actual duration: P1 runs 1 unit, P2 runs 4');
 await page.locator('[name=quantum]').fill('-1');
 assert.equal(await page.locator('.itds211-error').count(),1);
 await page.locator('[name=quantum]').fill('4');
 await page.locator('[name=jobs]').fill('P1 0 0');
 assert.equal(await page.locator('.itds211-error').count(),1);
 for(const chapter of ['02','04','08','09','12']){
  await open(chapter);
  for(const width of [390,1440])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:900});
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1),`${chapter} ${width} ${theme}: no page overflow`);
   assert.equal(await page.locator('.itds211-error').count(),0);
  }
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: all five reference widgets, calculations, editing, validation, themes and mobile widths.');
}finally{await browser.close();}
