import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const output=fileURLToPath(new URL('../../work-notes/wallpaper-qa/',import.meta.url));
await mkdir(output,{recursive:true});
const baseline=process.argv.includes('--baseline');
const browser=await chromium.launch({channel:'chrome',headless:true});
let checks=0;
try {
 for(const [name,width,height] of [['phone',390,844],['phone-short',360,640],['phone-tall',430,932],['ipad',820,1180],['ipad-pro',1024,1366],['ipad-landscape',1180,820],['ipad-pro-landscape',1366,1024],['phone-landscape',844,390],['desktop',1920,1080],['laptop',1440,900],['wide',2560,1080],['superwide',3840,1080],['split',600,900]]) {
  for(const theme of ['light','dark']) {
   const page=await useLocalFiles(await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),root);
   await page.addInitScript(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);
   for(const [label,path] of [['home','index.html'],['course','subjects/itds241/index.html'],['lesson','subjects/itds241/chapter-06.html']]) {
    await page.goto('https://study-garden.test/'+path,{waitUntil:'networkidle'});
    await page.screenshot({path:output+`${baseline?'before':'after'}-${name}-${theme}-${label}.png`});
    if(baseline) continue;
    const family=(w,h)=>w/h>=2?'ultrawide':w/h>=1&&w/h<=1.5?'tablet-landscape':w/h>=0.65&&w/h<1?'tablet':w/h<0.65?'mobile':null;
    const expected=family(width,height);
    const check=async()=>{
     const state=await page.evaluate(()=>{const s=getComputedStyle(document.body,'::before');return {position:s.position,image:s.backgroundImage,pointer:s.pointerEvents,top:document.body.getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth};});
     assert.equal(state.position,'fixed');assert.equal(state.pointer,'none');assert.equal(state.overflow,false);
     assert.ok(state.image.includes(`background-${theme}${expected?'-'+expected:''}.webp`),state.image);
    };
    await check();
    await page.evaluate(async()=>{
     const url=getComputedStyle(document.body,'::before').backgroundImage.match(/url\("([^"]+)"\)/)[1];
     const image=new Image(); image.src=url; await image.decode();
     if(!image.naturalWidth) throw new Error('Wallpaper failed to decode: '+url);
    });
    await page.evaluate(()=>scrollTo(0,document.body.scrollHeight/2));await check();
    assert.equal(await page.evaluate(()=>getComputedStyle(document.body,'::before').top),'0px');
    await page.evaluate(()=>scrollTo(0,0));
    await page.locator('[data-theme-toggle]').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme==='light'?'dark':'light');
    await page.locator('[data-theme-toggle]').click();
    if(width<height){await page.setViewportSize({width:height,height:width});assert.ok((await page.evaluate(()=>getComputedStyle(document.body,'::before').backgroundImage)).includes(`background-${theme}${family(height,width)?'-'+family(height,width):''}.webp`));await page.setViewportSize({width,height});await check();}
    await page.emulateMedia({media:'print'});assert.equal(await page.evaluate(()=>getComputedStyle(document.body,'::before').display),'none');await page.emulateMedia({media:'screen'});
    checks++;
   }
   await page.close();
  }
 }
 console.log(baseline?'Baseline screenshots captured':`Wallpaper: ${checks} page/theme/viewport combinations passed (scroll, rotate, theme, print).`);
}finally{await browser.close();}
