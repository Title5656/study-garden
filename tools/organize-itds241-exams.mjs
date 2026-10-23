// Regenerate the two exam folders from the course registry; future chapters go in Final.
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const context={window:{}};vm.createContext(context);vm.runInContext(read('assets/content.js'),context);
const content=context.window.StudyContent.itds241;
const midtermIds=new Set(['06','07','08']);
const chapters=Object.entries(content).sort(([a],[b])=>a.localeCompare(b)).map(([id,data])=>{
 const html=read(`subjects/itds241/chapter-${id}.html`);
 const title=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g,'').replaceAll('&amp;','&') || `บทที่ ${Number(id)}`;
 return {id,data,title};
});
const groups=[
 {id:'midterm',label:'Midterm',thai:'สอบกลางภาค',palette:'aurora',chapters:chapters.filter(c=>midtermIds.has(c.id)),topics:'JavaScript · Functions · Objects · DOM · Events · ECMAScript · Promise · Async / Await'},
 {id:'final',label:'Final',thai:'สอบปลายภาค',palette:'indigo',chapters:chapters.filter(c=>!midtermIds.has(c.id)),topics:'Node.js · Module · File System · HTTP'},
];
const back='M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z';
const front='M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z';
function folder(group) {
 const {id,label,thai,palette,topics}=group;
 const n=group.chapters.length,cards=group.chapters.reduce((sum,c)=>sum+c.data.cards.length,0),quiz=group.chapters.reduce((sum,c)=>sum+c.data.quiz.length,0);
 return `<article class="folder-card palette-${palette}" data-exam-folder="${id}" data-search-text="${escape(['ITDS241 Web Technologies',label,thai,topics,...group.chapters.map(c=>`บท ${Number(c.id)} ${c.title}`)].join(' '))}">
 <span class="folder-category">${thai}</span>
 <details class="glass-folder" name="exam-folders">
  <summary aria-label="เปิดโฟลเดอร์ ${label}">
   <span class="folder-object" aria-hidden="true">
    <span class="folder-back art-${palette}"></span><svg class="folder-rim folder-back-rim" viewBox="0 0 340 272" preserveAspectRatio="none"><path d="${back}"/></svg>
    <span class="folder-sheet sheet-one"><span>บทเรียน</span><i></i><i></i><i></i></span>
    <span class="folder-sheet sheet-two"><span>Flashcards</span><b>${cards}</b></span>
    <span class="folder-sheet sheet-three"><span>Quiz</span><b>${quiz}</b></span>
    <span class="folder-front"><svg class="folder-rim folder-front-rim" viewBox="0 0 340 198" preserveAspectRatio="none"><path d="${front}"/></svg><span class="folder-label"><span class="folder-code">ITDS241 / ${label.toUpperCase()}</span><strong>${label}</strong><span class="folder-meta">${thai} · ${n} บทเรียน</span></span><span class="folder-key">↗</span></span>
   </span>
  </summary>
  <nav class="folder-files" aria-label="บทเรียน ${label}">
  ${group.chapters.map(c=>`<a href="chapter-${c.id}.html"><span>${id==='midterm'?`บทที่ ${Number(c.id)} · `:''}${escape(c.title)}<small data-chapter-status="${c.id}">ยังไม่ได้อ่าน</small></span><span aria-hidden="true">↗</span></a>`).join('\n')}
  </nav>
 </details>
 <div class="folder-caption"><strong>${label}</strong><span>${n} บทเรียน</span></div>
 <p class="folder-topics">${escape(group.chapters.map(c=>c.title).join(' · '))}</p>
</article>`;
}
let index=read('subjects/itds241/index.html');
if(!index.includes('<link rel="stylesheet" href="../../assets/exam-folders.css')) index=index.replace('</head>','<link rel="stylesheet" href="../../assets/exam-folders.css">\n</head>');
index=index.replace('<body data-subject="itds241">','<body data-subject="itds241" data-exam-library>');
const grid=/<div class="folder-grid(?: subject-grid)?">[\s\S]*?(?=<p id="search-empty")/;
if(!grid.test(index)) throw new Error('ITDS241 folder grid not found; refusing to replace unrelated content');
const template=index;
function examFolder(group) {
 return folder(group)
  .replace(/<details[^>]*>\s*<summary[^>]*>/,`<a class="subject-folder" href="${group.id}.html" aria-label="เปิดโฟลเดอร์ ${group.label}">`)
  .replace('</summary>','</a>')
  .replace(/<nav class="folder-files"[\s\S]*?<\/nav>\s*<\/details>/,'')
  .replace(/<span class="folder-category">[^<]*<\/span>/,'')
  .replace(/<span class="folder-code">[^<]*<\/span>/,'<span class="folder-code">ITDS241</span>')
  .replace(/<span class="folder-meta">[^<]*<\/span>/,`<span class="folder-meta">${group.chapters.length} บทเรียน</span>`)
  .replace(/<div class="folder-caption">[\s\S]*?<\/div>/,'')
  .replace(/<p class="folder-topics">[\s\S]*?<\/p>/,'');
}
function chapterFolder(c,group) {
 let result=folder({...group,id:c.id,label:escape(c.title),thai:`บทที่ ${Number(c.id)}`,chapters:[c]});
 result=result.replace('data-exam-folder=','data-chapter-folder=')
  .replace(/<span class="folder-code">[^<]*<\/span>/,`<span class="folder-code">ITDS241 / ${c.id}</span>`)
  .replace(/<span class="folder-meta">[^<]*<\/span>/,`<span class="folder-meta">${c.data.cards.length} cards · ${c.data.quiz.length} คำถาม</span>`)
  .replace(/<nav class="folder-files"[\s\S]*?<\/nav>/,`<nav class="folder-files" aria-label="เนื้อหาบท ${Number(c.id)}"><a href="chapter-${c.id}.html"><span>สรุปบทเรียน</span><span>↗</span></a><a href="chapter-${c.id}.html#flashcards"><span>Flashcards <small>${c.data.cards.length} ใบ</small></span><span>↗</span></a><a href="chapter-${c.id}.html#quiz"><span>Quiz <small>${c.data.quiz.length} ข้อ</small></span><span>↗</span></a></nav>`)
  .replace(/<div class="folder-caption">[\s\S]*?<\/div>/,`<div class="folder-caption"><a href="chapter-${c.id}.html">บทที่ ${Number(c.id)} <span>↗</span></a><span data-chapter-status="${c.id}">ยังไม่ได้อ่าน</span></div>`);
 return result;
}
for(const group of groups) {
 let page=template.replace(grid,`<div class="folder-grid">${group.chapters.map(c=>chapterFolder(c,group)).join('\n')}</div>\n`)
  .replace('<body data-subject="itds241" data-exam-library>',`<body data-subject="itds241" data-exam-library data-exam-chapters="${group.chapters.map(c=>c.id).join(',')}">`)
  .replace(/<title>[^<]*<\/title>/,`<title>${group.label} · ITDS241 · Study Garden</title>`)
  .replace('<span>ITDS241</span>','<a href="index.html">ITDS241</a><span>/</span><span>'+group.label+'</span>')
  .replace('<h1>Web Technologies</h1>',`<h1>${group.label}</h1>`)
  .replace(/<span class="active-tab">[\s\S]*?<\/span><\/span>/,`<span class="active-tab">บทเรียน ${group.label} <span>${group.chapters.length}</span></span>`)
  .replace(/(<strong data-read-count>0<\/strong> \/ )\d+/,`$1${group.chapters.length}`)
  .replace(/<span class="library-count">[^<]*<\/span>/,`<span class="library-count">${group.chapters.length} บทเรียน</span>`);
 writeFileSync(new URL(`subjects/itds241/${group.id}.html`,root),page.replace(/[\t ]+$/gm,''));
}
index=index.replace(grid,`<div class="folder-grid subject-grid">${groups.map(examFolder).join('\n')}</div>\n`);
index=index.replace(/<span class="library-count">[^<]*<\/span>/,`<span class="library-count">2 โฟลเดอร์ · ${chapters.length} บทเรียน</span>`);
index=index.replace('บทเรียนทั้งหมด <span>4</span>','Midterm &amp; Final <span>2</span>');
writeFileSync(new URL('subjects/itds241/index.html',root),index.replace(/[\t ]+$/gm,''));
console.log(`Organized ITDS241: Midterm ${groups[0].chapters.length}, Final ${groups[1].chapters.length}.`);
