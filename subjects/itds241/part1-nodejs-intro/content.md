---
title: "Node.js Part I — พื้นฐาน Node.js, Module และเว็บเซิร์ฟเวอร์แรก"
course: ITDS241 Web Technologies and Application
source: Lecture 09 (Node.js Part I)
---

# Node.js Part I — เริ่มจากศูนย์

**เป้าหมายของบทเรียน (ตามสไลด์)**
- เข้าใจแนวคิดพื้นฐานของ Node.js
- ใช้ built-in module พื้นฐานของ Node.js ได้
- สร้างเว็บเซิร์ฟเวอร์ง่ายๆ ตั้งแต่ศูนย์ได้

**หัวข้อ:** Intro → Getting Started/Hello World → Global object → Module system (สร้างเอง + built-in: Path, URL, File System, HTTP) → สร้างเซิร์ฟเวอร์เอง

---

## บทที่ 1 — ภาพรวมเว็บ: Client / Server / Request–Response

### 1.1 หน้าเว็บประกอบด้วยอะไร (RECAP)
| ฝั่ง | เทคโนโลยี |
|---|---|
| **Front-end** (สิ่งที่ผู้ใช้เห็น) | HTML, CSS, JavaScript |
| **Back-end** (หลังบ้าน) | Database, API, Framework |
| **Full-stack** | ทำได้ทั้ง front-end + back-end |

### 1.2 Client-side vs Server-side
- **Client-side code** = HTML, CSS, JavaScript ที่ **รันในเว็บเบราว์เซอร์**
- **Server-side code** = เขียนด้วยภาษาอะไรก็ได้ เช่น PHP, Python, Ruby, C#, **Node.js (JavaScript)** และ **เข้าถึงระบบปฏิบัติการและไฟล์ของเซิร์ฟเวอร์ได้เต็มที่**
- งานหลักของ server-side คือ **เลือกว่าจะส่งเนื้อหาอะไรกลับไปให้เบราว์เซอร์** ตาม request ที่เข้ามา

:::exam-tip
Node.js = เอา JavaScript ไปรัน "ฝั่งเซิร์ฟเวอร์" ไม่ใช่ในเบราว์เซอร์
:::

### 1.3 วงจร Request / Response (6 ขั้น)
1. Client ส่ง **HTTP (GET) request** ไปยัง Web Server
2. Web Server รับ request แล้ววิเคราะห์ว่าจะไปเอา resource จากไหน — ถ้าเป็น **static resource** (ไฟล์สำเร็จรูป) ข้ามไปขั้น 5
3. ถ้าเป็น **dynamic resource** จะส่งต่อให้ **Web Application (โค้ดฝั่งเซิร์ฟเวอร์)** ซึ่งอ่านข้อมูลที่ต้องการจาก **Database**
4. เซิร์ฟเวอร์เอาข้อมูลมา **รวมกับ HTML template**
5. ส่ง **response** ที่มี HTML ที่สร้างแล้วกลับไป
6. Client ได้รับหน้า HTML

:::interactive{id="p1-ch1-reqres" component="RequestResponseSim"}
วาดใหม่เป็น SVG: กล่อง Browser ⇄ Web Server ⇄ Web App ⇄ Database + กล่อง Static files
- ปุ่ม Stepper 6 ขั้น กดทีละขั้น ไฮไลต์ลูกศรและคำอธิบายขั้นนั้น
- Toggle เลือก "Static request" / "Dynamic request": ถ้า static ให้ข้ามจากขั้น 2 ไปขั้น 5 ถ้า dynamic ผ่านครบ
:::

### 1.4 Server, IP Address, Port
- **IP Address** ระบุว่าเครื่องไหน เช่น `10.34.111.111` หรือชื่อพิเศษ **`localhost`** (= เครื่องตัวเอง)
- **Port** ระบุว่า "ประตูไหน" ของเครื่องนั้น เช่น `3000`, `8080`, `8081`
- ตัวอย่าง URL: `http://localhost:8081` = เครื่องตัวเอง ประตู 8081

*เสริมความเข้าใจ:* เปรียบ IP = ที่อยู่อาคาร, Port = เลขห้อง, หนึ่งเครื่องรันหลายโปรแกรมได้โดยแต่ละโปรแกรมใช้ port ต่างกัน

:::interactive{id="p1-ch1-url-build" component="DragMatch"}
ให้ผู้เรียนลาก 3 ชิ้น `http://` + `localhost` + `:8081` มาประกอบเป็น URL แล้วอธิบายแต่ละส่วน (protocol / host / port)
:::

:::quiz{id="p1-ch1-quiz"}
Q1. โค้ดฝั่งใดที่ "เข้าถึงไฟล์ในระบบของเซิร์ฟเวอร์ได้เต็มที่"?
- A) Client-side  B) Server-side  C) CSS  D) HTML5 attributes
Answer: B
Why: server-side รันบนเซิร์ฟเวอร์ จึงเข้าถึง OS และ file system ได้

