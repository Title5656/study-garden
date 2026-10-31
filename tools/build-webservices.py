"""Authoring source for ITDS241 L11-L13. Run from any working directory."""
from pathlib import Path
from html import escape as e
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
def code(s): return '<pre><code>'+e(s.strip())+'</code></pre>'
def flow(*items):return '<figure><div class="ws-flow">'+'<span aria-hidden="true">→</span>'.join('<b>'+s+'</b>' for s in items)+'</div><figcaption>อ่านตามลูกศรเพื่อเชื่อมบทบาทและลำดับการทำงาน</figcaption></figure>'
def table(headers,rows):return '<div class="ws-table" tabindex="0" role="region" aria-label="ตารางเปรียบเทียบ เลื่อนเพื่ออ่าน"><table><thead><tr>'+''.join('<th>'+s+'</th>' for s in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+s+'</td>' for s in row)+'</tr>' for row in rows)+'</tbody></table></div>'
def lab(kind,title,body,fallback):return f'<div class="ws-lab" data-ws-lab="{kind}"><h3>{title}</h3>{body}<p role="status" aria-live="polite">{fallback}</p><small>แบบจำลองเพื่อเรียนรู้บนหน้านี้ ไม่ส่งข้อมูลจริง ไม่เชื่อม server หรือฐานข้อมูล และไม่บันทึกข้อมูลส่วนบุคคล</small></div>'
def btn(action,label):return f'<button class="btn" type="button" data-ws-action="{action}">{label}</button>'
def options(name,label,pairs):return '<label>'+label+f'<select name="{name}">'+''.join(f'<option value="{e(a)}">{b}</option>' for a,b in pairs)+'</select></label>'
def note(s):return '<p class="ws-note">'+s+'</p>'
LESSONS={}
def lesson(id,title,subtitle,source):
 d={'id':id,'title':title,'subtitle':subtitle,'source':source,'sections':[],'cards':[],'quiz':[]};LESSONS[id]=d;return d
def sec(d,id,title,pages,body):d['sections'].append({'id':id,'title':title,'pages':pages,'body':body})
def checks(d,rows):
 for q,choices,answer,why in rows:d['quiz'].append(dict(q=q,options=choices,answer=answer,explanation=why))

