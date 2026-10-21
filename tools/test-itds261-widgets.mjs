import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({channel:'chrome',headless:true});
const errors=[],failures=[];
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.ttf':'font/ttf','.mp4':'video/mp4'};
async function pageFor(cid,hash,options={}) {
 const page=await browser.newPage({viewport:{width:375,height:900},reducedMotion:'reduce',...options});
 page.on('pageerror',e=>errors.push(e.message));
 // Fulfil local assets in-process, so no network or localhost exception is required.
 await page.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname!=='study-garden.test') return route.abort();
  const name=decodeURIComponent(u.pathname).replace(/\/$/,'/index.html');
  const path=resolve(root,'.'+name);
  if(!path.startsWith(resolve(root)+sep)) return route.abort();
  try {await route.fulfill({body:await readFile(path),contentType:types[extname(path)]||'application/octet-stream'});} catch {await route.fulfill({status:404,body:'Missing asset'});}
 });
 await page.goto(`https://study-garden.test/subjects/itds261/chapter-${cid}.html#${hash}`);
 const ids=await page.locator('[id]').evaluateAll(xs=>xs.map(x=>x.id));
 assert.equal(new Set(ids).size,ids.length,'duplicate IDs after initialization');
 return page;
}
async function check(name,fn){try{await fn();console.log('PASS:',name);}catch(e){failures.push(name);console.error('FAIL:',name,e.message);}}
try {
 await check('Team slider draws 2 and 12 people with 1 and 66 channels',async()=>{
  const p=await pageFor('01','people-quality');
  assert.equal(await p.locator('#w-channels').count(),1,'team widget missing');
  for(const [people,lines] of [[2,1],[12,66]]) {
   await p.locator('#ch-range').fill(String(people));
   assert.equal(await p.locator('#ch-svg circle').count(),people);
   assert.equal(await p.locator('#ch-svg line').count(),lines);
   assert.match(await p.locator('#ch-out').innerText(),new RegExp(`${lines} ช่องทาง`));
  }
  await p.close();
 });
 await check('Model chooser evaluates all 8 combinations and supports keyboard',async()=>{
  const p=await pageFor('02','selection');
  assert.equal(await p.locator('#w-model').count(),1,'model widget missing');
  for(const [req,risk,feedback,want] of [['clear','low','rare','Waterfall'],['clear','low','frequent','Incremental'],['unclear','low','rare','prototype'],['unclear','low','frequent','Agile'],['clear','high','rare','Spiral'],['clear','high','frequent','Spiral'],['unclear','high','rare','Spiral'],['unclear','high','frequent','Spiral']]) {
   for(const [key,val] of Object.entries({req,risk,feedback})) {
    await p.locator(`#mc [data-key="${key}"][data-val="${val}"]`).focus(); await p.keyboard.press('Space');
    assert.equal(await p.locator(`#mc [data-key="${key}"][data-val="${val}"]`).getAttribute('aria-pressed'),'true');
   }
   assert.ok((await p.locator('#mc-out').innerText()).includes(want));
  }
  await p.close();
 });
 await check('DFD checks all 36 endpoint pairs including self and store/entity edges',async()=>{
  const p=await pageFor('05','dfd-elements');
  assert.equal(await p.locator('#w-dfd').count(),1,'DFD widget missing');
  const nodes=[['visitor','entity'],['provider','entity'],['p1','process'],['p4','process'],['d1','store'],['d4','store']];
  for(const [from,fk] of nodes) for(const [to,tk] of nodes){
   await p.locator('#dfd-from').selectOption(from); await p.locator('#dfd-to').selectOption(to);
   const want=from!==to && (fk==='process'||tk==='process');
   assert.ok((await p.locator('#dfd-out').innerText()).startsWith(want?'✓':'✕'),`${from}->${to}`);
  }
  await p.close();
 });
 await check('Triangle rejects missing/zero/degenerate and classifies all positive cases',async()=>{
  const p=await pageFor('06','triangle');
  assert.equal(await p.locator('#w-triangle').count(),1,'triangle widget missing');
  for(const [sides,want,line] of [[[4,4,4],'ด้านเท่า','l3'],[[3,3,5],'หน้าจั่ว','l4'],[[3,4,5],'ด้านไม่เท่า','l5'],[[1,2,3],'ไม่เป็นสามเหลี่ยม','l2'],[[0,4,4],'ค่าบวก','l1'],[[-1,4,4],'ค่าบวก','l1']]) {
   for(const [i,id] of ['a','b','c'].entries()) await p.locator('#tri-'+id).fill(String(sides[i]));
   assert.ok((await p.locator('#tri-out').innerText()).includes(want));
   assert.equal(await p.locator('#tri-code .hit').getAttribute('data-line'),line);
  }
  await p.locator('#tri-a').fill(''); assert.match(await p.locator('#tri-out').innerText(),/ครบ/);
  await p.locator('[data-preset="3,3,3"]').focus(); await p.keyboard.press('Enter');
  assert.equal(await p.locator('[data-preset="3,3,3"]').getAttribute('aria-pressed'),'true');
  assert.equal(await p.locator('#tri-svg polygon').count(),1);
  await p.close();
 });
 await check('Git preserves index snapshot through edit/add/edit/commit and push/reset',async()=>{
  const p=await pageFor('10','git-areas');
  assert.equal(await p.locator('#w-git').count(),1,'Git widget missing');
  for(const action of ['edit','add','edit','commit']) await p.locator(`#w-git [data-act="${action}"]`).click();
  const values=await p.locator('#git-areas .file').allTextContents();
  assert.deepEqual(values.map(v=>v.match(/v\d+/)[0]),['v3','v2','v2','v1']);
  assert.match(await p.locator('#git-msg').innerText(),/v2/);
  assert.match(await p.locator('#git-diff').innerText(),/v2 → v3/);
  await p.locator('[data-act="push"]').click();assert.match((await p.locator('#git-areas .file').allTextContents())[3],/v2/);
  await p.locator('[data-act="reset"]').focus();await p.keyboard.press('Space');
  assert.deepEqual((await p.locator('#git-areas .file').allTextContents()).map(v=>v.match(/v\d+/)[0]),['v1','v1','v1','v1']);
  await p.close();
 });
 await check('Use case flips arrow meaning and exposes a pressed keyboard control',async()=>{
  const p=await pageFor('04','use-case-visual');
  assert.equal(await p.locator('#w-usecase').count(),1,'use case widget missing');
  assert.match(await p.locator('#uc-note').innerText(),/^✓/);
  await p.locator('#uc-flip').focus();await p.keyboard.press('Space');
  assert.match(await p.locator('#uc-note').innerText(),/^✕/);
  assert.equal(await p.locator('#uc-flip').getAttribute('aria-pressed'),'true');
  const outline=await p.locator('#uc-flip').evaluate(e=>getComputedStyle(e).outlineStyle);
  assert.notEqual(outline,'none');
  await p.keyboard.press('Enter'); assert.match(await p.locator('#uc-note').innerText(),/^✓/);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await p.close();
 });
 await check('Pages with no supplied widgets load without errors',async()=>{const p=await pageFor('12','story-ac');assert.equal(await p.locator('.itds261-widget').count(),0);await p.close();});
 assert.deepEqual(errors,[],'page errors');
} finally {await browser.close();}
if(failures.length) throw new Error(failures.join('; '));
