# ITDS261 Coverage Mapping

อัปเดต 22 ตุลาคม 2026 · ฐานก่อนแก้ `1c5e997` · branch `codex/itds261-audit-improvement`

## วิธีอ่านและข้อจำกัด

ตรวจต้นฉบับ 20 ไฟล์: อ่าน text ของ PDF ทุกหน้าและ Word XML ของ Exercise 2 แยกจาก PDF; ตรวจภาพ/ตารางที่ระบุในบันทึกทั้งสามกลุ่มและ PNG ทั้งสามโดยตรง เลขหน้าเป็นหน้าของไฟล์ PDF ไม่มี L5 และ Lab3 เป็นงาน ITDS262 ประกอบการเรียน ไม่ใช่เฉลยทางการของ ITDS261

สถานะในตารางหลักใช้แบบอนุรักษ์นิยม: **บางส่วน** หมายถึงปรับหัวข้อหลักแล้วแต่ยังไม่รับรองทุกตัวอย่าง/รายละเอียดภาพในต้นฉบับครบ; **ตรวจไม่ได้** ใช้กับส่วนที่ไม่มีหลักฐานอ่านได้ ส่วน **ครบ** ต้องจำกัดเฉพาะหัวข้อที่มีหลักฐานเพียงพอ ไม่ใช้ผลทดสอบเว็บแทนการรับรองเนื้อหา

