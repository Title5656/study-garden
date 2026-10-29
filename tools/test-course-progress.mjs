import assert from 'node:assert/strict';
import {readdirSync, readFileSync, mkdirSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium} = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const base = 'https://study-garden.test/';
function pages(dir) {
  return readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? pages(join(dir,e.name)) : e.name.endsWith('.html') ? [join(dir,e.name)] : []);
}
const lessons = pages(join(root,'subjects')).filter(file => {
  const html = readFileSync(file,'utf8');
  return html.includes('reader.js') && html.includes('lesson-content') && /class="[^"]*\btoc\b/.test(html);
});
const seeds = {
  itds211: {'01':{read:true},'02':{read:true},'03':{best:10}},
  itds241: {'06':{read:true},'09':{read:true},'07':{best:10},'stale':{read:true}},
  itds261: {'01':{read:true},'02':{read:true},'03':{read:true}},
  itds294: {'01':{read:true},'02':{read:true},'03':{read:true}},
  'thermo-chemical': {'01':{read:true},'02':{read:true},'03':{read:true}},
};
const expected = {itds211:17,itds241:40,itds261:27,itds294:30,'thermo-chemical':33};
const browser = await chromium.launch({channel:'chrome',headless:true});
const errors=[];
try {
  for (const [theme,width] of [['light',1440],['dark',320]]) {
    const page = await useLocalFiles(await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),root);
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(({theme,seeds})=>{
      localStorage.setItem('study-garden:theme',JSON.stringify(theme));
      for (const [course,value] of Object.entries(seeds)) localStorage.setItem('study-garden:'+course,JSON.stringify(value));
    },{theme,seeds});
    for (const file of lessons) {
      const path = relative(root,file).replaceAll('\\','/');
      await page.goto(base+path);
      await page.waitForFunction(()=>document.body.classList.contains('reader-ready'));
      const course = await page.locator('body').getAttribute('data-subject');
      const ring = page.locator('.reader-course [role="progressbar"]');
      assert.equal(await ring.count(),1,`${path}: shared course progress ring`);
      assert.equal(await ring.getAttribute('aria-valuenow'),String(expected[course]),path);
      assert.equal(await ring.innerText(),expected[course]+'%',path);
      const style = await ring.evaluate(el=>{
        const rect=el.getBoundingClientRect(), parent=el.parentElement.getBoundingClientRect(), arc=el.querySelector('.course-progress-value');
        return {width:parseFloat(getComputedStyle(el).width),height:parseFloat(getComputedStyle(el).height),color:getComputedStyle(el).color,
          accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
          stroke:getComputedStyle(arc).stroke,transition:getComputedStyle(arc).transitionDuration,
          offset:Number(arc.getAttribute('stroke-dashoffset')),fits:rect.width===0 || (rect.left>=parent.left && rect.right<=parent.right)};
      });
      assert.equal(style.width,42,path); assert.equal(style.height,42,path);
      assert.equal(style.stroke,style.color,path);
      assert.equal(style.transition,'0s',path);
      assert.ok(Math.abs(style.offset-(100-expected[course]))<1,path);
      assert.equal(style.fits,true,`${path}: ring fits the existing course card`);
      assert.ok(!(await page.locator('.reader-course').innerText()).includes('▦'),path);
    }
    console.log(`PASS: ${lessons.length} lesson pages, ${theme}, ${width}px`);
    if(process.argv.includes('--capture')) {
      mkdirSync(resolve(root,'docs/screenshots/course-progress'),{recursive:true});
      await page.screenshot({path:resolve(root,`docs/screenshots/course-progress/${theme}-${width}.png`)});
    }
    await page.close();
  }
  const context = await browser.newContext();
  const page = await useLocalFiles(await context.newPage(),root);
  await page.goto(base+'subjects/itds241/chapter-06.html');
  const ring=page.locator('.reader-course [role="progressbar"]');
  assert.equal(await ring.innerText(),'0%');
  assert.equal(await ring.locator('.course-progress-value').evaluate(el=>getComputedStyle(el).transitionDuration),'0.35s, 0.35s');
  const lightColor=await ring.evaluate(el=>getComputedStyle(el).color);
  await page.locator('[data-theme-toggle]').click();
  assert.notEqual(await ring.evaluate(el=>getComputedStyle(el).color),lightColor,'accent follows theme toggle');
  // Real read/unread actions must refresh the ring without a reload.
  await page.locator('[data-mark-read]').evaluate(el=>el.click());
  assert.equal(await ring.innerText(),'20%');
  await page.locator('[data-mark-read]').evaluate(el=>el.click());
  assert.equal(await ring.innerText(),'0%');
  // Another tab writes the existing storage key; mounted readers update too.
  const other = await useLocalFiles(await page.context().newPage(),root);
  await other.goto(base+'subjects/itds241/chapter-09.html');
  await other.evaluate(()=>localStorage.setItem('study-garden:itds241',JSON.stringify(Object.fromEntries(['06','07','08','09','10'].map(id=>[id,{read:true}])))));
  await page.waitForFunction(()=>document.querySelector('[role="progressbar"]').textContent==='100%');
  await page.reload(); assert.equal(await ring.innerText(),'100%');
  await page.evaluate(()=>{window.StudyContent.itds241={};window.dispatchEvent(new Event('pageshow'));});
  assert.equal(await ring.innerText(),'0%','empty course has finite zero progress');
  await page.close();
  const blocked = await useLocalFiles(await browser.newPage(),root);
  await blocked.addInitScript(()=>{Storage.prototype.getItem=Storage.prototype.setItem=()=>{throw new Error('Storage disabled');};});
  await blocked.goto(base+'subjects/itds241/chapter-06.html');
  await blocked.locator('[data-mark-read]').evaluate(el=>el.click());
  assert.equal(await blocked.locator('.reader-course [role="progressbar"]').innerText(),'20%','uses existing memory fallback');
  assert.deepEqual(errors,[]);
  console.log('PASS: read/unread, cross-tab updates, reload, 0%/100%, empty course, blocked storage');
} finally { await browser.close(); }
