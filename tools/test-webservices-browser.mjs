import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {useLocalFiles} from './local-browser-fixture.mjs';
import {webtechFolders} from './webtech-folders.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const evidence=resolve(root,'../work-notes/webtech-11-13/qa');mkdirSync(evidence,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];const base='https://study-garden.test/subjects/itds241/';
async function page(options={}){const p=await useLocalFiles(await browser.newPage({viewport:{width:1280,height:950},reducedMotion:'reduce',...options}),root);p.on('pageerror',e=>errors.push(e.message));return p;}
async function go(p,id,section){await p.goto(base+`chapter-${id}.html#${section}`);await p.locator(`#${section}`).waitFor({state:'visible'});}
try{
 for(const width of [320,390,1440])for(const theme of ['light','dark']){
  const p=await page({viewport:{width,height:950}});await p.addInitScript(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);
  const art=[];
  for(const name of ['index','midterm','final']){
   await p.goto(base+name+'.html');
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name}/${width}/${theme}: overflow`);
   for(const card of await p.locator('[data-chapter-folder]').all()){
    const id=await card.getAttribute('data-chapter-folder'),meta=webtechFolders[id];
    assert.equal(await card.locator('.folder-code').innerText(),meta.label);
    assert.equal(await card.locator('.folder-label strong').innerText(),meta.title);
    assert.match(await card.locator('.folder-caption').innerText(),new RegExp(meta.label));
    assert.ok(await card.locator('.folder-front').evaluate(el=>{const a=el.getBoundingClientRect(),b=el.querySelector('.folder-label').getBoundingClientRect();return b.top>=a.top&&b.bottom<=a.bottom+1;}),`${id}: title fits folder`);
    art.push(await card.locator('.folder-back').evaluate(el=>getComputedStyle(el).backgroundImage));
   }
   await p.screenshot({path:resolve(evidence,`${name}-${width}-${theme}.png`),fullPage:true});
  }
  assert.equal(new Set(art).size,8,'each chapter has unique art');
  for(const [id,section] of [['11','session'],['12','json'],['13','crud'],['13','cors'],['13','jwt']]){
   await go(p,id,section);
   assert.equal(await p.locator('.lesson-section:visible').count(),1);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id}/${section}/${width}: overflow`);
   await p.screenshot({path:resolve(evidence,`L${id}-${section}-${width}-${theme}.png`)});
  }
  await p.close();
 }
 const p=await page();await go(p,'11','session');let lab=p.locator('[data-ws-lab=session]');
 await lab.getByRole('button',{name:'ส่ง request',exact:true}).press('Enter');assert.match(await lab.locator('[role=status]').innerText(),/อ่าน 1 ครั้ง/);
 await lab.getByRole('button',{name:'ส่ง request',exact:true}).click();assert.match(await lab.locator('[role=status]').innerText(),/อ่าน 2 ครั้ง/);
 await lab.getByRole('button',{name:'ลบ cookie',exact:true}).click();await lab.getByRole('button',{name:'ส่ง request',exact:true}).click();assert.match(await lab.locator('[role=status]').innerText(),/อ่าน 1 ครั้ง/);
 await lab.getByRole('button',{name:'Restart server',exact:true}).click();await lab.getByRole('button',{name:'ส่ง request',exact:true}).click();assert.match(await lab.locator('[role=status]').innerText(),/อ่าน 1 ครั้ง/);
 await lab.getByRole('button',{name:'เริ่มใหม่',exact:true}).click();assert.match(await lab.locator('[data-client]').innerText(),/ไม่มี/);
 await go(p,'12','json');lab=p.locator('[data-ws-lab=json]');await lab.getByLabel('JSON ที่ต้องการตรวจ').fill('{name:20}');await lab.getByRole('button').click();assert.match(await lab.locator('[role=status]').innerText(),/แปลงไม่ได้/);
 await lab.getByLabel('JSON ที่ต้องการตรวจ').fill('[1,true,null]');await lab.getByRole('button').click();assert.match(await lab.locator('[role=status]').innerText(),/ชนิด array/);
 await go(p,'13','crud');lab=p.locator('[data-ws-lab=crud]');await lab.getByLabel('HTTP method').selectOption('POST');await lab.getByRole('button',{name:'ส่งคำขอจำลอง'}).click();assert.match(await lab.locator('[role=status]').innerText(),/201/);await lab.getByRole('button',{name:'ส่งคำขอจำลอง'}).click();assert.match(await lab.locator('[role=status]').innerText(),/409/);
 await lab.getByLabel('HTTP method').selectOption('PUT');await lab.getByLabel('ชื่อ (สำหรับ POST/PUT)').fill('May');await lab.getByRole('button',{name:'ส่งคำขอจำลอง'}).click();assert.match(await lab.locator('[data-db]').innerText(),/May/);
 await lab.getByLabel('HTTP method').selectOption('DELETE');await lab.getByRole('button',{name:'ส่งคำขอจำลอง'}).click();assert.doesNotMatch(await lab.locator('[data-db]').innerText(),/May/);await lab.getByRole('button',{name:'ส่งคำขอจำลอง'}).click();assert.match(await lab.locator('[role=status]').innerText(),/404/);await lab.getByRole('button',{name:'เริ่มใหม่'}).click();assert.match(await lab.locator('[data-db]').innerText(),/Nida/);
 await go(p,'13','cors');lab=p.locator('[data-ws-lab=cors]');assert.match(await lab.locator('[role=status]').innerText(),/ไม่ให้/);await lab.getByLabel('Access-Control-Allow-Origin จาก API').selectOption('*');assert.match(await lab.locator('[role=status]').innerText(),/อ่าน response ได้/);await lab.getByRole('checkbox').check();assert.match(await lab.locator('[role=status]').innerText(),/ไม่ให้/);
 await go(p,'13','jwt');lab=p.locator('[data-ws-lab=token]');assert.match(await lab.locator('[role=status]').innerText(),/401/);await lab.getByLabel('หลักฐานที่ส่ง').selectOption('valid');assert.match(await lab.locator('[role=status]').innerText(),/200/);await lab.getByRole('checkbox').check();assert.match(await lab.locator('[role=status]').innerText(),/403/);await lab.getByLabel('หลักฐานที่ส่ง').selectOption('expired');assert.match(await lab.locator('[role=status]').innerText(),/401/);
 for(const id of ['11','12','13']){
  await go(p,id,'flashcards');const before=await p.locator('#flash-text').innerText();await p.locator('#flashcard').click();assert.notEqual(await p.locator('#flash-text').innerText(),before);await p.locator('#flash-next').click();
  await go(p,id,'quiz');await p.locator('#quiz-submit').click();assert.match(await p.locator('#quiz-error').innerText(),/10/);
  const answers=await p.evaluate(id=>window.StudyContent.itds241[id].quiz.map(q=>q.answer),id);
  for(let i=0;i<answers.length;i++)await p.locator(`input[name=q${i}][value="${answers[i]}"]`).check();
  await p.locator('#quiz-submit').click();assert.match(await p.locator('#quiz-score').innerText(),/10 \/ 10/);assert.equal(await p.locator('.explanation:visible').count(),10);
  await p.locator('#quiz-retry').click();assert.equal(await p.locator('input:checked').count(),0);
  await p.locator('[data-mark-read]').click();
  assert.equal(await p.evaluate(id=>JSON.parse(localStorage.getItem('study-garden:itds241'))[id].read,id),true);
 }
 await p.close();
 const plain=await page({javaScriptEnabled:false});for(const id of ['11','12','13']){await plain.goto(base+`chapter-${id}.html`);assert.ok(await plain.locator('.lesson-section:visible').count()>8);assert.ok(await plain.locator('#quiz details').count()===10);}await plain.close();
 assert.deepEqual(errors,[]);console.log('PASS: L11-L13 labs, quiz/retry, flashcards, saved progress, no-JS, 320/390/1440 light/dark and 8 unique folder titles/art.');
}finally{await browser.close();}
