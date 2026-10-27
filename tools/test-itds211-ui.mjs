// Run with the existing Playwright runtime. Test real clipping, not CSS declarations alone.
import assert from 'node:assert/strict';
import {mkdir,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const output=process.env.STUDY_GARDEN_OUTPUT;
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const failures=[];let cases=0;
const tokens=['--bg','--paper','--ink','--muted','--line','--accent','--purple','--sage','--peach','--soft','--code','--code-ink'];
const reference={};
async function themeTokens(page){return page.evaluate(keys=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries(keys.map(k=>[k,s.getPropertyValue(k).trim()]))},tokens)}
async function clippedPoints(folder){
 await folder.scrollIntoViewIfNeeded();
 return folder.evaluate(folder=>{
  const hit=(selector,x,y)=>{const n=folder.querySelector(selector),r=n.getBoundingClientRect();return document.elementsFromPoint(r.left+r.width*x,r.top+r.height*y).includes(n)};
  const f=folder.querySelector('.folder-front').getBoundingClientRect(),l=folder.querySelector('.folder-label').getBoundingClientRect();
  return {backOutside:hit('.folder-back',.05,.04),backInside:hit('.folder-back',.85,.06),frontOutside:hit('.folder-front',.90,.04),frontInside:hit('.folder-front',.5,.6),labelFits:l.left>=f.left && l.right<=f.right && l.top>=f.top && l.bottom<=f.bottom,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
 });
}
function assertPoints(actual,label){
 assert.equal(actual.backOutside,false,label+': back image must leave the area above the folder tab transparent');
 assert.equal(actual.backInside,true,label+': back tab keeps its artwork');
 assert.equal(actual.frontOutside,false,label+': front follows the shared tab silhouette');
 assert.equal(actual.frontInside,true,label+': front body remains painted');
 assert.equal(actual.labelFits,true,label+': title fits inside the folder');
 assert.ok(actual.overflow<=1,label+': no page overflow');
}
async function check(name,run){
 if(process.env.STUDY_GARDEN_TEST && !name.includes(process.env.STUDY_GARDEN_TEST))return;
 try{await run();cases++}catch(e){failures.push(name);console.error('FAIL:',name,e.message)}
}
async function localPage(options={}){return useLocalFiles(await browser.newPage(options),root)}
async function snapshot(page,name){if(output)await page.screenshot({path:resolve(output,name+'.png')})}
try{
 for(const theme of ['light','dark']){
  const ref=await localPage({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  await ref.goto('https://study-garden.test/subjects/itds261/index.html');await ref.evaluate(()=>document.fonts.ready);
  assertPoints(await clippedPoints(ref.locator('.glass-folder').first()),'existing ITDS261 reference');
  reference[theme]=await themeTokens(ref);await ref.close();
 }
 for(const width of [1440,390,320])for(const theme of ['light','dark'])await check(`folders ${width} ${theme}`,async()=>{
  const page=await localPage({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('https://study-garden.test/subjects/itds211/index.html');await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await themeTokens(page),reference[theme],'shared theme palette matches other courses');
   const folders=page.locator('.glass-folder');assert.equal(await folders.count(),12);
   for(let i=0;i<12;i++)assertPoints(await clippedPoints(folders.nth(i)),`folder ${i+1}`);
   await page.locator('.folder-card').first().scrollIntoViewIfNeeded();
   await snapshot(page,`folders-${width}-${theme}-closed`);
   const first=folders.first();
   await first.locator('summary').focus();await page.keyboard.press('Enter');
   assert.equal(await first.getAttribute('open'),'');assert.equal(await first.locator('.folder-files').isVisible(),true);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,'opening a folder must not make the page scroll sideways');
   assert.equal(await first.locator('.folder-files a').count(),3);
   assert.deepEqual(await first.locator('.folder-files a').evaluateAll(links=>links.map(a=>a.getAttribute('href'))),['chapter-01.html','chapter-01.html#interactive','chapter-01.html#quiz']);
   await snapshot(page,`folders-${width}-${theme}-open`);
   for(let i=0;i<12;i++){
    const folder=folders.nth(i);if(await folder.getAttribute('open')===null)await folder.locator('summary').click();
    const id=String(i+1).padStart(2,'0');
    assert.deepEqual(await folder.locator('.folder-files a').evaluateAll(links=>links.map(a=>a.getAttribute('href'))),[`chapter-${id}.html`,`chapter-${id}.html#interactive`,`chapter-${id}.html#quiz`]);
    assert.equal(await folder.locator('.folder-files').isVisible(),true,`folder ${id} opens its own links`);
    assert.equal(await page.locator('.glass-folder[open]').count(),1);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,`folder ${id} stays inside the viewport when open`);
   }
   await folders.nth(1).locator('summary').click();assert.equal(await page.locator('.glass-folder[open]').count(),1);
   assert.equal(await first.getAttribute('open'),null,'opening another folder closes the first');
   await page.locator('#subject-search').fill('OS03');assert.equal(await page.locator('.folder-card:visible').count(),1);
   await page.locator('#subject-search').fill('no-such-lecture-xy');assert.equal(await page.locator('.folder-card:visible').count(),0);assert.equal(await page.locator('#search-empty').isVisible(),true);
   await page.locator('#subject-search').fill('');assert.equal(await page.locator('.folder-card:visible').count(),12);
   await page.locator('[data-theme-toggle]').focus();await page.keyboard.press('Space');
   const next=theme==='dark'?'light':'dark';assert.equal(await page.locator('html').getAttribute('data-theme'),next);
   assert.deepEqual(await themeTokens(page),reference[next]);
   await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),next,'theme persists on reload');
   assert.deepEqual(errors,[]);
  }finally{await page.close()}
 });
 for(const theme of ['light','dark'])await check(`folder visual states ${theme}`,async()=>{
  const appearance=folder=>folder.evaluate(folder=>Object.fromEntries(['.folder-back','.folder-front','.folder-sheet','.folder-label strong'].map(selector=>{
   const style=getComputedStyle(folder.querySelector(selector));
   return [selector,Object.fromEntries(['backgroundImage','backgroundColor','color','borderRadius','clipPath','transform','fontFamily','fontSize'].map(key=>[key,style[key]]))];
  })));
  const expected={};
  for(const [name,course] of [['reference','itds261'],['itds211','itds211']]){
   const page=await localPage({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'no-preference'});
   try{
    await page.goto(`https://study-garden.test/subjects/${course}/index.html`);await page.evaluate(()=>document.fonts.ready);
    const folder=page.locator('.glass-folder').first();
    // Percent-based sheet transforms need the same component dimensions on both pages.
    await folder.locator('..').evaluate(card=>card.style.width='300px');
    await folder.scrollIntoViewIfNeeded();
    for(const state of ['closed','hover','open']){
     if(state==='hover')await folder.locator('summary').hover();
     if(state==='open')await folder.locator('summary').click();
     await page.waitForTimeout(700);
     const actual=await appearance(folder);
     if(name==='reference')expected[state]=actual;else assert.deepEqual(actual,expected[state],state+' appearance matches the existing folder component');
     await snapshot(page,`${name}-${theme}-${state}`);
    }
   }finally{await page.close()}
  }
 });
 for(const width of [320,390,500,501,768,900,901,1024,1200,1280,1281])for(const course of ['itds211','itds261'])for(const touch of [false,true])await check(`responsive fan ${width} ${course} ${touch?'touch':'mouse'}`,async()=>{
  const page=await localPage({viewport:{width,height:1000},colorScheme:'dark',reducedMotion:'reduce',hasTouch:touch,isMobile:touch});
  try{
   await page.goto(`https://study-garden.test/subjects/${course}/index.html`);await page.evaluate(()=>document.fonts.ready);
   const columns=await page.locator('.folder-grid').evaluate(grid=>getComputedStyle(grid).gridTemplateColumns.split(' ').length);
   for(const index of [...new Set([0,columns-1])]){
    const summary=page.locator('.glass-folder summary').nth(index);
    if(touch)await summary.tap();else{await summary.hover();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,'hover fan must fit the viewport');await summary.click()}
    assert.equal(await page.locator('.glass-folder[open]').count(),1);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,'open fan must fit the viewport');
   }
  }finally{await page.close()}
 });
 const lessons=(await readdir(resolve(root,'subjects/itds211'))).filter(p=>/^chapter-\d+\.html$/.test(p)).sort();assert.equal(lessons.length,12);
 for(const width of [1440,390])for(const theme of ['light','dark'])for(const file of lessons)await check(`lesson ${file} ${width} ${theme}`,async()=>{
  const page=await localPage({viewport:{width,height:900},colorScheme:theme,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('https://study-garden.test/subjects/itds211/'+file);await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await themeTokens(page),reference[theme]);
   assert.equal(await page.locator('[data-theme-toggle][role=switch]').count(),1);
   for(const topic of ['overview','visual-map','interactive','glossary','quiz','sources','coverage','review-answers']){
    await page.goto('https://study-garden.test/subjects/itds211/'+file+'#'+topic);
    assert.equal(await page.locator('#'+topic).isVisible(),true,file+'#'+topic);
    assert.equal(await page.locator('.lesson-section:visible').count(),1);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,file+'#'+topic+' overflow');
    if(topic==='quiz')assert.equal(await page.locator('.quiz-question').count(),10);
   }
   assert.deepEqual(errors,[]);
  }finally{await page.close()}
 });
 for(const width of [1440,390])await check(`no-JS folders ${width}`,async()=>{
  const page=await localPage({viewport:{width,height:1000},javaScriptEnabled:false});
  try{await page.goto('https://study-garden.test/subjects/itds211/index.html');assertPoints(await clippedPoints(page.locator('.glass-folder').first()),'static folder')}finally{await page.close()}
 });
}finally{await browser.close()}
console.log(`${cases} ITDS211 shared-UI cases passed; ${failures.length} failed.`);
if(failures.length)process.exitCode=1;