d=lesson('11','Node.js Part III','จำผู้ใช้ข้าม request และเชื่อมข้อมูลถาวรด้วย MySQL','69-1-ITDS241-Lecture11-Node.js-Part-III.pdf')
sec(d,'start','จากเว็บที่ตอบได้ สู่เว็บที่จำสถานะได้','2–11','''<p>ร้านค้าออนไลน์ต้องจำว่าตะกร้าเป็นของใคร แม้ผู้ใช้เปิดหน้าใหม่ และต้องเก็บรายการสินค้าไว้แม้ server หยุดทำงาน บทนี้แยกปัญหาออกเป็น <strong>configuration, สถานะชั่วคราว และข้อมูลถาวร</strong> แล้วเลือก .env, cookie/session และฐานข้อมูลให้ถูกหน้าที่</p><p>ก่อนอ่านควรรู้ route, middleware และ req/res จาก L9–L10 เมื่อจบบทควรอธิบายได้ว่าข้อมูลอยู่ฝั่งไหน คาดการณ์ตัวนับ session และไล่เส้นทาง Express → SQL → JSON ได้</p>'''+flow('Browser<br>แสดงผล + cookie','Express<br>route + session','MySQL<br>ข้อมูลถาวร')+'''<p>Express ช่วย routing และ API; template engine เช่น EJS/Pug แทนค่าตัวแปรเป็น HTML ก่อนส่งให้ browser ส่วน API อาจส่ง JSON ให้ client ไปสร้างหน้าตาเอง</p>''')
sec(d,'config','ตั้งค่าโครงการโดยไม่ผูกกับเครื่อง','9–14','''<p><strong>Environment variable</strong> คือคู่ชื่อและค่าที่แยก configuration ออกจาก source code เช่น PORT และ MYSQL_HOST โค้ดชุดเดียวจึงทำงานกับเครื่องพัฒนาและเครื่องอื่นได้โดยเปลี่ยนค่า ไม่ต้องแก้ route</p>'''+code('''npm init -y
npm install express dotenv cookie-parser express-session mysql2
npm install --save-dev nodemon''')+'''<p><code>npm install</code> ติดตั้ง dependencies; <code>npm uninstall ชื่อแพ็กเกจ</code> เอาออก ส่วน <code>npm start</code> เรียก scripts.start เช่น <code>nodemon app.cjs</code> ใน package.json; nodemon มีหน้าที่ restart ระหว่างพัฒนา</p>'''+code('''// app.cjs (CommonJS)
require('dotenv').config(); // โหลดก่อนอ่าน process.env
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Ready'));
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Port ${port}`));''')+code('''# .env: ข้อมูลตัวอย่าง ไม่ใช่ credentials จริง
PORT=3000
MYSQL_HOST=localhost
MYSQL_USERNAME=webapp
MYSQL_PASSWORD=replace-locally
MYSQL_DATABASE=tinycollege''')+note('ค่าใน process.env เป็นข้อความ ต้องแปลงเมื่อจำเป็น .env ไม่ใช่การเข้ารหัส: เก็บนอก Git และใช้ .env.example ที่ไม่มี secret แทน สไลด์หน้า 10 พิมพ์ npm init &lt;package&gt; ในขั้นติดตั้ง; คำสั่งที่ถูกคือ npm install &lt;package&gt;'))
sec(d,'cookies','Cookie เชื่อม request ได้อย่างไร','15–29','''<p>HTTP เป็น <strong>stateless</strong>: request ใหม่ไม่ได้มีความทรงจำของ request ก่อนโดยอัตโนมัติ Server จึงส่ง <code>Set-Cookie</code> ใน response ให้ browser เก็บ แล้ว browser ส่ง <code>Cookie</code> กลับตามขอบเขต domain/path และเงื่อนไขของ cookie เพื่อให้แอปเชื่อมคำขอได้</p>'''+flow('Response<br>Set-Cookie: theme=dark','Browser<br>เก็บ theme=dark','Request ถัดไป<br>Cookie: theme=dark')+code('''const cookieParser = require('cookie-parser');
app.use(cookieParser()); // ก่อน route ที่อ่าน req.cookies
app.get('/set-cookie', (req, res) => {
  res.cookie('theme', 'dark', { maxAge: 360000, sameSite: 'lax' });
  res.send('Cookie sent');
});
app.get('/show-cookie', (req, res) => res.json(req.cookies));
app.get('/clear-cookie', (req, res) => {
  res.clearCookie('theme');
  res.send('Cookie cleared');
});''')+'''<p><code>res.cookie()</code> สร้าง header ส่วน cookie-parser อ่าน header ที่มากับ request เป็น <code>req.cookies</code> ไม่ได้เป็นสิ่งจำเป็นสำหรับการส่ง Set-Cookie เอง ตรวจใน DevTools → Application → Cookies แล้วเปิด /show-cookie ใน request ถัดไปจึงจะเห็นค่าที่ส่งกลับ</p>'''+table(['ตัวเลือก','ความหมาย'],[['maxAge','อายุเป็นมิลลิวินาที เช่น 360000 = 6 นาที'],['expires','วันหมดอายุ ใช้ Date เช่น new Date(Date.now() + 360000)'],['httpOnly','ไม่ให้ JavaScript ในหน้าอ่าน cookie ผ่าน document.cookie'],['secure','ส่งผ่าน HTTPS เป็นหลัก เหมาะกับระบบจริง'],['sameSite','กำหนดเงื่อนไขส่ง cookie ข้าม site ช่วยลดบางกรณีของ CSRF']])+note('อธิบายเสริม: สไลด์หน้า 26 ใช้ expire; Express ใช้ expires และรับ Date การ clear ต้องตรงชื่อและขอบเขตเดิม เช่น path/domain การมี cookie ชื่อ tokenID อย่างเดียวตาม demo ไม่ได้พิสูจน์ว่า login ถูกต้อง ผู้ใช้แก้ข้อมูลฝั่ง client ได้ ต้องตรวจหลักฐานฝั่ง server'))
sec(d,'session','Session: browser ถือบัตร ส่วนข้อมูลอยู่ server','30–34','''<p><strong>Session</strong> เก็บสถานะบน server เช่น numviews โดย browser ถือเพียง session ID ที่ใช้ค้นข้อมูล ไม่ได้ถือ object session ทั้งก้อน express-session จัดการ ID และการเข้าถึงผ่าน <code>req.session</code>; secret ใช้ลงลายเซ็น ID ไม่ใช่เข้ารหัสข้อมูลทุกอย่าง</p>'''+code('''const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));
app.get('/pageview', (req, res) => {
  req.session.numviews = (req.session.numviews || 0) + 1;
  res.json({ views: req.session.numviews });
});''')+'''<p>เพิ่ม SESSION_SECRET เป็นค่าสุ่มยาวใน .env ก่อนรัน สไลด์ใช้ saveUninitialized: true; ตัวอย่างนี้เลือก false เพื่อไม่บันทึก session ที่ยังไม่เปลี่ยนแปลง ส่วน resave: false ไม่บังคับบันทึกซ้ำเมื่อไม่มีการแก้ ทั้งนี้การต่ออายุขึ้นกับ store ด้วย MemoryStore เริ่มต้นเหมาะกับพัฒนา เมื่อ restart ข้อมูลในหน่วยความจำหาย จึงไม่ใช้เป็น session store ของระบบจริง</p><p><strong>คาดการณ์ก่อนลอง:</strong> เปิดหน้าเดิมสองครั้งแล้วลบ cookie ตัวนับครั้งถัดไปจะต่อจากเดิมหรือเริ่มใหม่? แล้วถ้า cookie ยังอยู่แต่ store หายจะเกิดอะไรขึ้น?</p>'''+lab('session','ตามรอย ID และตัวนับ','''<div class="ws-columns"><div data-client>Browser: ยังไม่มี ID</div><div data-server>Server: {}</div></div><div class="ws-controls">'''+btn('request','ส่ง request')+btn('forget','ลบ cookie')+btn('restart','Restart server')+btn('logout','Logout: ลบ session')+btn('reset','เริ่มใหม่')+'</div>','เมื่อส่งครั้งแรกได้ 1 ครั้งถัดไปได้ 2 ลบ cookie หรือ store แล้ว request ใหม่เริ่ม 1')+'''<p>ลบ cookie ทำให้ browser หา session เดิมไม่เจอ แต่ record เดิมอาจยังอยู่จน store ล้างตามอายุ ส่วน logout ที่สมบูรณ์ต้องทำลาย session ฝั่ง server และล้าง cookie ที่เกี่ยวข้อง ไม่ใช่ลบตัวแปรในหน้าเว็บอย่างเดียว แบบจำลองนี้ย่อขั้นตอนการ save และสร้าง ID เพื่อให้เห็นความสัมพันธ์</p>''')
sec(d,'database','ทำไมต้องมีฐานข้อมูลนอก session','35–44','''<p>Session เหมาะกับบริบทผู้ใช้ชั่วคราว แต่ตารางรายวิชาต้องเก็บอย่างเป็นระบบและมีความสัมพันธ์ <strong>Relational database</strong> เก็บข้อมูลเป็นตาราง เชื่อมกันด้วย keys และใช้ SQL เลือกหรือแก้ข้อมูล MySQL Server คือระบบที่รับ query; MySQL Workbench คือเครื่องมือให้คนจัดการ server ไม่ใช่ตัวฐานข้อมูลที่ Express ต้องเปิดหน้าต่างไว้</p><p>ตัวอย่าง tinycollege มี Department, Professor, Student, Course, Class และ Enroll: อาจารย์ทำงานในภาควิชาและเป็นหัวหน้าได้ นักศึกษาสังกัดภาคและมีอาจารย์ที่ปรึกษา Course เปิดโดยภาควิชา แต่ Class คือกลุ่มเรียนของ Course ที่มีอาจารย์สอน นักศึกษาหลายคนลงได้หลาย Class จึงใช้ Enroll เชื่อม ไม่ควรเก็บรายชื่อนักศึกษาทั้งหมดเป็นข้อความในแถว Class</p>'''+flow('Student<br>นักศึกษาหนึ่งคน','Enroll<br>เชื่อมการลงทะเบียน','Class → Course<br>กลุ่มเรียนของรายวิชา')+'''<p>เตรียม schema/tables ด้วย script หรือ Workbench แล้วสร้างบัญชีแอปที่ระบุ user/password/host ให้สิทธิ์เฉพาะ schema และ SQL ที่ต้องใช้ การใช้บัญชี root เพื่อจัดการครั้งแรกไม่ได้หมายความว่าควรให้เว็บใช้ root ตลอด</p>''')
sec(d,'sql','จาก request ผ่าน query กลับเป็น JSON','39–50','''<p><code>SELECT</code> อ่านข้อมูล, <code>INSERT</code> เพิ่ม, <code>UPDATE</code> แก้, <code>DELETE</code> ลบ; <code>WHERE</code> กรองแถว, <code>GROUP BY</code> จัดกลุ่ม, <code>HAVING</code> กรองกลุ่ม และ <code>ORDER BY</code> เรียงผล ตัวอย่างนี้อ่านชื่อและรหัสวิชาเฉพาะภาค CIS</p>'''+code('''const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
app.get('/cis-courses', (req, res, next) => {
  connection.query(
    'SELECT course_code, course_name FROM Course WHERE dept_code = ?',
    ['CIS'],
    (err, rows) => {
      if (err) return next(err);
      res.json(rows);
    }
  );
});
app.use((err, req, res, next) => {
  res.status(500).json({ error: true, message: 'Database operation failed' });
});''')+'''<p>callback ได้ error หรือผล query เมื่อฐานข้อมูลตอบกลับ จึงต้องส่ง response ภายใน callback หลังตรวจ error ไม่ใช่ส่ง rows ก่อนงานเสร็จ SELECT ได้อาร์เรย์แถว; INSERT ได้ผลการเขียน เช่น affectedRows และอาจมี insertId ไม่ใช่ชุดแถวแบบ SELECT</p>'''+code('''// ตัวอย่าง SQL สำหรับเพิ่มรายวิชา: ส่งค่าผ่าน placeholders
connection.query(
  'INSERT INTO Course (course_code, course_name, crs_credit, dept_code) VALUES (?, ?, ?, ?)',
  ['CIS-223', 'Introduction to Web Development', 3, 'CIS'],
  (err, result) => { /* ตรวจ err แล้วอ่าน result.affectedRows */ }
);''')+note('สไลด์หน้า 49 ใช้ GET เพิ่มข้อมูลเพื่อสาธิต และ redirect /cis-course ไม่ตรง route /cis-courses บทเรียนแยกให้เห็นว่าระบบจริงควรใช้ POST สำหรับเพิ่มข้อมูล และใช้ path ให้ตรงกัน อย่าต่อ input ผู้ใช้ลง SQL โดยตรง; mysql2 มี Promise API สำหรับ async/await ด้วย'))
sec(d,'recap','เลือกที่เก็บให้ตรงอายุและหน้าที่','12–50',table(['ข้อมูล','ที่เก็บที่เหมาะ','เพราะอะไร'],[['สีธีม','cookie หรือ localStorage','ให้ client จำความชอบ'],['จำนวนเข้าชมใน session','session store','ผูกกับ session ID ของผู้ใช้'],['รายวิชาที่เปิดสอน','ฐานข้อมูล','ข้อมูลถาวรและสัมพันธ์กัน'],['รหัสผ่าน DB / secret','environment configuration','ใช้ฝั่ง server ไม่ส่งเป็น JSON กลับไป']])+'''<p>ลองอธิบายว่า “cookie ถูกลบ” ต่างจาก “ฐานข้อมูลถูกลบ” อย่างไร ถ้าคิดว่าตัวนับและรายวิชาจะหายพร้อมกัน ให้กลับไปแยก browser, session store และ MySQL อีกครั้ง</p>''')
d['cards']=[['Environment variable','คู่ชื่อ/ค่าที่แยก configuration ออกจากโค้ด อ่านผ่าน process.env'],['Set-Cookie / Cookie','response ขอให้ browser เก็บ / request ส่งค่าที่เข้าเงื่อนไขกลับ'],['cookie-parser','อ่าน Cookie header เป็น req.cookies ไม่ใช่ตัวจัดเก็บ session'],['maxAge','อายุ cookie หน่วยมิลลิวินาทีใน Express'],['Session ID','กุญแจอ้างอิงสถานะบน server ไม่ใช่ข้อมูล session ทั้งก้อน'],['MemoryStore','session store ในหน่วยความจำสำหรับพัฒนา restart แล้วข้อมูลหาย'],['MySQL Server / Workbench','ระบบฐานข้อมูล / เครื่องมือจัดการฐานข้อมูล'],['SQL placeholder','ตำแหน่งค่าที่แยกจากข้อความ SQL ไม่ต่อ input ตรง ๆ'],['affectedRows','จำนวนแถวที่ผลการเขียนรายงาน ไม่ใช่แถวข้อมูล SELECT'],['dotenv','โหลดค่าจาก .env เข้า process.env ก่อนใช้งาน']]
checks(d,[('ติดตั้ง dotenv ใช้คำสั่งใด?',['npm init dotenv','npm install dotenv','node dotenv init','npm start dotenv'],1,'npm install เพิ่มแพ็กเกจ ส่วน npm init สร้าง package.json'),('server ขอให้ browser เก็บ cookie ผ่านอะไร?',['req.body','Cookie ใน response','Set-Cookie ใน response','SQL INSERT'],2,'Set-Cookie อยู่ใน response ส่วน Cookie ส่งกลับใน request ตามเงื่อนไข'),('cookie-parser ช่วยอะไร?',['สร้าง MySQL','เข้ารหัสทุก cookie','เก็บ session ใน DB','แปลง Cookie header เป็น req.cookies'],3,'การอ่าน req.cookies ต้องมี parser แต่การส่ง cookie ไม่ต้องอาศัย parser'),('maxAge: 360000 เท่ากับกี่นาที?',['6','60','360','0.36'],0,'Express ใช้มิลลิวินาที: 360000 / 1000 / 60 = 6 นาที'),('express-session เก็บข้อมูล numviews ที่ไหนโดยแนวทางนี้?',['URL','server store','CSS','ตัว cookie ทั้ง object'],1,'cookie ถือ session ID ส่วน numviews อยู่ใน server store'),('restart server ที่ใช้ MemoryStore แล้วจะเกิดอะไร?',['MySQL หาย','cookie ทุกเว็บหาย','ข้อมูล session ในหน่วยความจำหาย','JS ถูกลบ'],2,'MemoryStore อยู่ใน process ของ server และไม่ใช่ข้อมูลถาวร'),('dotenv.config() ควรเรียกเมื่อไร?',['หลัง query เสร็จ','หลัง res.send','ก่อนอ่าน process.env ที่พึ่ง .env','เฉพาะ browser'],2,'ต้องโหลด configuration ก่อนนำค่ามาสร้าง connection หรือ session'),('SELECT ไม่พบแถว ผลปกติเป็นอะไร?',['อาร์เรย์ว่าง','affectedRows 1','ลบตาราง','401 เสมอ'],0,'SELECT สำเร็จแต่ไม่พบข้อมูลต่างจาก query ล้มเหลว'),('ตัวเลือกใดตรงกับวันหมดอายุ cookie ใน Express?',['expire: 100','expires: new Date(...)','expiry: true','ttl: 6'],1,'expires รับ Date ส่วน maxAge รับอายุเป็นมิลลิวินาที'),('ทำไมไม่ควรเช็กแค่มี cookie tokenID แล้วให้ผ่าน?',['cookie อ่านไม่ได้เสมอ','MySQL ไม่รู้จัก cookie','cookie ใช้ได้แค่ CSS','ผู้ใช้แก้ข้อมูล client ได้ ต้องตรวจหลักฐาน'],3,'การมีชื่อ cookie ไม่พิสูจน์ว่า server ออกหลักฐานที่ถูกต้องและยังใช้ได้')])

