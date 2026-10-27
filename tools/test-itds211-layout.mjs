import assert from 'node:assert/strict';
import {readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const files=(await readdir(new URL('../subjects/itds211/',import.meta.url))).filter(x=>/^chapter-\d+\.html$/.test(x)).sort();
if(!process.env.STUDY_ITDS211_PARTIAL)assert.equal(files.length,12);
const browser=await chromium.launch({channel:'chrome',headless:true});
let checked=0;
const errors=[];
try{
 for(const theme of ['light','dark']){
 const page=await useLocalFiles(await browser.newPage({viewport:{width:320,height:900},reducedMotion:'reduce',colorScheme:theme}),root);
 page.on('pageerror',e=>errors.push(e.message));
 for(const file of files){
  await page.goto('https://study-garden.test/subjects/itds211/'+file);
  await page.evaluate(()=>document.fonts.ready);
  const results=await page.evaluate(async()=>{
   const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const sections=[...document.querySelectorAll('.lesson-content > .lesson-section')];
   const result=[];
   for(const section of sections){
    location.hash=section.id;
    await frames();
    for(const img of section.querySelectorAll('img')){img.loading='eager';try{await img.decode()}catch{}}
    result.push({id:section.id,visible:!section.hidden&&getComputedStyle(section).display!=='none',overflow:document.documentElement.scrollWidth-innerWidth});
   }
   return result;
  });
  for(const r of results){assert.equal(r.visible,true,`${file}#${r.id}: direct topic links`);assert.ok(r.overflow<=1,`${file}#${r.id}: 320px page overflow ${r.overflow}`);checked++}
  console.log(`PASS: ${theme} ${file}, ${results.length} topics, 320px tables/code/citations/graphics.`);
 }
 await page.close();
 }
 assert.deepEqual(errors,[],'all topic navigation stays free of runtime errors');
 console.log(`PASS: ${checked} ITDS211 topic/theme cases at 320px.`);
}finally{await browser.close()}