Q2. ถ้า request ขอ "ไฟล์รูปที่มีอยู่แล้ว" (static) ขั้นตอนใดที่ถูกข้าม?
- A) ขั้น 1  B) ขั้น 3–4 (ถาม Web App/DB และรวมกับ template)  C) ขั้น 6  D) ไม่ข้ามเลย
Answer: B
Why: static ข้ามจากขั้น 2 ไปส่ง response (ขั้น 5) ได้เลย

Q3. `localhost:3000` หมายถึงอะไร?
Answer: เครื่องของเราเอง (localhost) ที่โปรแกรมซึ่งฟังที่ port 3000
:::

---

## บทที่ 2 — Node.js คืออะไร และสถาปัตยกรรม

### 2.1 นิยาม
> **Node.js คือ JavaScript runtime แบบ asynchronous ที่สร้างบน V8 JavaScript engine ของ Chrome** — "สภาพแวดล้อมเซิร์ฟเวอร์แบบ open-source"

- **V8** = ตัวรัน JavaScript (เอนจิน)
- **Node** = ห่อ V8 ไว้แล้วเพิ่ม **module** ให้ใช้ เช่น File system, HTTP, Utilities

### 2.2 Node.js ต่างจาก JS ในเบราว์เซอร์อย่างไร
| JS ในเบราว์เซอร์ | Node.js |
|---|---|
| มี DOM | **ไม่มี DOM** |
| มี `document`, `window` | **ไม่มี** `document`, `window` |
| มี Cookies | **ไม่มี Cookies** (ในตัว Node เอง) |
| — | มี module: File system, HTTP, Utilities |

:::exam-tip
`console.log()` ใน Node ไม่ใช่ `window.console.log()` เพราะ Node ไม่มี `window`
:::

### 2.3 สถาปัตยกรรม: Single-thread Event Loop (Non-blocking)
1. Request เข้ามา → **main thread (เธรดเดียว)** รับเรื่อง แล้ว **ส่งต่อให้หน่วยที่เหมาะสม** (File System / Database / Computation)
2. เธรด **ไม่ต้องรอ** หน่วยนั้นทำเสร็จ → พร้อมรับ Request 2 ต่อทันที (**non-blocking**)
3. เมื่อหน่วยทำงานเสร็จ เธรดจะ **ตอบกลับ** request นั้น แล้วทำเช่นนี้ต่อไป

*เปรียบเทียบ:* พนักงานรับออเดอร์คนเดียวในร้านอาหาร รับออเดอร์แล้วส่งให้ครัว (ไม่ยืนรอครัวทำเสร็จ) ไปรับโต๊ะต่อไป พอครัวเสร็จก็มาเสิร์ฟ

:::interactive{id="p1-ch2-eventloop" component="EventLoopSim"}
อนิเมชัน SVG: ซ้าย Request 1, 2, 3 → กลางกล่อง "Node.js (1 thread)" → ขวา 3 กล่อง File System / Database / Computation
- ปุ่ม "ส่ง request ใหม่" (สุ่มว่าต้องไปหน่วยไหน มีเวลาทำไม่เท่ากัน)
- ปุ่มสลับโหมด **Non-blocking** (เธรดรับ request ถัดไปทันที) vs **Blocking** (เธรดรอจนเสร็จ) แสดงตัวนับ "request ที่รอคิว" ให้เห็นความต่าง
:::

### 2.4 Node.js Facts
- ✅ เหมาะกับ: **highly-scalable, data (I/O) intensive, real-time application**
- ✅ **JavaScript ทั้งระบบ** (ภาษาเดียวทั้ง front/back)
- ✅ เหมาะกับแอปที่ใช้ **JSON API**
- ❌ **ไม่เหมาะ** กับแอปที่ **ใช้การคำนวณหนัก (computation-intensive)** (เพราะเธรดเดียว งานคำนวณนานจะบล็อกทุก request)

:::quiz{id="p1-ch2-quiz"}
Q1. ข้อใด "ไม่มี" ใน Node.js?
- A) module `fs`  B) module `http`  C) `window` และ `document`  D) `console.log()`
Answer: C

Q2. จุดเด่นของ single-thread event loop คือ?
- A) รอ I/O เสร็จก่อนรับ request ถัดไป  B) ไม่รอ I/O เสร็จ เธรดรับ request ต่อได้ (non-blocking)  C) สร้างเธรดใหม่ทุก request  D) ใช้ไม่ได้กับเซิร์ฟเวอร์
Answer: B

Q3. งานแบบไหนไม่เหมาะกับ Node.js ตามสไลด์?
Answer: งาน computation-intensive (คำนวณหนัก)

Q4. Node.js สร้างบน engine อะไร?
Answer: V8 (JavaScript engine ของ Chrome)
:::