d=lesson('12','Web Services','อ่าน HTTP ให้ออก แปลงข้อมูลด้วย JSON และเข้าใจการออกแบบ REST','ITDS241-Lecture12-Web Services.pdf')
sec(d,'start','จากหน้าเว็บสำหรับคน สู่บริการสำหรับโปรแกรม','4–11, 55–58','''<p>หน้ารายชื่อนักศึกษาใน HTML เหมาะกับคนอ่าน แต่แอปมือถือและเว็บอื่นต้องการข้อมูลที่แปลงเป็นโครงสร้างได้ <strong>Web service</strong> จึงเปิดจุดติดต่อให้โปรแกรมสื่อสารผ่านเครือข่าย ส่วน <strong>API</strong> คือสัญญาการเรียกใช้ที่กว้างกว่าและอาจใช้ภายในเครื่องได้ ทุก web service เป็น API แต่ไม่ใช่ทุก API ต้องเป็น web service</p><p>ระบบมี presentation (หน้าตา), application/business logic (กติกา) และ resource/data management (ข้อมูล) แบบ 1-tier รวมบนเครื่องเดียว; 2-tier แบ่ง client/server และวาง logic ได้ทั้งสองฝั่ง; 3-tier แยก UI, application, DB; n-tier เพิ่มชั้นเพื่อกระจายงานและรองรับการขยาย</p>'''+flow('Presentation<br>แสดงข้อมูล','Application<br>ใช้กติกา','Data layer<br>จัดเก็บ/ค้นหา')+'''<p>Layer คือการแบ่งหน้าที่ ส่วน tier เน้นการแยกส่วนที่นำไปรัน ความเป็นอิสระช่วยพัฒนาและขยายแยกกัน แต่เพิ่มการสื่อสารและความซับซ้อน ไม่ใช่ยิ่งหลายชั้นยิ่งดีทุกงาน</p>''')
sec(d,'http','HTTP: แยกบรรทัดแรก header และ body','12–31','''<p>HTTP เป็นกติกาการแลกเปลี่ยนข้อความ request/response ที่ขยายข้อมูลผ่าน headers ได้ แม้โปรโตคอลไม่มีความจำ request ก่อน แต่แอปสร้าง session ได้ MIME type เช่น application/json บอกชนิดข้อมูลเพื่อให้ผู้รับตีความถูก ตัวอย่างต่อไปเป็นรูปแบบ HTTP/1.1 เพื่ออ่านง่าย ไม่ใช่ wire format ของ HTTP ทุกเวอร์ชัน</p>'''+code('''POST /students HTTP/1.1
Host: localhost:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer <token>

{"name":"Mali"}''')+'''<p>Request line ระบุ method, path และ version; headers บอกปลายทาง/ชนิดข้อมูล/หลักฐาน; บรรทัดว่างคั่น body ที่บรรทุกข้อมูล <code>Accept</code> บอกชนิด response ที่ client รับได้ ส่วน <code>Content-Type</code> บอกชนิด body ของข้อความนั้น <code>User-Agent</code> บอก client, <code>Referer</code> อาจบอกหน้าที่อ้างมา และ <code>Cookie</code> ส่งค่าที่เก็บไว้</p>'''+code('''HTTP/1.1 201 Created
Content-Type: application/json
Location: /students/2

{"id":2,"name":"Mali"}''')+'''<p>Response ใช้ status line บอก version/code ตามด้วย headers และ body: 2xx สำเร็จ, 4xx ปัญหาคำขอหรือสิทธิ์, 5xx ปัญหาฝั่งบริการ ไม่ควรดูข้อความ “success” ใน body อย่างเดียว GET ส่งค่าผ่าน path/query ได้; POST มักใช้ body แต่ HTTP method ไม่ได้บังคับรูปข้อมูลให้เป็น JSON เอง</p>''')
sec(d,'storage','Cookie, localStorage และ sessionStorage ต่างกันตรงไหน','37–44','''<p>ทั้งสามเก็บข้อมูลฝั่ง browser ได้ แต่มีขอบเขตและการส่งกลับต่างกัน อย่าสับสน <strong>sessionStorage ใน browser</strong> กับ <strong>session store บน server</strong> จาก L11</p>'''+table(['คุณสมบัติ','Cookie','localStorage','sessionStorage'],[['อายุ','ตาม expiry หรืออายุ session ของ browser','อยู่จนลบหรือ browser จัดการ','โดยทั่วไปจบเมื่อปิด tab/session นั้น'],['ขอบเขต','domain/path และเงื่อนไข cookie','origin เดียวกัน','origin + tab/top-level browsing context'],['ส่งตาม HTTP','ส่งเมื่อเข้าเงื่อนไข','ไม่ส่งอัตโนมัติ','ไม่ส่งอัตโนมัติ'],['รูปข้อมูล','ข้อความขนาดเล็ก','คู่ key/value แบบ string','คู่ key/value แบบ string']])+code('''localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme'); // null ถ้าไม่มี
localStorage.removeItem('theme');
sessionStorage.setItem('draft', 'My draft');''')+'''<p>Refresh ยังอ่าน sessionStorage เดิมได้ แต่ tab อื่นมี session storage แยกกัน ส่วน localStorage ใช้ร่วมกันใน origin เดียวกัน การเปิด tab จาก opener อาจเริ่มด้วยสำเนา sessionStorage แต่หลังจากนั้นแยกกัน ความจุขึ้นกับ browser/นโยบาย จึงไม่ควรใช้ตัวเลข 5 MB เป็นคำรับประกันทุกสภาพแวดล้อม</p>''')
sec(d,'json','JSON เป็นข้อความ จึงส่งและเก็บโครงสร้างได้','32–36, 45–54','''<p>HTML อธิบายโครงสร้างหน้าเว็บและมี semantics ขององค์ประกอบ เช่นหัวข้อ/ฟอร์ม ส่วน XML ใช้ tags ที่ตั้งเองและโครงสร้างต้นไม้ เช่น note มี to/from/body; XML Schema บอกชื่อ element และชนิดที่ยอมรับ JSON เป็นอีกทางเลือกสำหรับแลกข้อมูล โดยมี object, array, string, number, boolean และ null ไม่ได้มี function หรือ undefined</p>'''+code('''const student = { name: 'Mali', age: 20 }; // JavaScript object
const text = JSON.stringify(student);      // JSON text
localStorage.setItem('student', text);
const saved = localStorage.getItem('student');
const restored = saved === null ? null : JSON.parse(saved);''')+'''<p><strong>Serialization</strong> แปลงโครงสร้างเป็นข้อความ ส่วน parsing/deserialization แปลงข้อความกลับ ข้อความ JSON ต้องใช้ double quotes สำหรับ key และ string แต่ JavaScript object literal เขียน key ไม่ครอบ quotes ได้ ไม่ควรใช้ eval เพื่ออ่านข้อมูล JSON และควร try/catch เมื่อข้อมูลอาจเสีย</p><p>ลองเอา quotes รอบ name ออก หรือเพิ่ม comma หลังค่าตัวสุดท้าย แล้วคาดการณ์ว่า parse จะสำเร็จหรือไม่</p>'''+lab('json','ข้อความนี้เป็น JSON ที่อ่านได้ไหม?','''<label>JSON ที่ต้องการตรวจ<textarea name="json" spellcheck="false">{"name":"Mali","age":20,"active":true}</textarea></label><div class="ws-controls">'''+btn('parse','ลอง JSON.parse')+'</div>','ตัวอย่างเริ่มต้น parse ได้เป็น object; {name:"Mali"} ไม่ใช่ JSON ที่ถูกต้อง')+'''<p>JSON text อาจเป็น array หรือค่าพื้นฐานก็ได้ ไม่จำเป็นต้องเริ่มด้วย { ทุกครั้ง แต่ API สามารถกำหนดสัญญาว่าต้องรับ object รูปแบบใดเพิ่มเติมได้ การ parse ผ่านไม่ได้แปลว่าข้อมูลผ่าน validation ของแอป</p>''')
sec(d,'services','Web service, SOAP และ REST','55–60','''<p>บริการต้องให้ต่างภาษาและต่างแพลตฟอร์มเข้าใจ request/response ร่วมกัน SOAP ใช้ข้อความ XML ตามโครงสร้างโปรโตคอล; WSDL อธิบายสัญญาบริการ และ UDDI เกี่ยวข้องกับการลงทะเบียน/ค้นพบบริการในแนวทางดั้งเดิม ส่วน <strong>REST (Representational State Transfer)</strong> เป็น architectural style ไม่ใช่ library, protocol หรือชื่ออื่นของ JSON</p><p>REST มองสิ่งที่ระบุชื่อได้เป็น <strong>resource</strong> เช่นนักศึกษา แล้วใช้ URI ระบุและส่ง <strong>representation</strong> ของสถานะ เช่น JSON หรือ XML ทรัพยากรเดียวมีหลายรูปข้อมูลได้ผ่าน content negotiation จึงไม่ควรจำว่า REST ใช้ได้เฉพาะ JSON</p>'''+flow('Resource<br>student id 4','URI<br>/students/4','Representation<br>JSON / XML / HTML'))
sec(d,'rest','ข้อจำกัด REST: แต่ละข้อแก้ปัญหาอะไร','61–76',table(['หลักการ','ผลต่อการออกแบบ'],[['Client–server','แยก UI กับบริการข้อมูล เปลี่ยนได้โดยรักษาสัญญาร่วมกัน'],['Stateless','แต่ละ request มีบริบทที่จำเป็น ไม่อาศัยบทสนทนาที่จำไว้เฉพาะ client'],['Cacheable','ระบุการ cache เพื่อใช้ผลซ้ำได้ ลดโหลด แต่ต้องระวังข้อมูลเก่า'],['Uniform interface','ใช้ interface สม่ำเสมอ ลดข้อตกลงเฉพาะแต่ละ endpoint'],['Layered system','client ไม่จำเป็นต้องรู้ว่ามี proxy/cache/load balancer คั่นอยู่'],['Code on demand (ทางเลือก)','server ส่งโค้ดเพื่อเพิ่มพฤติกรรม client ได้ ไม่จำเป็นทุก API']])+'''<p>Uniform interface ประกอบด้วยการระบุ resource, การจัดการผ่าน representation, ข้อความที่อธิบายตัวเอง และ <strong>HATEOAS</strong> คือให้ response มี links สำหรับการไปต่อ เช่น student มี link ไป enrollment ไม่ต้องเดาทุก URI เอง</p>'''+code('''{
  "id": 4,
  "name": "Mali",
  "links": [{"rel":"enrollments","href":"/students/4/enrollments"}]
}''')+note('Stateless ไม่ได้ห้าม server เก็บฐานข้อมูล นักศึกษาและสินค้าเป็น resource state ที่ยังคงเก็บได้ สิ่งที่ต้องไม่พึ่งคือ conversation/session context ของ client ที่ต้องรู้จากคำขอก่อนเท่านั้น การใช้ session ในเว็บ L11 ทำงานได้ แต่ไม่ใช่ตัวอย่าง REST stateless แบบเคร่งครัด'))
sec(d,'methods','เลือก method และเข้าใจ idempotent','68–73',table(['Method','ตัวอย่าง','ความหมาย'],[['GET','/students/4','อ่าน representation; ไม่ใช้สร้างผลเปลี่ยนแปลงตามที่ขอ'],['POST','/students','ประมวลผล/สร้าง โดยทั่วไป server เลือก URI ใหม่'],['PUT','/students/4','แทนสถานะ resource ตาม URI ที่ทราบ; อาจสร้างถ้าสัญญาอนุญาต'],['PATCH','/students/4','แก้บางส่วนตามรูป patch ที่ตกลง'],['DELETE','/students/4','ขอลบ resource ตาม URI']])+'''<p><strong>Idempotent</strong> หมายถึงส่งคำขอเดิมซ้ำแล้วผลที่ตั้งใจต่อสถานะเท่ากับทำครั้งเดียว เช่น PUT ตั้งชื่อเป็น Mali ซ้ำยังเป็น Mali; DELETE ซ้ำยังเหลือสถานะว่าไม่มี resource แม้ครั้งแรกตอบ 200 และครั้งหลังตอบ 404 ได้ POST ไม่รับประกันคุณสมบัตินี้โดยทั่วไป จึงอาจสร้างรายการซ้ำ ถ้าต้องรองรับ retry ต้องออกแบบ idempotency เพิ่ม</p><details><summary>คิดก่อนเปิด: DELETE ซ้ำแล้ว status ต่างกัน แปลว่าไม่ idempotent หรือไม่?</summary><p>ไม่ใช่ เกณฑ์ดูผลต่อสถานะ ไม่ได้บังคับให้ response ทุกครั้งเหมือนกัน จำนวนรายการยังเป็นศูนย์หลังลบครั้งแรกและครั้งต่อไป</p></details>''')
sec(d,'clients','XHR และ Fetch: ได้ response ไม่เท่ากับสำเร็จ','77–89','''<p>XMLHttpRequest (XHR) สร้าง request ผ่าน open แล้ว send ใช้ events ติดตาม: load แปลว่ารับคำตอบครบแม้เป็น 404/500, error คือทำคำขอไม่สำเร็จระดับเครือข่าย และ progress รายงานการดาวน์โหลด responseType="json" ให้แปลง JSON ได้ readyState เดินจาก 0 UNSENT → 1 OPENED → 2 HEADERS_RECEIVED → 3 LOADING → 4 DONE</p>'''+code('''const xhr = new XMLHttpRequest();
xhr.open('GET', '/students');
xhr.responseType = 'json';
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) console.log(xhr.response);
  else console.error('HTTP', xhr.status);
};
xhr.onerror = () => console.error('Network error');
xhr.send();''')+'''<p>Fetch คืน Promise และมีสองช่วง: รอ Response เมื่อได้รับ headers แล้วค่อยรอ body เช่น json() อีกครั้ง <code>fetch()</code> ไม่ reject เพียงเพราะ HTTP 404 ต้องตรวจ ok ซึ่งจริงสำหรับ 200–299 และการ parse body ก็อาจล้มเหลวได้</p>'''+code('''async function loadStudent(id) {
  const response = await fetch('/students/' + encodeURIComponent(id));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}
loadStudent(4).then(console.log).catch(console.error);''')+'''<p>ฝึกไล่เหตุการณ์: เครือข่ายถึง server แล้วตอบ 404 → ได้ Response → ตรวจ ok พบ false → throw → catch ต่างจาก JSON เสียที่ response.json() reject ภายหลัง และต่างจาก network error ที่ไม่ได้ Response เลย</p>''')
sec(d,'recap','อ่านสัญญาบริการให้ครบก่อนเขียน client','5–89','''<p>เริ่มจาก resource และ URI → เลือก method → กำหนด headers/body → รับ status และ representation → ตรวจข้อผิดพลาด → ค่อยแสดงผล การใช้ HTTP กับ JSON ทำให้เรียกบริการได้ แต่จะเรียกว่าออกแบบตาม REST มากน้อยเพียงใดต้องดู constraints ร่วมด้วย</p><p>ถ้าต้องจำธีมโดยไม่ส่งทุก request เลือก localStorage ได้ ถ้าจะส่ง object ผ่าน HTTP ต้อง serialize และระบุ Content-Type ถ้าขอข้อมูลได้ 404 ต้องจัดการที่ client อย่ารอ catch จาก fetch โดยไม่ตรวจ status</p>''')
d['cards']=[['Web service / API','Web service คือ API ผ่านเครือข่าย; API อาจเป็น interface ภายในเครื่อง'],['3-tier','แยก presentation, application และ data management'],['Accept / Content-Type','รูป response ที่รับได้ / ชนิด body ของข้อความนั้น'],['localStorage','เก็บ string ต่อ origin ไม่ส่ง HTTP อัตโนมัติและไม่มีวันหมดอายุใน API'],['sessionStorage','เก็บ string แยกตาม origin และ tab; refresh ยังอยู่'],['JSON.stringify / JSON.parse','ค่า → JSON text / JSON text → ค่า'],['REST','architectural style ที่มี constraints ไม่ใช่ protocol หรือ JSON'],['HATEOAS','response ให้ links เพื่อค้นทางไปทรัพยากร/การเปลี่ยนสถานะ'],['Idempotent','ทำคำขอเดิมซ้ำแล้วผลที่ตั้งใจต่อสถานะเหมือนทำครั้งเดียว'],['fetch + response.json','รอ Response ก่อน แล้วรออ่าน/parse body อีกครั้ง']]
checks(d,[('API ทุกตัวต้องใช้เครือข่ายไหม?',['ต้องใช้เสมอ','เฉพาะ JSON','ไม่จำเป็น','ต้องมี MySQL'],2,'API อาจเรียกใน process หรือเครื่องเดียว ส่วน web service ต้องผ่านเครือข่าย'),('Content-Type บอกอะไร?',['ชนิด body ของข้อความ','ชื่อคนส่ง','อายุ session','จำนวน API'],0,'Accept บอกรูป response ที่รับได้ แต่ Content-Type บอกชนิด body ที่ส่ง'),('ข้อมูลใดส่งกลับ HTTP อัตโนมัติเมื่อเข้าเงื่อนไข?',['localStorage','ตัวแปร let','sessionStorage','Cookie'],3,'browser ส่ง cookie ตามขอบเขตและนโยบาย ส่วน storage ไม่ส่งเอง'),('ปิด tab แล้วโดยทั่วไปข้อมูลใดจบตาม tab?',['ฐานข้อมูล','sessionStorage','ไฟล์ .env','source code'],1,'sessionStorage ผูกกับ page session ของ tab ไม่ใช่ session store บน server'),('ข้อความใดเป็น JSON ที่ถูกต้อง?',['{name:"Mali"}','{"name":"Mali",}','{"name":"Mali"}','{name:undefined}'],2,'JSON ต้องใช้ double quotes และไม่รับ trailing comma/undefined'),('REST คืออะไร?',['รูปแบบสถาปัตยกรรม','protocol แทน HTTP','package ของ Express','รูปแบบฐานข้อมูล'],0,'REST วาง constraints ของระบบ ส่วน HTTP/JSON เป็นสิ่งที่นำมาใช้ได้'),('ข้อใดเป็น constraint ทางเลือก?',['Stateless','Uniform interface','Client–server','Code on demand'],3,'Code on demand เป็น optional constraint ไม่จำเป็นทุกบริการ'),('DELETE ซ้ำแล้ว 200 ตามด้วย 404 ยัง idempotent ได้หรือไม่?',['ไม่ได้เด็ดขาด','ได้ ถ้าผลต่อ resource ยังคือถูกลบ','ได้เฉพาะไม่มี body','ต้องตอบ 200 เท่านั้น'],1,'idempotence ดูผลที่ตั้งใจต่อสถานะ ไม่ใช่ status code เหมือนกัน'),('Fetch ได้ HTTP 404 จะเป็นอย่างไรโดยปกติ?',['reject อัตโนมัติเสมอ','ลบ localStorage','resolve เป็น Response ที่ ok=false','retry เองเสมอ'],2,'ต้องตรวจ response.ok/status เอง HTTP error ต่างจาก network failure'),('REST stateless ห้ามเก็บตารางนักศึกษาหรือไม่?',['ไม่ห้าม resource state','ห้ามฐานข้อมูลทุกแบบ','ห้าม JSON','ห้าม server'],0,'ไม่พึ่ง conversation context ของคำขอก่อน แต่ยังเก็บ resource state ได้')])

