# Node.js Part II — Express Framework

## ก่อนเริ่มบทนี้
ต่อจาก [Node.js Part I](chapter-09.html) ซึ่งสร้าง server ด้วย `http` บทนี้ใช้ **Express** ช่วยจัด route และรับข้อมูลจากฟอร์ม ตัวอย่างเป็น CommonJS และใช้พอร์ต 3000 ยกเว้นตัวอย่าง modular routes ที่สไลด์ใช้ 3030

เป้าหมาย: สร้าง Express server → แยก method/path → ส่ง HTML และ static files → แยก Router → รับ GET/POST อย่างถูกต้อง

คำศัพท์ก่อนใช้: **framework** = ชุดเครื่องมือช่วยสร้างแอป, **route** = กฎเลือก handler ตามคำขอ, **middleware** = ฟังก์ชันที่อยู่ระหว่างทางของ request, **payload** = ข้อมูลที่ส่งมาพร้อมคำขอ

อ้างอิง PDF หน้า 1–4; Cookies/Session, Environment variables และ Database ปรากฏใน Outline แต่ไฟล์นี้ยังไม่สอนรายละเอียด จึงไม่เพิ่มเป็นเนื้อหาหลัก

## 1.1 ทบทวน HTTP server
Node.js คือ runtime บน V8 รัน JavaScript นอกเบราว์เซอร์ ไม่มี DOM แบบ `window`/`document` แต่ทำงานกับ HTTP และไฟล์ได้ตามสิทธิ์ process การไม่มี cookie store แบบ browser ไม่ได้แปลว่า server รับ Cookie headers ไม่ได้

Server รับ **request** แล้วส่ง **response** เป็นข้อความ HTML หรือ JSON การเปิด `/` อาจตามมาด้วย `/favicon.ico` อีกคำขอหนึ่ง ซึ่ง browser เป็นผู้ขอเอง

```js
const http = require('http');
http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
}).listen(8081);
```

จุดต้องจำ: `req` คือคำขอ ส่วน `res` คือเครื่องมือตอบกลับ ต้องจบ response ให้ครบ

อ้างอิง PDF หน้า 5–9

## 1.2 จาก if/else ไปสู่ routing
ใน Part I เราเทียบ `req.url` กับ `/`, `/shabu`, `/bbq` แล้วอ่านไฟล์ HTML ด้วย `fs.readFile` หากไม่ตรงส่ง 404

เมื่อเส้นทางมากขึ้น การรวม if/else ไว้ที่เดียวดูแลยาก Express ช่วยเขียนแต่ละ handler แยกกันได้ แต่ยังทำงานบน Node.js ไม่ได้แทนที่ runtime

<figure><div class="node-diagram"><span>Request: method + path</span><i>→</i><span>เลือก handler</span><i>→</i><span>Response</span></div><figcaption>แผนภาพวาดใหม่: routing ตัดสินว่าจะเรียกโค้ดส่วนใด</figcaption></figure>

จุดสับสน: 404 หมายถึงไม่มี resource/route ที่ตรง ไม่ได้แปลว่า server ดับเสมอไป

อ้างอิง PDF หน้า 10–13

## 2.1 Express ช่วยอะไร
Express เป็น web application framework สำหรับ Node.js ช่วยจัด routing, middleware และการสร้าง API เราเลือกติดตั้งเครื่องมืออื่นเพิ่มตามงานได้

**Template engine** เช่น EJS หรือ Pug รับ template กับข้อมูล แล้วสร้าง HTML ส่งให้ client ตัวอย่างแนวคิด: ชื่อผู้ใช้ในข้อมูลเปลี่ยน → ข้อความใน HTML ที่สร้างเปลี่ยน ไม่จำเป็นต้องเขียน HTML ใหม่ทุกคน

<figure><div class="node-diagram"><span>Template + data</span><i>→</i><span>Template engine</span><i>→</i><span>HTML → Browser</span></div><figcaption>แผนภาพวาดใหม่: template engine ทำงานฝั่ง server ก่อนส่ง HTML</figcaption></figure>

อ้างอิง PDF หน้า 14–16

## ลองทำ · Template กับข้อมูล
:::lab template

## 2.2 เตรียมโครงการด้วย npm
**npm** เป็นเครื่องมือจัดการแพ็กเกจ เริ่มจากโฟลเดอร์งานเปล่าแล้วสั่งตามลำดับ

