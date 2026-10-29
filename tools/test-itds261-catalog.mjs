import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const context = {window:{}};
vm.createContext(context);
vm.runInContext(read('assets/software-content.js'), context);
const content = context.window.StudyContent.itds261;
const groups = {midterm:['01','02','03','04','05','06','07','11'],final:['08','09','10','13']};
const labels = {'01':'บทที่ 0','02':'L2','03':'L3','04':'L4','05':'L6','06':'L7','07':'L8','08':'L9','09':'L10','10':'L11','11':'Midterm recap','13':'L12'};
assert.equal(Object.keys(content).length,12);
const palettes = [];
for (const [exam, ids] of Object.entries(groups)) {
  const html = read(`subjects/itds261/${exam}.html`);
  assert.ok(html.includes(`data-exam-chapters="${ids.join(',')}"`));
  const cards = [...html.matchAll(/<article class="folder-card ([^"]+)"([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length,ids.length,exam);
  cards.forEach((card,i) => {
    const id = ids[i];
    palettes.push(card[1]);
    assert.ok(card[2].includes(`data-chapter-status="${id}"`));
    assert.ok(card[2].includes(`<a href="chapter-${id}.html">${labels[id]}`));
    assert.equal(content[id].label,labels[id]);
    assert.ok(existsSync(new URL(`assets/folder-${card[1].replace('palette-','')}.png`,root)));
  });
  assert.doesNotMatch(html,/chapter-12\.html|Lab 3 PHTRS|id="source-inventory"/);
}
assert.equal(new Set(palettes).size,12);
const index = read('subjects/itds261/index.html');
assert.equal((index.match(/data-exam-folder=/g)||[]).length,2);
assert.match(index,/2 โฟลเดอร์ · 12 บทเรียน/);
assert.match(content['13'].title,/Testing/);
assert.ok(content['13'].cards.length>=20);
assert.ok(!existsSync(new URL('subjects/itds261/chapter-12.html',root)));
for (const id of Object.keys(content)) {
  const html = read(`subjects/itds261/chapter-${id}.html`);
  assert.doesNotMatch(html,/chapter-12\.html|id="(?:sources|source-inventory)"/);
  assert.ok(html.includes(`<span>${labels[id]}</span></nav>`));
}
console.log('PASS: merged Midterm/Final catalog, 12 lecture labels and palettes, Testing retained, Lab removed.');
