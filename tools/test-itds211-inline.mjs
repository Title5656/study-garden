import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {mkdir} from 'node:fs/promises';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
try {
 const page=await browser.newPage({reducedMotion:'reduce'});
 await useLocalFiles(page,root);
 page.on('pageerror',e=>errors.push(e.message));
 let total=0;
 for(let i=1;i<=12;i++){
  const id=String(i).padStart(2,'0');
  await page.goto(`https://study-garden.test/subjects/itds211/chapter-${id}.html`);
  const maps=page.locator('.itds211-inline-map');
  assert.ok(await maps.count()>=4,`${id}: explanatory visuals belong inside at least four teaching topics`);
  total+=await maps.count();
  const anchors=await maps.evaluateAll(nodes=>nodes.map(n=>n.closest('.lesson-section').id));
  assert.ok(anchors.every(id=>!['interactive','visual-map'].includes(id)));
  for(const anchor of anchors){
   await page.goto(`https://study-garden.test/subjects/itds211/chapter-${id}.html#${anchor}`);
   const map=page.locator(`#${anchor} .itds211-inline-map`);
   const buttons=map.locator('.itds211-map-node');
   await buttons.nth(1).click();
   assert.equal(await buttons.nth(1).getAttribute('aria-pressed'),'true');
   assert.equal(await map.locator('.itds211-map-detail:visible').count(),1);
   assert.equal(await map.locator('.itds211-map-detail').nth(1).isVisible(),true);
  }
  for(const theme of ['light','dark']){
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   await page.setViewportSize({width:390,height:844});
   for(const anchor of anchors){
    await page.goto(`https://study-garden.test/subjects/itds211/chapter-${id}.html#${anchor}`);
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),theme);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id}/${anchor}: mobile overflow`);
   }
  }
 }
 const open=async(id,anchor)=>{await page.goto(`https://study-garden.test/subjects/itds211/chapter-${id}.html#${anchor}`);return page.locator(`#${anchor} .itds211-inline-sim`)};
 const setSlider=async(sim,value)=>sim.locator('input').evaluate((input,value)=>{input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}))},value);
 let sim=await open('02','clock-and-cpu-equation');
 await setSlider(sim,4);
 assert.match(await sim.locator('output').innerText(),/0.25/);
 sim=await open('04','twos-complement');
 await sim.locator('button[data-inline-bit="7"]').click();
 assert.match(await sim.locator('output').innerText(),/-128/);
 sim=await open('05','direct-mapping');
 await setSlider(sim,16);
 assert.match(await sim.locator('output').innerText(),/Block 4.*Line 0.*Tag 1/s);
 sim=await open('12','round-robin');
 const before=await sim.locator('output').innerText();
 await setSlider(sim,4);
 assert.notEqual(await sim.locator('output').innerText(),before);
 sim=await open('07','disk-timing');
 await setSlider(sim,15000);
 assert.match(await sim.locator('output').innerText(),/รวม 17 ms/);
 sim=await open('08','pipeline-timing');
 await setSlider(sim,1);
 assert.match(await sim.locator('output').innerText(),/5 cycles → Pipeline 5 cycles/);
 await setSlider(sim,8);
 assert.match(await sim.locator('output').innerText(),/40 cycles → Pipeline 12 cycles/);
 sim=await open('09','parallel-programming-cost');
 await setSlider(sim,1);
 assert.match(await sim.locator('output').innerText(),/= 1×/);
 await setSlider(sim,16);
 assert.match(await sim.locator('output').innerText(),/= 3.368×/);
 sim=await open('11','process-states');
 assert.equal(await sim.locator('[data-event="io"]').isDisabled(),true);
 await sim.locator('[data-event="dispatch"]').click();
 await sim.locator('[data-event="io"]').click();
 assert.match(await sim.locator('output').innerText(),/Blocked/);
 assert.equal(await sim.locator('[data-event="dispatch"]').isDisabled(),true);
 await sim.locator('[data-event="complete"]').click();
 assert.match(await sim.locator('output').innerText(),/Ready/);
 // Keyboard operability and independent state from the full lab.
 sim=await open('02','clock-and-cpu-equation');
 await sim.locator('input').focus();await page.keyboard.press('ArrowRight');
 assert.match(await sim.locator('output').innerText(),/0.4 วินาที/);
 await sim.locator('[data-inline-reset]').click();
 assert.match(await sim.locator('output').innerText(),/0.5 วินาที/);
 await page.goto('https://study-garden.test/subjects/itds211/chapter-02.html#interactive');
 assert.equal(await page.locator('[name=ghz]').inputValue(),'2');
 assert.deepEqual(errors,[]);
 if(process.env.STUDY_GARDEN_OUTPUT){
  await mkdir(process.env.STUDY_GARDEN_OUTPUT,{recursive:true});
  for(const theme of ['light','dark'])for(const width of [1440,390]){
   await page.setViewportSize({width,height:1000});
   await page.evaluate(t=>{localStorage.setItem('study-garden-theme',t);document.documentElement.dataset.theme=t},theme);
   await page.goto('https://study-garden.test/subjects/itds211/chapter-02.html#clock-and-cpu-equation');
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   await page.screenshot({path:`${process.env.STUDY_GARDEN_OUTPUT}/inline-${theme}-${width}.png`,fullPage:true});
  }
 }
 const plain=await browser.newPage({javaScriptEnabled:false});await useLocalFiles(plain,root);
 await plain.goto('https://study-garden.test/subjects/itds211/chapter-03.html');
 assert.ok(await plain.locator('.itds211-map-detail:visible').count()>=12,'all explanations remain readable without JS');
 console.log(`PASS: ${total} embedded maps across all 12 lessons; interactive calculations, mobile layouts, both themes, no JS fallback, no browser errors.`);
} finally {await browser.close()}