d=lesson('13','Web Services with Node.js','สร้างและทดสอบ Student API แล้วเชื่อม CORS, JWT และ HTTP client','ITDS241-Lecture13-Web Services with Node.js.pdf')
sec(d,'start','เชื่อม UI → Web service → MySQL','3–15','''<p>เมื่อเข้าใจ HTTP และ REST แล้ว เราจะให้ฟอร์มนักศึกษาสั่งเพิ่ม อ่าน แก้ และลบข้อมูลผ่าน Express โดยใช้ JSON เป็นสัญญาระหว่าง client กับ service บทนี้ควรอ่านหลัง L11–L12 เพื่อแยกความผิดพลาดของ body, SQL, CORS และ token ออกจากกันได้</p>'''+flow('Student form / Postman<br>method + URL + JSON','Express service<br>parse → validate → route','MySQL<br>SQL → rows/result')+'''<p>เตรียม database และ student table ก่อน ติดตั้ง express, dotenv, mysql2 และ nodemon แล้วตั้ง .env สำหรับ host/user/password/database ไฟล์ studentservices.js ในสไลด์รวม connection และ CRUD; browser ไม่ควรเชื่อม MySQL ตรงหรือได้รับรหัสผ่าน DB</p>'''+code('''npm init -y
npm install express dotenv mysql2 cors jsonwebtoken axios
npm install --save-dev nodemon'''))
sec(d,'contract','สัญญา Student API: ชื่อฟิลด์ต้องตรงกัน','14–26','''<p>สไลด์ใช้ <code>POST /student</code>, <code>PUT /student</code>, <code>DELETE /student</code>, <code>GET /student/:id</code> และ <code>GET /students</code> โดย response มี error, data, message ให้ client อ่านความหมายตรงกัน ใน POST/PUT ข้อมูลห่อใน student; DELETE ส่ง student_id ใน body</p>'''+table(['คำขอตามสไลด์','แหล่ง input','ผล SQL'],[['POST /student','req.body.student','INSERT → affectedRows'],['PUT /student','student object + ID','UPDATE → affectedRows'],['DELETE /student','req.body.student_id','DELETE → affectedRows'],['GET /student/:id','req.params.id','SELECT → rows[0]'],['GET /students','ไม่มี ID','SELECT → array ของแถว']])+code('''{
  "student": {
    "STU_ID": 2,
    "STU_FNAME": "Mali",
    "STU_LNAME": "Example",
    "STU_AGE": 20
  }
}''')+note('จุดแก้จากต้นฉบับ: หน้า PDF 19 อ่าน req.body.student.student_id แต่ body ตัวอย่างใช้ STU_ID ต้องเลือกชื่อเดียวกันและเช็ก student ก่อนเข้าถึง field บทเรียนส่วนถัดไปใช้ /students/:id และ id/name ที่ย่อเพื่อสอนการเปลี่ยนสถานะ จึงไม่ใช่ endpoint เดียวกับสไลด์ และไม่ใช่ API จริงที่กำลังรัน'))
sec(d,'crud','ลอง CRUD แล้วดูข้อมูลก่อน–หลัง','16–26','''<p><strong>CRUD</strong> คือ Create/Read/Update/Delete ซึ่งสัมพันธ์กับ INSERT/SELECT/UPDATE/DELETE การตอบ success ต้องสะท้อนสิ่งที่เกิดขึ้น เช่น SELECT ไม่พบแถวควรอธิบายว่าไม่พบ ส่วน id ซ้ำเป็นคนละเหตุผลกับ body ไม่ครบ</p><p>ลอง GET id 1 → POST id 2 → เปลี่ยนชื่อด้วย PUT → DELETE id 2 แล้วลบซ้ำ คาดการณ์ทั้ง status และข้อมูลที่เหลือ แบบจำลองเลือกสถานะ 201/400/404/409 เพื่อให้แยกเหตุผลได้ สไลด์หลาย route ใช้ค่าเริ่มต้น 200 แม้เป็นการสร้าง</p>'''+lab('crud','Student API ในหน่วยความจำ',options('method','HTTP method',[('GET','GET /students/:id'),('POST','POST /students'),('PUT','PUT /students/:id'),('DELETE','DELETE /students/:id')])+'''<div class="ws-columns"><label>Student ID<input name="id" type="number" value="2" min="1"></label><label>ชื่อ (สำหรับ POST/PUT)<input name="student" value="Mali" maxlength="80"></label></div><div class="ws-controls">'''+btn('send','ส่งคำขอจำลอง')+btn('reset','เริ่มใหม่')+'''</div><h4>ข้อมูลที่มีอยู่</h4><pre data-db>[{"id":1,"name":"Nida"}]</pre>''','เริ่มต้นมี Nida id 1; POST id 2 ได้ 201 และเพิ่มแถว แต่ POST id 2 ซ้ำได้ 409')+'''<p>GET ไม่เปลี่ยนข้อมูล PUT ในแบบจำลองแทนข้อมูล id/name ทั้งชุด DELETE ซ้ำอาจตอบ 404 แต่ resource ยังคงหายไปจึงไม่ขัดกับ idempotence ระบบจริงยังมี concurrent requests, constraints และ transactions ที่แบบจำลองนี้ไม่ได้จำลอง</p>''')
sec(d,'server','อ่านโค้ด service เป็นลำดับ ไม่ข้าม validation','15–25','''<p>ก่อนอ่าน req.body ต้องมี express.json() ก่อน routes; ก่อนส่ง SQL ต้องตรวจรูปข้อมูล แล้วส่ง input แยกด้วย placeholders ตัวอย่างต่อไปเป็น GET ที่ใช้ schema student ตามสไลด์ และใช้ Promise API ของ mysql2 เพื่อเห็นลำดับ await ชัดเจน</p>'''+code('''// server.cjs: ตั้ง MYSQL_* ใน .env และเตรียมตาราง student ก่อน
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
app.get('/student/:id', async (req, res, next) => {
  if (!/^[1-9][0-9]*$/.test(req.params.id))
    return res.status(400).json({ error: true, message: 'Invalid id' });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id))
    return res.status(400).json({ error: true, message: 'Invalid id' });
  try {
    const [rows] = await db.execute(
      'SELECT STU_ID, STU_FNAME, STU_LNAME, STU_AGE FROM student WHERE STU_ID = ?',
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ error: true, message: 'Student not found' });
    res.json({ error: false, data: rows[0], message: 'Student retrieved' });
  } catch (err) { next(err); }
});
app.use((err, req, res, next) => {
  res.status(500).json({ error: true, message: 'Service operation failed' });
});
app.listen(Number(process.env.PORT || 3000));''')+'''<p>POST ต้องตรวจ object และอนุญาตเฉพาะ STU_ID, STU_FNAME, STU_LNAME, STU_AGE แทนรับทุก key ไปใส่ SQL; UPDATE ต้องระบุ WHERE ให้ตรง record; DELETE ต้องตรวจ affectedRows; อย่า throw ใน callback แล้วคาดว่า Express จะจับให้เอง ให้ next(err) ไป error middleware</p>'''+code('''// รูป SQL สำหรับเขียน: ใช้ค่าที่ผ่าน validation แล้วเท่านั้น
INSERT INTO student (STU_ID, STU_FNAME, STU_LNAME, STU_AGE) VALUES (?, ?, ?, ?)
UPDATE student SET STU_FNAME = ?, STU_LNAME = ?, STU_AGE = ? WHERE STU_ID = ?
DELETE FROM student WHERE STU_ID = ?'''))
sec(d,'postman','ทดสอบให้รู้ว่าเสียที่สัญญาหรือ client','27–37','''<p>ใน Postman สร้าง request เลือก method ใส่ URL ให้ตรง ถ้าเป็น JSON เลือก body แบบ raw/JSON และ Content-Type: application/json แล้วส่ง ตรวจ status, headers และ body รวมถึงตรวจฐานข้อมูลหลังคำขอเขียน อย่าทดสอบเพียง 200 หนึ่งครั้ง</p>'''+table(['กรณี','สิ่งที่ควรตรวจ'],[['GET ID ที่มี / ไม่มี','ได้ record ถูกคน / ไม่พบตามสัญญา'],['POST ข้อมูลครบ / ขาด field','เพิ่มได้ / ได้ error โดยไม่เพิ่มแถว'],['POST ID ซ้ำ','แจ้ง conflict โดยไม่สร้างซ้ำ'],['PUT / DELETE','ข้อมูลเปลี่ยนหรือลบเฉพาะ ID เป้าหมาย'],['token ผิด / หมดอายุ','ถูกหยุดก่อน query ที่ป้องกัน']])+'''<p>ฝั่งฟอร์มอ่านค่าจาก input แล้วเรียก service แบบ asynchronous เมื่อรับ data แล้วจึงใส่ค่ากลับฟอร์ม ต้องตรวจ error/not-found ก่อนเข้าถึง data.STU_ID ไม่เช่นนั้นจะเกิดข้อผิดพลาดซ้ำที่ UI</p>'''+code('''async function callStudentWS(url, method, sentData) {
  const options = { method, headers: { Accept: 'application/json' } };
  if (sentData !== undefined && method !== 'GET') {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(sentData);
  }
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (result.error) throw new Error(result.message);
  return result;
}
// ตัวอย่าง: จับข้อผิดพลาดก่อนอัปเดต UI
callStudentWS('/student/4', 'GET').then(result => {
  document.querySelector('#student-name').value = result.data.STU_FNAME;
}).catch(err => { console.error(err.message); });'''))
sec(d,'cors','CORS: ใครอนุญาตให้ browser อ่าน response','38–43','''<p><strong>Origin</strong> ประกอบด้วย scheme, host และ port เช่น http://localhost:3100 กับ http://localhost:3000 ต่าง origin แม้ host เหมือนกัน Same-origin policy จำกัดการอ่านข้อมูลข้าม origin ของ scripts; CORS ให้ server ประกาศสิ่งที่อนุญาตผ่าน headers ไม่ใช่สิทธิ์ที่ client เปิดเองได้</p>'''+code('''const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3100',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})); // วางก่อน routes
// หรือกำหนดเฉพาะ route: app.get('/student/:id', cors(options), handler)''')+'''<p>app.use(cors()) ตาม demo เปิดอ่านแบบทั่วไปกว้างกว่า allowlist คำขอบางประเภท เช่น PUT, JSON POST หรือ Authorization header ต้องมี <strong>preflight OPTIONS</strong> ก่อนจริง ถ้า preflight ไม่ผ่าน browser ไม่ส่งคำขอจริง แต่ simple request อาจถึง server ก่อนถูกบล็อกการอ่าน response Postman/Node ไม่อยู่ภายใต้ CORS แบบ browser จึงอาจเรียกได้แม้หน้าเว็บอ่านไม่ได้</p>'''+lab('cors','พอร์ตเดียวกันไหม แล้วอ่านได้หรือไม่?',options('origin','Origin ของหน้าเว็บ',[('http://localhost:3100','http://localhost:3100'),('http://localhost:3000','http://localhost:3000'),('https://localhost:3000','https://localhost:3000')])+options('allow','Access-Control-Allow-Origin จาก API',[('none','ไม่มี header'),('http://localhost:3100','http://localhost:3100'),('*','*')])+'''<label><input name="credentials" type="checkbox"> ส่ง credentials (สมมติ server ให้ Allow-Credentials: true)</label>''','หน้าเว็บพอร์ต 3100 เรียก API พอร์ต 3000 ต้องได้รับ CORS headers ที่ถูกต้อง')+'''<p>เมื่อส่ง credentials ข้าม origin จะใช้ Allow-Origin: * ไม่ได้ ต้องระบุ origin และ allow-credentials ให้ถูก แบบจำลองตรวจเฉพาะ origin/credentials ของ response และสมมติ preflight ผ่านเมื่อจำเป็น ไม่ได้ทดสอบเครือข่ายจริง CORS ไม่แทน authentication, authorization หรือ CSRF protection</p>''')
sec(d,'jwt','JWT: อ่าน payload ได้ ไม่ได้แปลว่าเชื่อถือได้','44–61','''<p><strong>Authentication</strong> ตรวจว่าเป็นใคร ส่วน <strong>authorization</strong> ตรวจว่าทำอะไรได้ ใน token-based flow ผู้ใช้ login → server ตรวจ credentials → ออก token → client ส่ง Authorization: Bearer token ทุกครั้ง → middleware ตรวจ → จึงเข้า handler</p>'''+flow('Header<br>ชนิด + algorithm','Payload<br>claims เช่น sub / exp','Signature<br>ตรวจการแก้ไข')+'''<p>JWT แบบ signed token ที่สไลด์สอนมีสามส่วนคั่นด้วยจุด header.payload.signature; header/payload เป็น Base64URL จึงอ่านได้ ลายเซ็นช่วยตรวจความถูกต้องและการแก้ไข ไม่ใช่การปกปิดข้อมูล Claims มี registered เช่น iss, sub, aud, exp, iat; public ที่ตั้งแบบไม่ชนกัน และ private ที่คู่สื่อสารตกลงร่วมกัน ห้ามใส่รหัสผ่านลง payload</p>'''+code('''const jwt = require('jsonwebtoken');
// ทำหลังตรวจ credentials สำเร็จ โดยใช้ user จากแหล่งที่เชื่อถือได้
const token = jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, {
  algorithm: 'HS256', expiresIn: '1h', issuer: 'student-api', audience: 'student-ui'
});
function authorize(req, res, next) {
  const header = req.headers.authorization || '';
  const match = /^Bearer ([^ ]+)$/.exec(header);
  if (!match) return res.status(401).json({ error: true, message: 'Token required' });
  try {
    req.auth = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ['HS256'], issuer: 'student-api', audience: 'student-ui'
    });
    next();
  } catch {
    res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
}
// app.get('/students', authorize, handler);''')+note('โค้ดนี้เป็นส่วนประกอบ ไม่ใช่ระบบ login ครบชุด ต้องกำหนด user จากการตรวจ credentials ก่อน sign และตั้ง JWT_SECRET ฝั่ง server สไลด์ /signin รับ email/userid จาก body แล้ว sign เพื่อสาธิต จึงยังไม่พิสูจน์ตัวตน; อย่าใช้รูปนั้นเป็น login จริง หน้า PDF 65 ยังสลับลำดับ method/token ของ callStudentWS ให้รักษาลำดับอาร์กิวเมนต์ให้ตรงกับนิยาม')+lab('token','แยก token ใช้ไม่ได้ กับไม่มีสิทธิ์',options('token','หลักฐานที่ส่ง',[('missing','ไม่ส่ง token'),('valid','token ที่ตรวจผ่านและยังไม่หมดอายุ'),('expired','token หมดอายุ'),('tampered','payload ถูกแก้ ลายเซ็นไม่ผ่าน')])+'''<label><input name="forbidden" type="checkbox"> ผู้ใช้นี้ไม่มีสิทธิ์อ่านรายการ</label>''','ไม่ส่ง token ได้ 401; token ผ่านแต่ไม่มีสิทธิ์ได้ 403')+'''<p>ฝั่ง client ส่ง headers: { Authorization: 'Bearer ' + token } การเลือกที่เก็บ token มีข้อแลกเปลี่ยน: local/sessionStorage อ่านได้ด้วย JavaScript จึงเสี่ยงถูกขโมยเมื่อมี XSS; HttpOnly cookie จำกัดการอ่านด้วย JS แต่ต้องออกแบบ SameSite/CSRF และ credentials; เก็บใน memory ลดการคงค้างแต่ refresh แล้วหาย JWT ไม่ได้แก้ปัญหาเหล่านี้เอง และ logout ที่ client ลบ token ไม่ทำให้ token ที่ถูกคัดลอกหมดอายุทันที</p>''')
sec(d,'axios','Node.js เป็นผู้เรียกบริการอื่นได้ด้วย Axios','67–78','''<p>บริการหนึ่งอาจเรียกอีกบริการ เช่นค้นสูตรอาหารหรือเรียก Student WS <strong>Axios</strong> เป็น HTTP client สำหรับ browser/Node ใช้ get/delete โดย config เป็นอาร์กิวเมนต์ที่สอง ส่วน post/put/patch รับ data ก่อน config เมื่อได้ response ตัวข้อมูลอยู่ใน response.data ต่างจาก fetch ที่ต้องเรียก response.json()</p>'''+code('''const axios = require('axios');
async function getStudents() {
  try {
    const response = await axios.get('http://localhost:3000/students', {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      timeout: 5000
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? `HTTP ${err.response.status}` : 'Network/timeout error');
  }
}
getStudents();''')+'''<p>ตัวอย่าง spoonacular ส่ง query, number และ apiKey ผ่าน config.params แทนต่อ URL เอง; เก็บ API key ใน environment ฝั่ง server ไม่ใส่ source ที่ส่งให้ browser ความพร้อมใช้และข้อจำกัดของบริการภายนอกเป็นอีกเรื่อง ตัวบทไม่เรียก API จริง</p>'''+code('''const response = await axios.get(
  'https://api.spoonacular.com/recipes/complexSearch',
  { params: { query: 'pizza', number: 20, apiKey: process.env.SPOONACULAR_API_KEY }, timeout: 5000 }
);
console.table(response.data.results);''')+note('Axios มีการแปลง JSON, timeout, cancellation และกลไกช่วย XSRF ตาม configuration แต่ไม่ใช่การป้องกัน CSRF อัตโนมัติทั้งระบบ ต้องออกแบบฝั่ง server ด้วย ส่วนแพ็กเกจ HTTP clients อื่นในสไลด์เป็นรายการตัวอย่าง ไม่ใช่ข้อกำหนดว่าต้องติดตั้งทั้งหมด'))
sec(d,'debug','ใช้ debugger ไล่ request ตามหลักฐาน','79–83','''<p>เปิดโฟลเดอร์ Node project ใน VS Code → Run and Debug → สร้าง launch.json สำหรับ Node แล้วตั้ง program ให้ตรง entry point เช่น server.cjs ตั้ง breakpoint ที่รับ request, ก่อน query และก่อนส่ง response เพื่อดูค่าจริง</p>'''+code('''{
  "version": "0.2.0",
  "configurations": [{
    "type": "node", "request": "launch", "name": "Student API",
    "program": "${workspaceFolder}/server.cjs",
    "skipFiles": ["<node_internals>/**"]
  }]
}''')+'''<p>ส่ง request เดิมจาก Postman ดู req.params/req.body, step over validation, ดู rows หรือ err หลัง await แล้วดู status ที่ส่งออกมา ถ้าข้อมูลว่างให้แยก “query สำเร็จแต่ไม่พบแถว” จาก “connection/query ล้มเหลว” ถ้า Postman ได้แต่ browser ไม่ได้ ให้ดู origin, preflight และ response headers ก่อนสรุปว่า SQL เสีย</p>''')
sec(d,'recap','เชื่อมสาเหตุกับจุดตรวจที่ถูกต้อง','8–82',table(['อาการ','เริ่มตรวจ'],[['req.body ว่าง','Content-Type, JSON.stringify และตำแหน่ง express.json()'],['PUT ไม่ได้ ID','STU_ID เทียบกับ student_id และ body shape'],['404 ไม่พบคน','route, id, rows.length'],['Postman ได้ แต่ browser อ่านไม่ได้','origin, preflight, CORS headers'],['401','Bearer header, signature, expiry, issuer/audience'],['403','สิทธิ์ของผู้ใช้ที่ตรวจตัวตนผ่านแล้ว']])+'''<p>สิ่งที่ควรอธิบายได้หลังบทนี้คือ request หนึ่งผ่าน parser → CORS/การตรวจสิทธิ์ตามลำดับ middleware → validation → query → response อย่างไร และแต่ละจุดผิดแล้วควรส่งผลแบบใด คำตอบต้องเชื่อมกับสัญญา API ไม่ใช่ท่องเพียงชื่อ package</p>''')
d['cards']=[['CRUD','Create/Read/Update/Delete สัมพันธ์กับ INSERT/SELECT/UPDATE/DELETE'],['express.json()','parser JSON body ต้องวางก่อน handler ที่อ่าน req.body'],['req.params / req.body','ค่าจาก path parameters / body ที่ parse แล้ว'],['CORS origin','scheme + host + port ตรงกันจึงเป็น origin เดียวกัน'],['Preflight','OPTIONS ตรวจการอนุญาตก่อนคำขอจริงบางประเภท'],['JWT signature','ตรวจความถูกต้องและการแก้ไข ไม่ใช่เข้ารหัส payload'],['sign / verify','สร้าง token / ตรวจ token ตาม key และเงื่อนไข'],['401 / 403','ไม่มีหลักฐานตัวตนที่ใช้ได้ / รู้ตัวตนแต่ไม่มีสิทธิ์'],['Axios response.data','ข้อมูล body ที่ client แปลงให้ ไม่ต้อง response.json() แบบ fetch'],['Breakpoint','หยุดที่จุดโค้ดเพื่อดูค่าและเส้นทางจริงของ request']]
checks(d,[('ต้องวางอะไรก่อน route ที่อ่าน JSON body?',['express.json()','res.send()','axios.get()','JWT payload'],0,'JSON parser ต้องทำงานก่อน handler จึงอ่าน req.body ได้'),('body ใช้ STU_ID แต่ handler อ่าน student_id จะเกิดอะไร?',['Express แปลงให้เอง','MySQL สร้าง ID เสมอ','อาจได้ undefined เพราะ key ไม่ตรง','CORS เปลี่ยน key'],2,'ชื่อ field เป็นส่วนของสัญญา ต้องใช้ให้ตรงและตรวจ parent object ก่อน'),('localhost:3100 กับ localhost:3000 เป็น origin เดียวไหม?',['เป็นเสมอ','ไม่ใช่เพราะ port ต่าง','เป็นถ้าใช้ JSON','ขึ้นกับ JWT'],1,'Origin รวม scheme, host และ port ไม่ใช่แค่ host'),('CORS แทน authentication ได้ไหม?',['ได้ถ้า *','ได้เมื่อใช้ POST','ได้เฉพาะ MySQL','ไม่ได้'],3,'CORS ควบคุมการอ่านโดย browser ไม่ใช่พิสูจน์ตัวตนหรือสิทธิ์'),('JWT payload อ่านได้หรือไม่ใน signed JWT ที่เรียน?',['อ่านไม่ได้เพราะเข้ารหัสเสมอ','ได้ เพราะ encoding ไม่ใช่ encryption','อ่านได้แค่ root','ได้หลังลบ secret'],1,'Header/payload เป็น Base64URL ลายเซ็นช่วยตรวจความถูกต้องไม่ปกปิดข้อมูล'),('JWT verify ต้องตรวจสิ่งใด?',['เพียงมีจุดสองจุด','เพียง decode ได้','ลายเซ็นและเงื่อนไข เช่นอายุ/issuer/audience','เฉพาะสี header'],2,'Token มีรูปถูกยังปลอมได้ ต้อง verify และตรวจ claims ตามสัญญา'),('token ผ่านแต่ไม่มีสิทธิ์ ควรตอบสถานะใดตามบทเรียน?',['200','201','401','403'],3,'403 แยกผู้ใช้ที่ตรวจตัวตนผ่านแล้วแต่ไม่อนุญาตทำรายการ'),('Axios ได้ข้อมูล body จากไหน?',['response.data','response.json() เสมอ','req.params','process.env.body'],0,'Axios แปลงข้อมูลให้ตามรูปแบบที่รองรับ ส่วน fetch ใช้ body-reading methods'),('GET ID ไม่มีแถวควรทำอะไรก่อน data.STU_ID?',['ตั้ง 200 เสมอ','ตรวจ not-found/error','ลบ DB','sign token ใหม่'],1,'ต้องแยกไม่พบข้อมูลจากผลสำเร็จที่มี record เพื่อไม่ให้ UI อ่าน undefined'),('Postman เรียกได้แต่ browser อ่านไม่ได้ควรเริ่มตรงไหน?',['เขียน SQL ใหม่ทันที','เปลี่ยนฐานข้อมูล','ตรวจ CORS/origin/preflight','ลบ package.json'],2,'Postman ไม่ถูกจำกัด CORS เหมือน scripts ใน browser จึงช่วยแยกชั้นที่ผิดได้')])

