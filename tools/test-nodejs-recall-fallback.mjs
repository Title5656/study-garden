import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const width of [390,1440])for(const javaScriptEnabled of [true,false]){
  const p=await useLocalFiles(await browser.newPage({viewport:{width,height:900},javaScriptEnabled,reducedMotion:'reduce'}),fileURLToPath(new URL('../',import.meta.url)));
  if(javaScriptEnabled)await p.addInitScript(()=>localStorage.setItem('study-garden:itds241:node-quiz:p1-ch3-quiz',JSON.stringify({index:0,answers:[{correct:true,value:null}]})));
  await p.goto('https://study-garden.test/subjects/itds241/chapter-09.html#p1-ch3-quiz');
  const section=p.locator('#p1-ch3-quiz');
  assert.equal(await section.locator('textarea, button').count(),0,'remove stateful answering controls');
  assert.equal(await section.locator('details').count(),3);
  for(const details of await section.locator('details').all()){
   await details.locator('summary').click();assert.equal(await details.locator('p').first().isVisible(),true);
   await details.locator('summary').click();assert.equal(await details.getAttribute('open'),null);
  }
  if(javaScriptEnabled){await p.locator('[data-reader-next]').click();assert.equal(new URL(p.url()).hash,'#p1-modules');await p.locator('[data-reader-previous]').click();assert.equal(new URL(p.url()).hash,'#p1-setup');assert.ok(await section.isVisible());}
  await p.close();
 }
 console.log('PASS: native chapter 3 review disclosures and navigation on mobile/desktop, with saved answers and without JavaScript.');
}finally{await browser.close();}