---

## บทที่ 3 — เริ่มใช้ Node.js + Hello World + Global Objects

### 3.1 ติดตั้ง
- ดาวน์โหลดและติดตั้ง **LTS (stable) version** จาก https://nodejs.org
- ตรวจสอบ: เปิด command line แล้วพิมพ์ `node --version` (สไลด์แสดงผลตัวอย่างเป็น `v24.21.0`)

### 3.2 Hello World
ขั้นตอน: เขียน JS → บันทึก `filename.js` → เปิด command line ไปที่โฟลเดอร์นั้น → รัน `node filename.js` → ดูผลใน command line (หรือเบราว์เซอร์)

```js
// helloworld.js
console.log("Hello World!!");
console.log("In the command line");
```
```
$ node helloworld.js
Hello World!!
In the command line
```

### 3.3 Global Objects
**Global objects = ใช้ได้ในทุก module (ทุกไฟล์) โดยไม่ต้อง import**
| ชื่อ | ความหมายสั้นๆ |
|---|---|
| `__dirname` | path ของ **โฟลเดอร์** ที่ไฟล์ปัจจุบันอยู่ |
| `__filename` | path เต็มของ **ไฟล์** ปัจจุบัน |
| `exports`, `module` | ใช้ส่งออกโค้ดจาก module (บทที่ 4) |
| `require()` | ใช้นำเข้า module |
| `console.log()` | พิมพ์ผล |
| `process` | ข้อมูล/ควบคุม process ของ Node |
| `global` | **global namespace** (เช่น `global.console.log(message)`) |

```js
let message = "Sam I am";
console.log(__dirname);   // โฟลเดอร์ปัจจุบัน
console.log(__filename);  // path เต็มของไฟล์
global.console.log(message);
```

:::interactive{id="p1-ch3-hello" component="Stepper"}
Stepper 4 ขั้น "รันโปรแกรมแรก": (1) ติดตั้ง LTS (2) `node --version` (3) สร้าง helloworld.js (4) `node helloworld.js` — แต่ละขั้นมีกล่อง terminal จำลองแสดงผล
:::

:::quiz{id="p1-ch3-quiz"}
Q1. คำสั่งรันไฟล์ `app.js` ด้วย Node?
Answer: `node app.js`

Q2. `__dirname` ต่างจาก `__filename` อย่างไร?
Answer: `__dirname` = path ของโฟลเดอร์ที่ไฟล์อยู่, `__filename` = path เต็มรวมชื่อไฟล์

Q3. ข้อใดเป็น global object?
- A) `fs`  B) `path`  C) `require()`  D) `http`
Answer: C
Why: fs/path/http เป็น built-in module ที่ต้อง `require` ก่อนใช้
:::

---

## บทที่ 4 — Node Module System (สร้าง module เอง)

### 4.1 หลักการ Modularity
- **ทุกไฟล์ JS ใน Node คือ module**
- module หนึ่งมักมีชุดฟังก์ชันที่เราอยากนำไปใช้ในแอป
- ตัวแปร/ฟังก์ชันใน module **เป็น local/private ของไฟล์นั้น** → มีฟังก์ชันชื่อเดียวกันในสองไฟล์ได้ **โดยไม่ทับกัน**

### 4.2 `module.exports` — "เปิดประตู" ให้ไฟล์อื่นใช้
ใช้ส่งออกได้หลายแบบ:
```js
// msg.js — ส่งออก "ค่าตรงๆ" (literal)
module.exports = "Hello World!";

// ictgreet.js — ส่งออก "property ของ object"
let message = 'Hello ICT';
module.exports.greetICT = message;

// hello.js — ส่งออก "ฟังก์ชัน" ภายใต้ชื่อ sayHi
let message = 'Hello ICT';
function sayHello(){ console.log("Hello"); }
module.exports.sayHi = sayHello;
```

### 4.3 `require` — นำเข้า module
- ใช้ **relative path** (ขึ้นต้น `./`) ชี้ไปที่ไฟล์ JS (ไม่ต้องใส่ `.js` ก็ได้)
```
(root)
|_ message/
|    |_ ictgreet.js
|    |_ msg.js
|_ greet.js
|_ hello.js
```
```js
// greet.js
const eng      = require("./hello");
const ictgreet = require('./message/ictgreet');
const msg      = require('./message/msg');

eng.sayHi();                        // Hello
console.log(`${msg}`);              // Hello World!
console.log(`${ictgreet.greetICT}`);// Hello ICT
```

| ส่งออกแบบ | ค่าที่ `require` ได้รับ | วิธีใช้ |
|---|---|---|
| `module.exports = "..."` | **ตัวค่านั้นเลย** (string) | `${msg}` |
| `module.exports.x = ...` | **object** ที่มี property `x` | `obj.x` / `obj.x()` |

