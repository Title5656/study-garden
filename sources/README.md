# เอกสารต้นฉบับสำหรับอ่านและสรุปด้วย AI

เก็บไฟล์ต้นฉบับทั้งหมด **40 ไฟล์** ที่ได้รับใน workspace โดยคัดลอกแบบไม่แก้ไข ไม่ย่อ ไม่แปลงไฟล์ และไม่ตัดไฟล์ที่เนื้อหาซ้ำ รวม PDF, DOCX, PPTX และ PNG ชื่อไฟล์และข้อมูลภายในคงเดิม

## เริ่มอ่านที่นี่

- [manifest.json](manifest.json): รายการทุกไฟล์ ขนาด SHA-256 และความเชื่อมโยงกับบทเรียนทั้ง 25 บท พร้อมข้อความอ้างอิงจากบทเรียน
- [SHA256SUMS](SHA256SUMS): ค่า SHA-256 ของทุกต้นฉบับ โดย path เริ่มจากราก repository
- สรุปใน `subjects/` เป็นเนื้อหาเรียบเรียงและมีกิจกรรมที่เพิ่มขึ้น ส่วนไฟล์ในโฟลเดอร์นี้เป็นหลักฐานต้นฉบับ ให้ยึดต้นฉบับเมื่อตรวจความถูกต้อง

## ขอบเขตและช่องว่างของเอกสาร

- ITDS241: มีต้นฉบับ Lecture06, Lecture07 และ ECMAScript เท่านั้น เชื่อมกับบทเรียน 06–08 ไม่มีต้นฉบับ Lecture01–05 ในชุดที่ได้รับ
- ITDS261: มี L0–L4 และ L6–L11 **ไม่มีไฟล์ L5 ในชุดที่ได้รับ** รวมแบบฝึกหัด แนวสอบ Git cheat sheet งาน Lab3 และภาพแนวทาง 3 ภาพ เลขบทของเว็บไซต์ 01–12 ไม่ใช่เลข L ในชื่อไฟล์ ให้ใช้ตารางจับคู่ด้านล่าง
- ITDS294: Session #4–5, #7–8 และ #9–10 เป็นไฟล์รวมหลาย session จึงมีสไลด์ session 7 ไฟล์ ครอบคลุม session 1–10 รวม case study 4 ไฟล์ โครงงาน 3 ไฟล์ และ template 3 ไฟล์
- คำว่า “ครบ” หมายถึงครบทุกไฟล์จากโฟลเดอร์ต้นทางทั้งสามที่มีอยู่ ณ การรวบรวมครั้งนี้ ไม่ยืนยันเอกสารที่ยังไม่ได้รับ
- PDF บางหน้าและภาพ PNG ต้องอ่านด้วยระบบที่รองรับภาพหรือ OCR การดึงเฉพาะ text layer อาจทำให้ภาพ ตาราง แผนภาพ และกรณีศึกษาหายไป
- DOCX และ PDF ของ Ex2 ถูกเก็บทั้งคู่ แม้ใช้กับบทเดียวกัน ห้ามข้ามไฟล์เพราะชื่อหรือเนื้อหาคล้ายกัน

## คำสั่งตัวอย่างสำหรับ AI

> อ่าน sources/manifest.json แล้วไล่อ่านไฟล์ใน files ทุกแถว รวมทุกหน้า ทุกสไลด์ ทุกตารางและภาพ ใช้ OCR หรือการอ่านภาพเมื่อจำเป็น สรุปตามรายวิชาและบทโดยใช้ chapters เป็นตารางจับคู่ ระบุชื่อไฟล์และเลขหน้า/สไลด์ประกอบ แยกข้อมูลจากต้นฉบับออกจากคำอธิบายที่เพิ่มเอง ทำรายการตรวจว่าอ่านครบไฟล์ใดแล้ว หากเปิดไฟล์หรืออ่านหน้าใดไม่ได้ให้รายงานตรง ๆ ห้ามอ้างว่าอ่านครบและห้ามแต่งเติมเอกสารที่ขาด

## จำนวนไฟล์ที่ตรวจแล้ว

| วิชา | ต้นฉบับ | บทเรียนบนเว็บไซต์ |
|---|---:|---:|
| ITDS241 | 3 | 3 |
| ITDS261 | 20 | 12 |
| ITDS294 | 17 | 10 |
| รวม | 40 | 25 |

