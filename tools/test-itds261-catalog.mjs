import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(new URL(path, `file:///${root.replaceAll('\\', '/')}/`), 'utf8');
const index = read('subjects/itds261/index.html');
const home = read('index.html');
const css = read('assets/library.css');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('assets/software-content.js'), context);
const content = context.window.StudyContent.itds261;
const cards = [...index.matchAll(/<article class="folder-card ([^"]+)"([\s\S]*?)<\/article>/g)];
const labels = ['บทที่ 0', 'L2', 'L3', 'L4', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'Midterm recap'];
const titles = [
  'SE Foundation & SPM', 'Process Models', 'Requirement Engineering',
  'Use Case Modeling', 'Requirements Modeling: Flow & Behavior I',
  'Requirements Modeling: Flow & Behavior II', 'User Interface Design',
  'Design Architecture & Methodology', 'Implementation & Code Review',
  'VCS (Version Control Systems)', 'Midterm recap',
];

assert.equal(cards.length, 11, 'ITDS261 shows eleven lesson folders');
assert.equal(Object.keys(content).length, 11, 'removed Lab is absent from learning data');
assert.equal(new Set(cards.map(card => card[1])).size, 11, 'each folder has a different palette');
for (const [position, card] of cards.entries()) {
  const id = String(position + 1).padStart(2, '0');
  assert.ok(card[2].includes(`<strong>${titles[position].replaceAll('&', '&amp;')}</strong>`));
  assert.match(card[2], new RegExp(`<a href="chapter-${id}\\.html">${labels[position]}`));
  assert.match(card[2], new RegExp(`data-chapter-status="${id}"`));
  const palette = card[1].replace('palette-', '');
  assert.match(css, new RegExp(`\\.palette-${palette} \\{`));
  assert.ok(existsSync(new URL(`assets/folder-${palette}.png`, `file:///${root.replaceAll('\\', '/')}/`)));
}
assert.doesNotMatch(index, /Lab 3 PHTRS|chapter-12\.html|12 บท|120 คำถาม/);
assert.match(home, /ITDS261[^\n]*11 บทเรียน/);
assert.ok(!existsSync(new URL('subjects/itds261/chapter-12.html', `file:///${root.replaceAll('\\', '/')}/`)));
const sources = JSON.parse(read('subjects/itds261/sources.json'));
assert.ok(sources.every(source => !source.chapters.includes('12')));
const manifest = JSON.parse(read('sources/manifest.json'));
assert.equal(manifest.chapters.filter(page => page.course === 'itds261').length, 11);
assert.ok(manifest.chapters.every(page => page.page !== 'subjects/itds261/chapter-12.html'));
console.log('PASS: ITDS261 labels, original lecture titles, 11 unique folder artworks, and Lab removal.');
