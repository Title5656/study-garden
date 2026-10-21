import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const root=fileURLToPath(new URL('../',import.meta.url));
try{
 const p=await useLocalFiles(await browser.newPage({viewport:{width:700,height:1050}}),root);
 await p.emulateMedia({media:'print'});
 for(const cid of ['02','05','06','08','10']){
  await p.goto(`https://study-garden.test/subjects/itds261/chapter-${cid}.html`);
  const clipped=await p.locator('.se-svg-scroll:visible').evaluateAll(xs=>xs.filter(x=>x.scrollWidth>x.clientWidth+2).map(x=>x.closest('figure').id));
  assert.deepEqual(clipped,[],`chapter ${cid}: printed figures cannot scroll`);
  const tooWide=await p.locator('.se-print-piece:visible').evaluateAll(xs=>xs.filter(x=>x.getBoundingClientRect().width>x.parentElement.clientWidth+1).length);
  assert.equal(tooWide,0);
  if(cid==='05'){
   assert.equal(await p.locator('#zoo-l1 .se-print-piece:visible').count(),4);
   assert.equal(await p.locator('#zoo-l2 .se-print-piece:visible').count(),4);
   assert.equal(await p.locator('#zoo-l1 .se-svg-scroll:visible').count(),0);
  }
 }
 await p.close();console.log('PASS: A4 chapter figures fit print width, with all eight Zoo process views printable.');
}finally{await browser.close();}