def build():
 template=(ROOT/'subjects/itds241/chapter-10.html').read_text(encoding='utf-8')
 head=template[:template.index('<body')]
 head=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',head)
 head=re.sub(r'<link[^>]*href="[^\"]*(?:nodejs|express|final-learning|inline-learning)[^\"]*"[^>]*>','',head)
 for name in ['core','content','app','study-halftone-footer','reader','webservices-lab']:
  head=head.replace('</head>',f'<script defer src="../../assets/{name}.js"></script></head>')
 head=head.replace('</head>','<link rel="stylesheet" href="../../assets/webservices-lab.css"></head>')
 footer=template[template.index('<div class="footer-reveal">'):]
 registry={}
 for id,d in LESSONS.items():
  sections=list(d['sections'])
  cards=d['cards'];quiz=d['quiz'];registry[id]={'label':'L'+str(int(id)),'cards':cards,'quiz':quiz}
  sections.append(dict(id='flashcards',title='Flashcards',pages='',body='<p>ทบทวนเสริมหลังอ่านคำอธิบาย</p><button id="flashcard" class="flashcard" type="button" aria-pressed="false"><span id="flash-label"></span><strong id="flash-text"></strong></button><div class="ws-controls"><button class="btn" id="flash-prev">← ก่อนหน้า</button><span id="flash-position" aria-live="polite"></span><button class="btn" id="flash-next">ถัดไป →</button></div><noscript>'+''.join(f'<details><summary>{e(a)}</summary><p>{e(b)}</p></details>' for a,b in cards)+'</noscript>'))
  fallback=''.join(f'<details><summary>{e(q["q"])}</summary><p>{e(q["options"][q["answer"]])} · {e(q["explanation"])}</p></details>' for q in quiz)
  sections.append(dict(id='quiz',title='Quiz · 10 ข้อ',pages='',body='''<p>แบบฝึกทบทวนที่เรียบเรียงเพิ่ม ไม่ใช่ข้อสอบทางการ ตอบแล้วดูเหตุผลและลองใหม่ได้</p><form id="quiz-form"><p id="quiz-count" aria-live="polite">ตอบแล้ว 0 / 10 ข้อ</p><div id="quiz-questions"></div><p id="quiz-error" role="alert"></p><button class="btn primary" id="quiz-submit" type="submit">ตรวจคำตอบ</button><button class="btn" id="quiz-retry" type="button" hidden>ลองใหม่</button></form><div id="quiz-result" tabindex="-1" hidden><h3 id="quiz-score"></h3><p id="quiz-message"></p></div><noscript>'''+fallback+'</noscript>'))
  h=re.sub(r'<title>.*?</title>',f'<title>L{int(id)} · {e(d["title"])} · Study Garden</title>',head)
  h=re.sub(r'<meta\s+name="description"\s+content="[^"]*"\s*/?>',f'<meta name="description" content="L{int(id)} {e(d["title"])}: {e(d["subtitle"])} พร้อมคำอธิบาย ตัวอย่าง และแบบทดลองในเนื้อหา">',h)
  h+=f'''<body data-subject="itds241" data-chapter="{id}"><a class="skip" href="#main">ข้ามไปยังเนื้อหา</a><header class="site-header"><nav class="wrap nav" aria-label="เมนูหลัก"><a class="brand" href="../../index.html">Study Garden</a><div class="nav-links"><a href="index.html">Web Technologies</a><a href="final.html">Final</a></div><button class="theme-toggle" data-theme-toggle aria-label="สลับโหมดสี">☾ มืด</button></nav></header><div id="storage-notice" class="storage-notice" role="status" hidden>เบราว์เซอร์ไม่อนุญาตให้บันทึกข้อมูล</div><noscript><p class="wrap note">เนื้อหาและตัวอย่างอ่านได้ครบ เปิด JavaScript เพื่อทดลองและทำ Quiz แบบตรวจคะแนน</p></noscript><main id="main" class="wrap"><nav class="breadcrumb" aria-label="เส้นทาง"><a href="../../index.html">วิชาทั้งหมด</a><span>/</span><a href="index.html">ITDS241</a><span>/</span><a href="final.html">Final</a><span>/</span><span>L{int(id)}</span></nav><header class="chapter-hero"><div class="eyebrow">L{int(id)} · LECTURE {int(id)}</div><h1>{e(d['title'])}</h1><p>{e(d['subtitle'])}</p><div class="tags"><span class="tag" data-chapter-status="{id}">ยังไม่ได้อ่าน</span><span class="pill">Flashcards {len(cards)} · Quiz 10</span></div></header><div class="lesson-layout"><aside class="toc" aria-label="สารบัญบทเรียน"><h2>ในบทนี้</h2>'''
  h+=''.join(f'<a href="#{s["id"]}">{e(s["title"])}</a>' for s in sections)+'</aside><article class="lesson-content">'
  for s in sections:
   source=f'<p class="section-kicker">L{int(id)} · หน้า PDF {s["pages"]}</p>' if s['pages'] else ''
   body=s['body']
   if s['id']=='recap':
    refs={'11':[('Express session','https://expressjs.com/en/resources/middleware/session/')],'12':[('MDN HTTP','https://developer.mozilla.org/en-US/docs/Web/HTTP'),('MDN Fetch','https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch')],'13':[('MDN CORS','https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS'),('jsonwebtoken','https://github.com/auth0/node-jsonwebtoken'),('Axios','https://axios-http.com/docs/intro')]}
    body+='<p>เอกสารทางการสำหรับตรวจพฤติกรรมและอ่านต่อ: '+ ' · '.join(f'<a href="{url}">{title}</a>' for title,url in refs[id])+'</p>'
   if s['id']=='start':body+=note('เรียบเรียงจาก '+e(d['source'])+' โดยอ้างเลขหน้า PDF (อาจต่างจากเลขสไลด์ที่พิมพ์อยู่) ตัวอย่างและแบบทดลองที่เสริมมีคำอธิบายกำกับ ไม่ใช่ข้อสอบทางการ')
   h+=f'<section class="lesson-section" id="{s["id"]}">{source}<h2>{e(s["title"])}</h2>{body}</section>\n'
  previous=f'chapter-{int(id)-1:02}.html';nxt=f'chapter-{int(id)+1:02}.html' if id!='13' else 'final.html'
  h+=f'<button class="btn soft" data-mark-read aria-pressed="false">ทำเครื่องหมายว่าอ่านแล้ว ✓</button><nav class="chapter-end" aria-label="เปลี่ยนบท"><a class="btn" href="{previous}">← L{int(id)-1}</a><a class="btn primary" href="{nxt}">{"L"+str(int(id)+1) if id!="13" else "กลับไป Final"} →</a></nav></article></div></main>'+footer
  (ROOT/f'subjects/itds241/chapter-{id}.html').write_text(h,encoding='utf-8')
 content=(ROOT/'assets/content.js').read_text(encoding='utf-8')
 content=re.sub(r'\n/\* Web services registry \*/[\s\S]*?/\* End Web services registry \*/\n?','\n',content)
 content=re.sub(r'\n/\* Webtech labels \*/[\s\S]*?/\* End Webtech labels \*/\n?','\n',content)
 content=content.rstrip()+'\n/* Web services registry */\n'+''.join(f'window.StudyContent.itds241["{id}"] = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n' for id,data in registry.items())+'/* End Web services registry */\n'
 (ROOT/'assets/content.js').write_text(content,encoding='utf-8')
 mapping=[{'lecture':'L'+id,'file':d['source'],'sections':[{'id':s['id'],'title':s['title'],'pdf_pages':s['pages']} for s in d['sections']]} for id,d in LESSONS.items()]
 (ROOT/'docs/webservices-source-map.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print('Built L11-L13: 3 lessons, 30 cards, 30 questions, 5 contextual simulations.')
if __name__=='__main__':build()
