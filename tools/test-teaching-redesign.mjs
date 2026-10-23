import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({channel:'chrome',headless:true});
const capture=process.argv.includes('--capture');
const stage=process.argv.includes('--before')?'before':'after';
const errors=[];
try {
 for(const width of [390,1440]) for(const theme of ['light','dark']) {
  const page=await useLocalFiles(await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),root);
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('https://study-garden.test/subjects/itds241/chapter-06.html#variables');
  await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  await page.evaluate(()=>document.fonts.ready);
  if(capture) {
   const out=resolve(root,'docs/screenshots/teaching-redesign'); await mkdir(out,{recursive:true});
   await page.locator('#variables').scrollIntoViewIfNeeded();
   await page.screenshot({path:resolve(out,`${stage}-${width}-${theme}.png`)});
  } else {
   assert.equal(await page.locator('.lesson-section:visible').count(),1,'Show one complete topic at a time');
   assert.equal(await page.locator('#variables').evaluate(e=>getComputedStyle(e).borderLeftWidth),'0px');
   assert.equal(await page.locator('.chapter-hero h1').evaluate(e=>getComputedStyle(e).letterSpacing),'normal');
   assert.ok(await page.evaluate(()=>document.fonts.check('17px "Study Thai"')));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'document overflow');
   // Exercise the initial history entry, before any earlier navigation warms it up.
   await page.locator('#variables').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
   await page.waitForFunction(()=>document.querySelector('.reader-topic[aria-current]')?.getAttribute('href')==='#variables');
   const initialReadingY=await page.evaluate(()=>scrollY);
   await page.locator('.reader-topic[href="#quiz"]').evaluate(a=>a.click());
   await page.goBack();
   await page.waitForFunction(y=>Math.abs(scrollY-y)<3,initialReadingY,{timeout:5000});
   await page.locator('.reader-topic[href="#variables"]').evaluate(a=>a.click());
   await page.locator('.reader-category[data-reader-category="quiz"]').evaluate(button=>button.click());
   assert.equal(new URL(page.url()).hash,'#quiz');
   assert.ok(await page.locator('#quiz h2').evaluate(e=>e.getBoundingClientRect().top<innerHeight));
   await page.goBack();
   assert.equal(new URL(page.url()).hash,'#variables');
   assert.ok(await page.locator('#variables h2').evaluate(e=>e.getBoundingClientRect().top<innerHeight));
   await page.locator('.reader-topic[href="#operators"]').evaluate(a=>a.click());
   await page.waitForFunction(()=>document.querySelector('.reader-topic[aria-current]')?.getAttribute('href')==='#operators');
   const readingY=await page.evaluate(()=>scrollY);
   // Sidebar works without scrolling away from the reading position on desktop.
   // Programmatically activate the same real link on mobile (its menu is collapsed).
   await page.locator('.reader-topic[href="#quiz"]').evaluate(a=>a.click());
   await page.waitForFunction(()=>document.querySelector('.reader-topic[aria-current]')?.getAttribute('href')==='#quiz');
   const quizY=await page.evaluate(()=>scrollY);
   await page.goBack();
   await page.waitForFunction(y=>Math.abs(scrollY-y)<3,readingY,{timeout:5000});
   await page.goForward();
   await page.waitForFunction(y=>Math.abs(scrollY-y)<3,quizY,{timeout:5000});
  }
  await page.close();
 }
 if(!capture) {
  const p=await useLocalFiles(await browser.newPage({reducedMotion:'reduce'}),root);
  await p.goto('https://study-garden.test/subjects/itds241/chapter-06.html#variables');
  const tracer=p.locator('[data-variable-tracer]');
  assert.equal(await tracer.count(),1,'A variable trace must expose actual execution state');
  const next=tracer.getByRole('button',{name:'บรรทัดถัดไป'});
  const reset=tracer.getByRole('button',{name:'เริ่มใหม่'});
  for(let i=0;i<4;i++) await next.click();
  assert.equal(await tracer.locator('[data-trace-output]').textContent(),'200');
  assert.equal(await next.isDisabled(),true);
  await tracer.locator('[data-price]').fill('12.5');
  await tracer.locator('[data-quantity]').fill('3');
  for(let i=0;i<4;i++) await next.click();
  assert.equal(await tracer.locator('[data-trace-output]').textContent(),'37.5');
  await tracer.locator('[data-quantity]').fill('0');
  for(let i=0;i<4;i++) await next.click();
  assert.equal(await tracer.locator('[data-trace-output]').textContent(),'0');
  await tracer.locator('[data-price]').fill('');
  assert.equal(await next.isDisabled(),true,'Empty input must not silently become zero');
  await tracer.locator('[data-price]').fill('-1');
  assert.equal(await next.isDisabled(),true);
  await reset.focus(); await p.keyboard.press('Enter');
  assert.equal(await tracer.locator('[data-price]').inputValue(),'100');
  assert.equal(await tracer.locator('[data-quantity]').inputValue(),'2');
  // Reset must restore actual lesson state, not only a status message.
  const activities=await useLocalFiles(await browser.newPage({reducedMotion:'reduce'}),root);
  activities.on('pageerror',e=>errors.push(e.message));
  await activities.goto('https://study-garden.test/subjects/itds241/chapter-07.html#dom');
  const originalItems=await activities.locator('#dom-list li').allTextContents();
  // Run the exact complete HTML examples in a separate page, like a saved .html file.
  const examplePage=await browser.newPage();
  examplePage.on('pageerror',e=>errors.push(e.message));
  for(const id of ['dom-fixture','event-fixture','sum-fixture']) {
    const html=await activities.locator(`[data-browser-example="${id}"]`).textContent();
    await examplePage.setContent(html);
    if(id==='dom-fixture') {
      assert.equal(await examplePage.locator('#topics li').count(),0);
      assert.equal(await examplePage.locator('#result').textContent(),'ลูกที่เหลือ: 0');
    } else if(id==='event-fixture') {
      assert.equal(await examplePage.locator('#result').textContent(),'ยังไม่กด');
      await examplePage.locator('#check').focus(); await examplePage.keyboard.press('Enter');
      assert.equal(await examplePage.locator('#result').textContent(),'รับเหตุการณ์: click');
    } else {
      await examplePage.locator('#add').click();
      assert.equal(await examplePage.locator('#result').textContent(),'15');
      await examplePage.locator('#first').fill(''); await examplePage.locator('#add').click();
      assert.equal(await examplePage.locator('#result').textContent(),'กรุณากรอกตัวเลขทั้งสองช่อง');
      await examplePage.locator('#first').fill('0'); await examplePage.locator('#add').click();
      assert.equal(await examplePage.locator('#result').textContent(),'3');
    }
  }
  await examplePage.close();
  await activities.locator('#dom-input').fill('<b>literal input</b>');
  await activities.locator('#dom-add').click();
  assert.equal(await activities.locator('#dom-list b').count(),0,'User text remains text');
  assert.equal(await activities.locator('#dom-list li').count(),originalItems.length+1);
  await activities.locator('#dom-reset').focus(); await activities.keyboard.press('Enter');
  assert.deepEqual(await activities.locator('#dom-list li').allTextContents(),originalItems);
  assert.equal(await activities.locator('#dom-input').inputValue(),'');
  await activities.goto('https://study-garden.test/subjects/itds241/chapter-08.html#nullish');
  await activities.locator('#nullish-value').selectOption('nil');
  assert.equal(await activities.locator('#nullish-output').textContent(),'"สำรอง"');
  await activities.locator('#nullish-reset').focus(); await activities.keyboard.press('Space');
  assert.equal(await activities.locator('#nullish-value').inputValue(),'zero');
  assert.equal(await activities.locator('#nullish-output').textContent(),'0');
  await activities.close();
  assert.match(await tracer.locator('[data-trace-state]').textContent(),/ยังไม่/);
  assert.equal(await next.isDisabled(),false);
  await p.close();
  for(const javaScriptEnabled of [false,true]) {
   const p=await useLocalFiles(await browser.newPage({javaScriptEnabled}),root);
   await p.goto('https://study-garden.test/subjects/itds241/chapter-06.html');
   await p.emulateMedia({media:'print'});
   assert.equal(await p.locator('.lesson-section:visible').count(),await p.locator('.lesson-section').count());
   await p.close();
  }
 }
 assert.deepEqual(errors,[]);
 console.log(capture?`PASS: ${stage} screenshots captured`:'PASS: topic reading, navigation/history, Thai font, print/no-JS and responsive themes');
} finally {await browser.close();}
