import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),url='https://study-garden.test/subjects/itds241/chapter-10.html';
const browser=await chromium.launch({channel:'chrome',headless:true}),errors=[];
try{
 for(const width of [320,390,1440])for(const theme of ['light','dark']){
  const p=await useLocalFiles(await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),root);p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);await p.goto(url);
  assert.equal(await p.locator('.lesson-section:visible').count(),1);
  const ids=await p.locator('.lesson-section').evaluateAll(es=>es.map(e=>e.id));assert.deepEqual(ids,['before-start','p2-foundation','p2-project','p2-routing','p2-assets','p2-routers','p2-forms','p2-recap','flashcards','quiz']);
  for(const id of ids){await p.evaluate(id=>location.hash=id,id);await p.waitForFunction(id=>!document.getElementById(id).hidden,id);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id);}
  await p.goto(url+'#p2-form');const form=p.locator('[data-express-lab="form"]');
  if(width===1440&&theme==='light'){
   await p.goto(url+'#p2-setup');for(let i=0;i<5;i++)await p.getByRole('button',{name:'ขั้นต่อไป →'}).click();assert.match(await p.locator('[data-express-lab="setup"] output').innerText(),/npm start/);
   await p.goto(url+'#p2-template');await p.getByLabel('ชื่อที่ได้จากข้อมูล').fill('<hello>');assert.match(await p.locator('[data-express-lab="template"] output').innerText(),/Hello, <hello>/);assert.equal(await p.locator('[data-express-lab="template"] hello').count(),0);
   await p.goto(url+'#p2-static');await p.getByLabel('Mount path').selectOption('/assets');await p.getByLabel('URL ของ resource').fill('/assets/images/sample.png');await p.getByRole('button',{name:'ค้นหาไฟล์'}).click();assert.match(await p.locator('[data-express-lab="static"] output').innerText(),/200/);
   await p.goto(url+'#p2-middleware');await p.locator('[data-express-lab="middleware"]').getByLabel('ตำแหน่ง 404').selectOption('ก่อน routes');await p.getByRole('button',{name:'ส่ง request'}).click();assert.match(await p.locator('[data-express-lab="middleware"] output').innerText(),/404/);
   await p.goto(url+'#p2-form');
  }
  await form.getByLabel('วิธีส่ง').selectOption('POST');await form.getByLabel('First name').fill('John & Jane');await form.getByRole('button',{name:'ส่งฟอร์มจำลอง'}).click();
  assert.match(await form.locator('output').innerText(),/fname=John\+%26\+Jane/);
  await form.getByLabel('Body parser').selectOption('ปิด');await form.getByRole('button',{name:'ส่งฟอร์มจำลอง'}).click();assert.match(await form.locator('output').innerText(),/Status 400/);
  await form.getByLabel('Body parser').selectOption('เปิด');await form.getByLabel('First name').fill('');await form.getByRole('button',{name:'ส่งฟอร์มจำลอง'}).click();assert.match(await form.locator('output').innerText(),/Status 400/);
  await p.goto(url+'#p2-route');await p.locator('[data-express-lab="route"]').getByLabel('HTTP method').selectOption('POST');await p.getByRole('button',{name:'ส่ง request',exact:true}).click();assert.match(await p.locator('[data-express-lab="route"] output').innerText(),/404/);
  await p.goto(url+'#flashcards');const before=await p.locator('#flash-text').innerText();await p.locator('#flashcard').click();assert.notEqual(await p.locator('#flash-text').innerText(),before);
  await p.goto(url+'#quiz');const quiz=p.locator('#quiz [data-node-quiz]'),answers=await p.evaluate(()=>StudyContent.itds241['10'].quiz.map(q=>q.answer));
  await p.evaluate(()=>localStorage.setItem('study-garden:itds241',JSON.stringify({'09':{best:4}})));
  for(const answer of answers){await quiz.locator('[data-quiz-option]').nth(answer).click();await quiz.getByRole('button',{name:'ข้อต่อไป →'}).click();}
  assert.match(await quiz.innerText(),/10 \/ 10/);await p.reload();assert.match(await p.locator('[data-chapter-status="10"]').innerText(),/10\/10/);
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('study-garden:itds241'))['09'].best),4);
  await p.emulateMedia({media:'print'});assert.equal(await p.locator('.lesson-section:visible').count(),ids.length);await p.emulateMedia({media:'screen'});
  await p.goto(url+'#p2-form');if(process.argv.includes('--capture')){mkdirSync(resolve(root,'docs/screenshots/express'),{recursive:true});await p.screenshot({path:resolve(root,`docs/screenshots/express/${width}-${theme}.png`)});}
  await p.close();
 }
 const p=await useLocalFiles(await browser.newPage({javaScriptEnabled:false}),root);await p.goto(url);assert.equal(await p.locator('.lesson-section:visible').count(),10);assert.equal(await p.locator('#quiz details').count(),10);
 assert.deepEqual(errors,[]);console.log('PASS: Part II pages, six responsive themes, routing/forms, flashcards, independent quiz scoring, print and no-JS.');
}finally{await browser.close();}
