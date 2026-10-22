// Execute the exact authored snippets copied by students, in isolated Node contexts.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const [chapter,id,want] of [
 ['06','price-total',[200]],
 ['07','function-price',[80]],
 ['08','promise-order',['เริ่ม','ทำงานอื่นต่อ','ข้อมูลพร้อม']],
]) {
 const html=readFileSync(new URL(`../subjects/itds241/chapter-${chapter}.html`,import.meta.url),'utf8');
 const match=html.match(new RegExp(`<code data-example="${id}">([\\s\\S]*?)</code>`));
 assert.ok(match,`${id} example exists`);
 const source=match[1].replace(/<[^>]*>/g,'').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&').replaceAll('&quot;','"');
 const output=[];
 vm.runInNewContext(source,{console:{log:value=>output.push(value)}},{timeout:1000});
 await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(output,want,`${id}: actual copied code output`);
}
const data={window:{}};
vm.runInNewContext(readFileSync(new URL('../assets/content.js',import.meta.url),'utf8'),data);
for(const chapter of Object.values(data.window.StudyContent.itds241)) {
 assert.equal(chapter.quiz.length,10);
 for(const q of chapter.quiz) {
  assert.equal(q.options.length,4);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
 }
}
console.log('PASS: three authored examples produce stated output; 30 quiz questions keep score/storage contract');