:::exam-tip
สไลด์เรียกการ export ฟังก์ชันว่า "export sayHello **as sayHi**" → ชื่อที่ผู้ใช้เรียกคือชื่อที่ตั้งใน `module.exports.<ชื่อ>` ไม่ใช่ชื่อฟังก์ชันเดิม
:::

:::interactive{id="p1-ch4-modules" component="LiveTyper"}
จำลอง 4 ไฟล์ (hello.js, msg.js, ictgreet.js, greet.js) เป็นแท็บ แก้ได้
- ปุ่ม "Run greet.js" แสดงเอาต์พุตจำลอง (เขียนตัวจำลอง mini-`require` ด้วย JS ธรรมดา)
- ให้ลองเปลี่ยน `module.exports.sayHi` เป็นชื่ออื่นแล้วดู error `eng.sayHi is not a function`
:::

:::quiz{id="p1-ch4-quiz"}
Q1. ไฟล์ A และ B มีฟังก์ชัน `sayHello()` ชื่อเดียวกัน จะเกิดอะไรขึ้น?
Answer: ไม่ทับกัน เพราะแต่ละไฟล์เป็น module ที่ scope เป็น private

Q2. `msg.js` เขียน `module.exports = "Hello World!"` แล้ว `const msg = require('./msg')` ค่า `msg` คืออะไร?
Answer: สตริง "Hello World!"

Q3. จะเรียก `sayHi()` จาก hello.js ต้อง export อย่างไร?
Answer: `module.exports.sayHi = sayHello;` แล้ว `require("./hello").sayHi()`
:::

---

## บทที่ 5 — Built-in Modules: Path และ URL

