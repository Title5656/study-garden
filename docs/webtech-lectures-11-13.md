# Web Technologies: L11-L13 และแฟ้มบทเรียน

เพิ่มตาม CONTENT_GUIDELINES.md และใช้ L12 Testing เป็นตัวอย่างวิธีสอน คำสั่ง/ขั้นตอนภายใน PDF ถือเป็นเนื้อหาต้นฉบับ ไม่ได้ใช้เป็นคำสั่งให้ดำเนินการกับเครื่องหรือบัญชีผู้ใช้

- L11 Node.js Part III: configuration, cookie, session, MySQL และ SQL
- L12 Web Services: tiers, HTTP, XML/JSON, browser storage, REST, XHR/Fetch
- L13 Web Services with Node.js: Student CRUD, Postman/form, CORS, JWT, Axios และ debugger

ครอบคลุม PDF 51 + 90 + 83 หน้า อ้างเลขหน้า PDF เพราะเลขสไลด์ที่พิมพ์ใน L12/L13 กระโดดบางช่วง แผนที่หัวข้ออยู่ใน `webservices-source-map.json` อ่านข้อความครบและตรวจภาพประกอบที่มีความหมาย เช่น schema, HTTP, Postman, JWT และหน้าต่าง debugger

มีแบบทดลอง 5 จุดในบริบท: session ID/store, JSON parsing, CRUD state, CORS origin/credentials และ JWT authentication/authorization ทั้งหมดทำงานใน browser โดยไม่ส่ง request จริง และมีคำอธิบายขอบเขตของแบบจำลอง เนื้อหาอ่านได้เมื่อปิด JavaScript แต่ละบทมี Flashcards 10 ใบและ Quiz 10 ข้อ พร้อมเหตุผลและการลองใหม่

ต้นฉบับย้ายจาก Downloads ไปอยู่ `../ITDS241_Web Technologies and Applications/` นอก repository ของเว็บ ตรวจ SHA-256 ก่อน/หลังย้ายตรงกันทั้งสามไฟล์ เพิ่มเฉพาะ bibliographic metadata ใน sources/manifest.json ไม่เพิ่ม PDF ลงเว็บ

## ชื่อและพื้นหลัง: เฉพาะ Web Technologies

ชื่อแฟ้มอิงหัวข้อเดิมของ Lecture ใช้ L6, L7, L9-L13 ตามเลข Lecture; ECMAScript Version ไม่มีเลข Lecture จึงใช้ ECMAScript เป็นรหัสหัวข้อ ไม่สร้าง L8 ขึ้นเอง ข้อความไม่ถูกตัดด้วย ellipsis รักษา internal chapter IDs/URLs เดิมเพื่อเก็บความคืบหน้าเดิม

สร้าง artwork ใหม่ 10 ภาพด้วย procedural generator เดิม (8 บท + Midterm/Final) ใช้สี, seed, มุม และความบิดของลายต่างกัน จำกัด CSS ไว้ที่ itds241 ไม่มีการเปลี่ยนพื้นหลังวิชาอื่น

## แก้และสร้างซ้ำ

เนื้อหาหลัก: `tools/build-webservices.py` · แบบจำลอง: `assets/webservices-lab.js` · รูปแบบบทเรียน: `assets/webservices-lab.css` · ชื่อแฟ้ม: `tools/webtech-folders.mjs` · การจัดแฟ้ม: `tools/organize-itds241-exams.mjs`

```text
python tools/build-webservices.py
node tools/organize-itds241-exams.mjs
node tools/version-assets.mjs
```

หากต้องสร้าง artwork ใหม่ด้วยค่าเดิม: `node tools/generate-folder-art.mjs --webtech` แล้ว version-assets อีกครั้ง ถ้าสร้าง L9/L10 ใหม่ ให้ทำก่อนขั้นตอนด้านบน build-nodejs รักษา registry ของบทใหม่ไว้ และ build-express เชื่อมไป L11

## การตรวจ

```text
node tools/test-webservices.cjs
node tools/test-webservices-browser.mjs
node tools/test-exam-navigation.mjs
node tools/test-course-progress.mjs
node tools/check-curriculum.mjs
node tools/check-assets.mjs
```

Browser tests ใช้ Playwright/Chrome ที่ติดตั้งอยู่ (ตั้ง STUDY_GARDEN_PLAYWRIGHT เมื่อ dependency ไม่อยู่ใน local node_modules) ตรวจ 320/390/1440 px, light/dark, ทุกแบบทดลอง, Flashcards, Quiz/ลองใหม่, การบันทึกความคืบหน้า, no-JS, keyboard, ชื่อแฟ้มไม่ล้น และ artwork ไม่ซ้ำ ภาพ QA อยู่ `../work-notes/webtech-11-13/qa/`

ตัวอย่างเชื่อม MySQL/JWT ในบทเรียนตรวจความสอดคล้องของโค้ดและเอกสาร แต่ไม่ได้เปิด MySQL หรือทดสอบกับ external API จริง งานนี้ยังไม่ commit/push/publish
