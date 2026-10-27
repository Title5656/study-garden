// Regression: footer artwork must stay inside its footer at every page position.
import assert from 'node:assert/strict';
import {mkdir, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';

const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const output=process.env.STUDY_GARDEN_OUTPUT;
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const failures=[];
let passed=0;
const frames=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

async function geometry(page){
 return page.evaluate(()=>{
  const rect=selector=>{const b=document.querySelector(selector).getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height}};
  return {overflow:document.documentElement.scrollWidth-innerWidth,main:rect('main'),footer:rect('.motion-footer'),mark:rect('.footer-wordmark'),icon:rect('.footer-contact svg'),links:rect('.footer-actions')};
 });
}

function assertGeometry(g,name){
 assert.ok(g.overflow<=1,`${name}: horizontal overflow ${g.overflow}px`);
 assert.ok(g.icon.width>=16 && g.icon.width<=32 && g.icon.height>=16 && g.icon.height<=32,`${name}: GitHub icon must stay at button size: ${JSON.stringify(g.icon)}`);
 assert.ok(g.mark.top>=g.footer.top && g.mark.bottom<=g.footer.bottom-55,`${name}: Garden must stay inside its footer: ${JSON.stringify(g)}`);
 assert.ok(g.mark.left>=g.footer.left-1 && g.mark.right<=g.footer.right+1,`${name}: Garden must fit the footer width`);
 assert.ok(g.links.bottom+12<=g.mark.top,`${name}: Garden must not overlap footer navigation`);
}

async function check({path='index.html',width=1440,height=900,theme='dark',motion='no-preference',javascript=true}){
 const name=`${path} ${width} ${theme} ${motion}${javascript?'':' no-JS'}`;
 if(process.env.STUDY_GARDEN_TEST && !name.includes(process.env.STUDY_GARDEN_TEST))return;
 const page=await useLocalFiles(await browser.newPage({viewport:{width,height},reducedMotion:motion,javaScriptEnabled:javascript}),root);
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('https://study-garden.test/subjects/itds211/'+path);
  await page.evaluate(async theme=>{document.documentElement.dataset.theme=theme;await document.fonts.ready},theme);
  if(javascript)await frames(page);
  const top=await geometry(page);
  assertGeometry(top,name+' at top');
  assert.ok(top.mark.top>=top.main.bottom,`${name}: footer wordmark must not cover course content`);
  if(path==='index.html'){
   assert.equal(await page.locator('.folder-card').count(),12);
   assert.equal(await page.locator('.footer-reveal').evaluate(el=>el.classList.contains('reveal-enabled')),javascript && motion==='no-preference' && height>=580,'landing footer follows motion preference');
  }
  const capture=output && javascript && path==='index.html' && theme==='dark' && motion==='no-preference' && [1920,390].includes(width);
  if(capture)await page.screenshot({path:resolve(output,`itds211-index-${width}-top.png`)});
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight/2,behavior:'instant'}));if(javascript)await frames(page);
  assertGeometry(await geometry(page),name+' mid-scroll');
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));if(javascript)await frames(page);
  assertGeometry(await geometry(page),name+' at footer');
  assert.equal(await page.locator('.footer-contact').evaluate(el=>el.inert || el.closest('[inert]')!==null),false,'uncovered GitHub link remains interactive');
  assert.deepEqual(errors,[],'no runtime errors');
  if(capture)await page.screenshot({path:resolve(output,`itds211-index-${width}-footer.png`)});
  passed++;
 }catch(e){failures.push(name);console.error('FAIL:',name,e.message)}
 finally{await page.close()}
}

try{
 for(const [width,height] of [[1920,1000],[1440,900],[390,844],[320,568],[844,390]])
  for(const theme of ['dark','light'])
   for(const motion of ['no-preference','reduce'])await check({width,height,theme,motion});
 const lessons=(await readdir(resolve(root,'subjects/itds211'))).filter(p=>/^chapter-\d+\.html$/.test(p));
 assert.equal(lessons.length,12);
 for(const path of lessons)await check({path,width:390,height:844,motion:'reduce'});
 for(const width of [1920,390])await check({width,height:900,javascript:false});
}finally{await browser.close()}
console.log(`${passed} ITDS211 footer cases passed; ${failures.length} failed.`);
if(failures.length)process.exitCode=1;
