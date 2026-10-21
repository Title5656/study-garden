# Study Garden — Add 611201 Thermodynamics I

## ขอบเขตงานและการส่งต่อ

**โค้ด/เนื้อหาออกแบบและจัดทำเสร็จแล้ว** Codex มีหน้าที่เพียงนำไฟล์จาก ZIP วางทับตาม path ที่กำหนด แล้วรันสคริปต์ติดตั้ง/ทดสอบ ก่อน commit และ push ไปยัง `Title5656/study-garden` เท่านั้น **ไม่ต้องสร้างหรือย่อเนื้อหาใหม่**

Repository เป้าหมาย: `https://github.com/Title5656/study-garden` สาขา `main` ณ วันที่ 2026-10-21. เว็บไซต์ใช้ HTML+CSS+vanilla JS และ GitHub Pages (ไม่มี build step)

## ขั้นตอนสำหรับ Codex

1. ใช้ checkout ล่าสุดของ repository หรือ `git clone https://github.com/Title5656/study-garden.git` แล้ว `cd study-garden`
2. คัดลอกไฟล์ทั้งหมดใน ZIP นี้ลง **root** repository โดยคงโครงสร้าง `assets/`, `subjects/`, `docs/`, `tools/` และ `CODEX_HANDOFF.md` ไว้ตามเดิม (ไม่ลบหรือเขียนทับไฟล์เดิมที่ไม่ได้รวมใน ZIP)
3. ใน root repository รัน:

   ```bash
   node tools/install-thermo.mjs
   node tools/version-assets.mjs
   node tools/test-thermo.mjs
   node tools/check-curriculum.mjs
   node tools/check-assets.mjs
   ```

4. ตรวจ `git diff` ให้แน่ใจว่าไฟล์เดิมเปลี่ยนเฉพาะการเชื่อมหน้าแรก, README, และการขยายจำนวนคอร์สใน test; ถ้ามีการเปลี่ยนจาก upstream ที่ installer ไม่รองรับ ให้ตรวจด้วยคนก่อนแก้ ไม่ควร force/overwrite
5. ถ้า environment มี Playwright ให้รัน `node tools/test-learning.mjs` เพิ่มเพื่อตรวจ regression และเปิดดูหน้าเว็บจริงบนมือถือ/คอมโดยเลือกบท 1, 5 และ 9
6. เมื่อผ่านการตรวจสอบแล้ว `git add assets/thermo* subjects/thermo-chemical docs/thermo-source-map.json tools/thermo-authoring tools/install-thermo.mjs tools/test-thermo.mjs index.html README.md tools/check-curriculum.mjs tools/test-learning.mjs CODEX_HANDOFF.md CODEX_PROMPT.txt` รวมถึงไฟล์อื่นใดที่ `version-assets` จำเป็นต้องอัปเดต, `git commit -m "Add 611201 Thermodynamics learning course"`, แล้ว `git push origin main` ตามสิทธิ์ repo/branch policy. **อย่า force push**

เมื่อเผยแพร่แล้ว หน้าคอร์สคาดว่าจะอยู่ที่ `https://title5656.github.io/study-garden/subjects/thermo-chemical/index.html` โดยขึ้นกับการ deploy ของ GitHub Pages

## สิ่งที่จะได้รับ

- วิชา 611201, 9 บทตามหน้า PDF 4–292, คำอธิบายภาษาไทย 59 หัวข้อ, ตัวอย่างคำนวณทีละขั้น 9 ชุด, แผนที่วิธีแก้ 62 จุดจากตัวอย่างสไลด์
- SVG concept map 9 ภาพ, mini-labs 9 แบบ รวมภาพลูกสูบที่ขยับและสัดส่วนของเหลว–ไอ
- Flashcards 90 ใบ และ Quiz 90 ข้อพร้อมเฉลยและคำอธิบาย ใช้ engine เดิมเพื่อเก็บคะแนน/อ่านแล้วโดยแยก namespace ของวิชา
- ตารางหน้าอ้างอิง: `docs/thermo-source-map.json` และต้นฉบับเนื้อหาแก้ไขได้ `tools/thermo-authoring/author_content.py`

## ข้อควรทราบด้านวิชาการและลิขสิทธิ์

เอกสารต้นทางที่ผู้ใช้ให้ไว้คือ `611201-2569(1).pdf` จำนวน 292 หน้า (รศ.ดร. ศุภกิจ สุทธิเรืองวงศ์); **ZIP นี้ไม่ได้รวม PDF** เพราะ repository เป็นสาธารณะ และไม่ได้รับอนุญาตให้เผยแพร่ไฟล์ต้นฉบับทั้งฉบับ งานบทเรียนเขียนใหม่พร้อมเลขหน้าสไลด์อ้างอิง โดยครอบคลุมหัวข้อสำคัญและสูตร/ข้อควรระวัง อย่างไรก็ตาม **ไม่ได้ถอดทุกบรรทัดและเฉลยตัวเลขครบทุกโจทย์** ผู้เรียนควรอ้างอิงเอกสารของอาจารย์เมื่อฝึกแทนตัวเลขจริง โดยเฉพาะ Steam tables/สมบัติสารจริง

ปัจจุบันสคริปต์ `tools/install-thermo.mjs` ถูกออกแบบให้แก้ไฟล์เดิมน้อยที่สุดและรันซ้ำได้ ถ้ารูปแบบหน้า index เปลี่ยน จะหยุดด้วย error แทนการแก้แบบคาดเดา

## เมื่อแก้บทเรียนภายหลัง

หากผู้ดูแลต้องการแก้เนื้อหา ให้แก้ `tools/thermo-authoring/author_content.py` แล้วรัน `python3 tools/thermo-authoring/build_thermo.py` ตามด้วย `node tools/version-assets.mjs` และชุดตรวจสอบข้างต้น สคริปต์ generate ใช้ Python standard library ไม่ต้องติดตั้ง package เพิ่ม