**Built-in modules:** Node มีชุดโมดูลสำเร็จรูป เช่น Path, URL, File System, HTTP (เอกสารเต็ม: https://nodejs.org/docs/latest/api/) — ใช้ด้วย `require('ชื่อ')` ไม่ต้องมี `./`

### 5.1 Path Module
- เครื่องมือทำงานกับ path ของไฟล์/โฟลเดอร์
- path ต่างกันตาม OS (Windows ใช้ `\`, Mac/Linux ใช้ `/`) → **ให้ module จัดการให้อัตโนมัติ**

| เมธอด | หน้าที่ |
|---|---|
| `path.resolve()` | คืน **absolute path** จาก relative path |
| `path.parse()` | แยก path เป็น object: `root`, `dir`, `base`, `name`, `ext` |
| `path.extname()` | คืนนามสกุลไฟล์ |
| `path.join()` | **ต่อ** ส่วนของ path เข้าด้วยกัน |

```js
const path = require('path');
let fullPath = path.resolve(__filename);
console.log(fullPath);                    // /Users/jidapa.kra/Documents/demo/path.js
console.log(path.extname(__filename));    // .js
console.log(path.parse(fullPath));
console.log(path.join(__dirname,'test.js')); // .../demo/test.js
```
ผลของ `path.parse` สำหรับ `/Users/jidapa.kra/Documents/demo/path.js`:
```js
{ root: '/', dir: '/Users/jidapa.kra/Documents/demo', base: 'path.js', ext: '.js', name: 'path' }
```
| field | ความหมาย |
|---|---|
| root | รากของ path |
| dir | โฟลเดอร์ (นับจาก root) |
| base | ชื่อไฟล์ **+** นามสกุล |
| name | ชื่อไฟล์ **ไม่รวม** นามสกุล |
| ext | นามสกุลไฟล์ |

:::interactive{id="p1-ch5-path" component="PathParser"}
ช่องให้พิมพ์ path (ค่าเริ่มต้น `/Users/jidapa.kra/Documents/demo/path.js`) → แสดง 5 ช่อง root/dir/base/name/ext แบบแถบสีไฮไลต์บนสตริงเดียวกัน (คำนวณด้วย string split ใน JS ได้) + ปุ่มจับคู่ field กับความหมาย (DragMatch)
:::

### 5.2 URL Module
- เครื่องมือ **แยกส่วน (parse)** URL: ใช้ `new URL('...')` ได้ object ที่มี property ของแต่ละส่วน

**ส่วนประกอบของ URL** `https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash`
| ส่วน | ค่าในตัวอย่าง |
|---|---|
| `protocol` | `https:` |
| `username` / `password` (auth) | `user` / `pass` |
| `hostname` | `sub.example.com` |
| `port` | `8080` |
| `host` | `sub.example.com:8080` (**hostname + port**) |
| `pathname` | `/p/a/t/h` |
| `search` | `?query=string` |
| `hash` | `#hash` |
| `origin` | protocol + host |
| `href` | URL เต็ม |

ตัวอย่างจากสไลด์:
```js
const fakeurl = new URL('https://www.covid19.com:8080/p/a/t/h?country=TH&time=now');
fakeurl.href       // https://www.covid19.com:8080/p/a/t/h?country=TH&time=now
fakeurl.protocol   // https:
fakeurl.host       // www.covid19.com:8080
fakeurl.port       // 8080
fakeurl.pathname   // /p/a/t/h
fakeurl.search     // ?country=TH&time=now
fakeurl.searchParams            // URLSearchParams { 'country' => 'TH', 'time' => 'now' }
fakeurl.searchParams.get('time')// now
```
:::note
สไลด์เขียนคอมเมนต์ pathname เป็น `/P/a/t/h` (P ใหญ่) เป็นแค่พิมพ์ผิด ค่าจริงคือ `/p/a/t/h` และสไลด์ `require('url')` แต่ใช้ `new URL` ซึ่งเป็น global อยู่แล้ว ใช้ได้ทั้งสองแบบ
:::

:::exam-tip
`host` มี **port ติดมาด้วย** แต่ `hostname` **ไม่มี** port — จุดที่มักสับสน
:::

:::interactive{id="p1-ch5-url" component="UrlExplorer"}
ช่องใส่ URL (ค่าเริ่มต้นตามตัวอย่างข้างบน) → เรียก `new URL()` จริงในเบราว์เซอร์แล้วแสดงตาราง property ทุกตัว พร้อมแถบสีบน URL แสดงว่าแต่ละส่วนคือส่วนไหน + แสดง `searchParams` เป็นคู่ key/value (วาดแผนภาพส่วนประกอบเป็น SVG เอง)
:::

:::quiz{id="p1-ch5-quiz"}
Q1. `path.parse('/a/b/c.txt')` ได้ `name` และ `base` เป็นอะไร?
Answer: name = 'c', base = 'c.txt'

Q2. ต้องการต่อ `__dirname` กับ `test.js` ให้ถูกกับทุก OS ใช้อะไร?
Answer: `path.join(__dirname, 'test.js')`

Q3. `new URL('https://x.com:8080/a?b=1')` ค่า `host`, `hostname`, `search` คือ?
Answer: host = x.com:8080, hostname = x.com, search = ?b=1

Q4. ดึงค่า `time` จาก query ด้วยอะไร?
Answer: `url.searchParams.get('time')`
:::

---

## บทที่ 6 — Built-in Modules: File System (fs)

### 6.1 หน้าที่
| งาน | Async (non-blocking) | Sync (blocking) |
|---|---|---|
| อ่านไฟล์ | `fs.readFile()` | `fs.readFileSync()` |
| สร้าง/ต่อท้ายไฟล์ | `fs.appendFile()` | `fs.appendFileSync()` |
| เขียนไฟล์ | `fs.writeFile()` | `fs.writeFileSync()` |
| ลบไฟล์ | `fs.unlink()` | `fs.unlinkSync()` |
| เปลี่ยนชื่อ | `fs.rename()` | `fs.renameSync()` |

- **ทุกเมธอดใน fs มีคู่ทั้ง asynchronous และ synchronous**
- **Synchronous (blocking):** JS ส่วนอื่นใน Node process **ต้องรอ** จนงาน non-JS (อ่าน/เขียนไฟล์) เสร็จ
- **Asynchronous (non-blocking):** ไม่ต้องรอ → **แนะนำให้ใช้เพื่อหลีกเลี่ยง blocking**

### 6.2 อ่านไฟล์แบบ Async (Callback)
```js
const path = require('path');
const fs = require('fs');
const readme1 = path.join(__dirname, "src/README.txt");

fs.readFile(readme1, "utf8", function(err, contents){
  if(err) console.log("Error: ", err);   // มี error?
  else    console.log(contents);          // ไม่มี error → แสดงเนื้อหา
});
```
- อาร์กิวเมนต์ 3 ตัว: path, encoding (`"utf8"`), **callback function** `(err, contents)`
- Callback จะถูกเรียก **เมื่ออ่านเสร็จ** → ต้องเช็ก `err` ก่อนเสมอ

### 6.3 อ่านหลายไฟล์พร้อมกัน → **ลำดับผลลัพธ์ไม่แน่นอน!**
เรียก `readFile` 3 ครั้งติดกัน (README.txt, README2.txt, README3.txt) แล้วรันหลายรอบ สไลด์แสดงว่า **ลำดับที่พิมพ์ต่างกันในแต่ละรอบ** (เช่น 1,3,2 / 1,2,3 / 1,3,2 / 2,1,3) เพราะแต่ละไฟล์อ่านเสร็จไม่พร้อมกัน

:::interactive{id="p1-ch6-asyncorder" component="AsyncOrderSim"}
ปุ่ม "รันโปรแกรม" จำลอง 3 งานอ่านไฟล์ที่ใช้เวลาสุ่ม (เช่น 50–300 ms) แสดงแถบเวลา (timeline) และลำดับที่ console.log ออกมา กดซ้ำได้ ให้เห็นว่าลำดับเปลี่ยน
- แท็บ 3 โหมด: **Async parallel** (สุ่มลำดับ) / **Sync** (1→2→3 เสมอ และเธรดค้างระหว่างรอ) / **Nested callback** (1→2→3 เสมอ แต่โค้ดซ้อนลึก)
:::

### 6.4 วิธี "รับประกันลำดับ"
1. ใช้ **Synchronous version** (ถ้ามี) — ได้ลำดับ 1→2→3 แน่นอน
```js
let content  = fs.readFileSync(readme1, "utf8"); console.log(content);
let content2 = fs.readFileSync(readme2, "utf-8"); console.log(content2);
let content3 = fs.readFileSync(readme3, "utf-8"); console.log(content3);
```
2. **เขียน callback ซ้อนกัน (nested)** — อ่านไฟล์ถัดไปใน callback ของไฟล์ก่อนหน้า → ได้ลำดับ แต่ได้ **"Callback Hell"** (โค้ดซ้อนเป็นขั้นบันได `})` ท้ายสุด อ่านและดูแลยาก — **ไม่ใช่ practice ที่ดี**)
3. ใช้เวอร์ชันที่สะอาดกว่า: **Promise** หรือ **Async/Await**

:::exam-tip
- Sync = ง่าย ลำดับแน่นอน แต่ **blocking**  /  Async = **non-blocking** แต่ลำดับไม่แน่นอน ถ้าต้องการลำดับ ต้องซ้อน callback (→ Callback Hell) หรือใช้ Promise/Async-Await
- สไลด์เน้น: "เลือก Async เพื่อไม่ให้ block"
:::

:::quiz{id="p1-ch6-quiz"}
Q1. ข้อใดเป็นเมธอดอ่านไฟล์แบบ blocking?
- A) fs.readFile  B) fs.readFileSync  C) fs.unlink  D) fs.rename
Answer: B