```sh
mkdir myFirstExpress
cd myFirstExpress
npm init -y
npm install express
npm install --save-dev nodemon
```

`package.json` เก็บข้อมูลโครงการ scripts และ dependencies ส่วน `package-lock.json` บันทึก dependency tree เพื่อให้ติดตั้งซ้ำได้สอดคล้องกัน `node_modules` คือแพ็กเกจที่ติดตั้ง ไม่ควรแก้โค้ดในนั้นเป็นโค้ดแอปของเรา

เสริมความเข้าใจ: เก็บ nodemon ใน devDependencies เพราะใช้ช่วยพัฒนา รูป output/เลขเวอร์ชันในสไลด์ต่างช่วงเวลากัน จึงไม่ต้องให้ตรงภาพ ขอให้เข้าใจหน้าที่ของคำสั่ง

อ้างอิง PDF หน้า 17–20

## 2.3 Express server แรก
สร้างไฟล์ `app.cjs` เพื่อระบุชัดว่าใช้ CommonJS (สไลด์ใช้ `app.js` ในโครงการ CommonJS)

```js
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Hello World from Root!');
});
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
```

`require` นำเข้าแพ็กเกจ, `express()` สร้างแอป, `app.get` ลงทะเบียน handler สำหรับ GET และ `app.listen` เริ่มฟังพอร์ต ทดสอบด้วย `http://localhost:3000/` หยุดด้วย Ctrl+C

อ้างอิง PDF หน้า 21–22

## 2.4 npm start และ nodemon
กำหนด scripts ใน `package.json` แล้วสั่ง `npm start` แทนการจำคำสั่งยาว

```json
{
  "scripts": {
    "start": "node app.cjs",
    "dev": "nodemon app.cjs"
  }
}
```

นี่เป็นส่วน scripts สำหรับใส่ใน package.json เดิม ไม่ใช่ให้ลบ dependencies ออก ใช้ `npm run dev` ระหว่างพัฒนา nodemon ตรวจไฟล์เปลี่ยนและ restart server ให้ ส่วน `node` ปกติต้องหยุดแล้วรันใหม่เองเมื่อแก้โค้ด

โครงงานตัวอย่างมี `app.cjs`, `package.json`, `package-lock.json`, `html/shabu.html`, `html/bbq.html`, `public/mystyle.css` และ `public/images/sample.png`

อ้างอิง PDF หน้า 23–24; scripts dev เป็นส่วนเสริมเพื่อแยกการพัฒนา

## ลองทำ · ตั้งโครงการทีละขั้น
:::lab setup

## 3.1 Route = HTTP method + path
`GET /product/add` กับ `POST /product/add` เป็นคนละ route แม้ path เหมือนกัน การเปิด address bar ใช้ GET จึงไม่ใช่วิธีทดสอบ POST handler โดยตรง

```js
const router = express.Router();
router.get('/', (req, res) => res.send('Homepage'));
router.get('/shabu', (req, res) => res.send('Shabu'));
router.post('/product/add', (req, res) => {
  res.send('Product received');
});
app.use(router);
```

`express.Router()` ใช้ R ตัวใหญ่ สร้าง router object แล้วนำไปต่อกับแอปด้วย `app.use` Middleware เข้าถึง `req`, `res` และมักรับ `next` เพื่อส่งต่อไปขั้นถัดไป

อ้างอิง PDF หน้า 25–27

## 3.2 ส่งไฟล์ HTML ด้วย sendFile
```js
const path = require('path');
router.get('/shabu', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'shabu.html'));
});
```

`res.send()` ส่งข้อความ/ข้อมูล ส่วน `res.sendFile()` ส่งไฟล์ที่ระบุ ควรใช้ absolute path หรือกำหนด root ให้ถูกต้อง ตัวอย่างนี้ใช้ `path.join` กับ `__dirname` ของ CommonJS

เมนู HTML ต้องชี้ endpoint เช่น `<a href="/shabu">Shabu</a>` ไม่จำเป็นต้องใช้ชื่อไฟล์บนดิสก์เป็น URL

จุดต้องจำ: เส้นทางบนเว็บ `/shabu` กับตำแหน่งไฟล์ `html/shabu.html` เป็นคนละสิ่ง ส่วน `__dirname` เป็นค่าประจำ module ใน CommonJS ไม่ใช่ global ของทุกระบบ module

