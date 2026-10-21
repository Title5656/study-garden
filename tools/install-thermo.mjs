/**
 * Idempotent integration with Study Garden main branch structure (2026-10-21).
 * Run from repo root AFTER copying package files; affects existing files only.
 * No network, git, or push. Fail closed if known markup changed.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
function edit(file,mutate){
 const path=resolve(root,file);
 if(!existsSync(path))throw new Error(`Missing target: ${file}`);
 const old=readFileSync(path,'utf8');
 const normalized=old.replace(/\r\n/g,'\n');
 const updated=mutate(normalized);
 const next=old.includes('\r\n')?updated.replace(/\n/g,'\r\n'):updated;
 if(next===old){console.log('NO CHANGE',file);return;}
 writeFileSync(path,next,'utf8');console.log('UPDATED',file);
}
function replaceOnce(text,before,after,file){
 const count=text.split(before).length-1;
 if(count!==1)throw new Error(`${file}: expected exactly one occurrence of ${JSON.stringify(before)}; found ${count}. Review upstream changes before integrating.`);
 return text.replace(before,after);
}
const contentHash=createHash('sha256').update(readFileSync(resolve(root,'assets/thermo-content.js'),'utf8').replace(/\r\n/g,'\n')).digest('hex').slice(0,12);
const courseCard=`<article class="folder-card palette-glacier" data-search-text="611201 Thermodynamics for Chemical Process Engineers I อุณหพลศาสตร์ วิศวกรกระบวนการเคมี พลังงาน entropy enthalpy Rankine refrigeration"><span class="folder-category">วิศวกรรมกระบวนการเคมี</span>
  <a class="subject-folder" href="subjects/thermo-chemical/index.html" aria-label="เปิดวิชา 611201 Thermodynamics 9 บทเรียน"><span class="folder-object" aria-hidden="true"><span class="folder-back art-glacier"></span><svg class="folder-rim folder-back-rim" viewBox="0 0 340 272" preserveAspectRatio="none"><path d="M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z"/></svg><span class="folder-sheet sheet-one"><span>บทเรียน</span><i></i><i></i><i></i></span><span class="folder-sheet sheet-two"><span>Flashcards</span><b>90</b></span><span class="folder-sheet sheet-three"><span>Quiz</span><b>90</b></span><span class="folder-front"><svg class="folder-rim folder-front-rim" viewBox="0 0 340 198" preserveAspectRatio="none"><path d="M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z"/></svg><span class="folder-label"><span class="folder-code">611201</span><strong>Thermodynamics for Chemical Process Engineers I</strong><span class="folder-meta">9 บทเรียน · สรุปภาษาไทย + Interactive</span></span><span class="folder-key">↗</span></span></span></a>
  <div class="folder-caption"><h3><a href="subjects/thermo-chemical/index.html">611201 <span aria-hidden="true">↗</span></a></h3><span>อ่านแล้ว <span data-course-read-count="thermo-chemical">0</span> / 9 บท</span></div><p class="folder-topics">First Law · Entropy · EoS · Heat Effects · Rankine · COP</p></article>`;
edit('index.html',html=>{
 if(html.includes('subjects/thermo-chemical/index.html'))return html;
 html=replaceOnce(html,'<script defer src="assets/app.js',`<script defer src="assets/thermo-content.js?v=${contentHash}"></script>\n<script defer src="assets/app.js`,'index.html');
 html=replaceOnce(html,'วิชาทั้งหมด <span>3</span>','วิชาทั้งหมด <span>4</span>','index.html');
 html=replaceOnce(html,'3 วิชา · 25 บทเรียน','4 วิชา · 34 บทเรียน','index.html');
 html=replaceOnce(html,' / 25 บท',' / 34 บท','index.html');
 html=replaceOnce(html,'</article>\n        </div>\n        <p id="search-empty"',`</article>\n          ${courseCard}\n        </div>\n        <p id="search-empty"`,'index.html');
 html=html.replace('ITDS241, ITDS294 และ ITDS261 เลือกวิชา','ITDS241, ITDS294, ITDS261 และ 611201 เลือกวิชา');
 return html;
});
edit('tools/check-curriculum.mjs',s=>{
 if(s.includes("'thermo-content'"))return s;
 s=replaceOnce(s,"['content', 'ecommerce-content', 'software-content']","['content', 'ecommerce-content', 'software-content', 'thermo-content']",'tools/check-curriculum.mjs');
 s=replaceOnce(s,'), 25);', '), 34);','tools/check-curriculum.mjs');
 s=replaceOnce(s,'3 courses, 25 chapters, 250 questions','4 courses, 34 chapters, 340 questions','tools/check-curriculum.mjs');
 return s;
});
edit('tools/test-learning.mjs',s=>{
 if(s.includes("'.subject-folder').count(),4"))return s;
 return replaceOnce(s,"locator('.subject-folder').count(),3","locator('.subject-folder').count(),4",'tools/test-learning.mjs');
});
edit('README.md',s=>{
 if(s.includes('## 611201 Thermodynamics'))return s;
 return s+`\n## 611201 Thermodynamics for Chemical Process Engineers I\n\nบทเรียนภาษาไทย 9 บทจากโครงสร้างสไลด์รายวิชา 611201 (292 หน้า) เริ่มอ่านที่ [หน้ารวมบทเรียน](subjects/thermo-chemical/index.html) พร้อมการทดลองปรับค่า 9 แบบ, Flashcards 90 ใบ, Quiz 90 ข้อ และแผนที่ตัวอย่างโจทย์อ้างเลขหน้า PDF\n\n- เนื้อหาและแผนภาพเป็นการเรียบเรียงใหม่ ไม่ได้คัดลอกภาพสไลด์ทั้งหน้า\n- **ไฟล์ PDF ต้นฉบับไม่ได้รวมไว้ใน repository สาธารณะ** เนื่องจากต้องคำนึงถึงสิทธิ์ผู้จัดทำ; หากมีสิทธิ์เผยแพร่ ผู้ดูแลสามารถให้ลิงก์ PDF แยกได้\n- รายการหัวข้อและหน้าสไลด์อ้างอิง: [docs/thermo-source-map.json](docs/thermo-source-map.json)\n- แก้เนื้อหาใน [tools/thermo-authoring/author_content.py](tools/thermo-authoring/author_content.py) แล้วเรียก \`python3 tools/thermo-authoring/build_thermo.py\` เพื่อสร้างหน้า HTML และ quiz data ใหม่\n- ตรวจสอบความครบของบทและสูตรตัวอย่าง: \`node tools/test-thermo.mjs\` และ \`node tools/check-curriculum.mjs\`\n`;
});
console.log('Integration completed. Re-run safely; validate before committing.');
