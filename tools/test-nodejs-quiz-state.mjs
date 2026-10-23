import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {useLocalFiles} from './local-browser-fixture.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({channel:'chrome',headless:true});
const failures=[];
try {
 for(const width of [390,1440]) {
  const p=await useLocalFiles(await browser.newPage({viewport:{width,height:900}}),root);
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const url='https://study-garden.test/subjects/itds241/chapter-09.html#p1-ch3-quiz';
  const q=p.locator('#p1-ch3-quiz [data-node-quiz]');
  async function check(name,fn){try{await fn();}catch(e){failures.push(`${width}: ${name}: ${e.message}`);}}
  await p.goto(url);
  await check('question renders code',async()=>assert.equal(await q.locator('legend code').innerText({timeout:1000}),'app.js'));
  await check('decimal topic number survives',async()=>assert.match(await p.locator('.reader-topic[href="#topic-12"]').innerText(),/3\.1 ติดตั้ง/));
  await q.getByLabel('คำตอบของคุณ').fill('node app.js');
  await p.reload();
  await check('draft survives reload',async()=>assert.equal(await q.getByLabel('คำตอบของคุณ').inputValue(),'node app.js'));
  await q.getByRole('button',{name:'ดูเฉลย',exact:true}).click();
  await p.reload();
  await check('revealed answer survives reload',async()=>assert.equal(await q.getByRole('button',{name:'ตอบได้',exact:true}).count(),1));
  if(await q.getByRole('button',{name:'ตอบได้',exact:true}).count()===0)await q.getByRole('button',{name:'ดูเฉลย',exact:true}).click();
  await q.getByRole('button',{name:'ตอบได้',exact:true}).click();
  await p.reload();
  await check('assessed recall stays locked',async()=>{
   assert.equal(await q.getByRole('button',{name:'ดูเฉลย',exact:true}).isDisabled(),true);
   assert.equal(await q.getByRole('button',{name:'ตอบได้',exact:true}).isDisabled(),true);
   assert.equal(await q.getByLabel('คำตอบของคุณ').inputValue(),'node app.js');
   assert.equal(await q.getByRole('button',{name:'ข้อต่อไป →'}).isEnabled(),true);
  });
  if(process.argv.includes('--capture')){mkdirSync(resolve(root,'docs/screenshots/nodejs-fixes'),{recursive:true});await p.screenshot({path:resolve(root,`docs/screenshots/nodejs-fixes/quiz-${width}.png`)});}
  await q.getByRole('button',{name:'ข้อต่อไป →'}).click();
  await q.getByRole('button',{name:'ดูเฉลย',exact:true}).click();
  await q.getByRole('button',{name:'ต้องทบทวน',exact:true}).click();
  await q.getByRole('button',{name:'ข้อต่อไป →'}).click();
  await q.locator('[data-quiz-option]').nth(2).click();
  await p.reload();
  assert.equal(await q.locator('[data-quiz-option].correct').count(),1);
  await q.getByRole('button',{name:'ข้อต่อไป →'}).click();
  assert.match(await q.innerText(),/2 \/ 3/);
  await p.reload();assert.match(await q.innerText(),/2 \/ 3/);
  await q.getByRole('button',{name:'เริ่มใหม่',exact:true}).click();
  assert.equal(await q.getByLabel('คำตอบของคุณ').inputValue(),'');
  await check('malformed stored entries cannot award points',async()=>{
   await p.evaluate(()=>localStorage.setItem('study-garden:itds241:node-quiz:p1-ch3-quiz',JSON.stringify({index:3,answers:[{correct:true,value:99},{correct:true,value:99},{correct:true,value:99}]})));
   await p.reload();assert.match(await q.innerText(),/ข้อ 1 \/ 3/);
  });
  async function seed(answers,index=3){await p.evaluate(({answers,index})=>localStorage.setItem('study-garden:itds241:node-quiz:p1-ch3-quiz',JSON.stringify({answers,index})),{answers,index});await p.reload();}
  await check('invalid MC choice resumes at unanswered question',async()=>{
   await seed([{correct:true,value:null},{correct:false,value:null},{correct:true,value:99}]);
   assert.match(await q.innerText(),/ข้อ 3 \/ 3/);
   assert.equal(await q.getByRole('button',{name:'ข้อต่อไป →'}).isDisabled(),true);
  });
  await check('MC correctness is derived from choice',async()=>{
   await seed([{correct:true,value:null},{correct:false,value:null},{correct:true,value:0}]);
   assert.match(await q.innerText(),/1 \/ 3/);
  });
  await check('resume stops at first gap',async()=>{
   await seed([{correct:true,value:null},null,{correct:true,value:2}]);
   assert.match(await q.innerText(),/ข้อ 2 \/ 3/);
  });
  await check('inline code never interprets HTML',async()=>{
   await p.evaluate(()=>localStorage.removeItem('study-garden:itds241:node-quiz:p1-ch3-quiz'));
   await p.route('**/chapter-09.html',async route=>{
    const {readFile}=await import('node:fs/promises');
    const html=await readFile(resolve(root,'subjects/itds241/chapter-09.html'),'utf8');
    await route.fulfill({contentType:'text/html; charset=utf-8',body:html.replaceAll('คำสั่งรันไฟล์ `app.js` ด้วย Node?','<img src=x> `<b>app.js</b>`')});
   });
   await p.reload();
   assert.equal(await q.locator('legend').innerText(),'<img src=x> <b>app.js</b>');
   assert.equal(await q.locator('legend img, legend b').count(),0);
  });
  assert.deepEqual(errors,[]);await p.close();
 }
 assert.deepEqual(failures,[]);
 console.log('PASS: quiz draft/reveal/assessment reload, scores, retry, invalid progress and decimal headings on mobile and desktop.');
}finally{await browser.close();}