ตรวจ hash ของไฟล์ที่เก็บใน repository ได้จากราก repository ด้วย PowerShell:

```powershell
$manifest = Get-Content -Raw -Encoding UTF8 sources/manifest.json | ConvertFrom-Json
foreach ($entry in $manifest.files) {
    $file = Get-Item -LiteralPath $entry.path -ErrorAction Stop
    $actual = (Get-FileHash -LiteralPath $entry.path -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actual -ne $entry.sha256 -or $file.Length -ne $entry.bytes) {
        throw "File mismatch: $($entry.path)"
    }
}
"Verified $($manifest.files.Count) original files"
```

## สารบัญทุกไฟล์

### ITDS241

- [ITDS241-ECMAScript Version_Updated_2026Aug06.pdf](itds241/ITDS241-ECMAScript%20Version_Updated_2026Aug06.pdf) — บท 08
- [ITDS241-Lecture06-JavaScript Part 1.pdf](itds241/ITDS241-Lecture06-JavaScript%20Part%201.pdf) — บท 06
- [ITDS241-Lecture07-JavaScript Part 2.pdf](itds241/ITDS241-Lecture07-JavaScript%20Part%202.pdf) — บท 07

### ITDS261

- [2026 - ITDS261 - Ex2 - Requirements Analysis with Scenario-based Modeling (1).docx](itds261/2026%20-%20ITDS261%20-%20Ex2%20-%20Requirements%20Analysis%20with%20Scenario-based%20Modeling%20%281%29.docx) — บท 04
- [2026 - ITDS261 - Ex2 - Requirements Analysis with Scenario-based Modeling.pdf](itds261/2026%20-%20ITDS261%20-%20Ex2%20-%20Requirements%20Analysis%20with%20Scenario-based%20Modeling.pdf) — บท 04
- [2026 - ITDS261 - Ex3 - Flow Modeling (Zoo).pdf](itds261/2026%20-%20ITDS261%20-%20Ex3%20-%20Flow%20Modeling%20%28Zoo%29.pdf) — บท 05
- [2026 - ITDS261 - L0 - Course introduction.pdf](itds261/2026%20-%20ITDS261%20-%20L0%20-%20Course%20introduction.pdf) — บท 01
- [2026 - ITDS261 - L1 - SE foundation  SPM.pdf](itds261/2026%20-%20ITDS261%20-%20L1%20-%20SE%20foundation%20%20SPM.pdf) — บท 01
- [2026 - ITDS261 - L10 - Implementation  Code review.pdf](itds261/2026%20-%20ITDS261%20-%20L10%20-%20Implementation%20%20Code%20review.pdf) — บท 09
- [2026 - ITDS261 - L11 - VCS.pdf](itds261/2026%20-%20ITDS261%20-%20L11%20-%20VCS.pdf) — บท 10
- [2026 - ITDS261 - L2- Process models.pdf](itds261/2026%20-%20ITDS261%20-%20L2-%20Process%20models.pdf) — บท 02
- [2026 - ITDS261 - L3 - Requirement Engineering.pdf](itds261/2026%20-%20ITDS261%20-%20L3%20-%20Requirement%20Engineering.pdf) — บท 03, 12
- [2026 - ITDS261 - L4 - Use case modeling.pdf](itds261/2026%20-%20ITDS261%20-%20L4%20-%20Use%20case%20modeling.pdf) — บท 04
- [2026 - ITDS261 - L6 - Requirements Modeling Flow and Behavior I.pdf](itds261/2026%20-%20ITDS261%20-%20L6%20-%20Requirements%20Modeling%20Flow%20and%20Behavior%20I.pdf) — บท 05
- [2026 - ITDS261 - L7 - Requirements Modeling Flow and Behavior II.pdf](itds261/2026%20-%20ITDS261%20-%20L7%20-%20Requirements%20Modeling%20Flow%20and%20Behavior%20II.pdf) — บท 06
- [2026 - ITDS261 - L8 - User Interface Design.pdf](itds261/2026%20-%20ITDS261%20-%20L8%20-%20User%20Interface%20Design.pdf) — บท 07
- [2026 - ITDS261 - L9 - Design Architecture and Methodology.pdf](itds261/2026%20-%20ITDS261%20-%20L9%20-%20Design%20Architecture%20and%20Methodology.pdf) — บท 08
- [2026 - ITDS261 - Midterm guideline.pdf](itds261/2026%20-%20ITDS261%20-%20Midterm%20guideline.pdf) — บท 11
- [git-cheat-sheet-education.pdf](itds261/git-cheat-sheet-education.pdf) — บท 10
- [Lab3-Sec2-id6887054.pdf](itds261/Lab3-Sec2-id6887054.pdf) — บท 12
- [สกรีนช็อต 2026-09-21 170842.png](itds261/%E0%B8%AA%E0%B8%81%E0%B8%A3%E0%B8%B5%E0%B8%99%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%95%202026-09-21%20170842.png) — บท 05
- [สกรีนช็อต 2026-09-21 170946.png](itds261/%E0%B8%AA%E0%B8%81%E0%B8%A3%E0%B8%B5%E0%B8%99%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%95%202026-09-21%20170946.png) — บท 05
- [สกรีนช็อต 2026-09-21 171010.png](itds261/%E0%B8%AA%E0%B8%81%E0%B8%A3%E0%B8%B5%E0%B8%99%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%95%202026-09-21%20171010.png) — บท 05

