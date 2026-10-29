// Authoring only: node tools/build-nodejs.mjs (requires marked, or STUDY_GARDEN_MARKED=file URL).
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const {marked}=await import(process.env.STUDY_GARDEN_MARKED || 'marked');
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(resolve(root,p),'utf8');
const write=(p,text)=>writeFileSync(resolve(root,p),text);
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const json=x=>JSON.stringify(x).replaceAll('<','\\u003c');
const md=s=>marked.parse(s).replace(/<table>/g,'<div class="table-wrap" tabindex="0" role="region" aria-label="ตารางประกอบบทเรียน"><table>').replace(/<\/table>/g,'</table></div>');
let source=read('subjects/itds241/part1-nodejs-intro/content.md').replaceAll('\r\n','\n').replace(/^---\n[\s\S]*?\n---\n/,'');
// Corrections preserve the teaching intent; the original Markdown remains unchanged.
source=source.replaceAll('เข้าถึงระบบปฏิบัติการและไฟล์ของเซิร์ฟเวอร์ได้เต็มที่','เข้าถึงระบบปฏิบัติการและไฟล์ตามสิทธิ์ของ process ที่รัน');
source=source.replaceAll('เข้าถึงไฟล์ในระบบของเซิร์ฟเวอร์ได้เต็มที่','เข้าถึงไฟล์ในระบบของเซิร์ฟเวอร์ตามสิทธิ์ process');
source=source.replace('Q3. ข้อใดเป็น global object?','Q3. ข้อใดพร้อมใช้ใน CommonJS โดยไม่ต้องนำเข้า module อื่นก่อน?');
source=source.replace('Node.js = เอา JavaScript ไปรัน "ฝั่งเซิร์ฟเวอร์" ไม่ใช่ในเบราว์เซอร์','Node.js รัน JavaScript นอกเบราว์เซอร์ เช่น ฝั่งเซิร์ฟเวอร์หรือเครื่องมือ command line');
source=source.replace('และ **เข้าถึงระบบปฏิบัติการ','และ **เข้าถึงระบบปฏิบัติการ');
source=source.replace('**ไม่มี Cookies** (ในตัว Node เอง)','ไม่มี cookie store แบบเบราว์เซอร์ แต่รับ/ส่ง Cookie ผ่าน HTTP headers ได้');
source=source.replace('File System / Database / Computation','File System / Database / งานอื่นที่ไม่บล็อก');
source=source.replace('**main thread (เธรดเดียว)** รับเรื่อง แล้ว **ส่งต่อให้หน่วยที่เหมาะสม** (File System / Database / Computation)','**event loop** รับเรื่อง แล้วเริ่มงาน I/O ผ่าน OS หรือ worker pool ตามชนิดงาน');
source=source.replace('**Global objects = ใช้ได้ในทุก module (ทุกไฟล์) โดยไม่ต้อง import**','**ในตัวอย่าง CommonJS** มีทั้ง global จริง เช่น `console`, `process` และค่าประจำ module เช่น `__dirname`, `__filename`, `module`, `exports`, `require` ที่ Node เตรียมให้โดยไม่ต้อง import\n\n*เสริมความเข้าใจ:* ตัวอย่างบทนี้ใช้ CommonJS (`require`/`module.exports`) ส่วน ES modules (`import`/`export`) มีวิธีจัดการต่างกัน');
source=source.replace('ทุกไฟล์ JS ใน Node คือ module','ในตัวอย่าง CommonJS นี้ ทุกไฟล์ JS เป็น module แยก scope');
source=source.replace(' (สไลด์แสดงผลตัวอย่างเป็น `v24.21.0`)',' (เลขเวอร์ชันขึ้นกับรุ่นที่ติดตั้ง)');
source=source.replace('**ทุกเมธอดใน fs มีคู่ทั้ง asynchronous และ synchronous**','**เมธอดในตารางนี้มีทั้ง asynchronous และ synchronous**; ไม่ควรเหมารวมว่า API ทุกตัวใน `fs` มีคู่ Sync');
source=source.replace('fs | ทุกฟังก์ชันมีคู่ async/sync; ใช้ async;','fs | เมธอดในตารางมีคู่ async/sync; เลือก async สำหรับ I/O ใน server;');
source=source.replace('ไม่มี DOM/window/document/cookies','ไม่มี DOM/window/document หรือ cookie store แบบเบราว์เซอร์');
source=source.replace('ผูก server กับ localhost + port 8081','ฟังที่ port 8081; ถ้าไม่ระบุ host มักรับทุก network interface ไม่ได้จำกัด localhost');
source=source.replace('fs.readFile("./bbq.html", function(err, data) {\n      res.statusCode', 'fs.readFile("./bbq.html", function(err, data) {\n      if (err) {\n        res.statusCode = 500;\n        res.end("Cannot read file");\n        return;\n      }\n      res.statusCode');
const finalQuiz=[
 ['สร้าง server ควรทำอะไรก่อน listen(8081)?',['เรียก res.end() นอก callback','import http แล้วเรียก createServer','อ่าน window.document','ส่ง status 404 ทุกครั้ง'],1,'ต้องมี server object จาก http.createServer ก่อนเรียก listen ส่วน res.end อยู่ใน callback เมื่อมี request เข้ามา'],
 ['module.exports.sayHi = sayHello ทำให้ require ได้ค่าแบบใด?',['string เสมอ','ชื่อ sayHello เพียงอย่างเดียว','object ที่มี property sayHi เป็นฟังก์ชัน','HTML document'],2,'ชื่อที่ส่งออกคือ sayHi เรียกผ่าน object.sayHi() แม้ฟังก์ชันต้นทางชื่อ sayHello'],
 ['fs.readFile ต่างจาก fs.readFileSync อย่างไร?',['readFile ใช้ callback แบบ async; readFileSync บล็อกและคืนผลโดยตรง','ทั้งคู่บล็อกเหมือนกัน','readFileSync ใช้ได้เฉพาะใน browser','readFile ไม่รับ error'],0,'readFile เริ่มงาน I/O แล้วให้ event loop ทำงานต่อ ผลมาใน callback ส่วน readFileSync รออ่านจบก่อนทำบรรทัดต่อไป'],
 ['อ่านไฟล์ต่อกัน 1 → 2 → 3 โดยไม่บล็อก ใช้วิธีใด?',['readFileSync สามครั้ง','เรียก readFile สามครั้งพร้อมกันแล้วหวังลำดับ','เพิ่มเวลารอเท่ากัน','await fs.promises.readFile ทีละไฟล์'],3,'await ทีละงานใน async function รอผลแบบไม่บล็อก event loop; nested callback ก็ทำได้ แต่โค้ดซ้อนมากขึ้น'],
 ['https://example.com:8080/p/a?country=TH มี protocol, port, pathname อะไร?',['http:, 80, /country','https:, 8080, /p/a','https:, 443, ?country=TH','example.com, 8080, /p/a'],1,'protocol คือ https: ส่วน port ที่ระบุคือ 8080 และ pathname ไม่รวม query string'],
 ['สิ่งใดไม่มีใน Node.js แบบเดียวกับ browser?',['console.log','module http','document และ window','process'],2,'Node ไม่มี DOM ของ browser จึงไม่มี document/window ในสภาพแวดล้อม Node ปกติ'],
 ['request ขอภาพที่มีเป็นไฟล์อยู่แล้วในโมเดล static ข้ามขั้นใด?',['อ่านฐานข้อมูลและรวมข้อมูลกับ HTML template','ส่ง request','รับ response','ส่ง response'],0,'static server ส่ง resource ที่เตรียมไว้ได้โดยไม่ต้องเรียก web app/DB เพื่อสร้าง HTML ใหม่'],
 ['path.parse("/a/b/c.txt") มี name และ base อย่างไร?',['name=c.txt, base=c','name=/a/b, base=c.txt','name=c, base=/a/b/c.txt','name=c, base=c.txt'],3,'name ไม่รวมนามสกุล ส่วน base คือชื่อไฟล์พร้อมนามสกุล; dir คือ /a/b'],
 ['เทียบ req.url === "/bbq" แล้วรับ /BBQ จะได้อะไรในตัวอย่าง?',['200 และหน้า BBQ','404 เพราะตัวพิมพ์ต่างกัน','301 โดยอัตโนมัติ','เปลี่ยนเป็น /bbq เสมอ'],1,'การเทียบ string ด้วย === ตรงตามตัวอักษร จึงไม่ normalize ตัวพิมพ์หรือ slash ให้เอง'],
 ['งานใดทำให้ event loop ติดค้างได้ แม้แอปใช้ async I/O?',['รอ callback อ่านไฟล์','รอ response จากฐานข้อมูล','วนคำนวณ JavaScript หนักบน main thread','รับ request ใหม่ขณะที่รอ I/O'],2,'การคำนวณ JS บน main thread ยังบล็อก event loop ต้องแบ่งงานหรือย้ายงานคำนวณไป worker ตามความเหมาะสม']
].map(([q,options,answer,explanation])=>({q,options,answer,explanation}));
const cards=[['Node.js','JavaScript runtime นอก browser สร้างบน V8'],['Non-blocking I/O','เริ่มงาน I/O แล้วให้ event loop รับงานอื่นต่อ ระหว่างรอผล'],['CPU-bound','งานคำนวณ JS นานบน main thread ยังบล็อก event loop'],['CommonJS','ระบบ module ที่ใช้ require และ module.exports ในบทนี้'],['module.exports','ค่าที่ไฟล์อื่นได้รับเมื่อ require module นี้'],['./ ใน require','relative path ของ module ที่เขียนเอง; built-in เช่น http ไม่ต้องมี ./'],['__dirname / __filename','โฟลเดอร์ของ module / path เต็มรวมชื่อไฟล์ ใน CommonJS'],['path.parse','แยก root, dir, base, name, ext'],['host / hostname','host รวม port ที่ไม่ใช่ค่า default; hostname ไม่มี port'],['readFile / readFileSync','async callback / sync ที่บล็อกเธรด'],['req / res','ข้อมูล request ที่เข้ามา / object สำหรับตอบ response'],['res.end()','ส่งข้อมูลส่วนสุดท้ายและจบ response'],['200 / 404','สำเร็จ / ไม่พบ resource'],['listen(8081)','ให้ server ฟัง port 8081; ไม่ระบุ host ไม่ได้แปลว่ารับแค่ localhost']];
const summaries={
 1:['Client ขอ resource; server เลือก response; static ข้ามการสร้าง HTML จาก DB','IP/hostname ระบุเครื่อง ส่วน port ระบุบริการ; localhost คือเครื่องตัวเอง'],
 2:['Node.js รัน JavaScript บน V8; I/O แบบ non-blocking ช่วยรับงานหลายคำขอ','single-thread กล่าวถึงการรัน JS หลัก ไม่ได้แปลว่าทั้ง process มีเพียง thread เดียว; คำนวณหนักยังบล็อก'],
 3:['ติดตั้ง LTS แล้วตรวจด้วย node --version; รันด้วย node filename.js','__dirname และ __filename เป็นค่าประจำ module ใน CommonJS ไม่ใช่ global แบบ console'],
 4:['แต่ละ module มี scope ของตัวเอง; require ได้ค่าจาก module.exports','ชื่อ property ที่ export อาจต่างจากชื่อฟังก์ชันต้นทาง; require ของไฟล์เราใช้ ./'],
 5:['path แยก/ต่อเส้นทางไฟล์; URL แยกที่อยู่เว็บและ query string','base รวม ext แต่ name ไม่รวม; host รวม port ที่ไม่ใช่ค่า default แต่ hostname ไม่รวม'],
 6:['ตรวจ err ก่อนใช้ contents; async I/O ไม่บล็อกระหว่างรอ','เรียกอ่านพร้อมกันไม่รับประกันลำดับ; nested callback หรือ await ทีละงานจัดลำดับได้โดยไม่ใช้ Sync'],
 7:['require → createServer → listen; ใน callback ตั้ง status/header เขียนข้อมูลแล้ว end','req.url เทียบตรงตัวรวม query; ส่ง HTML ใช้ text/html และจัดการ error ใน callback อ่านไฟล์']
};
const pages=[]; let chapter=0, chapterTitle='', serial=0;
function add(title,body,id,category='learn') {pages.push({id:id || `topic-${++serial}`,title,body,chapter,chapterTitle,category});}
function quizBlock(id,body) {
 const questions=[...body.matchAll(/Q\d+\.\s*([\s\S]*?)(?=\nQ\d+\.|$)/g)].map(m=>{
  const [before,after='']=m[1].split(/\nAnswer:\s*/);
  const [answer,why='']=after.split(/\nWhy:\s*/);
  const at=before.indexOf('\n- A)');
  const q=(at<0 ? before : before.slice(0,at)).trim();
  const options=at<0 ? [] : [...before.slice(at).matchAll(/[A-D]\)\s*([\s\S]*?)(?=\s+[A-D]\)|$)/g)].map(x=>x[1].trim());
  return {q,options,answer:options.length ? 'ABCD'.indexOf(answer.trim()) : answer.trim(),explanation:why.trim()};
 });
 return quizMarkup(id,questions,false);
}
function quizMarkup(id,questions,final) {
 const fallback=questions.map(q=>`<p>${escape(q.q)}</p>${q.options?.length ? '<ul>'+q.options.map(o=>`<li>${escape(o)}</li>`).join('')+'</ul>' : ''}<details><summary>ดูเฉลย</summary><p>${escape(typeof q.answer==='number' ? q.options[q.answer] : q.answer)}</p><p>${escape(q.explanation)}</p></details>`).join('');
 if(id==='p1-ch3-quiz')return `<div class="node-review">${fallback}</div>`;
 return `<div class="node-quiz" data-node-quiz data-quiz-key="${id}"${final ? ' data-final-quiz' : ''}><div class="node-quiz-fallback">${fallback}</div><script type="application/json">${json(questions)}</script></div>`;
}
function prose(markdown,title) {
 let chunks=[],current='',size=0;
 for(const token of marked.lexer(markdown)) {
  if(token.type==='space' || token.type==='hr') continue;
  if(size+token.raw.length>1450 && current) {chunks.push(current);current='';size=0;}
  current+=token.raw+'\n\n'; size+=token.raw.length;
 }
 if(current) chunks.push(current);
 chunks.forEach((chunk,i)=>add(title+(chunks.length>1 ? ` · ${i+1}/${chunks.length}` : ''),md(chunk)));
}
source=source.replace(/:::(exam-tip|note)\n([\s\S]*?)\n:::/g,(_,kind,body)=>`\n<aside class="node-note"><strong>${kind==='exam-tip'?'ต้องจำ':'หมายเหตุ'}</strong>${md(body)}</aside>\n`);
const parts=source.split(/(?=^## |^### |^:::interactive|^:::quiz)/m);
let subsection='ก่อนเริ่มบทนี้', pending='';
for(let part of parts) {
 if(part.startsWith(':::interactive')) {
  const m=/^:::interactive\{id="([^"]+)" component="([^"]+)"\}\n([\s\S]*?)\n:::\n?([\s\S]*)/.exec(part);
  if(!m) throw new Error('Invalid activity');
  const names={Stepper:'รันโปรแกรมแรก',LiveTyper:'ทดลองส่งออกและนำเข้า module',CodeTrace:'เรียงโค้ดเว็บเซิร์ฟเวอร์'};
  const diagrams={RequestResponseSim:['Browser','Web Server','Web App','Database'],EventLoopSim:['Requests','Event loop','I/O: OS / worker pool','Response']};
  const fallback=diagrams[m[2]] ? `<figure><div class="node-diagram">${diagrams[m[2]].map(x=>`<span>${x}</span>`).join('<i>→</i>')}</div><figcaption>แผนภาพวาดใหม่ · ${m[2]==='EventLoopSim'?'event loop เริ่มงาน I/O แล้วรับ request ต่อระหว่างรอ':'request ไปยัง server; dynamic ใช้ Web App และ Database; response ส่งกลับ browser'}</figcaption></figure>` : '';
  add('ลองทำ · '+(names[m[2]]||subsection),`<div class="node-lab" data-node-lab="${m[2]}" id="lab-${m[1]}">${fallback}<p>เปิด JavaScript เพื่อทดลองกิจกรรมนี้ ตัวอย่างและคำอธิบายอยู่ในหัวข้อก่อนหน้า</p></div>`,m[1],'practice');
  if(m[4].trim().replaceAll('-','')) prose(m[4],subsection+' · จุดต้องจำ');
 } else if(part.startsWith(':::quiz')) {
  const m=/^:::quiz\{id="([^"]+)"\}\n([\s\S]*?)\n:::\n?([\s\S]*)/.exec(part);
  if(chapter && summaries[chapter] && m[1]!=='p1-final') add('สรุปบท '+chapter,`<h3>ต้องจำ</h3><p>${escape(summaries[chapter][0])}</p><h3>จุดที่มักสับสน</h3><p>${escape(summaries[chapter][1])}</p>`);
  add(m[1]==='p1-final' ? 'ลองตอบด้วยตัวเอง · ท้าย Part I' : `ทบทวนบท ${chapter}`,quizBlock(m[1],m[2]),m[1]);
  if(m[3].trim().replaceAll('-','')) prose(m[3],subsection);
 } else if(/^## /.test(part)) {
  const [head,...rest]=part.split('\n');
  const n=/บทที่ (\d+) — (.+)/.exec(head);
  if(n) {chapter=Number(n[1]);chapterTitle=n[2];}
  else {chapter=0;chapterTitle='สรุปท้าย Part I';}
  subsection=head.replace(/^## /,'');
  if(rest.join('\n').trim().replaceAll('-','')) prose(rest.join('\n'),subsection);
 } else if(/^### /.test(part)) {
  const [head,...rest]=part.split('\n');subsection=head.replace(/^### /,'');
  if(rest.join('\n').trim()) prose(rest.join('\n'),subsection);
 } else prose(part.replace(/^\s*# .+\n/,''),'ก่อนเริ่มบทนี้');
}
for(const page of pages) if(page.body.includes(':::')) throw new Error('Unrendered content directive: '+page.id);
pages[0].id='before-start';
pages[0].body='<p>ก่อนเริ่มบทนี้ ทบทวนตัวแปร ฟังก์ชัน และ callback จากบท 6–8 ตัวอย่างในบทนี้ใช้ <strong>CommonJS</strong> และเป็นแบบจำลองในเบราว์เซอร์</p><dl><dt>Runtime</dt><dd>สภาพแวดล้อมที่ใช้รันโค้ด</dd><dt>I/O</dt><dd>งานรับส่งข้อมูล เช่น อ่านไฟล์หรือคุยกับฐานข้อมูล</dd></dl>'+pages[0].body;
add('Flashcards',`<p>กดคำศัพท์เพื่อพลิกดูความหมาย</p><button id="flashcard" class="flashcard" type="button" aria-pressed="false"><span id="flash-label"></span><strong id="flash-text"></strong></button><div class="node-controls"><button class="btn" id="flash-prev">← ก่อนหน้า</button><span id="flash-position" aria-live="polite"></span><button class="btn" id="flash-next">ถัดไป →</button></div>`,'flashcards');
add('Quiz ท้ายบท · 10 ข้อ','<p class="node-muted">เสริมความเข้าใจ · ชุดปรนัยเรียบเรียงเพิ่มเพื่อฝึกทบทวน กดตอบและดูเฉลยทีละข้อ</p>'+quizMarkup('final-scored',finalQuiz,true),'quiz');
const template=read('subjects/itds241/chapter-08.html');
let html=template.slice(0,template.indexOf('<aside class="toc"'));
html=html.replaceAll('บท 6–8','บท 6–9').replace('<title>บท 8 · Modern JavaScript · Study Garden</title>','<title>บท 9 · Node.js Part I · Study Garden</title>');
html=html.replace('data-chapter="08"','data-chapter="09" data-reader-mode="paged"');
html=html.replace('<span>บทที่ 8</span>','<span>บทที่ 9</span>');
html=html.replace(/<header class="chapter-hero">[\s\S]*?<\/header>/,`<header class="chapter-hero"><div class="eyebrow">CHAPTER 09 · LECTURE 09</div><h1>Node.js Part I</h1><p>จาก JavaScript สู่เว็บเซิร์ฟเวอร์แรก · อ่านและลองทำทีละเรื่อง</p><div class="tags"><span class="tag" data-chapter-status="09">ยังไม่ได้อ่าน</span><span class="node-muted">7 บทย่อย · ${pages.length} หน้าสั้น · Quiz 10 ข้อ</span></div></header>`);
html=html.replace(/<script\s+defer\s+src="https:\/\/cdn.jsdelivr.net[\s\S]*?<\/script>/,'').replace(/<script defer src="\.\.\/\.\.\/assets\/labs.js[^>]*><\/script>/,'');
html=html.replace('</head>','<link rel="stylesheet" href="../../assets/nodejs.css"><script defer src="../../assets/nodejs-core.js"></script><script defer src="../../assets/nodejs.js"></script></head>');
html+=`<aside class="toc" aria-label="สารบัญบทเรียน"><h2>ในบทนี้</h2>${pages.map(p=>`<a href="#${p.id}">${escape(p.title.replaceAll('`',''))}</a>`).join('')}</aside><article class="lesson-content">`;
html+=pages.map(p=>`<section class="lesson-section" id="${p.id}"${p.category==='practice'?' data-reader-category="practice"':''}>${p.chapter?`<p class="node-chapter-label">บท ${p.chapter} · ${escape(p.chapterTitle)}</p>`:''}<h2>${md(p.title).replace(/^<p>|<\/p>\n?$/g,'')}</h2>${p.body}</section>`).join('\n');
html+='<button class="btn soft" data-mark-read aria-pressed="false">ทำเครื่องหมายว่าอ่านแล้ว ✓</button><nav class="chapter-end" aria-label="เปลี่ยนบท"><a class="btn" href="chapter-08.html">← บทก่อนหน้า</a><a class="btn primary" href="index.html">กลับไปดูความคืบหน้า →</a></nav></article></div></main>';
html+=template.slice(template.indexOf('<div class="footer-reveal">'));
write('subjects/itds241/chapter-09.html',html);
// Add the chapter to the existing content registry, so all course dashboards see it.
const registry=read('assets/content.js').replace(/\n\/\* Node\.js Part I registry \*\/[\s\S]*$/,'');
const partII=read('assets/content.js').match(/\/\* Node\.js Part II registry \*\/[\s\S]*?\/\* End Node\.js Part II registry \*\//)?.[0] || '';
write('assets/content.js',registry+'\n/* Node.js Part I registry */\nwindow.StudyContent.itds241["09"] = '+JSON.stringify({cards,quiz:finalQuiz},null,2)+';\n'+partII+'\n');
write('docs/nodejs-part1-pages.json',JSON.stringify(pages.map(({id,title,chapter,category})=>({id,title,chapter,category})),null,2)+'\n');
console.log(`Generated chapter 09: ${pages.length} pages, ${cards.length} flashcards, 10 final quiz questions.`);
