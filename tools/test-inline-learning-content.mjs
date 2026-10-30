import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from './final-learning-content.mjs';
import {enhanceLesson} from './install-final-learning.mjs';
for(const key of Object.keys(lessons)) {
  const [course,id]=key.split('/'), html=readFileSync(new URL(`../subjects/${course}/chapter-${id}.html`,import.meta.url),'utf8');
  assert.ok(html.includes('data-reader-inline="true"'),`${key}: integrate experiments into content`);
  assert.ok(!/<section[^>]+id="(?:learn-impact|learn-review|learn-merge|learn-transfer)"/.test(html),'No detached practice sections');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length);
  const once=enhanceLesson(html,key);assert.equal(enhanceLesson(once,key),once,'regeneration must stay idempotent');
  for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),`${key} anchor ${m[1]}`);
  if(course==='itds241') {
    assert.ok((html.match(/class="lesson-section/g)||[]).length<=12,'coherent topics, not dozens of isolated lab pages');
    assert.ok(html.includes('data-inline-source'));
  } else assert.ok(html.includes('data-inline-explorer')||html.includes('data-inline-sort'));
}
console.log('PASS: five inline lessons, preserved anchors, coherent topic counts and stable regeneration.');
