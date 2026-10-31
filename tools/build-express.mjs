import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {enhanceLesson} from './install-final-learning.mjs';
const {marked}=await import(process.env.STUDY_GARDEN_MARKED||'marked');
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8'),write=(p,s)=>writeFileSync(new URL(p,root),s);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const md=s=>marked.parse(s).replaceAll('<table>','<div class="table-wrap" tabindex="0" aria-label="ตารางทบทวน"><table>').replaceAll('</table>','</table></div>');
const quiz=[
 ['Express ต่างจาก Node.js อย่างไร?',['เป็น framework ที่ทำงานบน Node.js','เป็น browser engine','แทนระบบปฏิบัติการ','เป็นฐานข้อมูล'],0,'Node.js คือ runtime ส่วน Express ช่วยจัดการ web application และ routing บน runtime นั้น'],
 ['คำสั่งใดสร้าง package.json แบบใช้ค่าเริ่มต้น?',['npm start','npm install nodemon','npm init -y','node app.cjs'],2,'npm init -y สร้างข้อมูลโครงการตามค่าเริ่มต้น ไม่ได้เริ่ม server หรือติดตั้ง Express'],
 ['สั่ง npm start แล้วทำงานจากที่ใด?',['ชื่อโฟลเดอร์ html','scripts.start ใน package.json','คำสั่งใน CSS','req.body'],1,'npm start เรียกคำสั่ง start ที่กำหนดใน scripts เช่น node app.cjs หรือ nodemon app.cjs'],
 ['มีเพียง router.get("/add", handler) การส่ง POST /add จะตรงหรือไม่?',['ตรงทุก method','ตรงเมื่อมี query','ตรงถ้ามีพอร์ต 3000','ไม่ตรง เพราะ method ต่างกัน'],3,'Route ผูกทั้ง method และ path การกำหนด GET ไม่ได้สร้าง POST handler ให้เอง'],
 ['ต้องการส่งไฟล์ HTML ด้วย absolute path ใช้อะไร?',['res.sendFile(path.join(__dirname,"html","shabu.html"))','req.query("shabu.html")','express.json("shabu.html")','npm start html'],0,'sendFile ใช้ส่งไฟล์ ส่วน path.join กับ __dirname ให้ absolute path ในตัวอย่าง CommonJS นี้'],
 ['วาง middleware ส่ง 404 ก่อน routes และไม่เรียก next() จะเกิดอะไรขึ้น?',['ส่งต่อทุก route','ทำให้ทุก route เป็น GET','คำขอจบก่อนถึง route ที่อยู่หลัง','ติดตั้ง router เพิ่ม'],2,'Middleware ประมวลผลตามลำดับ เมื่อส่ง response จบแล้วและไม่ส่งต่อ handler หลังจากนั้นจะไม่ทำงาน'],
 ['mount static ที่ /assets และมี public/mystyle.css ต้องขอ URL ใด?',['/public/mystyle.css','/assets/mystyle.css','/assets/public/mystyle.css','/mystyle.css เท่านั้น'],1,'URL ใช้ mount prefix ตามด้วย path ภายใน public โดยไม่รวมชื่อโฟลเดอร์ public อีกครั้ง'],
 ['mount product router ที่ /product และ route ภายในคือ /add จะใช้ path ใด?',['/add/product','/product/product/add','/add','/product/add'],3,'Mount prefix รวมกับ route ภายในทำให้ endpoint เป็น /product/add แยกจาก /user/add ของ router อื่น'],
 ['GET form มี input name="fname" ควรอ่านค่าจากไหน?',['req.query.fname','req.body เสมอ','res.fname','input.id บน server'],0,'GET form ส่งคู่ name/value ใน query string จึงอ่านจาก req.query และต้องตรวจค่าก่อนใช้งาน'],
 ['ฟอร์ม HTML POST แบบปกติต้องใช้ parser ใดก่อน handler?',['express.static()','express.Router() อย่างเดียว','express.urlencoded()','express.json() อย่างเดียว'],2,'Form ปกติส่ง application/x-www-form-urlencoded จึงใช้ urlencoded ส่วน JSON parser รับ JSON ตาม Content-Type']
].map(([q,options,answer,explanation])=>({q,options,answer,explanation}));
const cards=[['Express','Web application framework บน Node.js'],['npm init','สร้าง package.json ของโครงการ'],['package-lock.json','บันทึก dependency tree เพื่อการติดตั้งซ้ำ'],['nodemon','เครื่องมือพัฒนา: ตรวจไฟล์แล้ว restart server'],['express()','สร้าง Express application'],['express.Router()','สร้าง router สำหรับจัดกลุ่มเส้นทาง'],['Route','HTTP method และ path ที่เลือก handler'],['Middleware','ฟังก์ชันในลำดับ request ที่ใช้ req/res/next'],['res.send / res.sendFile','ส่งข้อมูล / ส่งไฟล์ตาม path'],['express.static','ให้บริการไฟล์จาก directory ที่ระบุ'],['Mount prefix','ส่วนต้น URL ที่เพิ่มให้ router หรือ static middleware'],['action / method','ปลายทางการส่งฟอร์ม / HTTP method'],['name','ชื่อ key ของข้อมูล input ที่ส่ง'],['req.query','ค่าจาก query string'],['req.body','ข้อมูล body หลัง parser ที่เหมาะสม'],['urlencoded / json','parser ของ form ปกติ / parser ของ JSON']];
const pages=read('subjects/itds241/part2-express-framework/content.md').replace(/^# .*\n/,'').split(/^## /m).filter(x=>x.trim()).map((part,i)=>{
 const at=part.indexOf('\n'),title=part.slice(0,at).trim(),text=part.slice(at+1).trim(),lab=/^:::lab (\w+)$/m.exec(text);
 return {id:i===0?'before-start':lab?'p2-'+lab[1]:`p2-topic-${i}`,title,body:lab?`<div class="node-lab" data-express-lab="${lab[1]}"><p>เปิด JavaScript เพื่อทดลองแบบจำลอง เนื้อหาข้างต้นอ่านได้ตามปกติ</p></div>`:md(text),practice:Boolean(lab)};
});
const add=(id,title,body)=>pages.push({id,title,body});
add('flashcards','Flashcards',`<p>กดพลิกคำศัพท์เพื่อทบทวน</p><button id="flashcard" class="flashcard" aria-pressed="false"><span id="flash-label"></span><strong id="flash-text"></strong></button><div class="node-controls"><button class="btn" id="flash-prev">← ก่อนหน้า</button><span id="flash-position" aria-live="polite"></span><button class="btn" id="flash-next">ถัดไป →</button></div>`);
add('quiz','Quiz ท้ายบท · 10 ข้อ',`<p>แบบฝึกทบทวนที่เรียบเรียงเพิ่ม ไม่ใช่ข้อสอบทางการ</p><div class="node-quiz" data-node-quiz data-quiz-key="p2-final" data-final-quiz><div class="node-quiz-fallback">${quiz.map(q=>`<p>${esc(q.q)}</p><ul>${q.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ul><details><summary>ดูเฉลย</summary><p>${esc(q.options[q.answer])} · ${esc(q.explanation)}</p></details>`).join('')}</div><script type="application/json">${JSON.stringify(quiz).replaceAll('<','\\u003c')}</script></div>`);
const template=read('subjects/itds241/chapter-09.html');
let html=template.slice(0,template.indexOf('<aside class="toc"'))
 .replaceAll('data-chapter="09"','data-chapter="10"').replace('บท 9 · Node.js Part I','บท 10 · Node.js Part II').replace('<span>บทที่ 9</span>','<span>บทที่ 10</span>')
 .replace(/<header class="chapter-hero">[\s\S]*?<\/header>/,`<header class="chapter-hero"><div class="eyebrow">CHAPTER 10 · LECTURE 10</div><h1>Node.js Part II · Express</h1><p>สร้าง server จัด routes และรับฟอร์ม GET/POST ทีละเรื่อง</p><div class="tags"><span class="tag" data-chapter-status="10">ยังไม่ได้อ่าน</span><span class="node-muted">${pages.length} หน้าสั้น · 6 กิจกรรม · Quiz 10 ข้อ</span></div></header>`)
 .replace('</head>','<script defer src="../../assets/express-core.js"></script><script defer src="../../assets/express-labs.js"></script></head>');
html+=`<aside class="toc" aria-label="สารบัญบทเรียน"><h2>ในบทนี้</h2>${pages.map(p=>`<a href="#${p.id}">${esc(p.title)}</a>`).join('')}</aside><article class="lesson-content">`;
html+=pages.map(p=>`<section class="lesson-section" id="${p.id}"${p.practice?' data-reader-category="practice"':''}><h2>${esc(p.title)}</h2>${p.body}</section>`).join('\n');
html+='<button class="btn soft" data-mark-read aria-pressed="false">ทำเครื่องหมายว่าอ่านแล้ว ✓</button><nav class="chapter-end" aria-label="เปลี่ยนบท"><a class="btn" href="chapter-09.html">← Node.js Part I</a><a class="btn primary" href="chapter-11.html">L11 · Node.js Part III →</a></nav></article></div></main>';
html+=template.slice(template.indexOf('<div class="footer-reveal">'));write('subjects/itds241/chapter-10.html',enhanceLesson(html,'itds241/10'));
const registry=read('assets/content.js').replace(/\n\/\* Node\.js Part II registry \*\/[\s\S]*?\/\* End Node\.js Part II registry \*\/\n?/,'').replace(/\n\/\* Webtech labels \*\/[\s\S]*?\/\* End Webtech labels \*\/\n?/,'');
write('assets/content.js',registry+'\n/* Node.js Part II registry */\nwindow.StudyContent.itds241["10"] = '+JSON.stringify({cards,quiz},null,2)+';\n/* End Node.js Part II registry */\n');
write('docs/nodejs-part2-pages.json',JSON.stringify(pages.map(({id,title,practice})=>({id,title,practice})),null,2));
console.log(`Built Part II: ${pages.length} pages, 6 labs, ${cards.length} cards, ${quiz.length} questions.`);
