// Editorial scope and navigation invariants for the completed Mahidol revision.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=fileURLToPath(new URL('../',import.meta.url));
const baseline='abe9b00'; // last delivered version, before the user's scope clarification
const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const old=path=>execFileSync('git',['show',`${baseline}:${path}`],{cwd:root,encoding:'utf8'});
const normalize=text=>text.replaceAll('\r\n','\n');
let chapters=0;
for(const course of ['itds241','itds261','itds294']) {
 for(const file of readdirSync(new URL(`../subjects/${course}/`,import.meta.url)).filter(n=>/^chapter-\d+\.html$/.test(n))) {
  const path=`subjects/${course}/${file}`,html=read(path);
  for(const id of [...old(path).matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])) assert.ok(html.includes(`id="${id}"`),`${path}: removed original anchor ${id}`);
  assert.match(html,/ก่อนเริ่มบทนี้/);
  const introduction=html.match(/<section\b[^>]*id="before-(?:start|you-start)"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(introduction&&introduction.length>200&&/(?:<dl\b|ศัพท์)/.test(introduction),`${path}: prerequisite terminology must remain accessible as text`);
  assert.match(html,/สรุป(?:บท|ความเชื่อมโยงของบท)/);
  assert.match(html,/<details\b/,'Practice answers must be available without scripting');
  chapters++;
 }
}
assert.equal(chapters,25);
const unchanged=execFileSync('git',['ls-tree','-r','--name-only',baseline,'subjects/thermo-chemical','assets/thermo-content.js','assets/thermo-core.js','assets/thermo-labs.js','assets/thermo.css','docs/thermo-source-map.json'],{cwd:root,encoding:'utf8'}).trim().split('\n');
for(const path of unchanged) assert.equal(normalize(read(path)),normalize(old(path)),`${path}: Thermodynamics is outside editorial scope`);
const withoutVersions=text=>normalize(text).replace(/\?v=[a-f0-9]+/g,'');
assert.equal(withoutVersions(read('index.html')),withoutVersions(old('index.html')),'All existing course links/counts remain unchanged (asset versions may refresh)');
const context={window:{}};vm.createContext(context);
const previous={window:{}};vm.createContext(previous);
for(const file of ['content','software-content','ecommerce-content']) {
 vm.runInContext(read(`assets/${file}.js`),context);
 vm.runInContext(old(`assets/${file}.js`),previous);
}
for(const [course,chapters] of Object.entries(context.window.StudyContent)) for(const [id,chapter] of Object.entries(chapters)) {
 assert.equal(chapter.quiz.length,10);
 assert.ok(new Set(chapter.quiz.map(q=>q.answer)).size>=3,`${course}/${id}: answer locations are too predictable`);
 for(const question of chapter.quiz) {
  const prior=previous.window.StudyContent[course][id].quiz.find(q=>q.q===question.q);
  assert.ok(prior,`${course}/${id}: question identity changed`);
  assert.equal(question.options[question.answer],prior.options[prior.answer],`${course}/${id}: shuffle changed the correct answer`);
 }
}
const ecommerce=createRequire(import.meta.url)('../assets/ecommerce-core.js');
const funnel=ecommerce.funnel(10000,2,5,2000,500);
assert.deepEqual([funnel.clicks,funnel.orders,funnel.revenue,funnel.cpc,funnel.cpa,funnel.roas],[200,10,5000,10,200,2.5]);
assert.equal(ecommerce.funnel(0,2,5,0,500).cpa,null);
assert.equal(ecommerce.funnel(10000,2,5,0,500).roas,null);
const finance=ecommerce.finance(10,4,6000,1200);
assert.deepEqual([finance.margin,finance.breakEven,finance.profit],[6,1000,1200]);
assert.equal(ecommerce.finance(4,4,6000,1200).breakEven,null);
assert.equal(ecommerce.finance(3,4,6000,1200).breakEven,null);
console.log('PASS: all 25 Mahidol chapters retain original anchors and teaching structure; 250 quiz contracts; Thermodynamics and course navigation unchanged.');
