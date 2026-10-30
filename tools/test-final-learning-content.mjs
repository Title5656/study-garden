import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from './final-learning-content.mjs';
import {enhanceLesson} from './install-final-learning.mjs';
for (const [key, lesson] of Object.entries(lessons)) {
  const [course, chapter] = key.split('/');
  const html = readFileSync(new URL(`../subjects/${course}/chapter-${chapter}.html`,import.meta.url),'utf8');
  assert.match(html,/id="learn-transfer"/,`${key} needs transfer practice`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${key}: unique IDs`);
  for(const href of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(href[1]),`${key}: ${href[1]}`);
  const once = enhanceLesson(html,key);
  assert.equal(enhanceLesson(once,key),once,`${key}: rebuilding must not duplicate content`);
  assert.equal(lesson.checks.length,2);
  assert.equal(new Set(lesson.checks.map(x=>x.id)).size,2);
  for(const q of lesson.checks) {assert.ok(q.options[q.answer]);assert.ok(ids.includes(q.link));}
  assert.equal((html.match(/data-final-checks/g)||[]).length,1);
  for(const [id] of lesson.route) assert.ok(ids.includes(id));
  if(lesson.lab) assert.ok(ids.includes(lesson.lab.id));
}
console.log('PASS: all five learning paths, practice data, links, unique IDs and idempotent rebuilding.');
