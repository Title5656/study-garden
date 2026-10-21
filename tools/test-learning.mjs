// Run with Playwright installed, or set STUDY_GARDEN_PLAYWRIGHT to its file URL.
// Optional STUDY_GARDEN_OUTPUT stores screenshots for review.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { useLocalFiles } from './local-browser-fixture.mjs';
const { chromium } = await import(process.env.STUDY_GARDEN_PLAYWRIGHT || 'playwright');
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const out = process.env.STUDY_GARDEN_OUTPUT;
if (out) await mkdir(out, { recursive: true });
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.ttf':'font/ttf','.pdf':'application/pdf','.mp4':'video/mp4'};
const server = createServer(async (req,res) => {
  let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if(name.endsWith('/')) name += 'index.html';
  const file = resolve(root, '.'+name);
  if(!file.startsWith(root+sep)) return res.writeHead(403).end();
  try { const bytes=await readFile(file); res.writeHead(200,{'Content-Type':types[extname(file)] || 'application/octet-stream'}); res.end(bytes); }
  catch {res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'chrome',headless:true});
let sectionChecks=0, chapters=0;
const errors=[], failures=[];
const settle=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
async function test(name,fn) { try {await fn(); console.log('PASS:',name);} catch(e) {failures.push(name); console.error('FAIL:',name,e.message);} }
async function newPage(options={}) {
 const page=await browser.newPage(options);
 await useLocalFiles(page,root);
 await page.route('https://cdn.jsdelivr.net/**',route=>route.abort());
 page.on('pageerror',e=>errors.push(e.message));
 return page;
}
try {
 await test('Home search exposes ITDS261, course index exposes 12 chapters',async()=>{
  const page=await newPage({viewport:{width:1440,height:1000}});
  await page.goto(base+'/index.html');
  assert.equal(await page.locator('.subject-folder').count(),4);
  await page.locator('#subject-search').fill('ITDS261');
  assert.equal(await page.locator('.subject-folder:visible').count(),1);
  await page.locator('.subject-folder:visible').click();
  assert.equal(await page.locator('.glass-folder').count(),12);
  if (out) await page.screenshot({path:resolve(out,'course-desktop.png')});
  await page.close();
 });
 for(const width of [1440,390]) await test(`${width}px: every chapter topic, visual, and local image`,async()=>{
  const page=await newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  for(const course of ['itds241','itds294','itds261']) {
   for(const filename of (await readdir(resolve(root,'subjects',course))).filter(f=>/^chapter-.*\.html$/.test(f))) {
    await page.goto(`${base}/subjects/${course}/${filename}`);
    await page.evaluate(()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');});
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete && i.naturalWidth>0));
    assert.ok(await page.locator('figure').count()>=2);
    const topics=await page.locator('.lesson-content > .lesson-section').evaluateAll(xs=>xs.map(x=>x.id));
    for(const id of topics) {
     await page.evaluate(id=>{location.hash=id;},id); await settle(page);
     assert.ok(await page.locator(`[id="${id}"]`).isVisible(),`${course}/${filename}#${id} hidden`);
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
     assert.ok(overflow<=1,`${course}/${filename}#${id} overflow ${overflow}px`);
     sectionChecks++;
    }
    if(width===1440) chapters++;
   }
  }
  await page.close();
 });
 await test('New course: reader practice grouping, flashcard, quiz retry, persisted independent progress',async()=>{
  const page=await newPage({viewport:{width:1440,height:1000}});
  await page.goto(base+'/subjects/itds261/chapter-05.html');
  assert.ok(await page.locator('[data-reader-category="practice"]').count()>0);
  await page.locator('.reader-category[data-reader-category="practice"]').click();
  assert.ok(await page.locator('.lesson-section[data-reader-category="practice"]:visible').count()>0);
  await page.locator('.reader-topic[href="#supplied-guidelines"]').click();
  await page.locator('img[src*="zoo-guideline-1"]').scrollIntoViewIfNeeded();
  if (out) await page.screenshot({path:resolve(out,'zoo-guidelines.png')});
  await page.locator('.reader-topic[href="#flashcards"]').click();
  const before=await page.locator('#flash-text').innerText();
  await page.locator('#flashcard').click();
  assert.notEqual(await page.locator('#flash-text').innerText(),before);
  await page.locator('#flash-next').click();
  await page.locator('.reader-topic[href="#quiz"]').click();
  assert.equal(await page.locator('.quiz-question').count(),10);
  await page.locator('#quiz-submit').click();
  assert.match(await page.locator('#quiz-error').innerText(),/10/);
  const answers=await page.evaluate(()=>window.StudyContent.itds261['05'].quiz.map(q=>q.answer));
  for(const [i,a] of answers.entries()) await page.locator(`input[name="q${i}"][value="${a}"]`).check();
  await page.locator('#quiz-submit').click();
  assert.match(await page.locator('#quiz-score').innerText(),/10 \/ 10/);
  assert.equal(await page.locator('.explanation:visible').count(),10);
  await page.locator('#quiz-retry').click();
  assert.equal(await page.locator('.quiz-option input:checked').count(),0);
  await page.locator('[data-mark-read]').click();
  await page.reload();
  assert.equal(await page.locator('[data-mark-read]').getAttribute('aria-pressed'),'true');
  await page.goto(base+'/index.html');
  assert.equal(await page.locator('[data-course-read-count="itds261"]').innerText(),'1');
  assert.equal(await page.locator('[data-course-read-count="itds241"]').innerText(),'0');
  await page.close();
 });
 await test('Mobile dark mode, source figures, native answer disclosure and no-JS reading',async()=>{
  const page=await newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(base+'/subjects/itds261/chapter-04.html');
  await page.locator('[data-theme-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  if (out) await page.screenshot({path:resolve(out,'software-mobile-dark.png')});
  const details=await page.locator('.lesson-section:has(details)').first().getAttribute('id');
  assert.ok(details);
  await page.evaluate(id=>location.hash=id,details);await settle(page);
  const answer=page.locator('.lesson-section:visible details').first();
  assert.equal(await answer.getAttribute('open'),null);
  await answer.locator('summary').click(); assert.notEqual(await answer.getAttribute('open'),null);
  await page.goto(base+'/subjects/itds241/chapter-07.html');
  const target=await page.locator('.lesson-section:has(figure)').first().getAttribute('id');
  await page.evaluate(id=>location.hash=id,target);await settle(page);
  if (out) await page.locator('.lesson-section:visible figure').first().screenshot({path:resolve(out,'existing-mobile-diagram.png')});
  await page.close();
  const plain=await newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await plain.goto(base+'/subjects/itds261/chapter-05.html');
  const sections=plain.locator('.lesson-section');
  assert.equal(await sections.count(),await plain.locator('.lesson-section:visible').count());
  const a=plain.locator('.worked-answer').first(); await a.locator('summary').click();
  assert.notEqual(await a.getAttribute('open'),null);
  await plain.close();
 });
 assert.deepEqual(errors,[],'No browser runtime errors');
 if(failures.length) throw new Error(failures.join('; '));
 console.log(`PASS: ${chapters} chapters; ${sectionChecks} desktop/mobile topic checks; images, search, reader, quiz, flashcards, persistence, theme and no-JS fallback.`);
} finally {await browser.close();await new Promise(r=>server.close(r));}
