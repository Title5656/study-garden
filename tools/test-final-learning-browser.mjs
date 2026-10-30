import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {useLocalFiles} from './local-browser-fixture.mjs';
import {lessons} from './final-learning-content.mjs';
const {chromium}=await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const evidence=resolve(root,'../work-notes/final-learning-qa');mkdirSync(evidence,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}), errors=[];
async function page(options={}) {
  const p=await useLocalFiles(await browser.newPage({viewport:{width:1280,height:950},reducedMotion:'reduce',...options}),root);
  p.on('pageerror',e=>errors.push(e.message));return p;
}
const url=key=>`https://study-garden.test/subjects/${key.split('/')[0]}/chapter-${key.split('/')[1]}.html`;
async function go(p,key,id){await p.goto(url(key)+'#'+id);await p.locator('#'+id).waitFor({state:'visible'});}
try {
  for (const [key,lesson] of Object.entries(lessons)) {
    for(const width of [375,1280]) for(const theme of ['light','dark']) {
      const p=await page({viewport:{width,height:950}});
      await p.addInitScript(t=>localStorage.setItem('study-garden:theme',JSON.stringify(t)),theme);
      for(const id of [lesson.start,lesson.lab?.id || (key.endsWith('09')?'p1-ch6-asyncorder':'p2-form'),'learn-transfer']) {
        await go(p,key,id);
        if(id===lesson.start) await p.locator('.fl-guide summary').click();
        assert.equal(await p.locator('.lesson-section:visible').count(),1);
        assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${key}/${id}/${width} overflow`);
        if(id!=='learn-transfer') await p.screenshot({path:resolve(evidence,`${key.replace('/','-')}-${width}-${theme}-${id}.png`)});
      }
      await p.close();
    }
    const p=await page();await go(p,key,'learn-transfer');
    const checks=p.locator('[data-final-checks]');
    const storage=`study-garden:final-learning:v1:${key.replace('/',':')}`;
    await p.evaluate(()=>localStorage.setItem('study-garden:untouched',JSON.stringify({best:7})));
    await checks.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();
    assert.match(await checks.locator('.fl-progress').innerText(),/0 \/ 2/);
    await checks.locator('input[type=radio]').nth((lesson.checks[0].answer+1)%3).check();
    await checks.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();
    assert.match(await checks.locator('[role=status]').innerText(),/ยังไม่ตรง/);
    for(const [i,q] of lesson.checks.entries()) {
      await checks.locator('input[type=radio]').nth(q.answer).focus();await p.keyboard.press('Space');
      await checks.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).press('Enter');
      assert.match(await checks.locator('[role=status]').innerText(),/ถูกต้อง/);
      if(i===0)await checks.getByRole('button',{name:'ข้อต่อไป →',exact:true}).click();
    }
    assert.match(await checks.locator('.fl-progress').innerText(),/2 \/ 2/);
    await p.reload();assert.match(await checks.locator('.fl-progress').innerText(),/2 \/ 2/);
    await checks.getByRole('button',{name:'เริ่มชุดฝึกใหม่',exact:true}).click();
    await checks.locator('input[type=radio]').nth(lesson.checks[0].answer).check();await checks.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();
    assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).length,storage),2,'no duplicate awards');
    assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('study-garden:untouched'))),{best:7});
    await p.emulateMedia({media:'print'});assert.ok(await checks.locator('.fl-check-fallback').isVisible());assert.ok(!await checks.locator('.fl-check-ui').isVisible());
    await p.emulateMedia({media:'screen'});
    await p.evaluate(k=>localStorage.setItem(k,'{"unexpected":true}'),storage);await p.reload();assert.match(await checks.locator('.fl-progress').innerText(),/0 \/ 2/);
    await p.close();
    const nojs=await page({javaScriptEnabled:false});await nojs.goto(url(key));assert.ok(await nojs.locator('.lesson-section:visible').count()>=9);assert.ok(await nojs.locator('.fl-check-fallback').isVisible());await nojs.close();
  }
  const p=await page();
  await go(p,'itds261/08','learn-impact');let lab=p.locator('[data-final-lab]');
  assert.match(await lab.locator('[role=status]').innerText(),/4 ส่วน/);
  await lab.getByLabel('โครงสร้าง',{exact:true}).selectOption('adapter');assert.match(await lab.locator('[role=status]').innerText(),/2 ส่วน/);
  await lab.getByLabel('สัญญาของ Adapter').selectOption('changed');assert.match(await lab.locator('[role=status]').innerText(),/5 ส่วน/);
  await lab.getByLabel('สิ่งที่เปลี่ยน').selectOption('ui');assert.match(await lab.locator('[role=status]').innerText(),/1 ส่วน/);
  await lab.getByRole('button',{name:'เริ่มใหม่'}).click();assert.match(await lab.locator('[role=status]').innerText(),/4 ส่วน/);
  await go(p,'itds261/09','learn-review');lab=p.locator('[data-final-lab]');
  await lab.getByRole('button',{name:'ทดสอบค่าขอบ'}).click();assert.match(await lab.locator('[role=status]').innerText(),/พบ 1/);
  await lab.getByLabel('การเปลี่ยนโค้ด').selectOption('refactor');await lab.getByRole('button',{name:'ทดสอบค่าขอบ'}).click();assert.match(await lab.locator('[role=status]').innerText(),/พบ 1/);
  await lab.getByLabel('การเปลี่ยนโค้ด').selectOption('fix');await lab.getByRole('button',{name:'ทดสอบค่าขอบ'}).click();assert.match(await lab.locator('[role=status]').innerText(),/ผ่านชุด/);
  await lab.getByLabel('ยอดที่อยากลอง (บาท)').fill('');await lab.getByRole('button',{name:'ทดสอบค่าขอบ'}).click();assert.match(await lab.locator('[role=status]').innerText(),/ใส่ยอด/);
  await lab.getByRole('button',{name:'เริ่มใหม่'}).click();assert.equal(await lab.getByLabel('การเปลี่ยนโค้ด').inputValue(),'original');
  await go(p,'itds261/10','learn-merge');lab=p.locator('[data-final-lab]');
  for(const scenario of ['different','conflict','same']) {
    await lab.getByLabel('การแก้ของสอง branch').selectOption(scenario);
    await lab.getByRole('button',{name:'สร้าง commit ทั้งสองฝั่ง'}).click();await lab.getByRole('button',{name:'ลองรวมเข้า main'}).click();
    if(scenario==='conflict') {
      assert.match(await lab.locator('[role=status]').innerText(),/ขัดแย้ง/);
      await lab.getByRole('button',{name:'บันทึกผลที่ตกลง'}).click();assert.match(await lab.locator('[role=status]').innerText(),/เลือกค่า/);
      await lab.getByLabel('ค่าที่ตกลงให้ fee เป็น').selectOption('0');await lab.getByRole('button',{name:'บันทึกผลที่ตกลง'}).click();
      assert.ok(await lab.locator('[role=status]').evaluate(n=>n===document.activeElement),'focus follows the merge result');
    }
    assert.match(await lab.locator('figure').innerText(),/C · main หลังรวม/);
  }
  await go(p,'itds241/09','p1-ch6-asyncorder');lab=p.locator('[data-node-lab="AsyncOrderSim"]');
  await lab.getByRole('button',{name:'รันโปรแกรม',exact:true}).click();
  let result=await lab.locator('output').innerText();assert.ok(result.indexOf('README2')<result.indexOf('README3')&&result.indexOf('README3')<result.indexOf('README1'));
  await lab.getByLabel('รูปแบบการอ่าน').selectOption('nested');await lab.getByRole('button',{name:'รันโปรแกรม',exact:true}).click();assert.match(await lab.locator('output').innerText(),/600 ms/);
  await lab.getByLabel('README1 เวลา (ms)').fill('');await lab.getByRole('button',{name:'รันโปรแกรม',exact:true}).click();assert.match(await lab.locator('output').innerText(),/ใส่เวลา/);
  await go(p,'itds241/10','p2-form');lab=p.locator('[data-express-lab="form"]');
  await lab.locator('summary').click();
  await lab.getByLabel('วิธีส่ง').selectOption('POST');await lab.getByLabel('Content-Type',{exact:true}).selectOption('json');await lab.getByLabel('ชนิด parser',{exact:true}).selectOption('urlencoded');
  await lab.getByRole('button',{name:'ส่งฟอร์มจำลอง'}).click();assert.match(await lab.locator('output').innerText(),/Status 400/);
  await lab.getByLabel('ชนิด parser',{exact:true}).selectOption('json');await lab.getByLabel('ตำแหน่ง parser').selectOption('หลัง handler');await lab.getByRole('button',{name:'ส่งฟอร์มจำลอง'}).click();assert.match(await lab.locator('output').innerText(),/Status 400/);
  await lab.getByLabel('ตำแหน่ง parser').selectOption('ก่อน handler');await lab.getByRole('button',{name:'ส่งฟอร์มจำลอง'}).click();assert.match(await lab.locator('output').innerText(),/Status 200/);
  await lab.getByLabel('name ของ input ชื่อ').selectOption('มีแต่ id ไม่มี name');await lab.getByRole('button',{name:'ส่งฟอร์มจำลอง'}).click();assert.match(await lab.locator('output').innerText(),/ไม่มี key fname/);
  await p.close();
  const blocked=await page();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage denied');}});});await go(blocked,'itds261/08','learn-transfer');
  await blocked.locator('[data-final-checks] input[type=radio]').nth(1).check();await blocked.locator('[data-final-checks]').getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();assert.match(await blocked.locator('.fl-progress').innerText(),/1 \/ 2/);assert.match(await blocked.locator('.fl-check-ui>.fl-limit').innerText(),/บันทึกถาวรไม่ได้/);await blocked.close();
  assert.deepEqual(errors,[]);
  console.log('PASS: 20 chapter/theme/viewport combinations; all simulations, transfer checks, keyboard, persistence, blocked storage, no-JS and print.');
} finally {await browser.close();}
