import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const base='https://study-garden.test/subjects/itds261/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
const out=process.env.STUDY_GARDEN_OUTPUT;
if(out)await mkdir(out,{recursive:true});
const settle=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
async function create(options={}){const p=await useLocalFiles(await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce',...options}),root);p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()===404)errors.push(r.url());});return p;}
async function topic(p,id){await p.evaluate(id=>location.hash=id,id);await settle(p);}
try{
 const p=await create();await p.goto(base+'chapter-14.html');
 await topic(p,'junit');
 assert.match(await p.locator('#junit-results').innerText(),/Space[\s\S]*PASS[\s\S]*Nospace[\s\S]*FAIL/);
 await p.locator('#junit-space').uncheck();assert.match(await p.locator('#junit-results').innerText(),/Space[\s\S]*FAIL[\s\S]*Nospace[\s\S]*PASS/);
 await p.locator('#junit-first').fill('<img src=x onerror=alert(1)>');await p.locator('#junit-run').click();assert.equal(await p.locator('#junit-results img').count(),0,'User text must stay text');
 for(let i=0;i<8;i++)await p.locator('#life-next').click();assert.equal(await p.locator('#life-log li').count(),8);assert.ok(await p.locator('#life-next').isDisabled());await p.locator('#life-reset').click();assert.equal(await p.locator('#life-log li').count(),0);await p.locator('#life-next').click();assert.equal(await p.locator('#life-log li').count(),1);
 await topic(p,'assertions');await p.getByRole('button',{name:'assertSame(a, b)',exact:true}).focus();await p.keyboard.press('Enter');assert.match(await p.locator('#assert-feedback').innerText(),/FAIL/);
 await topic(p,'integration');await p.locator('#integration-case').selectOption('contract');assert.match(await p.locator('#integration-result').innerText(),/FAIL/);assert.match(await p.locator('#integration-flow').innerText(),/2 บาท/);await p.locator('#integration-case').selectOption('stub');assert.match(await p.locator('#integration-result').innerText(),/ยังไม่มีหลักฐาน/);
 await topic(p,'system');await p.locator('[data-v-pair="2"]').click();assert.match(await p.locator('#vmodel-feedback').innerText(),/Detailed design ↔ Integration/);assert.equal(await p.locator('[data-v-line].selected').count(),1);
 await topic(p,'test-documents');assert.match(await p.locator('#report-feedback').innerText(),/Executed = 125.*Planned = 130.*96.0%/);
 await p.locator('#report-pass').fill('');assert.match(await p.locator('#report-feedback').innerText(),/กรอกจำนวนเต็ม/);
 for(const id of ['pass','fail','pending','progress','blocked'])await p.locator('#report-'+id).fill('0');assert.match(await p.locator('#report-feedback').innerText(),/ตัวหารเป็น 0/);
 await p.locator('[data-trace-test][value="journey"]').check();assert.match(await p.locator('#trace-feedback').innerText(),/2\/3/);await p.locator('[data-trace-test][value="denied"]').check();assert.match(await p.locator('#trace-feedback').innerText(),/3\/3/);
 await topic(p,'quality');await p.getByRole('button',{name:'Security',exact:true}).click();assert.match(await p.locator('#quality-feedback').innerText(),/Confidentiality/);
 await topic(p,'usability');await p.locator('#usability-design').selectOption('b');assert.match(await p.locator('#usability-feedback').innerText(),/9\/10.*90%/);
 await topic(p,'exercise-5');await p.locator('#park-age').fill('61');assert.match(await p.locator('#park-feedback').innerText(),/100 บาท/);await p.locator('#park-age').fill('');assert.match(await p.locator('#park-feedback').innerText(),/Invalid/);
 await topic(p,'exercise-6-7');assert.match(await p.locator('#discount-feedback').innerText(),/ส่วนลด 0%/);await p.locator('#discount-mode').selectOption('problem');assert.match(await p.locator('#discount-feedback').innerText(),/ส่วนลด 5%/);await p.locator('#discount-amount').fill('5000');assert.match(await p.locator('#discount-feedback').innerText(),/ไม่ได้กำหนด/);
 await topic(p,'exercise-8');await p.locator('#cfg-age').fill('0');assert.match(await p.locator('#cfg-feedback').innerText(),/P5.*None/);assert.equal(await p.locator('[data-cfg-false].selected').count(),4);await p.locator('#cfg-age').fill('13');assert.match(await p.locator('#cfg-feedback').innerText(),/P2.*100 บาท/);assert.equal(await p.locator('[data-cfg-node].selected').count(),2);assert.equal(await p.locator('[data-cfg-true="1"].selected').count(),1);await p.locator('#cfg-age').fill('');assert.equal(await p.locator('[data-cfg-node].selected').count(),0);
 // Finish and retry twice: catches stale answer locks and double scoring on reset.
 await topic(p,'test-phases');const game=p.locator('[data-level-quiz="phases"]');
 for(let round=0;round<2;round++){for(const name of ['Unit','Integration','System','Unit']){await game.getByRole('button',{name,exact:true}).click();await game.getByRole('button',{name:/ข้อต่อไป|ดูคะแนน/}).click();assert.ok(await game.locator('.level-prompt').evaluate(el=>el===document.activeElement),'New question or score must receive focus');}assert.match(await game.locator('.level-prompt').innerText(),/4 \/ 4/);await game.getByRole('button',{name:'ลองใหม่'}).click();}
 await topic(p,'flashcards');const before=await p.locator('#flash-text').innerText();await p.locator('#flashcard').click();assert.notEqual(await p.locator('#flash-text').innerText(),before);
 await topic(p,'quiz');assert.equal(await p.locator('#quiz .quiz-question').count(),10);
 const answers=await p.evaluate(()=>window.StudyContent.itds261['14'].quiz.map(q=>q.answer));
 const qs=p.locator('#quiz .quiz-question');for(let i=0;i<10;i++)await qs.nth(i).locator('input[type="radio"]').nth(answers[i]).check();await p.locator('#quiz-submit').click();assert.match(await p.locator('#quiz-score').innerText(),/10/);
 if(await p.locator('[data-mark-read]').getAttribute('aria-pressed')!=='true')await p.locator('[data-mark-read]').click();
 await p.goto(base+'final.html');assert.match(await p.locator('[data-chapter-status="14"]').innerText(),/คะแนนดีที่สุด 10\/10/);assert.equal(await p.locator('[data-read-count]').innerText(),'1');assert.equal(await p.locator('.glass-folder').count(),5);
 await p.close();
 let checks=0;
 for(const width of [320,768,1440])for(const theme of ['light','dark']){
  const page=await create({viewport:{width,height:950}});await page.goto(base+'chapter-14.html');await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  const ids=await page.locator('[id]').evaluateAll(xs=>xs.map(x=>x.id));assert.equal(ids.length,new Set(ids).size);
  assert.ok(await page.locator('.levels-code').first().evaluate(el=>{const c=getComputedStyle(el),rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}),lum=s=>rgb(s).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0),a=lum(c.color),b=lum(c.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;}),'Code text needs readable contrast');
  const topics=await page.locator('.lesson-content>.lesson-section').evaluateAll(xs=>xs.map(x=>x.id));
  for(const id of topics){await topic(page,id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}/${theme}#${id} overflows`);checks++;}
  if(out){for(const id of ['before-you-start','junit','system','exercise-6-7','exercise-8']){await topic(page,id);await page.screenshot({path:resolve(out,`${id}-${width}-${theme}.png`)});}for(const [id,widget]of [['junit','w-junit'],['system','w-vmodel'],['exercise-8','w-cfg']]){await topic(page,id);await page.locator('#'+widget).screenshot({path:resolve(out,`${widget}-${width}-${theme}.png`),style:'.site-header,.reader-toolbar{visibility:hidden!important}'});}}
  await page.close();
 }
 const nojs=await create({javaScriptEnabled:false,viewport:{width:320,height:900}});await nojs.goto(base+'chapter-14.html');assert.equal(await nojs.locator('.lesson-section:visible').count(),await nojs.locator('.lesson-section').count());assert.ok(await nojs.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await nojs.close();
 const denied=await create();await denied.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}});});await denied.goto(base+'chapter-14.html#exercise-5');await denied.locator('#park-age').fill('18');assert.match(await denied.locator('#park-feedback').innerText(),/200 บาท/);await denied.close();
 const print=await create();await print.goto(base+'chapter-14.html');await print.emulateMedia({media:'print'});assert.equal(await print.locator('.lesson-section:visible').count(),await print.locator('.lesson-section').count());await print.close();
 const mapping=JSON.parse(await readFile(resolve(root,'docs/itds261-l13-source-map.json'),'utf8'));assert.deepEqual([...new Set(mapping.coverage.flatMap(x=>x.pages))].sort((a,b)=>a-b),Array.from({length:40},(_,i)=>i+1));
 assert.deepEqual(errors,[]);console.log(`PASS: all L13 widgets, reset, keyboard, safe text, quiz/progress, ${checks} responsive theme/section checks, no-JS, blocked storage, print and source coverage`);
}finally{await browser.close();}
