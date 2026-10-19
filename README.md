# Study Garden

เว็บเตรียมสอบแบบ static สำหรับหลายวิชา มี **ITDS241 บท 6, 7, 8** และ **ITDS294 Fundamentals of Electronic Commerce Systems จำนวน 10 บท** รวม 13 บทเรียน, Flashcards 132 ใบ และ Quiz 130 ข้อพร้อมคำอธิบาย

## ITDS294 · Electronic Commerce

เปิด `subjects/itds294/index.html` หรือเลือก ITDS294 จากหน้าแรก ใช้แฟ้มกระจกและหน้าบทเรียนตามเทมเพลตเดิม แบ่งเป็นสรุป 7 บทตามชุดสไลด์ Session 1, 2, 3, 4–5, 6, 7–8, 9–10 และ Lab โครงงานอีก 3 บท แต่ละบทมีศัพท์ 10 ใบและ Quiz 10 ข้อ

- กิจกรรมทีละขั้น: Uber, เส้นทางคำสั่งซื้อ, SDLC, แผนความปลอดภัย, การจ่ายเงิน, programmatic advertising, social marketing และ customer journey
- ตัวเลือกสำรวจโมเดลรายได้ ทางเลือกแพลตฟอร์ม SCAMPER, Lean Canvas และ BMC
- เครื่องคำนวณ funnel พร้อม CTR/CVR/CPC/CPA/ROAS และกราฟจุดคุ้มทุนที่มีตารางตัวเลขประกอบ ทำงานได้โดยไม่ใช้ CDN
- แบบจำลองระยะจากร้านและเงื่อนไขการรับข้อเสนอ ไม่อ่านตำแหน่งจริง
- แนวคำตอบเปิดดูได้ของกรณีศึกษา 4 เรื่อง: Uber, Twitter, Skyscanner และ Alipay/WeChat Pay โดยระบุบริบทตามเวลาในเอกสาร
- ตัวอย่าง CampusMeal ที่กรอก SCAMPER, Persona, Lean Canvas, BMC, Journey และแผนการเงินครบ พร้อมไฟล์ `subjects/itds294/campusmeal-worked-example.md` ให้ดาวน์โหลด ข้อมูลและตัวเลขตัวอย่างเป็นสมมติฐานเพื่อฝึก
- ใบงานใน Lab 1–2 พิมพ์ บันทึกร่างในเบราว์เซอร์ และดาวน์โหลดเป็น `.txt` ได้ ถ้า storage ถูกปิดยังใช้หน้านี้และดาวน์โหลดเก็บได้

เนื้อหาอ้างอิงเอกสารทั้ง 17 ไฟล์ในโฟลเดอร์ Electronic Commerce Lec และระบุชื่อไฟล์กับช่วงหน้าในแต่ละบท ไม่แนบไฟล์ต้นฉบับในเว็บ หัวข้อ Programmatic Advertising และ ExchangeHunterJumper ที่สไลด์เอ่ยถึงแต่ไม่มีไฟล์กรณีศึกษาแยก ใช้กิจกรรมประกอบที่ระบุชัดว่าเป็นแบบฝึกเพิ่มเติม

ไฟล์ `assets/ecommerce-content.js` เก็บศัพท์ คำถาม และข้อมูลกิจกรรม; `ecommerce-core.js` เก็บสูตร; `ecommerce-labs.js` ดูแลตัวควบคุม และ `ecommerce.css` ใช้สี/โครงเดิม หน้าแรกนับความคืบหน้าทั้งสองวิชา ส่วนคะแนนและสถานะบทเก็บแยกตามรหัสวิชา โดยใช้ key เดิมของ ITDS241

## รูปแบบหน้าเว็บ

