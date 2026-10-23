import assert from 'node:assert/strict';
import {readFileSync, mkdirSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {useLocalFiles} from './local-browser-fixture.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
assert.ok(existsSync(resolve(root,'subjects/itds241/chapter-09.html')), 'Part I must be reachable as chapter 09');
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
const url='https://study-garden.test/subjects/itds241/chapter-09.html';
try {
 for(const width of [390,1440]) for(const theme of ['light','dark']) {
  const p=await useLocalFiles(await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),root);
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);
  await p.goto(url);
  await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  assert.equal(await p.locator('.lesson-section:visible').count(),1,'one topic per page');
  await p.locator('[data-reader-next]').click();
  const second=new URL(p.url()).hash;
  assert.notEqual(second,'');
  assert.equal(await p.locator('.lesson-section:visible').count(),1);
  await p.goBack();
  await p.waitForURL(u=>u.hash==='');
  assert.equal(await p.locator('.lesson-section:visible').count(),1);
  await p.goForward(); await p.waitForURL(u=>u.hash===second); assert.equal(new URL(p.url()).hash,second);
  const pages=await p.locator('.lesson-section').evaluateAll(es=>es.map(e=>e.id));
  for(const id of pages) {
   await p.goto(url+'#'+id);
   assert.equal(await p.locator('.lesson-section:visible').count(),1,id);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),id+' no horizontal overflow');
  }
  await p.goto(url+'#p1-ch5-url');
  await p.locator('[data-url-input]').fill('https://example.com:8080/a?time=now#end');
  assert.match(await p.locator('[data-url-output]').innerText(),/example.com:8080/);
  await p.locator('[data-url-input]').fill('<invalid>');
  assert.match(await p.locator('[data-url-output]').innerText(),/URL/);
  await p.goto(url+'#p1-ch7-routetester');
  await p.locator('[data-route-input]').fill('/BBQ'); await p.locator('[data-route-run]').click();
  assert.match(await p.locator('[data-route-output]').innerText(),/404/);
  await p.locator('[data-route-input]').fill('/bbq'); await p.locator('[data-route-run]').click();
  assert.match(await p.locator('[data-route-output]').innerText(),/200/);
  if(width===1440 && theme==='light') {
   await p.goto(url+'#p1-ch1-reqres');
   await p.locator('#p1-ch1-reqres select').selectOption('static');
   await p.getByRole('button',{name:'ขั้นต่อไป →',exact:true}).click();
   assert.match(await p.locator('#p1-ch1-reqres output').innerText(),/ขั้น 2:/);
   await p.getByRole('button',{name:'ขั้นต่อไป →',exact:true}).click();
   assert.match(await p.locator('#p1-ch1-reqres output').innerText(),/ขั้น 5:/);
   await p.goto(url+'#p1-ch1-url-build');
   const match=p.locator('#p1-ch1-url-build');
   for(const [value,target] of [['http://','protocol'],['localhost','host'],[':8081','port']]) {
    await match.getByRole('button',{name:value,exact:true}).press('Enter');
    await match.getByRole('button',{name:target+' · วางที่นี่',exact:true}).press('Space');
   }
   assert.match(await match.locator('output').innerText(),/✓/);
   await p.goto(url+'#p1-ch2-eventloop');
   const loop=p.locator('#p1-ch2-eventloop');
   await loop.locator('select').first().selectOption('blocking');
   await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();
   assert.match(await loop.locator('output').innerText(),/request ที่รอคิว: 1/);
   await loop.locator('select').first().selectOption('nonblocking');
   await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();
   assert.match(await loop.locator('output').innerText(),/request ที่รอคิว: 0/);
   for(let i=0;i<4;i++)await loop.getByRole('button',{name:'เดินเวลา 1 ขั้น'}).click();
   assert.match(await loop.locator('output').innerText(),/ตอบกลับแล้ว/);
   await loop.getByRole('button',{name:'เริ่มใหม่'}).click();
   await loop.getByLabel('ชนิดงาน').selectOption('cpu');
   await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();
   assert.match(await loop.locator('output').innerText(),/request ที่รอคิว: 1/,'CPU work still blocks non-blocking mode');
   await p.goto(url+'#p1-ch3-hello');
   for(let i=0;i<3;i++)await p.getByRole('button',{name:'ขั้นต่อไป →',exact:true}).click();
   assert.match(await p.locator('#p1-ch3-hello output').innerText(),/Hello World!!/);
   await p.goto(url+'#p1-ch4-modules');
   const mod=p.locator('#p1-ch4-modules');
   await mod.getByRole('button',{name:'Run greet.js'}).click();assert.match(await mod.locator('output').innerText(),/Hello World!/);
   await mod.locator('textarea').fill('function sayHello(){ console.log("Hello"); }\nmodule.exports.other = sayHello;');
   await mod.getByRole('button',{name:'Run greet.js'}).click();assert.match(await mod.locator('output').innerText(),/sayHi is not a function/);
   await p.goto(url+'#p1-ch5-path');
   await p.locator('[data-path-input]').fill('C:\\demo\\test.txt');
   assert.match(await p.locator('[data-path-output]').innerText(),/test.txt/);
   await p.goto(url+'#p1-ch6-asyncorder');
   const async=p.locator('#p1-ch6-asyncorder');
   await async.locator('select').selectOption('nested');await async.getByRole('button',{name:'รันโปรแกรม'}).click();
   assert.match(await async.locator('output').innerText(),/README1[\s\S]*README2[\s\S]*README3/);
   await async.locator('select').selectOption('sync');await async.getByRole('button',{name:'รันโปรแกรม'}).click();
   assert.match(await async.locator('output').innerText(),/บล็อก/);
   await p.goto(url+'#p1-ch7-serverbuilder');
   const sort=p.locator('#p1-ch7-serverbuilder');
   await sort.getByRole('button',{name:'Run',exact:true}).click();assert.match(await sort.locator('output').innerText(),/ยังไม่ตรง/);
   for(const [index,text] of ['require("http")','createServer((req, res) => {','res.statusCode = 200;','res.setHeader("Content-Type", "text/plain");','res.write("Hello World!");','res.end(); // ปิด callback ด้วย });','myServer.listen(8081);'].entries()) {
    let current=await sort.locator('li code').allTextContents();let at=current.indexOf(text);
    while(at>index){await sort.locator('li').nth(at).getByRole('button',{name:/ขึ้น/}).click();at--;}
   }
   await sort.getByRole('button',{name:'Run',exact:true}).click();assert.match(await sort.locator('output').innerText(),/✓ Terminal/);
  }
  await p.goto(url+'#p1-ch1-quiz');
  const q=p.locator('#p1-ch1-quiz [data-node-quiz]');
  await q.getByRole('button',{name:/B\)/}).click();
  assert.match(await q.innerText(),/ถูกต้อง/);
  await q.getByRole('button',{name:'ข้อต่อไป →'}).click();
  assert.match(await q.innerText(),/static/);
  await p.goto(url+'#sources');
  await p.locator('[data-mark-read]').click();
  await p.locator('.reader-topic[href="#quiz"]').evaluate(a=>a.click());
  const final=p.locator('#quiz [data-node-quiz]');
  const answers=await p.evaluate(()=>StudyContent.itds241['09'].quiz.map(q=>q.answer));
  for(const answer of answers) {
   await final.locator('[data-quiz-option]').nth(answer).click();
   await final.getByRole('button',{name:'ข้อต่อไป →'}).click();
  }
  assert.match(await final.innerText(),/10 \/ 10/);
  await p.locator('.reader-topic[href="#sources"]').evaluate(a=>a.click());
  await p.locator('[data-mark-read]').click();
  await p.locator('.reader-topic[href="#quiz"]').evaluate(a=>a.click());
  await p.reload();
  assert.match(await p.locator('[data-chapter-status="09"]').innerText(),/10\/10/);
  await final.getByRole('button',{name:'เริ่มใหม่'}).click();
  assert.equal(await final.locator('[data-quiz-option]').count(),4);
  await p.emulateMedia({media:'print'});
  assert.equal(await p.locator('.lesson-section:visible').count(),pages.length,'print every topic');
  await p.emulateMedia({media:'screen'});
  await p.goto(url+'#p1-ch1-reqres');
  if(process.argv.includes('--capture')) {mkdirSync(resolve(root,'docs/screenshots/nodejs'),{recursive:true}); await p.screenshot({path:resolve(root,`docs/screenshots/nodejs/${width}-${theme}.png`),fullPage:false});}
  await p.close();
 }
 const p=await useLocalFiles(await browser.newPage({javaScriptEnabled:false}),root);
 await p.goto(url); assert.ok(await p.locator('.lesson-section:visible').count()>25,'no-JS reading fallback');
 await p.close();
 const blocked=await useLocalFiles(await browser.newPage(),root);
 await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}}));
 blocked.on('pageerror',e=>errors.push(e.message));await blocked.goto(url+'#quiz');
 await blocked.locator('#quiz [data-quiz-option]').first().click();
 assert.equal(await blocked.locator('#storage-notice').isVisible(),true);
 assert.equal(await blocked.locator('#quiz').getByRole('button',{name:'ข้อต่อไป →'}).isEnabled(),true);
 await blocked.close();
 const old=await useLocalFiles(await browser.newPage(),root); await old.goto('https://study-garden.test/subjects/itds241/chapter-08.html');
 assert.equal(await old.locator('.lesson-section[hidden]').count(),0,'older chapters stay continuously readable');
 await old.goto('https://study-garden.test/index.html');
 assert.equal(await old.getByText('2 มหาวิทยาลัย · 4 วิชา · 35 บทเรียน',{exact:true}).count(),1,'home total includes the new chapter');
 assert.match(await old.locator('.university-count').first().innerText(),/26 บทเรียน/);
 await old.locator('#subject-search').fill('Node.js');
 assert.equal(await old.locator('.subject-folder:visible').count(),1,'new topic is searchable from home');
 assert.deepEqual(errors,[]);
 console.log('PASS: short pages, history, all anchors, responsive themes, quiz scoring/retry, URL/routing, print, no-JS and old-reader behavior.');
} finally {await browser.close();}