อ้างอิง PDF หน้า 28–29 และ 31

## 3.3 404 และลำดับ middleware
วาง handler สำหรับ route ที่รู้จักก่อน แล้ววาง fallback ท้ายสุด

```js
router.get('/shabu', (req, res) => res.send('Shabu'));
router.use((req, res) => {
  res.status(404).send('Invalid Path');
});
```

หากวาง fallback นี้ก่อน route แล้วส่ง response ทันที คำขอจะจบก่อนถึง `/shabu` เพราะไม่ได้เรียก `next()` อย่าเรียก `next()` ต่อหลังส่งคำตอบจบโดยไม่มีเหตุผล เพราะอาจเกิดการตอบซ้ำ

เสริมความเข้าใจ: unlike การเทียบ `req.url === '/bbq'` ใน Part I, Express ปกติจับ route แบบไม่แยกตัวพิมพ์ใหญ่เล็กและไม่เคร่ง trailing slash (ปรับตั้งค่าได้) และ query string ไม่ใช่ส่วนของ route path

อ้างอิง PDF หน้า 30; พฤติกรรมค่าเริ่มต้นตรวจประกอบเอกสาร Express

## ลองทำ · ลำดับ middleware
:::lab middleware

## 4.1 Static files คืออะไร
ไฟล์ CSS, รูป และ JavaScript ฝั่ง browser ต้องให้ server ส่งได้ด้วย การส่งหน้า HTML สำเร็จไม่ได้รับประกันว่า URL ของ resource ข้างในจะถูกต้อง

```js
app.use(express.static(path.join(__dirname, 'public')));
```

หากมี `public/mystyle.css` และ `public/images/sample.png` จะเรียกจากหน้า HTML ได้ดังนี้

```html
<link rel="stylesheet" href="/mystyle.css">
<img src="/images/sample.png" alt="ภาพตัวอย่าง">
```

ชื่อ `public` เป็นตำแหน่งบนดิสก์ ไม่ใช่ส่วนหนึ่งของ URL เมื่อ mount ที่ `/` เส้นทางที่เริ่ม `/` อิง root ของเว็บไซต์ ส่วน relative URL เช่น `../public/...` จะถูก browser resolve จาก URL ของหน้าปัจจุบันก่อน

อ้างอิง PDF หน้า 32–34

## 4.2 เปลี่ยน mount path
```js
app.use('/assets', express.static(path.join(__dirname, 'public')));
```

เมื่อ mount ที่ `/assets` ไฟล์เดิมจะอยู่ที่ `/assets/mystyle.css` และ `/assets/images/sample.png` ชื่อ mount ไม่จำเป็นต้องตรงกับโฟลเดอร์จริง

จุดสับสน: ถ้า router ที่อยู่ก่อน static middleware ส่ง 404 ปิดคำขอแล้ว static จะไม่มีโอกาสทำงาน จัด static middleware ก่อน fallback ที่กินทุกเส้นทาง

เสริมความเข้าใจ: เปิดเผยเฉพาะ directory ที่ตั้งใจเผยแพร่ อย่าใช้โฟลเดอร์โครงการทั้งหมดเป็น public

อ้างอิง PDF หน้า 33–34 และเอกสาร Express เรื่อง mount path

## ลองทำ · URL ไปหาไฟล์ใด
:::lab static

## 5.1 แยก Router เป็นหมวด
เมื่อแอปโต แบ่งเส้นทางเป็นหมวด product และ user แทน router เดียวที่รวมทุกอย่าง

```js
const product = express.Router();
const user = express.Router();
product.get('/', (req, res) => res.send('Product root'));
product.get('/add', (req, res) => res.send('Product add'));
user.get('/', (req, res) => res.send('User root'));
user.get('/add', (req, res) => res.send('User add'));
app.use('/product', product);
app.use('/user', user);
```

สูตรจำ: **mount prefix + path ใน router = path ที่ผู้ใช้เรียก** เช่น `/product` + `/add` = `/product/add` ส่วน route `/` ของ product ใช้เข้าที่ `/product`

อ้างอิง PDF หน้า 35–38 (ตัวอย่างนี้ในสไลด์ใช้พอร์ต 3030)

