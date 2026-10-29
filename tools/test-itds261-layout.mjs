import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium }=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.STUDY_GARDEN_OUTPUT;
if(out)await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[],failures=[],bounds=[];let checks=0;
const settle=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
async function page(options={}){
 const p=await useLocalFiles(await browser.newPage({reducedMotion:'reduce',...options}),root);
 p.on('pageerror',e=>errors.push(e.message));
 p.on('response',r=>{if(r.status()===404)errors.push('404 '+r.url());});return p;
}
try {
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
  const p=await page({viewport:{width,height:950}});
  await p.addInitScript(theme=>localStorage.setItem('study-garden-theme',theme),theme);
  for(let n=1;n<=12;n++){
   const cid=String(n).padStart(2,'0');
   await p.goto(`https://study-garden.test/subjects/itds261/chapter-${cid}.html`);
   // Use the real theme control's state, regardless of the app's storage-key spelling.
   await p.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
   assert.equal(await p.locator('.se-recall').count(),1);
   assert.equal(await p.locator('#common-confusions tbody tr').count()>=3,true);
   const topics=await p.locator('.lesson-content > .lesson-section').evaluateAll(xs=>xs.map(x=>x.id));
   for(const id of topics){
    await p.evaluate(id=>location.hash=id,id);await settle(p);
    const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    if(overflow>1)failures.push(`${width}/${theme}/${cid}#${id}: ${overflow}px overflow`);
    const clipped=await p.locator('.lesson-section:visible svg.se-inline-svg:visible').evaluateAll(svgs=>svgs.flatMap(svg=>{
     const vb=svg.viewBox.baseVal;
     return [...svg.querySelectorAll('text')].filter(t=>{
      const b=t.getBBox();return b.x<vb.x-2 || b.y<vb.y-2 || b.x+b.width>vb.x+vb.width+2 || b.y+b.height>vb.y+vb.height+2;
     }).map(t=>t.textContent);
    }));
    if(clipped.length)bounds.push(`${width}/${theme}/${cid}#${id}: ${clipped.join(' | ')}`);
    checks++;
   }
   if(out && width===375 && n===6){await p.evaluate(()=>location.hash='control-state');await settle(p);await p.locator('#ticket-state').screenshot({path:resolve(out,`state-${theme}.png`)});}
  }
  if(out){
   for(const [cid,hash,selector,name] of [['05','worked-dfd','#zoo-l2','zoo-level2'],['05','practice-zoo-level1','#zoo-l1','zoo-level1'],['08','architecture-styles','.se-figure:has(.se-style-grid)','architecture'],['10','git-areas','#w-git','git-widget'],['04','use-case-visual','#w-usecase','usecase'],['01','people-quality','#w-channels','channels']]){
    await p.goto(`https://study-garden.test/subjects/itds261/chapter-${cid}.html#${hash}`);
    await p.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);await settle(p);
    await p.locator(selector).screenshot({path:resolve(out,`${name}-${width}-${theme}.png`),style:'.site-header,.reader-toolbar { visibility:hidden!important; }'});
   }
  }
  await p.close();
 }
 const plain=await page({javaScriptEnabled:false,viewport:{width:375,height:900}});
 await plain.goto('https://study-garden.test/subjects/itds261/chapter-05.html');
 assert.equal(await plain.locator('.lesson-section').count(),await plain.locator('.lesson-section:visible').count());
 assert.equal(await plain.locator('#zoo-l2 [data-dfd-process]').count(),4);
 assert.equal(await plain.locator('.se-source-note').count(),0);
 await plain.close();
 const print=await page({viewport:{width:1000,height:1200}});
 await print.goto('https://study-garden.test/subjects/itds261/midterm-a4.html');
 await print.emulateMedia({media:'print'});
 const pdf=await print.pdf({format:'A4',preferCSSPageSize:true,printBackground:true});
 const count=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;
 assert.equal(count,1,'A4 recall must fit one page');
 if(out){await writeFile(resolve(out,'itds261-midterm-a4.pdf'),pdf);await print.screenshot({path:resolve(out,'a4-print.png'),fullPage:true});}
 await print.close();
 assert.deepEqual(errors,[],'browser errors or missing assets');
 assert.deepEqual(failures,[],'responsive layout');
 assert.deepEqual(bounds,[],'SVG text outside its viewBox');
 console.log(`PASS: ${checks} mobile/desktop light/dark topic checks; SVG bounds; no-JS; one-page A4; no browser errors.`);
}finally{await browser.close();}
