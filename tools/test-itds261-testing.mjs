import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.createContext(context);
vm.runInContext(readFileSync(new URL('../assets/software-content.js',import.meta.url),'utf8'),context);
const lesson=context.window.StudyContent.itds261['13'];
assert.ok(lesson,'Lecture 12 must be registered without overwriting existing chapter 12');
assert.equal(lesson.quiz.length,10);
assert.ok(lesson.cards.length>=20);
const html=readFileSync(new URL('../subjects/itds261/chapter-13.html',import.meta.url),'utf8');
for(const id of ['sec-qa','debugging','ecp','bva','find-largest','flashcards','quiz']) assert.ok(html.includes(`id="${id}"`));
const final=readFileSync(new URL('../subjects/itds261/final.html',import.meta.url),'utf8');
assert.match(final,/data-exam-chapters="08,09,10,13"/);
assert.match(final,/href="chapter-13.html"/);
assert.doesNotMatch(final,/ยังไม่มีเนื้อหา/);
console.log('PASS: Testing registered, study content and Final navigation');
const lab=readFileSync(new URL('../assets/testing-lab.js',import.meta.url),'utf8');
for(const [,id] of lab.matchAll(/dragGame\('([^']+)'/g)) assert.ok(html.includes(`id="${id}"`),`Missing sorting-game mount: ${id}`);
// Exercise the actual asynchronous replay with controlled delays, without a browser.
function replayFixture() {
  let table={innerHTML:'',isConnected:true}, waits=[];
  const button={disabled:false};
  const stage={set innerHTML(value){table.isConnected=false;table=null;}};
  const sandbox={dFixed:true,dK:4,dReplay:0,dReplaying:false,dbgFlow(){},fixed:p=>p.reduce((a,b)=>a+b,0),buggy:()=>NaN,
    $:id=>id==='d4'?table:id==='dbgStage'?stage:id==='debug-retest'?button:null,
    sleep:()=>new Promise(resolve=>waits.push(resolve))};
  vm.createContext(sandbox);
  vm.runInContext(lab.slice(lab.indexOf('function dbgGo('),lab.indexOf('function dRepT(')),sandbox);
  vm.runInContext(lab.slice(lab.indexOf('async function dRetest('),lab.indexOf('\ndbgGo(0);')),sandbox);
  return {sandbox,get table(){return table;},async flush(){for(let i=0;i<20;i++){waits.splice(0).forEach(r=>r());await new Promise(resolve=>setImmediate(resolve));}}};
}
const replay=replayFixture();
const first=replay.sandbox.dRetest(),second=replay.sandbox.dRetest();
await replay.flush();await Promise.all([first,second]);
assert.equal((replay.table.innerHTML.match(/<tr>/g)||[]).length,7,'Repeated clicks must not interleave replay rows');
const cancel=replayFixture();
const running=cancel.sandbox.dRetest();
cancel.sandbox.dbgGo(0);
await cancel.flush();await running;
console.log('PASS: debugging replay ignores duplicate starts and cancels safely on step change');
const sourceMap=JSON.parse(readFileSync(new URL('../docs/itds261-l12-source-map.json',import.meta.url),'utf8'));
assert.deepEqual([...new Set(sourceMap.coverage.flatMap(row=>row.pages))].sort((a,b)=>a-b),Array.from({length:42},(_,i)=>i+1));
for(const row of sourceMap.coverage) assert.ok(html.includes(`id="${row.section}"`));
console.log('PASS: every source page maps to an existing lesson section');