### ITDS294

- [Case Study 0 Uber Everything on Demand.pdf](itds294/Case%20Study%200%20Uber%20Everything%20on%20Demand.pdf) — บท 01
- [Case Study 1 Weathering the Storm Twitter’s Un-certain Future.pdf](itds294/Case%20Study%201%20Weathering%20the%20Storm%20Twitter%E2%80%99s%20Un-certain%20Future.pdf) — บท 02
- [Case Study 2 Skyscanner  The One-Stop Travel Platform.pdf](itds294/Case%20Study%202%20Skyscanner%20%20The%20One-Stop%20Travel%20Platform.pdf) — บท 04
- [Case Study 3 Alipay and WeChatPay.pdf](itds294/Case%20Study%203%20Alipay%20and%20WeChatPay.pdf) — บท 05
- [E-Commerce Project Initiative #1.pdf](itds294/E-Commerce%20Project%20Initiative%20%231.pdf) — บท 08
- [E-Commerce Project Initiative #2.pdf](itds294/E-Commerce%20Project%20Initiative%20%232.pdf) — บท 09
- [E-Commerce Project Initiative #3.pdf](itds294/E-Commerce%20Project%20Initiative%20%233.pdf) — บท 10
- [ITDS294 eCommerce Session #1.pdf](itds294/ITDS294%20eCommerce%20Session%20%231.pdf) — บท 01
- [ITDS294 eCommerce Session #2.pdf](itds294/ITDS294%20eCommerce%20Session%20%232.pdf) — บท 02
- [ITDS294 eCommerce Session #3.pdf](itds294/ITDS294%20eCommerce%20Session%20%233.pdf) — บท 03
- [ITDS294 eCommerce Session #4 - 5.pdf](itds294/ITDS294%20eCommerce%20Session%20%234%20-%205.pdf) — บท 04
- [ITDS294 eCommerce Session #6.pdf](itds294/ITDS294%20eCommerce%20Session%20%236.pdf) — บท 05
- [ITDS294 eCommerce Session #7 - 8.pdf](itds294/ITDS294%20eCommerce%20Session%20%237%20-%208.pdf) — บท 06
- [ITDS294 eCommerce Session #9 - 10.pdf](itds294/ITDS294%20eCommerce%20Session%20%239%20-%2010.pdf) — บท 07
- [Lean-Canvas.docx](itds294/Lean-Canvas.docx) — บท 08
- [Romans-persona-template.pdf](itds294/Romans-persona-template.pdf) — บท 08
- [SCAMPER-Template.pptx](itds294/SCAMPER-Template.pptx) — บท 08

## จับคู่ครบทุกบทเรียน

### ITDS241 บท 06

[อ่านบทเรียน](../subjects/itds241/chapter-06.html)

- [ITDS241-Lecture06-JavaScript Part 1.pdf](itds241/ITDS241-Lecture06-JavaScript%20Part%201.pdf)

### ITDS241 บท 07

[อ่านบทเรียน](../subjects/itds241/chapter-07.html)

- [ITDS241-Lecture07-JavaScript Part 2.pdf](itds241/ITDS241-Lecture07-JavaScript%20Part%202.pdf)

### ITDS241 บท 08

[อ่านบทเรียน](../subjects/itds241/chapter-08.html)

- [ITDS241-ECMAScript Version_Updated_2026Aug06.pdf](itds241/ITDS241-ECMAScript%20Version_Updated_2026Aug06.pdf)

### ITDS261 บท 01

[อ่านบทเรียน](../subjects/itds261/chapter-01.html)

- [2026 - ITDS261 - L0 - Course introduction.pdf](itds261/2026%20-%20ITDS261%20-%20L0%20-%20Course%20introduction.pdf)
- [2026 - ITDS261 - L1 - SE foundation  SPM.pdf](itds261/2026%20-%20ITDS261%20-%20L1%20-%20SE%20foundation%20%20SPM.pdf)

### ITDS261 บท 02

[อ่านบทเรียน](../subjects/itds261/chapter-02.html)

- [2026 - ITDS261 - L2- Process models.pdf](itds261/2026%20-%20ITDS261%20-%20L2-%20Process%20models.pdf)

### ITDS261 บท 03

[อ่านบทเรียน](../subjects/itds261/chapter-03.html)

- [2026 - ITDS261 - L3 - Requirement Engineering.pdf](itds261/2026%20-%20ITDS261%20-%20L3%20-%20Requirement%20Engineering.pdf)

### ITDS261 บท 04

[อ่านบทเรียน](../subjects/itds261/chapter-04.html)

- [2026 - ITDS261 - Ex2 - Requirements Analysis with Scenario-based Modeling (1).docx](itds261/2026%20-%20ITDS261%20-%20Ex2%20-%20Requirements%20Analysis%20with%20Scenario-based%20Modeling%20%281%29.docx)
- [2026 - ITDS261 - Ex2 - Requirements Analysis with Scenario-based Modeling.pdf](itds261/2026%20-%20ITDS261%20-%20Ex2%20-%20Requirements%20Analysis%20with%20Scenario-based%20Modeling.pdf)
- [2026 - ITDS261 - L4 - Use case modeling.pdf](itds261/2026%20-%20ITDS261%20-%20L4%20-%20Use%20case%20modeling.pdf)

### ITDS261 บท 05

[อ่านบทเรียน](../subjects/itds261/chapter-05.html)

- [2026 - ITDS261 - Ex3 - Flow Modeling (Zoo).pdf](itds261/2026%20-%20ITDS261%20-%20Ex3%20-%20Flow%20Modeling%20%28Zoo%29.pdf)
- [2026 - ITDS261 - L6 - Requirements Modeling Flow and Behavior I.pdf](itds261/2026%20-%20ITDS261%20-%20L6%20-%20Requirements%20Modeling%20Flow%20and%20Behavior%20I.pdf)
- [สกรีนช็อต 2026-09-21 170842.png](itds261/%E0%B8%AA%E0%B8%81%E0%B8%A3%E0%B8%B5%E0%B8%99%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%95%202026-09-21%20170842.png)
- [สกรีนช็อต 2026-09-21 170946.png](itds261/%E0%B8%AA%E0%B8%81%E0%B8%A3%E0%B8%B5%E0%B8%99%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%95%202026-09-21%20170946.png)
- [สกรีนช็อต 2026-09-21 171010.png](itds261/%E0%B8%AA%E0%B8%81%E0%B8%A3%E0%B8%B5%E0%B8%99%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%95%202026-09-21%20171010.png)

### ITDS261 บท 06

[อ่านบทเรียน](../subjects/itds261/chapter-06.html)

- [2026 - ITDS261 - L7 - Requirements Modeling Flow and Behavior II.pdf](itds261/2026%20-%20ITDS261%20-%20L7%20-%20Requirements%20Modeling%20Flow%20and%20Behavior%20II.pdf)

### ITDS261 บท 07

[อ่านบทเรียน](../subjects/itds261/chapter-07.html)

- [2026 - ITDS261 - L8 - User Interface Design.pdf](itds261/2026%20-%20ITDS261%20-%20L8%20-%20User%20Interface%20Design.pdf)

### ITDS261 บท 08

[อ่านบทเรียน](../subjects/itds261/chapter-08.html)

- [2026 - ITDS261 - L9 - Design Architecture and Methodology.pdf](itds261/2026%20-%20ITDS261%20-%20L9%20-%20Design%20Architecture%20and%20Methodology.pdf)

### ITDS261 บท 09

[อ่านบทเรียน](../subjects/itds261/chapter-09.html)

- [2026 - ITDS261 - L10 - Implementation  Code review.pdf](itds261/2026%20-%20ITDS261%20-%20L10%20-%20Implementation%20%20Code%20review.pdf)

### ITDS261 บท 10

[อ่านบทเรียน](../subjects/itds261/chapter-10.html)

- [2026 - ITDS261 - L11 - VCS.pdf](itds261/2026%20-%20ITDS261%20-%20L11%20-%20VCS.pdf)
- [git-cheat-sheet-education.pdf](itds261/git-cheat-sheet-education.pdf)

### ITDS261 บท 11

[อ่านบทเรียน](../subjects/itds261/chapter-11.html)

- [2026 - ITDS261 - Midterm guideline.pdf](itds261/2026%20-%20ITDS261%20-%20Midterm%20guideline.pdf)

### ITDS261 บท 12

[อ่านบทเรียน](../subjects/itds261/chapter-12.html)

- [2026 - ITDS261 - L3 - Requirement Engineering.pdf](itds261/2026%20-%20ITDS261%20-%20L3%20-%20Requirement%20Engineering.pdf)
- [Lab3-Sec2-id6887054.pdf](itds261/Lab3-Sec2-id6887054.pdf)

### ITDS294 บท 01

[อ่านบทเรียน](../subjects/itds294/chapter-01.html)

- [Case Study 0 Uber Everything on Demand.pdf](itds294/Case%20Study%200%20Uber%20Everything%20on%20Demand.pdf)
- [ITDS294 eCommerce Session #1.pdf](itds294/ITDS294%20eCommerce%20Session%20%231.pdf)

### ITDS294 บท 02

[อ่านบทเรียน](../subjects/itds294/chapter-02.html)

- [Case Study 1 Weathering the Storm Twitter’s Un-certain Future.pdf](itds294/Case%20Study%201%20Weathering%20the%20Storm%20Twitter%E2%80%99s%20Un-certain%20Future.pdf)
- [ITDS294 eCommerce Session #2.pdf](itds294/ITDS294%20eCommerce%20Session%20%232.pdf)

### ITDS294 บท 03

[อ่านบทเรียน](../subjects/itds294/chapter-03.html)

- [ITDS294 eCommerce Session #3.pdf](itds294/ITDS294%20eCommerce%20Session%20%233.pdf)

### ITDS294 บท 04

[อ่านบทเรียน](../subjects/itds294/chapter-04.html)

- [Case Study 2 Skyscanner  The One-Stop Travel Platform.pdf](itds294/Case%20Study%202%20Skyscanner%20%20The%20One-Stop%20Travel%20Platform.pdf)
- [ITDS294 eCommerce Session #4 - 5.pdf](itds294/ITDS294%20eCommerce%20Session%20%234%20-%205.pdf)

### ITDS294 บท 05

[อ่านบทเรียน](../subjects/itds294/chapter-05.html)

- [Case Study 3 Alipay and WeChatPay.pdf](itds294/Case%20Study%203%20Alipay%20and%20WeChatPay.pdf)
- [ITDS294 eCommerce Session #6.pdf](itds294/ITDS294%20eCommerce%20Session%20%236.pdf)

### ITDS294 บท 06

[อ่านบทเรียน](../subjects/itds294/chapter-06.html)

- [ITDS294 eCommerce Session #7 - 8.pdf](itds294/ITDS294%20eCommerce%20Session%20%237%20-%208.pdf)

### ITDS294 บท 07

[อ่านบทเรียน](../subjects/itds294/chapter-07.html)

- [ITDS294 eCommerce Session #9 - 10.pdf](itds294/ITDS294%20eCommerce%20Session%20%239%20-%2010.pdf)

### ITDS294 บท 08

[อ่านบทเรียน](../subjects/itds294/chapter-08.html)

- [E-Commerce Project Initiative #1.pdf](itds294/E-Commerce%20Project%20Initiative%20%231.pdf)
- [Lean-Canvas.docx](itds294/Lean-Canvas.docx)
- [Romans-persona-template.pdf](itds294/Romans-persona-template.pdf)
- [SCAMPER-Template.pptx](itds294/SCAMPER-Template.pptx)

### ITDS294 บท 09

[อ่านบทเรียน](../subjects/itds294/chapter-09.html)

- [E-Commerce Project Initiative #2.pdf](itds294/E-Commerce%20Project%20Initiative%20%232.pdf)

### ITDS294 บท 10

[อ่านบทเรียน](../subjects/itds294/chapter-10.html)

- [E-Commerce Project Initiative #3.pdf](itds294/E-Commerce%20Project%20Initiative%20%233.pdf)