Q2. เรียก `fs.readFile` สามไฟล์ติดกัน แล้วรันซ้ำหลายครั้ง ผลเป็นอย่างไร?
Answer: ลำดับการแสดงผลอาจเปลี่ยนได้ เพราะเป็น async ไฟล์ที่เสร็จก่อนแสดงก่อน

Q3. "Callback Hell" คืออะไรและแก้อย่างไร?
Answer: callback ซ้อนกันหลายชั้นจนโค้ดอ่าน/ดูแลยาก แก้ด้วย Promise หรือ Async/Await

Q4. ใน callback `function(err, contents)` ค่าที่ต้องตรวจก่อนใช้ `contents` คือ?
Answer: `err`

Q5. ต้องการลบไฟล์แบบ async ใช้ฟังก์ชันใด?
Answer: `fs.unlink()`
:::

---

## บทที่ 7 — Built-in Module: HTTP และสร้างเซิร์ฟเวอร์

### 7.1 HTTP Module
- Node ส่งข้อมูลผ่าน **HTTP (Hypertext Transfer Protocol)** ได้
- HTTP module สร้าง **HTTP server** ที่ **ฟังที่ port** และ **ตอบ response กลับให้ client เมื่อมี request**

### 7.2 Web server ทำอะไร
- รับ **HTTP request** จาก client แล้วให้ **HTTP response**
- response เป็นได้ทั้ง **plain text, HTML page หรือ JSON object**
- ใช้ `require("http")` เพื่อสร้างเซิร์ฟเวอร์
- ตัวอย่างในสไลด์: รันที่ `localhost` port **8081** → URL `http://localhost:8081`

### 7.3 โค้ดเซิร์ฟเวอร์แรก (`myFirstNodeServer.js`)
```js
/* 1. Import HTTP Module */
const http = require("http");

/* 2. Create a server object */
const myServer = http.createServer((req, res) => {
  res.statusCode = 200;                              // 200 = OK
  res.setHeader("Content-Type", "text/plain");       // ชนิดเนื้อหา
  res.write("Hello World!");                         // เนื้อหา
  res.end();                                         // จบ response
});

/* 3. Listen on port 8081 */
myServer.listen(8081, () => {
  console.log("Listening on the port 8081");
});
```
| บรรทัด | ความหมาย |
|---|---|
| `http.createServer(callback)` | สร้าง server; **ทุกครั้งที่มี request เข้ามา** callback จะถูกเรียก |
| `req` | request object (ข้อมูลที่ client ส่งมา) |
| `res` | response object (ใช้ตอบกลับ) |
| `res.statusCode = 200` | HTTP 200 OK = request สำเร็จ |
| `res.setHeader("Content-Type", ...)` | บอกชนิดข้อมูลที่ส่งกลับ |
| `res.write(...)` | เขียนเนื้อหา |
| `res.end()` | **จบ response** |
| `myServer.listen(8081, cb)` | ผูก server กับ localhost + port 8081 |