## ลองทำ · Method และ modular routes
:::lab route

## 6.1 วงจรการทำงานของฟอร์ม
Form คือพื้นที่ที่ผู้ใช้กรอกข้อมูล วงจรทั่วไปคือ GET เพื่อขอหน้าฟอร์ม → ผู้ใช้กรอก → ส่ง GET/POST → server ตรวจข้อมูล → ถ้าไม่ผ่านแสดงฟอร์มพร้อมค่าเดิมและข้อผิดพลาด ถ้าผ่านทำงานที่ต้องการ แล้วอาจ redirect ไปหน้าสำเร็จ

<figure><div class="node-diagram"><span>GET ฟอร์ม</span><i>→</i><span>กรอกและส่ง</span><i>→</i><span>ตรวจบน server</span><i>→</i><span>ผิด: ฟอร์มเดิม / ถูก: ทำงานและ redirect</span></div><figcaption>วาดใหม่จากวงจรหน้า 41; redirect เป็นรูปแบบทั่วไป ไม่ใช่สิ่งที่ทุก handler ทำให้อัตโนมัติ</figcaption></figure>

ตรวจบน browser ด้วย `required` หรือ JS ช่วยเรื่องประสบการณ์ใช้งาน แต่ **server ต้องตรวจข้อมูลเองด้วย** เพราะ client validation ถูกข้ามได้ ไม่ใช่ตรวจเฉพาะเมื่อใช้ฐานข้อมูลเท่านั้น

อ้างอิง PDF หน้า 39–41; การเน้นตรวจ server ทุกครั้งเป็นคำอธิบายเสริม

## 6.2 action, method และ name
```html
<form action="/form-get" method="GET">
  <label>First name <input name="fname" required></label>
  <label>Last name <input name="lname" required></label>
  <button type="submit">Submit</button>
</form>
```

- `action` = ส่งไป endpoint ใด
- `method` = ส่งด้วย GET หรือ POST
- `name` = ชื่อ key ของค่าที่ส่ง ไม่ใช่ `id`
- `value` = ค่าปัจจุบันที่ส่งไปกับฟอร์ม; input ที่ไม่มี name จะไม่เป็นคู่ข้อมูลปกติในการส่งฟอร์ม

มี `id="fname"` อย่างเดียวไม่ทำให้ server ได้ `fname` ต้องกำหนด `name` ด้วย การแสดงฟอร์มใช้ route `GET /my-form` ที่ `sendFile` หน้า HTML กลับมา

อ้างอิง PDF หน้า 42–46

## 7.1 ฟอร์ม GET → req.query
เมื่อส่งชื่อ John และนามสกุล Doe ด้วย GET จะได้ URL ลักษณะนี้

```text
/form-get?fname=John&lname=Doe
```

```js
router.get('/form-get', (req, res) => {
  const { fname, lname } = req.query;
  // ตรวจชนิดและความยาวก่อนใช้งานจริง
  res.json({ fname, lname, method: req.method });
});
```

ชื่อ property ต้องตรง `name` ใน input ส่วน method และ path ของ handler ต้องตรง form GET เหมาะกับการค้นหาหรือกรองข้อมูล ไม่ควรใช้เปลี่ยนข้อมูลสำคัญบน server

เสริมความเข้าใจ: อย่าใส่รหัสผ่านใน query string เพราะ URL อาจเข้า browser history, logs และระบบอื่น

อ้างอิง PDF หน้า 46–48

## 8.1 ฟอร์ม POST → req.body
เปลี่ยน HTML เป็น `action="/form-post" method="POST"` ข้อมูลไปใน request body ฟอร์ม HTML ปกติใช้ `application/x-www-form-urlencoded` ไม่ได้กลายเป็น JSON เอง

```js
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.post('/form-post', (req, res) => {
  const { fname, lname } = req.body ?? {};
  if (typeof fname !== 'string' || typeof lname !== 'string' ||
      !fname.trim() || !lname.trim()) {
    return res.status(400).send('กรอกชื่อและนามสกุล');
  }
  res.json({ fname, lname, method: req.method });
});
```

วาง parser ก่อน handler ที่อ่าน `req.body` โดย `express.urlencoded()` อ่าน urlencoded และ `express.json()` อ่าน JSON ตาม Content-Type ไม่จำเป็นต้องติดตั้ง body-parser เพิ่มสำหรับตัวอย่างนี้

