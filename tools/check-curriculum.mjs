import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const home = readFileSync(resolve(root, 'index.html'), 'utf8');
assert.match(home, /subjects\/itds261\/index\.html/, 'New course must be reachable from the home page');
const context = { window: {} };
vm.createContext(context);
for (const name of ['content', 'ecommerce-content', 'software-content', 'thermo-content', 'itds211-content']) {
  vm.runInContext(readFileSync(resolve(root, `assets/${name}.js`), 'utf8'), context);
}
const courses = context.window.StudyContent;
assert.equal(Object.keys(courses.itds261).length, 12);
assert.equal(Object.values(courses).reduce((n, course) => n + Object.keys(course).length, 0), 48);
let figures = 0;
for (const [course, chapters] of Object.entries(courses)) {
  for (const [id, data] of Object.entries(chapters)) {
    const html = readFileSync(resolve(root, `subjects/${course}/chapter-${id}.html`), 'utf8');
    assert.equal(data.quiz.length, 10, `${course}/${id}: shared scoring is out of ten`);
    assert.equal(new Set(data.quiz.map(q => q.q)).size, 10, `${course}/${id}: unique questions`);
    for (const q of data.quiz) {
      assert.equal(q.options.length, 4);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
      assert.ok(q.explanation.length > 15);
    }
    assert.ok(data.cards.length >= 8);
    assert.ok((html.match(/<figure\b/g) || []).length >= 2, `${course}/${id}: at least two explanatory figures`);
    figures += (html.match(/<figure\b/g) || []).length;
    if (course === 'itds261') {
      for (const id of ['flashcards','quiz','sources']) assert.ok(html.includes(`id="${id}"`));
      assert.match(html, /data-mark-read/);
      assert.match(html, /software-content\.js/);
    }
  }
}
const manifest = JSON.parse(readFileSync(resolve(root, 'subjects/itds261/sources.json'), 'utf8'));
assert.equal(manifest.length, 20, 'Every supplied file must have an explicit role');
for (const entry of manifest) { assert.ok(entry.file && entry.role && entry.chapters.length); }
const architectureSources = JSON.parse(readFileSync(resolve(root, 'subjects/itds211/sources.json'), 'utf8'));
assert.equal(architectureSources.length, 12, 'All supplied ITDS211 source lectures are indexed');
assert.equal(architectureSources.reduce((n, entry) => n + entry.pages, 0), 648);
const coverage = JSON.parse(readFileSync(resolve(root, 'docs/itds211-source-map.json'), 'utf8'));
assert.equal(coverage.length, 12);
for (const entry of coverage) {
  assert.equal(entry.coverage.length, entry.pages);
  assert.equal(new Set(entry.coverage.map(row => row.page)).size, entry.pages);
  assert.ok(entry.coverage.every(row => ['context', 'explained'].includes(row.status) && row.sectionIds.length));
}
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(item => item.name === '.git' ? [] : item.isDirectory() ? walk(resolve(dir,item.name)) : [resolve(dir,item.name)]);
}
let links = 0;
for (const file of walk(root).filter(path => path.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  for (const match of html.matchAll(/\b(?:href|src|poster|data-src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const [resource, hash] = ref.split('#');
    const path = decodeURIComponent(resource.split('?')[0]);
    const target = path ? resolve(dirname(file), path) : file;
    assert.ok(existsSync(target), `${file}: broken local reference ${ref}`);
    if (hash && target.endsWith('.html')) {
      const targetText = target === file ? html : readFileSync(target, 'utf8');
      assert.ok(targetText.includes(`id="${decodeURIComponent(hash)}"`), `${file}: missing anchor ${ref}`);
    }
    links++;
  }
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag[0], /\balt="[^"]*"/, `${file}: image needs alt`);
}
console.log(`PASS: 5 courses, 48 chapters, 480 questions, ${figures} learning figures, 20 ITDS261 + 12 ITDS211 source files, ${links} local references.`);