- **หยุดเซิร์ฟเวอร์:** กด **Ctrl+C**
- **รัน:** `node myFirstNodeServer.js` → ขึ้น `Listening on the port 8081`
- **ทดสอบ:** พิมพ์ `http://localhost:8081` ในเบราว์เซอร์ → เห็น `Hello World!`
- ฝั่งเซิร์ฟเวอร์อาจเห็น request ถึง **2 ครั้ง**: `/` และ `/favicon.ico` (เบราว์เซอร์ขอไอคอนแท็บเองอัตโนมัติ)

:::interactive{id="p1-ch7-serverbuilder" component="CodeTrace"}
เรียงโค้ดเซิร์ฟเวอร์: DragMatch ให้ผู้เรียน **เรียงบรรทัดที่สลับกัน** ให้ถูกลำดับ (require → createServer → statusCode → setHeader → write → end → listen)
แล้วกด "Run" จำลองเทอร์มินัลซ้าย "Listening on the port 8081" และเบราว์เซอร์ขวาแสดง "Hello World!" พร้อม log 2 บรรทัด `/` และ `/favicon.ico`
:::

### 7.4 `req` และ `res`
```js
const myServer = http.createServer((req, res) => {
  console.log(`url ${req.url}`);        // path ที่ขอ
  console.log(`method ${req.method}`);  // เช่น GET
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.write("Request made!");
  res.end();
});
```
เมื่อเปิด `http://localhost:8081` จะเห็น `url /` / `method GET` แล้วตามด้วย `url /favicon.ico` / `method GET`

### 7.5 Routing ด้วย `req.url`
- เว็บเซิร์ฟเวอร์ตอบ **หน้าเว็บ** ตาม path เช่น `http://localhost:8081/homepage`
- **Routing** = เมื่อ request เข้า → **ส่งไปยังโค้ดที่จัดการ** (เช่น ส่งหน้าเฉพาะ)
- `req.url` ของ `http://localhost:8081/bbq` คือ `"/bbq"`
- ลำดับตรวจ: `"/bbq"?` → ใช่: เปิด bbq.html / ไม่ → `"/shabu"?` → ใช่: เปิด shabu.html / ไม่ → **404 Invalid**

โครงสร้างไฟล์ตัวอย่าง: `(root)/shabu.html`, `(root)/bbq.html`, `routing.js`

```js
const http = require("http");
const fs   = require("fs");   // ไว้เปิดไฟล์ HTML

const myServer = http.createServer((req, res) => {
  console.log("Req: " + req.url);
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write("Greeting");
    res.end();
  }
  else if (req.url === "/shabu") { /* เหมือน /bbq แต่เปิด ./shabu.html */ }
  else if (req.url === "/bbq") {
    fs.readFile("./bbq.html", function(err, data) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");  // ← html!
      res.write(data);
      res.end();
    });
  }
  else {
    res.statusCode = 404;                           // 404 = ไม่พบ
    res.setHeader("Content-Type", "text/plain");
    res.write("Invalid requested :(");
    res.end();
  }
});
console.log("Listening on the port 8081");
myServer.listen(8081);
```
ผลที่เห็นในสไลด์: `/` → "Greeting", `/bbq` → หน้า BBQ, `/shabu` → หน้า Shabu, `/SOMEPATH` → "Invalid requested :(" (status 404)