อ้างอิง PDF หน้า 49–51; ตรวจข้อมูลและตอบ JSON เป็นส่วนเสริมเพื่อแสดงแนวทางที่ปลอดภัยกว่าการสะท้อนข้อความเป็น HTML

## 8.2 เลือก parser ให้ตรงข้อมูล
| ข้อมูลที่เข้า | ตำแหน่งที่อ่าน | สิ่งที่ต้องเตรียม |
|---|---|---|
| GET query | req.query | route GET ที่ตรง path |
| POST form ปกติ | req.body | express.urlencoded ก่อน handler |
| POST JSON จาก fetch/API | req.body | express.json และ Content-Type ที่ถูกต้อง |

`req.body` ยังเป็นข้อมูลที่ไม่เชื่อถือ ต้องตรวจชนิด/รูปแบบก่อนใช้ ไม่ควรสมมติว่ามี property เสมอ และ `express.json()` ไม่ใช่ parser สำหรับ upload ไฟล์

จุดสับสน: POST ไม่ได้เข้ารหัสข้อมูลให้อัตโนมัติ ควรใช้ HTTPS ทั้ง GET และ POST เมื่อรับส่งข้อมูลจริง

อ้างอิง PDF หน้า 50–52; ข้อจำกัด parser และ HTTPS เป็นคำอธิบายเสริม

## ลองทำ · ส่งฟอร์ม GET/POST
:::lab form

## สรุปท้ายบท · สิ่งที่ต้องจำ
Express ทำงานบน Node.js: `express()` → route/middleware → `listen()`

Router เลือกตาม method + path; `app.use('/product', router)` เพิ่ม prefix ให้ทุก route ในหมวดนั้น วาง 404 หลัง routes และ static ที่ต้องการให้เข้าถึง

`res.sendFile` ส่ง HTML แต่ resource ที่ HTML อ้างถึงต้องมี URL ที่ server ให้บริการ เช่น static middleware

GET อ่าน `req.query`; POST body อ่าน `req.body` หลัง parser ที่ตรงชนิดข้อมูล ชื่อ key มาจาก `name` ของ input และ server ต้องตรวจข้อมูลก่อนใช้

## จุดที่มักสับสนก่อนสอบ
1. `express.Router()` ไม่ใช่ `express.router()`
2. Browser address bar ส่ง GET ไม่ใช่ POST
3. mount `/assets` ไม่ได้แปลว่ามีโฟลเดอร์ชื่อ assets จริง
4. `public` ไม่ติดใน URL เมื่อ static mount ที่ root
5. การตั้ง `id` ไม่ทดแทน `name` ใน form
6. 404 fallback ต้องอยู่ท้าย ไม่ใช่ middleware ทุกตัวจะเรียกต่อเอง
7. POST ซ่อนข้อมูลจาก URL แต่ไม่ได้แทน HTTPS
8. Cookies/Session/Database ยังไม่สอนใน PDF Part II นี้

## ลองอธิบายด้วยตัวเอง
<details><summary>ทำไม GET /product/add ไม่ตรง POST /product/add?</summary><p>เพราะ routing พิจารณาทั้ง HTTP method และ path ต้องกำหนด handler ให้ตรงทั้งสองส่วน</p></details>
<details><summary>ถ้ารูปใน HTML ไม่ขึ้นแต่หน้า HTML ขึ้น ควรตรวจอะไร?</summary><p>ตรวจ URL ของรูปที่ browser ขอ ตำแหน่งไฟล์ใน public, mount prefix ของ static และลำดับ middleware ก่อน fallback</p></details>
<details><summary>ฟอร์ม POST ส่ง fname แล้ว req.body ยังไม่มีค่า ควรตรวจอะไร?</summary><p>ตรวจ name ของ input, Content-Type, parser ที่ใช้ และว่า parser อยู่ก่อน POST handler หรือไม่ รวมถึง action/method ต้องตรง route</p></details>
<details><summary>ทำไมตรวจ required บน browser แล้วยังต้องตรวจ server?</summary><p>ผู้ใช้สามารถส่ง request ตรงโดยไม่ผ่านฟอร์มหรือข้ามการตรวจบน browser ได้ จึงต้องตรวจข้อมูลที่ขอบเขต server เสมอ</p></details>