ตารางรายละเอียดระดับช่วงหน้าและหัวข้อก่อนแก้เก็บไว้ครบใน [01–04](itds261-audit-01-04.md#page-range-coverage-ledger), [05–08](itds261-audit-05-08.md#source-page-coverage-ledger) และ [09–12](itds261-audit-09-12.md) รวมไฟล์/หน้า/หัวข้อ/section/ช่องว่าง ใช้อ่านร่วมกับรายการแก้ล่าสุดด้านล่าง เพื่อไม่ให้ข้อค้นพบก่อนแก้ถูกเข้าใจว่าแก้ครบแล้วทั้งหมด

## ทุกต้นฉบับ → บทและส่วนที่ครอบคลุม

| Source file | หน้า/ส่วนที่อ่าน | หน้าเว็บ / section | สถานะปัจจุบัน | สิ่งที่แก้หรือเพิ่ม |
|---|---|---|---|---|
| 2026 - ITDS261 - Ex2 - Requirements Analysis with Scenario-based Modeling (1).docx | PDF 1–2 / DOCX body paragraphs | 04#practice-dental, #practice-pos | บางส่วน | ตรวจทั้งสองรูปแบบแยกกัน; เพิ่มภาพตามบทบาทสองระบบและพฤติกรรมอัตโนมัติ; ระบุเพดานต่อทันตแพทย์ |
| 2026 - ITDS261 - Ex2 - Requirements Analysis with Scenario-based Modeling.pdf | 1–2 | 04#practice-dental, #practice-pos | บางส่วน | ตรวจทั้งสองรูปแบบแยกกัน; เพิ่มภาพตามบทบาทสองระบบและพฤติกรรมอัตโนมัติ; ระบุเพดานต่อทันตแพทย์ |
| 2026 - ITDS261 - Ex3 - Flow Modeling (Zoo).pdf | 1–1 | 05#practice-zoo-context, #practice-zoo-level1, #practice-zoo-level2 | บางส่วน | แยกโจทย์ L6 แบบ visitor-only จาก Ex3; อธิบายสิทธิ์และ cancellation/QR |
| 2026 - ITDS261 - L0 - Course introduction.pdf | 1–13 | 01#course-map | บางส่วน | คงการแยก lecture/lab และข้อขัดแย้งคะแนน; ไม่แปลงข้อมูลรายวิชาเป็นข้อสอบ |
| 2026 - ITDS261 - L1 - SE foundation  SPM.pdf | 1–76 | 01#business-software, #people-quality, #poma, #wbs-tools | บางส่วน | เพิ่ม process/product, ชั้นซอฟต์แวร์, test level/technique, support, บทบาท, 10 ด้านบริหาร, WBS→dependency พร้อมตัวเลขสมมติ |
| 2026 - ITDS261 - L10 - Implementation  Code review.pdf | 1–58 | 09#implementation, #style-comments, #debug-refactor, #review-process | บางส่วน | ขยาย paradigms/เครื่องมือ, คุณภาพ 6 ด้าน, comments 9 ข้อ, debugging, smells, Fagan objectives และ checklist |
| 2026 - ITDS261 - L11 - VCS.pdf | 1–33 | 10#cm-vcs, #git-areas, #branches-merge | บางส่วน | เพิ่ม centralized/distributed, file states, Gitflow branch roles และเหตุผลการนำ fix กลับ |
| 2026 - ITDS261 - L2- Process models.pdf | 1–32 | 02#traditional, #spiral, #agile, #selection | บางส่วน | ขยาย incremental, Scrum ในภาพและข้อจำกัดตารางเปรียบเทียบ; ย้ายภาพ Spiral |
| 2026 - ITDS261 - L3 - Requirement Engineering.pdf | 1–67 | 03#requirement-types, #elicitation, #specification, #validation-change; 12#story-ac | บางส่วน | เพิ่ม taxonomy, ตัววัด, Mentcare, structured record, epic/story/task, Zoo criteria, prototype, ERD, SRS, แบบฝึก 5 FR/5 NFR |
| 2026 - ITDS261 - L4 - Use case modeling.pdf | 1–24 | 04#use-case-basics, #relationships, #narrative, #use-case-visual | บางส่วน | คงอธิบายทิศ include/extend/generalization และวิดเจ็ต; เพิ่มพื้นฐาน actor/เป้าหมาย/ขอบเขต |
| 2026 - ITDS261 - L6 - Requirements Modeling Flow and Behavior I.pdf | 1–43 | 05#dfd-elements, #hierarchy-balance, #practice-zoo-context | บางส่วน | เพิ่ม packet, consistency, แบบฝึกภาพผิดและข้อขัดแย้ง entity ในภาพลูก; จำกัดคำอ้างของวิดเจ็ต |
| 2026 - ITDS261 - L7 - Requirements Modeling Flow and Behavior II.pdf | 1–25 | 06#pspec, #triangle, #decision-table, #control-state | บางส่วน | เพิ่ม CASE, pre/post-test loops, decision table และ state reasoning; ย้ายภาพตารางสู่หัวข้อที่ใช้ |
| 2026 - ITDS261 - L8 - User Interface Design.pdf | 1–25 | 07#ui-context, #ui-process, #golden-rules | บางส่วน | เพิ่ม UI 8 ชนิด เป้าหมายคุณภาพ 5 ด้าน และ subrules พร้อมเหตุผล/ตัวอย่าง |
| 2026 - ITDS261 - L9 - Design Architecture and Methodology.pdf | 1–65 | 08#design-levels, #architecture-styles, #mapping, #modularity | บางส่วน | เพิ่ม transform/transaction walkthrough, robot paths, cohesion/coupling ตัวอย่าง; ย้ายภาพให้ตรงหัวข้อ |
| 2026 - ITDS261 - Midterm guideline.pdf | 1–46 | 11#exam-scope, #part1-revision, #part2-method | บางส่วน | เก็บกติกาจริง; เพิ่ม reasoning และลิงก์ถึงเนื้อหาเฉพาะหัวข้อ; แบบฝึกสมมติไม่ใช่ข้อสอบ |
| git-cheat-sheet-education.pdf | 1–2 | 10#git-cheatsheet, #history-workflow | บางส่วน | เพิ่มคำสั่งพร้อมความหมายและข้อควรแยก range/diff/stash/ignore; ไม่รันคำสั่งทำลายข้อมูล |
| Lab3-Sec2-id6887054.pdf | 1–5 | 12#phtrs-scope, #story-ac, #nfr-review, #practice-nfr | บางส่วน | คง ITDS262/student provenance; เพิ่มวิจารณ์ตัวเลขต้นฉบับ; แก้ annual 99% และ Percentile |
| สกรีนช็อต 2026-09-21 170842.png | ภาพเดียวต่อไฟล์ | 05#supplied-guidelines, #practice-zoo-level1 | ครบ: ตรวจภาพต้นฉบับและอธิบายความต่างของแบบจำลอง; ไม่ใช่ยืนยันเฉลย | อ่านภาพต้นฉบับทั้งสาม; อธิบาย mapping หมายเลข store/process ระหว่างต้นฉบับและตัวอย่างเว็บ |
| สกรีนช็อต 2026-09-21 170946.png | ภาพเดียวต่อไฟล์ | 05#supplied-guidelines, #practice-zoo-level1 | ครบ: ตรวจภาพต้นฉบับและอธิบายความต่างของแบบจำลอง; ไม่ใช่ยืนยันเฉลย | อ่านภาพต้นฉบับทั้งสาม; อธิบาย mapping หมายเลข store/process ระหว่างต้นฉบับและตัวอย่างเว็บ |
| สกรีนช็อต 2026-09-21 171010.png | ภาพเดียวต่อไฟล์ | 05#supplied-guidelines, #practice-zoo-level1 | ครบ: ตรวจภาพต้นฉบับและอธิบายความต่างของแบบจำลอง; ไม่ใช่ยืนยันเฉลย | อ่านภาพต้นฉบับทั้งสาม; อธิบาย mapping หมายเลข store/process ระหว่างต้นฉบับและตัวอย่างเว็บ |

## สิ่งที่ยังไม่ควรอ้างว่าครบ

- บางหน้าตรวจข้อความเท่านั้น รายการหน้าที่เปิดภาพจริงอยู่ใน audit แต่ละกลุ่ม ไม่ได้ตรวจทุกภาพแบบขยายเต็มขนาด; code/label ขนาดเล็กบางหน้า L9 และภาพ L8 หน้า 25 ยังไม่รับรองทุกอักขระ
- Exercise 2 DOCX อ่านเนื้อหา Word XML แล้ว แต่ยังไม่ render ตรวจ pagination/header/footer; PDF ทั้งสองหน้าตรวจภาพและข้อความแล้ว
- บท 01 เพิ่มประเภท/ความล้าสมัยและกรอบ Software 1.0/2.0/3.0 แล้ว แต่ไม่ได้สอนเทคโนโลยีในภาพแนวโน้มทุกเรื่อง; บท 02 เพิ่มกรณี CrowdStrike/Knight Capital และ Spotify/HealthCare.gov ตามสไลด์แล้ว ไม่ได้ตรวจรายงานเหตุการณ์หรือวิดีโอฉบับเต็ม
- บท 04 เพิ่มภาพแยกมุมมองตามบทบาทพร้อมรายละเอียดประกอบ แต่ไม่ได้ผลิตเฉลย detailed-level diagram ครบทุกการแตก include/extend ที่เป็นไปได้ (ไม่มีเฉลยทางการในต้นฉบับ)
- บท 08 เพิ่มกระบวนการ mapping และตัวอย่าง coupling/cohesion หลักแล้ว แต่ยังไม่ได้อธิบายโค้ดทุกตัวอย่างใน L9 แบบบรรทัดต่อบรรทัด
- ไม่ได้เปิดวิดีโอ/หนังสือ/ลิงก์ภายนอกทุกอันที่ปรากฏในสไลด์ จึงไม่อ้างว่าอ่านแหล่งเหล่านั้น; เนื้อหาเสริมที่ใช้จริงอยู่ด้านล่าง

## External Sources ที่ใช้จริง

| เอกสาร / ผู้เผยแพร่ | ส่วนที่ตรวจและนำมาใช้ | บท / เหตุผล |
|---|---|---|
| [The Scrum Guide 2020 — Ken Schwaber & Jeff Sutherland](https://scrumguides.org/scrum-guide.html) | The Sprint; Commitment: Definition of Done | 02 / แยกช่วง 2–4 สัปดาห์ในภาพจากกฎไม่เกินหนึ่งเดือน; 03 และลิงก์จาก 12 / แยก DoD จาก acceptance criteria |
| [Pro Git, Scott Chacon & Ben Straub — git-scm.com](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) | Recording Changes to the Repository; staging modified files | 10 / ยืนยันว่า commit ใช้ snapshot ที่ stage ไม่ใช่การแก้ล่าสุดทุกครั้ง |

ตรวจแหล่งข้างต้น 22 ตุลาคม 2026 ผ่านหน้าเอกสารต้นฉบับ IREB glossary ค้นพบแต่เปิดหน้าได้ 503 จึงไม่ใช้เป็นหลักฐานอ้างอิงเพิ่มเติมและไม่ใส่เป็น citation ในบทเรียน ตัวอย่างคลินิก ร้านค้า ตัวเลข workload และ test criteria ที่สร้างขึ้นแยกกำกับว่าเป็นสมมติ/แนวอธิบาย ไม่ใช่ข้อมูลจากสไลด์หรือข้อสอบจริง