| URL | `req.url` | ผลลัพธ์ | Status | Content-Type |
|---|---|---|---|---|
| `http://localhost:8081` | `/` | ข้อความ Greeting | 200 | text/plain |
| `.../shabu` | `/shabu` | shabu.html | 200 | text/html |
| `.../bbq` | `/bbq` | bbq.html | 200 | text/html |
| `.../SOMEPATH` | `/SOMEPATH` | Invalid requested :( | **404** | text/plain |

:::interactive{id="p1-ch7-routetester" component="RouteTester"}
ช่องแถบ address จำลอง (พิมพ์ path ได้ + ปุ่มลัด /, /shabu, /bbq, /SOMEPATH)
- แสดง **flowchart** วาดเอง (SVG) ไฮไลต์ทางที่ if/else ผ่าน
- เทอร์มินัลจำลองพิมพ์ `Req: <path>` ทุกครั้งที่กด
- เบราว์เซอร์จำลองแสดงผล + badge Status code + Content-Type
- ให้ลองพิมพ์ `/BBQ` (ตัวพิมพ์ใหญ่) → ตกไป 404 เพราะ `===` เทียบแบบตรงตัวเป๊ะ
:::

:::exam-tip
- ลืม `res.end()` → response ไม่จบ เบราว์เซอร์จะโหลดค้าง *(เสริมความเข้าใจ)*
- ส่ง HTML ต้อง `Content-Type: text/html` ไม่ใช่ `text/plain` ไม่งั้นเบราว์เซอร์จะแสดงเป็นข้อความโค้ด *(เสริมความเข้าใจ)*
- 200 = OK, 404 = ไม่พบ/path ไม่ถูกต้อง
- `fs.readFile` เป็น async → การ `res.write` ต้องอยู่ **ใน callback**
:::

:::note
ข้อความในสไลด์พิมพ์ผิดบางจุด เช่น `http:/locahost:8081`, `comming` ให้เข้าใจว่าคือ `http://localhost:8081` และ coming
:::

:::quiz{id="p1-ch7-quiz"}
Q1. ถ้าไม่เรียก `res.end()` จะเกิดอะไรขึ้น?
Answer: response ไม่ถูกปิด เบราว์เซอร์รอ/โหลดค้าง (ต้องจบ response ด้วย end)

Q2. Status code ใดสื่อว่า "สำเร็จ" และใดสื่อว่า "ไม่พบ"?
Answer: 200 = OK, 404 = ไม่พบ

Q3. ต้องการส่งไฟล์ `bbq.html` ให้เบราว์เซอร์แสดงเป็นหน้าเว็บ ต้องตั้ง Content-Type เป็น?
Answer: `text/html`

Q4. เบราว์เซอร์เปิด `http://localhost:8081/shabu` ค่า `req.url` คือ?
Answer: `"/shabu"`

Q5. ทำไม log ฝั่งเซิร์ฟเวอร์จึงมี `/favicon.ico` ด้วยทั้งที่เราเปิดแค่ `/`?
Answer: เบราว์เซอร์ขอไอคอนของแท็บเองอัตโนมัติอีกหนึ่ง request

Q6. เติมโค้ด: ให้เซิร์ฟเวอร์ฟังที่ port 8081 และพิมพ์ข้อความเมื่อพร้อม
Answer: `myServer.listen(8081, () => { console.log("Listening on the port 8081"); });`

Q7. อ่านโค้ด: `else if(req.url==="/bbq")` เมื่อผู้ใช้เข้า `/bbq/` (มี `/` ท้าย) จะตรงเงื่อนไขหรือไม่?
Answer: ไม่ตรง (=== เทียบเป๊ะ) จะตกไป else → 404 *(เสริมความเข้าใจ)*
:::

---

## สรุปท้าย Part 1 (Cheat Sheet)

| หัวข้อ | ต้องจำ |
|---|---|
| Node.js | async JS runtime บน V8, ไม่มี DOM/window/document/cookies |
| Architecture | single-thread event loop, non-blocking, ไม่เหมาะงานคำนวณหนัก |
| รันไฟล์ | `node file.js` / ตรวจเวอร์ชัน `node --version` / หยุดด้วย Ctrl+C |
| Global | `__dirname`, `__filename`, `exports`, `module`, `require`, `console`, `process`, `global` |
| Export | `module.exports = ค่า` หรือ `module.exports.ชื่อ = ...` |
| Import | `require('./path')` (ของเราเอง) / `require('http')` (built-in) |
| path | `resolve`, `parse`(root,dir,base,name,ext), `extname`, `join` |
| URL | `new URL()` → href, protocol, host, port, pathname, search, searchParams |
| fs | ทุกฟังก์ชันมีคู่ async/sync; ใช้ async; ระวัง callback hell → Promise, async/await |
| HTTP server | `createServer((req,res)=>{...})` + `statusCode`, `setHeader`, `write`, `end` + `listen(port)` |
| Routing | เช็ก `req.url` ด้วย if/else; ไม่ตรงทุกกรณี → 404 |

### ข้อสอบรวมท้าย Part 1 (ลองทำก่อนดูเฉลย)
:::quiz{id="p1-final"}
Q1. (เรียงลำดับ) สร้าง server ให้ถูกลำดับ: (a) `res.end()` (b) `require("http")` (c) `listen(8081)` (d) `createServer`
Answer: b → d → a (อยู่ใน callback ของ createServer) → c

Q2. ผลลัพธ์ของ `module.exports.sayHi = sayHello;` เมื่อไฟล์อื่น `require("./hello")` คืออะไร?
Answer: object ที่มี property `sayHi` (เรียกด้วย `.sayHi()`)

Q3. เปรียบเทียบ `fs.readFile` กับ `fs.readFileSync` (1 ประโยค)
Answer: readFile = async non-blocking ใช้ callback / readFileSync = sync blocking คืนค่าทันทีแต่ทำให้ส่วนอื่นต้องรอ

Q4. ถ้าต้องการอ่านไฟล์ 3 ไฟล์ตามลำดับแบบไม่ block มีกี่วิธีและคืออะไร?
Answer: ซ้อน callback (nested), Promise, async/await (sync ได้ลำดับแต่ block)

Q5. ระบุ `protocol`, `port`, `pathname` ของ `https://www.covid19.com:8080/p/a/t/h?country=TH&time=now`
Answer: `https:`, `8080`, `/p/a/t/h`
:::
