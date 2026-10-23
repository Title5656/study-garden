# Node.js Part I

เพิ่มบท 9 ใน ITDS241 โดยคง HTML/CSS/vanilla JS และสไตล์ Study Garden เดิม

- 7 บทย่อย แบ่งเป็น 59 หน้าสั้น กดหัวข้อก่อนหน้า/ถัดไปได้ ใช้สารบัญและปุ่ม Back/Forward ของเบราว์เซอร์ได้
- กิจกรรมครบ 10 บล็อก: Request/Response, ประกอบ URL, Event Loop, Hello World Stepper, แก้โค้ด module 4 ไฟล์, Path Parser, URL Explorer, Async Order, เรียงโค้ด server, Route Tester
- คำถามต้นทางครบ 34 ข้อ กดดูเฉลยทีละข้อ ข้อเขียนให้ประเมินตนเองอย่างชัดเจน
- Flashcards 14 ใบ และชุดปรนัยเสริม 10 ข้อ บันทึกคะแนนผ่านระบบความคืบหน้าเดียวกับเว็บเดิม
- ใช้พื้นที่อ่านเรียบและเส้นคั่น ลดกรอบซ้อน รองรับธีมสว่าง/มืด มือถือ การพิมพ์ และเนื้อหาสำรองเมื่อปิด JavaScript
- Part II ยังไม่รวม ตามคำตอบของผู้ใช้

ไฟล์หลัก: `subjects/itds241/chapter-09.html`

การจัดแฟ้มตามช่วงสอบ: หน้ารายวิชามี Midterm (บท 6–8) และ Final (Node.js Part I และบทใหม่ในอนาคต) ใช้โฟลเดอร์แบบเดิม ค้นหาและติดตามคะแนนได้ตามเดิม ลิงก์บทเรียนและข้อมูลคะแนนไม่เปลี่ยน เครื่องมือ `tools/organize-itds241-exams.mjs` จัดกลุ่มจาก registry และถูกเรียกโดย `connect-nodejs.mjs` เพื่อคงการจัดกลุ่มเมื่อสร้างเนื้อหาใหม่

ปรับตามคำขอเพิ่มเติม: คลิกโฟลเดอร์ช่วงสอบเพื่อเปิด `midterm.html` หรือ `final.html` ซึ่งแสดงโฟลเดอร์รายบท จากนั้นเปิดโฟลเดอร์บทเพื่อเลือกสรุป Flashcards หรือ Quiz ความคืบหน้าในหน้าแต่ละช่วงสอบนับเฉพาะบทของช่วงนั้น ส่วนหน้ารวมยังแสดงภาพรวมทั้งวิชา

ต้นทาง: `subjects/itds241/part1-nodejs-intro/content.md` เก็บตามที่ได้รับ แก้คำอธิบายทางเทคนิคเฉพาะฉบับที่แสดงบนเว็บ พร้อมระบุในแหล่งอ้างอิงท้ายบท ไม่ใช้ภาพสไลด์

สร้างใหม่หลังแก้เนื้อหา:

```text
node tools/build-nodejs.mjs
node tools/connect-nodejs.mjs
node tools/version-assets.mjs
```

เครื่องมือ authoring ใช้ `marked` (ติดตั้งในสภาพแวดล้อมเครื่องมือ หรือกำหนด `STUDY_GARDEN_MARKED` เป็น file URL ของแพ็กเกจ) เว็บไซต์ที่สร้างแล้วไม่ต้องติดตั้งแพ็กเกจหรือ build ก่อนเปิดใช้งาน

ทดสอบ:

```text
node tools/test-nodejs-core.cjs
node tools/test-nodejs-browser.mjs --capture
node tools/check-curriculum.mjs
node tools/check-assets.mjs
node tools/test-learning.mjs
node tools/test-teaching-redesign.mjs
```

Browser tests ใช้ Playwright และ Chrome ตามแนวทางเครื่องมือเดิมของ repo หรือกำหนด `STUDY_GARDEN_PLAYWRIGHT` เป็น file URL ของ Playwright

ข้อจำกัด: กิจกรรมเป็นแบบจำลองฝั่งเบราว์เซอร์ ตัวแก้โค้ด module รองรับ syntax ของตัวอย่างนี้ ไม่มีการรัน Node.js จริง คำถามปลายเปิดเป็นการประเมินตนเอง และผู้ตรวจอิสระติดข้อจำกัดการใช้งาน จึงใช้การตรวจด้วยผู้เขียนร่วมกับชุดทดสอบอัตโนมัติ
