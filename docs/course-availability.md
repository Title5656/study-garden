# สถานะรายวิชาที่ยังไม่เปิดให้เรียน

การ์ดใน `.subject-grid` รองรับ `data-course-status="coming-soon"` (เร็ว ๆ นี้)
และ `data-course-status="in-progress"` (กำลังจัดทำเนื้อหา) บน `.folder-card`
ทั้งสองสถานะแสดงการ์ดจางลง พร้อมป้ายที่ยังอ่านได้ชัด และไม่ให้เปิดรายวิชา
ไม่ใช้ความคืบหน้าการอ่านของผู้เรียนเป็นตัวตัดสินความพร้อมของเนื้อหา

เมื่อเพิ่มวิชาที่ยังไม่พร้อม ให้เขียนเป็นข้อความตั้งแต่ HTML เพื่อให้แสดงสถานะ
และกดไม่ได้แม้ปิด JavaScript ตัวอย่างโครงสร้าง (ใช้ภาพแฟ้มเดิมภายใน `.subject-folder` ได้):

```html
<article class="folder-card palette-indigo"
  data-course-status="in-progress"
  data-search-text="CODE ชื่อวิชา คำค้น"
  aria-disabled="true">
  <span class="folder-category">หมวดวิชา</span>
  <span class="subject-folder">
    <span class="folder-object" aria-hidden="true">
      <!-- ภาพแฟ้มเดิม ไม่ใส่ .folder-key หรือลูกศรเปิดลิงก์ -->
    </span>
  </span>
  <div class="folder-caption">
    <h3>CODE · ชื่อวิชา</h3>
    <span class="course-status" lang="en">In Progress</span>
  </div>
  <p class="folder-topics">กำลังจัดทำเนื้อหา · ยังไม่เปิดให้เรียน</p>
</article>
```

สำหรับ `coming-soon` ใช้ป้าย `Coming Soon` และข้อความ `เร็ว ๆ นี้ · ยังไม่เปิดให้เรียน`
แทน ห้ามใส่ `href="#"` หรือแสดงจำนวนบทที่อ่านแล้วบนการ์ดที่ยังไม่พร้อม

JavaScript ยังรองรับการ์ดเก่าที่มีลิงก์ว่าง ไม่มี `href` หรือใช้ `#` โดยเปลี่ยนเป็น
`Coming Soon` อัตโนมัติ และถอดลิงก์ทั้งภาพแฟ้มและชื่อวิชาออกจากการ์ด
การ์ดที่มีสถานะชัดเจนใช้สถานะนั้น แม้จะยังมี URL เก่าอยู่

เมื่อเนื้อหาพร้อม ให้ถอด `data-course-status` และ `aria-disabled` เปลี่ยนภาพแฟ้ม
และชื่อวิชากลับเป็น `<a href="subjects/.../index.html">` ที่มีหน้าปลายทางจริง
และคืนข้อความความคืบหน้า/ลูกศรตามการ์ดวิชาที่เปิดแล้ว
รายวิชาปัจจุบันทั้ง 4 วิชามีหน้าปลายทางและเปิดให้เรียนตามเดิม

ตรวจพฤติกรรมด้วย `node tools/test-course-availability.mjs`
(ตั้ง `STUDY_GARDEN_PLAYWRIGHT` เป็น file URL ของ Playwright หากไม่ได้ติดตั้งในโปรเจกต์)
