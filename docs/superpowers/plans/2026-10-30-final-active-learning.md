# Final Learning Redesign — แผนที่ดำเนินการแล้ว

## ข้อกำหนดล่าสุด

ผู้ใช้อนุมัติให้ปรับหรือสร้างใหม่เพื่อความเข้าใจง่าย โดยใช้ Software Engineering L12 Testing เป็นตัวอย่าง ไม่แยกหมวดกิจกรรม ใช้สีสื่อบทบาทและสถานะในธีมเดิม และเลือกวิธีโต้ตอบตามความเหมาะสม ข้อกำหนดนี้แทนแนวทางรอบแรกที่แยกกิจกรรมและใช้สีน้อยเกินไป

## ขอบเขต

ITDS241 Final chapter-09/10 และ ITDS261 L9–L11 chapter-08/09/10 ใน checkout เดิม ใช้ HTML/CSS/vanilla JS และ reader/quiz เดิม ไม่เพิ่ม backend ไม่เผยแพร่ source PDFs และไม่เปลี่ยนงาน README/screenshots ของผู้ใช้

## ขั้นตอนและสถานะ

- [x] ศึกษา L12: คำอธิบาย → เห็นกลไก → ลงมือเลือก/ทดลอง → เหตุผลของผลลัพธ์
- [x] รวม Node/Express เป็นหัวข้อที่เชื่อมเนื้อหากับการทดลอง เก็บ anchor เดิมและ Flashcards/Quiz
- [x] ฝังแบบจำลอง architecture/code review/Git ในแนวคิดที่เกี่ยวข้อง
- [x] เพิ่ม explorer 8 ชุดและ sorting 2 ชุด พร้อมตัวอย่าง เหตุผล ข้อแลกเปลี่ยน และ reset
- [x] ใช้สีม่วง/น้ำเงิน/เขียว/เหลืองแยกสถานะ พร้อมข้อความ ไม่พึ่งสีอย่างเดียว
- [x] จัดคำถามประยุกต์ไว้ในบทสรุป ไม่สร้างหมวดกิจกรรม คะแนนหรือแรงกดดันด้านเวลา
- [x] ทำ authoring แบบ idempotent และผูกกับ generator ทั้งสองบท
- [x] ตรวจโมเดล การใช้งานจริง keyboard/no-JS/print และมือถือ/light-dark
- [x] ตรวจ shared reader 48 บท, regression Node/Express/Git, generators ใน fixture แยก
- [x] แก้เกมที่ถูกฝังในเฉลยพับอยู่ และตรวจโดย reviewer อิสระ
- [x] อัปเดตรายงาน coverage พร้อมหลักฐานและข้อจำกัด

## จุดตรวจสำคัญ

เวลา I/O เป็นแบบจำลอง ไม่ใช่ benchmark; CPU ยังบล็อก event loop; parser ต้องตรงชนิดและอยู่ก่อน handler; architecture impact คือพื้นที่ต้องตรวจ; refactor รักษาพฤติกรรม; Git commit เก็บ index snapshot และ merge ใช้ฐานร่วม

## ส่งมอบ

งานอยู่ใน local working tree พร้อม preview http://127.0.0.1:62030 (ต้องเปิด local server หากกลับมาใหม่) ผลตรวจและรายการหัวข้ออยู่ใน docs/final-active-learning-coverage.md ยังไม่ได้ commit/push/publish
