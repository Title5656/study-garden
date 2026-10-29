import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
// Shared assets live in the existing Study Garden repo, not the add-on archive.
const sharedAssetHashes = {
 'favicon.png':'66f8b58bffb5', 'study-garden-logo.png':'4d3c7e4e5b15',
 'style.css':'57402278ef28', 'reader.css':'e645af8bb978',
 'core.js':'02afe1c9497e', 'app.js':'187c0a39763c',
 'reader.js':'6909a53af50d'
};
const context={window:{}};vm.createContext(context);
vm.runInContext(readFileSync(resolve(root,'assets/thermo-content.js'),'utf8'),context);
const data=context.window.StudyContent['thermo-chemical'];
assert.equal(Object.keys(data).length,9);
const chartMap=JSON.parse(readFileSync(resolve(root,'docs/thermo-source-map.json'),'utf8'));
assert.equal(chartMap.chapters.length,9);
const thermo=(await import('../assets/thermo-core.js')).default; // CJS module mapped to default by Node
const near=(a,b,eps=1e-6)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
near(thermo.piston(10),249.43387854);
near(thermo.energy(70,30),40);
near(thermo.virial(0),1);
near(thermo.virial(10),1-1.2/(0.08314462618*400));
near(thermo.sensible(60),334.4);
near(thermo.carnot(600),.5);
near(thermo.qualityH(0),419.1);near(thermo.qualityH(1),2676);
near(thermo.nozzle(0),50);
near(thermo.rankine(1100),.36);
near(thermo.fridgeCOP(250),5);
let totalSections=0,totalProblems=0,totalQuestions=0;
for(let n=1;n<=9;n++){
 const id=String(n).padStart(2,'0');
 const entry=data[id];assert.equal(entry.cards.length,10);assert.equal(entry.quiz.length,10);
 const html=readFileSync(resolve(root,`subjects/thermo-chemical/chapter-${id}.html`),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`duplicate IDs chapter ${n}`);
 assert.ok((html.match(/<figure\b/g)||[]).length>=2);assert.ok((html.match(/<li>/g)||[]).length>=3,`missing worked steps ${n}`);
 for(const must of ['id="flashcards"','id="quiz"','id="experiment"','id="worked-example"','data-mark-read','data-thermo-widget','id="concept-map"'])assert.ok(html.includes(must),`${n}: ${must}`);
 assert.ok(!html.includes('id="sources"'),`${n}: public source section is removed`);
 assert.match(html,/data-chapter="\d\d"/);
 assert.ok(html.includes('reader.js'));
 for(const q of entry.quiz){
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert.ok(q.explanation.length>12);
 }
 const mapped=chartMap.chapters[n-1];assert.equal(mapped.chapter,n);
 totalSections+=mapped.sections.length;totalProblems+=mapped.example_pages.length;totalQuestions+=entry.quiz.length;
 for(const sec of mapped.sections){assert.ok(html.includes(sec.title));}
 for(const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)){
  const ref=m[1];if(ref.startsWith('#')){assert.ok(ids.includes(ref.slice(1)),`bad anchor ${ref}`);continue;}
  if(/^(?:https?:|mailto:)/.test(ref))continue;
  const path=ref.split(/[?#]/)[0];
  const file=resolve(root,'subjects/thermo-chemical',path);
  const basename=path.split('/').at(-1);
  if(!existsSync(file)) {
   // The home page and existing courses live in the destination repository.
   if(path==='../../index.html'||/^\.\.\/\.\.\/subjects\/itds(?:241|261|294)\/index\.html$/.test(path))continue;
   // Legacy shared assets are expected to be supplied by the destination repository.
   assert.equal(sharedAssetHashes[basename],new URLSearchParams(ref.split('?')[1]||'').get('v'),`missing ${n}:${path}`);
   continue;
  }
  if(/\.(?:png|svg|js|css)$/.test(path)){
   const v=new URLSearchParams(ref.split('?')[1]||'').get('v');
   const bytes=readFileSync(file);
   const content=['.css','.js','.svg'].includes(extname(file))?bytes.toString('utf8').replace(/\r\n/g,'\n'):bytes;
   const calculated=createHash('sha256').update(content).digest('hex').slice(0,12);
   assert.equal(v,calculated,`asset hash mismatched ${ref}`);
  }
 }
}
const index=readFileSync(resolve(root,'subjects/thermo-chemical/index.html'),'utf8');
assert.equal((index.match(/class="thermo-course-card"/g)||[]).length,9);
assert.ok(index.includes('data-course')===false || index.includes('thermo-course'));
console.log(`PASS: 9 chapters / ${totalSections} lesson sections / ${totalProblems} original-slide exercise guides / ${totalQuestions} quiz / 90 flashcards / 9 calculators; all new references and fingerprints valid`);
