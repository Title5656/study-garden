// Comparable editorial screenshots against the last delivered version.
import {mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'docs/screenshots/mahidol-completion');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const [course,chapter,anchor] of [['itds241','07','callbacks'],['itds261','02','framework'],['itds294','02','model']]) {
  const path=`subjects/${course}/chapter-${chapter}.html`;
  const old=execFileSync('git',['show',`abe9b00:${path}`],{cwd:root,encoding:'utf8'});
  for(const stage of ['before','after']) for(const width of [390,1440]) for(const theme of ['light','dark']) {
   const page=await useLocalFiles(await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),root);
   if(stage==='before') await page.route(`**/${path}`,r=>r.fulfill({body:old,contentType:'text/html; charset=utf-8'}));
   await page.goto(`https://study-garden.test/${path}#${anchor}`);
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   await page.evaluate(()=>document.fonts.ready);
   await page.locator(`#${anchor}`).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
   await page.screenshot({path:resolve(out,`${course}-${stage}-${width}-${theme}.png`)});
   await page.close();
  }
 }
 console.log('Captured 24 comparable Mahidol before/after screenshots, 390/1440px, light/dark.');
} finally {await browser.close();}
