import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
import {explorers,sorting} from './inline-learning-content.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),shots=resolve(root,'../work-notes/inline-learning-qa');mkdirSync(shots,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),errors=[];
const url=(key,id='')=>`https://study-garden.test/subjects/${key.split('/')[0]}/chapter-${key.split('/')[1]}.html#${id}`;
try {
 const p=await useLocalFiles(await browser.newPage({viewport:{width:1280,height:950},reducedMotion:'reduce'}),root);p.on('pageerror',e=>errors.push(e.message));
 for(const key of ['itds241/09','itds241/10','itds261/08','itds261/09','itds261/10']){
  await p.goto(url(key));assert.ok(!(await p.locator('.reader-categories').innerText()).includes('กิจกรรม'));
 }
 for(const [key,sections] of Object.entries(explorers))for(const [id,data] of Object.entries(sections)){
  await p.goto(url(key,id));const card=p.locator('#'+id+' [data-inline-explorer]');
  for(const [i,choice] of data.choices.entries()){
   await card.locator('.il-choice').nth(i).press('Enter');
   assert.match(await card.locator('.il-stage').innerText(),new RegExp(choice.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
   assert.equal(await card.locator('[aria-pressed="true"]').count(),1);
  }
 }
 for(const [key,sections] of Object.entries(sorting))for(const [id,data] of Object.entries(sections)){
  await p.goto(url(key,id));const game=p.locator('#'+id+' [data-inline-sort]');
  assert.ok(await game.isVisible(),`${id}: game is visible before opening answers`);
  assert.equal(await game.evaluate(n=>n.closest('details')),null,'practice must not be hidden inside an answer');
  await game.locator('[data-card="0"]').press('Enter');await game.locator('.il-bin-target').nth((data.cards[0][1]+1)%data.bins.length).click();assert.equal(await game.locator('progress').getAttribute('value'),'0');
  for(const [i,card] of data.cards.entries()){await game.locator(`[data-card="${i}"]`).press('Enter');await game.locator('.il-bin-target').nth(card[1]).press('Enter');}
  assert.equal(await game.locator('.il-solved').count(),data.cards.length);assert.equal(await game.locator('.il-chip').count(),0);
  await game.getByRole('button',{name:'↺ เริ่มใหม่',exact:true}).click();assert.equal(await game.locator('.il-chip').count(),data.cards.length);
 }
 await p.goto(url('itds241/09','p1-ch2-eventloop'));const loop=p.locator('[data-node-lab="EventLoopSim"]');await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();await loop.getByRole('button',{name:'ส่ง request ใหม่'}).click();assert.equal(await loop.locator('.il-job').count(),2);
 assert.equal(await loop.evaluate(n=>n.closest('.lesson-section').id),'p1-runtime');
 for(let i=0;i<3;i++)await loop.getByRole('button',{name:'เดินเวลา 1 ขั้น'}).click();assert.equal(await loop.locator('.il-lane').last().locator('.il-job').count(),2);
 await p.goto(url('itds261/09','learn-review'));const review=p.locator('[data-final-lab="review"]');await review.getByLabel('ลากสำรวจยอด 0–2000 บาท').fill('1000');assert.match(await review.locator('.il-receipt').nth(2).innerText(),/1000.00/);await review.getByLabel('การเปลี่ยนโค้ด').selectOption('fix');assert.match(await review.locator('.il-receipt').nth(2).innerText(),/900.00/);
 for(const width of [375,1280])for(const theme of ['light','dark']){
  await p.setViewportSize({width,height:950});await p.evaluate(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);
  for(const [key,id] of [['itds261/08','design-levels'],['itds261/08','architecture-styles'],['itds261/09','learn-review'],['itds261/10','learn-merge'],['itds241/09','p1-ch2-eventloop'],['itds241/10','p2-middleware']]){
   await p.goto(url(key,id));assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${key} ${id} ${width}`);
   const target=p.locator('#'+id+' .il-card, #'+id+' .fl-lab, #'+id+' .node-lab').first();if(await target.count())await target.scrollIntoViewIfNeeded();
   await p.screenshot({path:resolve(shots,`${key.replace('/','-')}-${id}-${width}-${theme}.png`)});
  }
 }
 await p.close();
 const nojs=await useLocalFiles(await browser.newPage({javaScriptEnabled:false,reducedMotion:'reduce'}),root);await nojs.goto(url('itds261/08','architecture-styles'));const fallback=nojs.locator('#architecture-styles .il-static');assert.ok(await fallback.isVisible());await fallback.locator('summary').click();assert.ok((await fallback.innerText()).includes('Microservices'));await nojs.close();
 assert.deepEqual(errors,[]);console.log('PASS: inline navigation, every explorer choice, sorting games, visual state, 24 responsive/theme screens and no-JS explanation.');
}finally{await browser.close();}