หน้าบทเรียนแสดง **ทีละหัวข้อ** โดยแยกหมวดเนื้อหา กิจกรรม Flashcards, Quiz และแหล่งอ้างอิง เลือกจาก sidebar หรือแถบหมวดด้านบน แล้วกดหัวข้อถัดไปเพื่ออ่านตามลำดับเดิม ปุ่มท้ายบทพาไปบทถัดไปและบันทึกว่าอ่านจบ; บทสุดท้ายกลับไปเลือกบทเรียนในวิชาเดิม การสลับหมวดไม่ล้างคำตอบหรือใบงาน ลิงก์ `#quiz`, `#flashcards` และปุ่ม Back/Forward ยังใช้ได้

Sidebar ใช้การ์ดโทนเดียวกับแฟ้มรายวิชาและพับเป็นสารบัญบนมือถือ Footer ได้แรงบันดาลใจจาก [Motion Footer โดย @jahed](https://21st.dev/@jahed/components/motion-footer) ช่วงแรกแสดง “SCROLL DOWN TO REVEAL” แล้วแผงด้านหน้าเลื่อนขึ้นตามระยะ scroll เพื่อเผย footer เต็มจอ มีลิงก์ [GitHub ของ Title5656](https://github.com/Title5656), ชื่อ Study Garden ขนาดใหญ่ พื้นหลังตาราง แสงไล่สี และแถบชื่อวิชาเฉียงที่ขยับตาม scroll เขียน HTML/CSS/JavaScript สำหรับเว็บนี้เองโดยไม่เพิ่มไลบรารี รองรับโหมดมืด; เมื่อเปิด reduced motion, ใช้หน้าจอแนวนอนเตี้ย หรือปิด JavaScript จะแสดงแบบเลื่อนปกติเพื่อให้เข้าถึงลิงก์ได้ครบ

`assets/reader.js` ดูแลการเลือกหมวด/หัวข้อและการนำทาง ส่วน `assets/reader.css` ดูแล sidebar และ footer เมื่อปิด JavaScript หรือพิมพ์ บทเรียนยังแสดงเนื้อหาทุกหัวข้อครบตามเดิม

หน้าแรกแสดงแฟ้มกระจกแยกตามรายวิชา พร้อมจำนวนบทและความคืบหน้าของแต่ละวิชา กดแฟ้มหรือรหัสวิชาเพื่อเข้าสู่หน้าบทเรียนของวิชานั้น ช่องค้นหาหน้าแรกใช้ค้นหารหัสวิชา ชื่อวิชา หรือหัวข้อหลัก

ภายในหน้ารายวิชา กดแฟ้มบทเรียนเพื่อเปิดลิงก์สรุป, Flashcards และ Quiz หรือกดชื่อบทใต้แฟ้มเพื่ออ่านทันที ทั้งสองวิชามีช่องค้นหาบทเรียน ความคืบหน้า และคะแนน Quiz ของวิชานั้น รองรับคีย์บอร์ด ธีมสว่าง/มืด และลดการเคลื่อนไหวตามระบบ

ดัดแปลงจาก [Glass Folder Cards โดย @kedhareswer](https://21st.dev/@kedhareswer/components/glass-folder-cards) และโค้ดที่ผู้ใช้แนบมา ให้ทำงานกับ HTML/CSS/JavaScript เดิม ไม่ต้องติดตั้ง React, Tailwind หรือ shadcn ลวดลายใช้ algorithm จากตัวอย่างและสร้างเป็น PNG ไว้ล่วงหน้า สร้างใหม่ได้ด้วย `node tools/generate-folder-art.mjs` (ต้องใช้ Node เฉพาะตอนสร้างภาพใหม่)

`assets/library.css` ดูแลเลย์เอาต์แฟ้ม ส่วน `assets/style.css` เก็บสีและรูปแบบบทเรียนร่วมกัน คะแนนและสถานะอ่านแล้วใช้ storage เดิม

## เปิดใช้งาน

ดับเบิลคลิก `index.html` ได้ทันที ไม่ต้องติดตั้ง Node.js, npm หรือ build โค้ดเป็น HTML/CSS/JavaScript ธรรมดา

- กราฟใช้ Chart.js 4.4.8 ผ่าน CDN จึงต้องมีอินเทอร์เน็ต หาก CDN โหลดไม่ได้ยังมีผลลัพธ์เป็นข้อความ และส่วนอื่นยังทำงานได้
- ภาษาอังกฤษใช้ฟอนต์ระบบ ภาษาไทยใช้ Noto Sans Thai ที่แนบใน `assets/fonts` พร้อม SIL Open Font License ไม่เรียกบริการฟอนต์ภายนอกตอนเปิดเว็บ
- คะแนนสูงสุดและเครื่องหมายอ่านแล้วเก็บใน localStorage ของเบราว์เซอร์ ไม่ซิงก์ข้ามเครื่อง
- การเปิดแบบ `file://` มีพฤติกรรม localStorage แตกต่างกันตามเบราว์เซอร์ สำหรับการบันทึกข้ามหน้าอย่างสม่ำเสมอให้เปิดผ่าน GitHub Pages หรือ HTTP server
- การล้างข้อมูลเว็บไซต์จะลบคะแนนด้วย หาก storage ถูกบล็อก เว็บจะแจ้งและยังใช้กิจกรรมในหน้าปัจจุบันได้

## อัปโหลดขึ้น GitHub Pages ฟรี

1. แตก ZIP แล้วสร้าง repository แบบ **Public** ใน GitHub (สำหรับบัญชี GitHub Free)
2. อัปโหลด **ไฟล์และโฟลเดอร์ข้างใน `study-garden`** ไปไว้ที่ root ของ repository ให้เห็น `index.html`, `assets`, `subjects` และ `README.md` โดยตรง ไม่ต้องอัปโหลด PDF ต้นฉบับ
3. เก็บ `.nojekyll` ไว้ด้วยเพื่อบอก GitHub ว่าให้เสิร์ฟไฟล์ static โดยไม่ต้องประมวลผล Jekyll หากตัวเลือกไฟล์ซ่อนไม่แสดง สามารถสร้างไฟล์เปล่าชื่อนี้ผ่าน GitHub ได้
4. เปิด **Settings → Pages → Build and deployment**
5. เลือก **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)** แล้วกด **Save**
6. รอการเผยแพร่สำเร็จ แล้วใช้ลิงก์ที่ GitHub แสดง รูปแบบทั่วไปคือ `https://USERNAME.github.io/REPOSITORY/`

ทุกลิงก์ภายในเว็บเป็น relative path จึงรองรับการอยู่ใต้ชื่อ repository โดยไม่ต้องแก้ base URL

อ้างอิงขั้นตอน: [GitHub Docs: Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) และ [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

Repository ของชุดนี้: [Title5656/study-garden](https://github.com/Title5656/study-garden)

เว็บไซต์: [Study Garden](https://title5656.github.io/study-garden/)

ตั้งค่า GitHub Pages ให้เผยแพร่จาก `main` ที่ `/(root)` แล้ว การ push ไฟล์ขึ้น `main` จะเริ่มการเผยแพร่เวอร์ชันใหม่อัตโนมัติ

ก่อน commit/push หลังแก้ CSS, JavaScript, รูป หรือฟอนต์ ให้รัน `node tools/version-assets.mjs` แล้ว `node tools/check-assets.mjs` เพื่ออัปเดตและตรวจรหัสเวอร์ชันตามเนื้อหาไฟล์ การเปลี่ยน URL ของไฟล์ที่แก้ช่วยให้เบราว์เซอร์โหลดเวอร์ชันใหม่แทนไฟล์เก่าที่ cache ไว้ โดยไม่ล้างคะแนนหรือธีมของผู้ใช้

## โครงสร้างไฟล์

```text
study-garden/
├── index.html                 แฟ้มบทเรียน ค้นหา และความคืบหน้า ITDS241
├── .nojekyll                  ใช้งานบน GitHub Pages แบบ static
├── README.md                  คู่มือนี้
├── assets/
│   ├── style.css              สี เลย์เอาต์ responsive / dark / print
│   ├── library.css            แฟ้มกระจกและหน้าเลือกบทเรียน
│   ├── folder-*.png           ลวดลายแฟ้มที่สร้างไว้ล่วงหน้า
│   ├── app.js                 ธีม flashcard quiz ซ่อนเฉลย และความคืบหน้า
│   ├── core.js                การให้คะแนนและตรรกะกิจกรรม
│   ├── content.js             คลัง flashcard และคำถาม แยกตามวิชาและบท
│   ├── labs.js                กิจกรรมเชิงโต้ตอบเฉพาะ ITDS241
│   └── favicon.svg            ไอคอนเว็บไซต์
├── tools/generate-folder-art.mjs  สร้างลวดลายแฟ้มจากโค้ดตัวอย่าง
└── subjects/
    └── itds241/
        ├── index.html         ภาพรวมวิชาและการ์ดบทเรียน
        ├── chapter-06.html    JavaScript Essentials
        ├── chapter-07.html    Functions, Objects & DOM
        └── chapter-08.html    Modern JavaScript / ECMAScript
```

## มีอะไรในบทเรียน

- สรุปภาษาไทยเรียบเรียงใหม่ พร้อมโค้ด ตารางเปรียบเทียบ และคำถามเปิด/ซ่อนคำตอบ
- บท 6: loop ที่กดเดินหน้า/ย้อนกลับได้ กราฟผลรวมจากค่าจริง และเกม Tic-tac-toe ที่แสดงลำดับการเปลี่ยน state
- บท 7: closure counter สองชุดที่เป็นอิสระ และ DOM playground สำหรับเพิ่ม/แก้/ลบ node
- บท 8: แบบจำลองสถานะ Promise และตัวเลือกเปรียบเทียบ `||` กับ `??`
- Flashcards 10 + 10 + 12 ใบ รวม 32 ใบ
- Quiz บทละ 10 ข้อ รวม 30 ข้อ พร้อมเฉลยและคำอธิบายทุกข้อ หลังส่งคำตอบครบ
- คะแนนเป็นผลการทำจริง เก็บคะแนนล่าสุดและคะแนนสูงสุดแยกกัน; ทำใหม่ได้โดยคะแนนสูงสุดไม่ลด
- เครื่องหมายอ่านแล้วเป็นสิ่งที่ผู้ใช้เลือกเอง ไม่ถือว่าการเปิดหน้าเท่ากับอ่านจบ

## เพิ่มวิชาใหม่

1. สร้างโฟลเดอร์ เช่น `subjects/math101/` และใช้ HTML ของวิชาที่มีอยู่เป็นเทมเพลตโครงหน้า
2. ใน `<body>` เปลี่ยนเป็น `data-subject="math101"` และกำหนด `data-chapter="01"` สำหรับหน้าบทที่ 1 เปลี่ยนชื่อวิชา เมนู เนื้อหา แหล่งที่มา และลิงก์ไปบทก่อน/ถัดไปให้ครบ
3. ใน `assets/content.js` เพิ่ม key `math101` ระดับเดียวกับ `itds241` แล้วเพิ่มข้อมูลของแต่ละบท โดยคงรูปแบบตัวอย่างด้านล่าง
4. เพิ่มแฟ้มรายวิชา `<article class="folder-card">` ใน `index.html` โดยใช้ `<a class="subject-folder">` ลิงก์ไปหน้ารายวิชา ตั้ง `data-search-text` และ `data-course-read-count` ให้ตรงกับรหัสวิชา จากนั้นเพิ่มแฟ้มบทเรียนใน `subjects/math101/index.html` พร้อมลิงก์สรุป/Flashcards/Quiz และ `data-chapter-status` ตามบทจริง
5. ปรับจำนวนวิชา/บท/คำถามตามข้อมูลจริง และโหลดไฟล์เนื้อหาวิชาใหม่บนหน้าแรกด้วย หน้าแรกใช้ `data-all-courses` รวมความคืบหน้าทุกวิชาและ `data-course-read-count` แสดงจำนวนบทที่อ่านแยกตามวิชา ส่วนหน้ารายวิชาและกราฟในบทเรียนใช้วิชาจาก `data-subject` ของหน้านั้น
6. ลบกิจกรรมเฉพาะบทเดิมที่ไม่เกี่ยวข้องออกจาก HTML หากไม่ใช้ id ของกิจกรรมเดิม `labs.js` จะไม่เริ่มกิจกรรมนั้น

รูปแบบข้อมูลหนึ่งบท (เพิ่มให้ครบ 10 คำถามเพื่อใช้ข้อความ Quiz ของเทมเพลตเดิม):

```js
// ภายใน window.StudyContent ระดับเดียวกับ itds241
math101: {
  '01': {
    cards: [
      ['ศัพท์', 'คำอธิบายด้วยภาษาของตัวเอง']
    ],
    quiz: [
      {
        q: '2 + 3 เท่ากับเท่าไร?',
        options: ['4', '5', '6', '7'],
        answer: 1, // index เริ่ม 0 จึงหมายถึงตัวเลือกที่ 2
        explanation: 'เริ่มจาก 2 แล้วเพิ่มอีก 3 จึงได้ 5'
      }
      // เพิ่มคำถามที่ 2–10 ในรูปแบบเดียวกัน
    ]
  }
}
```

กลไกกลางแยก storage ตามรหัสวิชา จึงมีบท `01` เหมือนกันในหลายวิชาได้โดยคะแนนไม่ชนกัน เทมเพลตนี้ออกแบบคะแนนต่อบทไว้ที่ 10 ข้อ หากเปลี่ยนจำนวนข้อให้ปรับข้อความและขอบเขตคะแนนใน `app.js` ด้วย

เพิ่มปุ่มเปิด/ซ่อนคำตอบโดยให้ id ไม่ซ้ำในหน้า:

```html
<button class="btn" data-reveal="answer-one"
        aria-controls="answer-one" aria-expanded="false">ดูคำตอบ ↓</button>
<div class="answer" id="answer-one" hidden>คำอธิบายคำตอบ</div>
```

## แหล่งเนื้อหาและหมายเหตุ

เรียบเรียงจากไฟล์ที่ผู้ใช้ให้มา:

- `ITDS241-Lecture06-JavaScript Part 1.pdf`
- `ITDS241-Lecture07-JavaScript Part 2.pdf`
- `ITDS241-ECMAScript Version_Updated_2026Aug06.pdf`

แต่ละบทระบุช่วงหน้า PDF ที่อ้างอิงไว้ด้านท้าย ตัวอย่างและ quiz เขียนขึ้นใหม่ ไม่ใช่ข้อสอบจริง ไม่ได้แนบหรือเผยแพร่ PDF ต้นฉบับในชุดเว็บไซต์นี้

บางข้อความในสไลด์ย่อหรือคลาดเคลื่อน จึงเสริมหมายเหตุเกี่ยวกับ const, reference, callback, DOM collections, Atomics, top-level await และสถานะข้อเสนอ ECMAScript โดยบท 8 ลิงก์เอกสาร MDN/TC39 ที่ใช้ประกอบไว้ใกล้ข้อความ ตรวจข้อมูลเมื่อ 18 ตุลาคม 2026

ใช้ [Chart.js แบบ script tag](https://www.chartjs.org/docs/latest/getting-started/integration.html) และโหลดเวอร์ชันตรึงจาก CDN สามารถแก้ URL เมื่อต้องการอัปเดตหลังทดสอบแล้ว

## การเข้าถึงและข้อมูล

ใช้ปุ่มและ radio ของ HTML จริง รองรับคีย์บอร์ด มี focus ring, aria-live สำหรับผลกิจกรรม, ลิงก์ข้ามไปเนื้อหา, โหมดลดการเคลื่อนไหวตามระบบ และรูปแบบสำหรับพิมพ์ ตารางกว้างเลื่อนในตัวได้บนมือถือ

ไม่มีบัญชีผู้ใช้ ไม่มีการส่งคะแนนออกไป และไม่มี analytics การโหลด Chart.js เป็นคำขอไปยัง CDN ภายนอกตามปกติ
