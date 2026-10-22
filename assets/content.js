/* ข้อมูลทบทวนแยกจากกลไกแสดงผล: เพิ่มบทใหม่โดยใช้โครงสร้างเดียวกัน
   answer ใช้เลขดัชนี 0–3; explanation อธิบายเหตุผลหลังส่งคำตอบ */
window.StudyContent = {
  itds241: {
    "06": {
      cards: [
        ["เมื่อคำนวณ total แล้วเปลี่ยน quantity ภายหลัง total เปลี่ยนเองไหม?", "ไม่เปลี่ยน ต้องสั่ง total = price * quantity อีกครั้ง เพราะ assignment เก็บค่าที่คำนวณ ณ ตอนนั้น ไม่ใช่สูตรอัปเดตอัตโนมัติ"],
        [
          "JavaScript",
          "ภาษาที่ใช้เขียนพฤติกรรม เช่น ตอบสนองการคลิก ตรวจข้อมูล และเปลี่ยนหน้าเว็บผ่าน DOM",
        ],
        [
          "Dynamic typing",
          "ชนิดข้อมูลผูกกับค่า ตัวแปร let จึงรับ Number แล้วเปลี่ยนไปรับ String ได้",
        ],
        [
          "let / const",
          "ทั้งคู่มี block scope; let กำหนดค่าใหม่ได้ ส่วน const เปลี่ยน binding ไม่ได้ แต่ยังแก้สมาชิกของ object ได้",
        ],
        [
          "undefined / null",
          "undefined มักหมายถึงยังไม่มีค่าที่กำหนด ส่วน null ใช้ระบุความว่างโดยตั้งใจ",
        ],
        [
          "Strict equality (===)",
          'เปรียบเทียบโดยไม่แปลงชนิดข้อมูล เช่น "5" === 5 เป็น false',
        ],
        [
          "Reference",
          "ตัวแปร object เก็บการอ้างอิง การกำหนด b = a จึงไม่ได้สร้างสำเนา object",
        ],
        [
          "Sentinel",
          'ค่าพิเศษที่ใช้หยุด loop เช่น "stop" เหมาะกับงานที่ไม่รู้จำนวนรอบล่วงหน้า',
        ],
        [
          "break / continue",
          "break ออกจาก loop; continue ข้ามส่วนที่เหลือของรอบปัจจุบันแล้วไปรอบถัดไป",
        ],
        [
          "map / filter / reduce",
          "map แปลงสมาชิกเป็น array ใหม่; filter คัดสมาชิก; reduce สะสมเป็นผลลัพธ์เดียว",
        ],
        ["do…while", "ทำ body ก่อนตรวจเงื่อนไข จึงทำงานอย่างน้อยหนึ่งครั้ง"],
      ],
      quiz: [
        {
          q: "ส่วนใดรับผิดชอบการตอบสนองเมื่อผู้ใช้กดปุ่มบนเว็บ?",
          options: [
            "JavaScript ร่วมกับ Web API",
            "CSS เพียงอย่างเดียว",
            "HTML เพียงอย่างเดียว",
            "ชื่อไฟล์ index.html"
          ],
          answer: 0,
          explanation:
            "HTML วางโครงสร้าง CSS จัดหน้าตา ส่วน JavaScript ผูก event และเปลี่ยนข้อมูลหรือ DOM ตามการกระทำของผู้ใช้ HTML อย่างเดียวไม่ได้กำหนดการคำนวณตามคลิก CSS จัดรูปแบบ และชื่อไฟล์ไม่ได้สร้างพฤติกรรมให้โปรแกรม",
        },
        {
          q: "const user = { score: 1 }; user.score = 2; ให้ผลอย่างไร?",
          options: [
            "เกิด SyntaxError เสมอ",
            "score คงเป็น 1",
            "score กลายเป็น 2",
            "user กลายเป็น null"
          ],
          answer: 2,
          explanation:
            "const ห้ามเปลี่ยนการอ้างอิงของ user แต่ไม่ได้แช่แข็งสมาชิกใน object จึงเปลี่ยน user.score ได้ จึงไม่เกิด SyntaxError จากบรรทัดนี้ score ไม่คงเป็น 1 เพราะมีการเขียนค่าใหม่ และไม่มีคำสั่งกำหนด user เป็น null",
        },
        {
          q: 'ผลของ "5" + 2 และ "5" === 5 ตามลำดับคืออะไร?',
          options: [
            "7 และ true",
            "\"52\" และ true",
            "7 และ false",
            "\"52\" และ false"
          ],
          answer: 3,
          explanation:
            "เมื่อมี string ตัวดำเนินการ + จะต่อข้อความ ส่วน === ไม่แปลง string ให้เป็น number จึงได้ false ผล 7 ต้องแปลงข้อความเป็นจำนวนก่อน ส่วน true ผิดเพราะ === ไม่แปลงชนิด ดังนั้นตัวเลือกที่มี 7 หรือ true จึงผิด",
        },
        {
          q: "let x; console.log(typeof x); จะแสดงอะไร?",
          options: [
            "\"null\"",
            "\"undefined\"",
            "\"number\"",
            "ReferenceError"
          ],
          answer: 1,
          explanation:
            "x ถูกประกาศแล้วแต่ยังไม่มีค่า จึงเป็น undefined และ typeof คืนชื่อชนิดเป็น string \"undefined\" ไม่ใช่ null เพราะไม่ได้กำหนด null ไม่ใช่ number เพราะยังไม่มีค่าตัวเลข และไม่เกิด ReferenceError เพราะ x ถูกประกาศแล้ว",
        },
        {
          q: "const a = { n: 1 }; const b = a; b.n = 9; ค่า a.n คืออะไร?",
          options: [
            "1",
            "undefined",
            "เกิดข้อผิดพลาดจาก const",
            "9"
          ],
          answer: 3,
          explanation:
            "a และ b ชี้ไปยัง object เดียวกัน การแก้ผ่าน b จึงมองเห็นผ่าน a ได้ด้วย จึงไม่คงเป็น 1 ไม่ใช่ undefined เพราะมี property n และ const ไม่ห้ามแก้ property ของ object เดิม",
        },
        {
          q: "ข้อใดเปลี่ยน [1, 2, 3] เป็น [2, 4, 6] และคืน array ใหม่?",
          options: [
            "map(n => n * 2)",
            "forEach(n => n * 2)",
            "filter(n => n * 2)",
            "pop()"
          ],
          answer: 0,
          explanation:
            "map เก็บค่าที่ callback คืนใน array ใหม่ ส่วน forEach คืน undefined และ filter ใช้ค่าจริง/เท็จคัดสมาชิกเดิม ส่วน pop ลบและคืนสมาชิกท้าย จึงไม่ได้สร้าง array ที่คูณทุกตัวด้วยสอง",
        },
        {
          q: "2 + 3 * 4 ได้ค่าเท่าไร?",
          options: [
            "20",
            "24",
            "14",
            "9"
          ],
          answer: 2,
          explanation:
            "คูณมีลำดับความสำคัญก่อนบวก จึงคำนวณ 3 * 4 = 12 แล้วบวก 2 หากต้องการ 20 ให้ใช้ (2 + 3) * 4 24 และ 9 ไม่ได้จากการทำคูณก่อนบวกตามนิพจน์นี้ ต้องติดตามตัวดำเนินการทุกตัว ไม่เดาจากตัวเลขที่เห็น",
        },
        {
          q: "เมื่อเงื่อนไขเป็น false ตั้งแต่เริ่ม โครงสร้างใดยังทำ body หนึ่งครั้ง?",
          options: [
            "while",
            "do…while",
            "if",
            "for"
          ],
          answer: 1,
          explanation:
            "do…while ตรวจเงื่อนไขหลังทำ body จึงต่างจาก while และ for ที่ตรวจก่อนเข้ารอบแรก if ตรวจเงื่อนไขก่อนเช่นกันและไม่ใช่ loop จึงไม่ทำ body เมื่อเงื่อนไข false",
        },
        {
          q: "let s = 0; for (let i = 1; i <= 3; i++) { s += i; } ค่า s สุดท้ายคืออะไร?",
          options: [
            "6",
            "4",
            "3",
            "7"
          ],
          answer: 0,
          explanation:
            "body ทำสามรอบโดย i เป็น 1, 2, 3 ผลรวมคือ 6 เมื่อ i เป็น 4 เงื่อนไขเป็น false จึงไม่บวกอีก 3 คือค่า i ในรอบท้าย ไม่ใช่ผลรวม 4 คือ i หลังเพิ่มเพื่อออกจาก loop ส่วน 7 ไม่ใช่ 1 + 2 + 3",
        },
        {
          q: "ใน loop ที่ i เป็น 0 ถึง 4 หาก i === 2 แล้ว continue ก่อน console.log(i) จะพิมพ์อะไร?",
          options: [
            "0, 1, 2, 3, 4",
            "0, 1",
            "2, 3, 4",
            "0, 1, 3, 4"
          ],
          answer: 3,
          explanation:
            "continue ข้ามเฉพาะการพิมพ์ในรอบ i = 2 แต่ loop ยังไปต่อ ถ้าใช้ break จะหยุดและพิมพ์เพียง 0, 1 ชุด 2, 3, 4 ผิดเพราะรอบ 0 และ 1 ยังทำงาน ชุดที่มี 2 ผิดเพราะข้ามการพิมพ์รอบนั้น",
        },
      ],
    },
    "07": {
      cards: [
        ["return กับ console.log ต่างกันอย่างไร?", "return ส่งค่ากลับให้ผู้เรียกและจบการทำงานครั้งนั้น ส่วน console.log แสดงค่าใน Console การแสดงค่าไม่ได้ส่งค่ากลับแทน return"],
        [
          "Parameter / Argument",
          "Parameter คือชื่อช่องรับค่าในนิยามฟังก์ชัน ส่วน argument คือค่าที่ส่งตอนเรียกใช้",
        ],
        [
          "First-class function",
          "ฟังก์ชันเป็นค่า: เก็บในตัวแปร ส่งเป็น argument หรือคืนจากอีกฟังก์ชันได้",
        ],
        [
          "Higher-order function",
          "ฟังก์ชันที่รับฟังก์ชันอื่นเป็น argument หรือคืนฟังก์ชันออกมา เช่น map",
        ],
        [
          "Callback",
          "ฟังก์ชันที่ส่งให้อีกส่วนเรียกใช้ อาจถูกเรียกทันทีแบบ synchronous หรือภายหลังแบบ asynchronous",
        ],
        [
          "Closure",
          "ฟังก์ชันพร้อมการอ้างอิง lexical environment รอบตัว จึงยังเข้าถึงตัวแปรภายนอกได้แม้ฟังก์ชันภายนอกจบแล้ว",
        ],
        [
          "Class / Instance",
          "Class เป็นแบบแผน ส่วน instance คือ object ที่สร้างจากแบบแผนด้วย new",
        ],
        [
          "Inheritance / Polymorphism",
          "Inheritance ใช้สมาชิกจากต้นแบบแม่; polymorphism ทำให้การเรียก method ชื่อเดียวกันมีพฤติกรรมต่างกันตามชนิด object",
        ],
        [
          "DOM",
          "แบบจำลองเอกสารเป็นต้นไม้ของ node ใช้ค้นหา เพิ่ม ลบ หรือแก้เนื้อหาผ่าน API",
        ],
        [
          "NodeList / HTMLCollection",
          "querySelectorAll คืน static NodeList; getElementsByClassName คืน live HTMLCollection ทั้งคู่ไม่ใช่ Array โดยตรง",
        ],
        [
          "Event listener",
          'ฟังก์ชันที่ลงทะเบียนเพื่อรับเหตุการณ์ เช่น button.addEventListener("click", handler)',
        ],
      ],
      quiz: [
        {
          q: "function sum(a, b) { a + b; } เมื่อเรียก sum(2, 3) คืนค่าอะไร?",
          options: [
            "5",
            "undefined",
            "null",
            "\"23\""
          ],
          answer: 1,
          explanation:
            "การคำนวณ expression อย่างเดียวไม่ใช่การคืนค่า ต้องเขียน return a + b; มิฉะนั้นฟังก์ชันจะคืน undefined จึงไม่ใช่ 5 แม้คำนวณได้ 5 ภายใน ไม่ใช่ null เพราะไม่มีการคืน null และไม่ใช่ข้อความ \"23\" เพราะไม่มีการต่อข้อความ",
        },
        {
          q: "ข้อใดเป็น higher-order function?",
          options: [
            "ฟังก์ชันที่มีชื่อยาว",
            "ฟังก์ชันที่ประกาศด้วย const เท่านั้น",
            "ฟังก์ชันที่ใช้แต่ตัวเลข",
            "ฟังก์ชันที่รับ callback หรือคืนฟังก์ชัน"
          ],
          answer: 3,
          explanation:
            "higher-order อธิบายการรับหรือคืนฟังก์ชัน เช่น map รับ callback เพื่อแปลงสมาชิกแต่ละตัว ความยาวชื่อ การใช้ตัวเลข และการประกาศด้วย const ไม่ใช่เกณฑ์ของ higher-order function",
        },
        {
          q: "ข้อใดอธิบาย callback ได้ถูกต้อง?",
          options: [
            "ต้อง asynchronous ทุกครั้ง",
            "ต้องเป็น arrow function",
            "อาจ synchronous หรือ asynchronous ก็ได้",
            "ใช้กับ event เท่านั้น"
          ],
          answer: 2,
          explanation:
            "callback ของ map ถูกเรียกแบบ synchronous ขณะที่ callback ของ setTimeout จะถูกเรียกภายหลัง ชื่อ callback ไม่ได้กำหนดเวลาเอง ไม่จำเป็นต้องเป็น arrow เพราะ function ปกติก็ส่งเป็นค่าได้ และ map เป็นตัวอย่างที่ไม่ใช่ event",
        },
        {
          q: "if (true) { let x = 7; } แล้วอ่าน x นอก block โดยไม่มี x อื่น จะเกิดอะไร?",
          options: [
            "ReferenceError",
            "ได้ 7",
            "ได้ null",
            "ได้ 0"
          ],
          answer: 0,
          explanation:
            "let มี block scope ตัวแปร x จึงไม่อยู่ในขอบเขตภายนอก ต่างจาก var ที่ยึดขอบเขตฟังก์ชัน จึงไม่ได้ค่า 7, null หรือ 0 การไม่มีชื่อในขอบเขตเป็นข้อผิดพลาด ไม่ใช่การได้ค่าตั้งต้น",
        },
        {
          q: "ทำไมฟังก์ชัน counter ที่ถูก return ออกมาจึงยังเพิ่ม count เดิมได้?",
          options: [
            "ทุกตัวแปรเป็น global",
            "เพราะ closure อ้างอิง environment ที่มี count",
            "เพราะ const ทำให้ค่าอยู่ตลอดไป",
            "เพราะ DOM บันทึกค่าอัตโนมัติ"
          ],
          answer: 1,
          explanation:
            "closure ทำให้ environment ยังเข้าถึงได้ผ่านฟังก์ชันที่คืนมา ตัวแปร local จึงอาจอยู่ต่อหลังฟังก์ชันภายนอกจบ count ยังเป็น local ไม่ใช่ global; const ไม่ได้ยืดอายุทุกค่า และตัวอย่างไม่ต้องใช้ DOM",
        },
        {
          q: "ใน constructor ของ subclass ที่ extends คลาสอื่น ต้องทำอะไรก่อนใช้ this?",
          options: [
            "return null",
            "เรียก this()",
            "เรียก super(...)",
            "ใช้ querySelector()"
          ],
          answer: 2,
          explanation:
            "derived constructor ต้องเรียก super เพื่อสร้างส่วนของ instance จากคลาสแม่ก่อนเข้าถึง this this() ไม่ใช่การเรียก constructor แม่ return null ไม่สร้าง this และ querySelector เกี่ยวกับการค้นหา DOM",
        },
        {
          q: 'querySelector(".item") กับ querySelectorAll(".item") ต่างกันอย่างไร?',
          options: [
            "ตัวแรกคืน element แรกหรือ null; ตัวหลังคืน static NodeList",
            "ทั้งคู่คืน Array",
            "ตัวแรกคืน HTMLCollection; ตัวหลังคืน String",
            "ตัวแรกค้นได้เฉพาะ id"
          ],
          answer: 0,
          explanation:
            "querySelector รองรับ CSS selector และเลือกตัวแรก ส่วน querySelectorAll คืนชุดผลลัพธ์แบบ snapshot ซึ่งอาจเป็นชุดว่าง จึงไม่ใช่ Array ทั้งคู่ ไม่ได้คืน HTMLCollection/String และเลือกด้วย class อย่าง .item ได้ ไม่จำกัดแค่ id",
        },
        {
          q: "ต้องการแสดงข้อความที่ผู้ใช้พิมพ์โดยไม่ให้ถูกตีความเป็น HTML ควรใช้ข้อใด?",
          options: [
            "innerHTML",
            "document.write",
            "eval",
            "textContent"
          ],
          answer: 3,
          explanation:
            "textContent ใส่เป็นข้อความ ส่วน innerHTML แปลเป็น markup จึงไม่ควรนำข้อความที่ไม่เชื่อถือไปใส่โดยตรง document.write ก็แปลเนื้อหาเป็น HTML ส่วน eval ประมวลผลข้อความเป็นโค้ด จึงไม่ใช่การแสดงข้อความอย่างปลอดภัย",
        },
        {
          q: 'สร้าง li ด้วย document.createElement("li") แล้ว ต้องทำอะไรให้ปรากฏใน ul?',
          options: [
            "เรียก console.log(li)",
            "ตั้ง li = \"ul\"",
            "เรียก ul.appendChild(li)",
            "ใช้ new Date()"
          ],
          answer: 2,
          explanation:
            "createElement สร้าง node ที่ยังไม่ติดกับเอกสาร appendChild จึงนำ node เข้าไปอยู่ใต้ parent และปรากฏบนหน้า console.log แสดงใน Console ไม่เพิ่มลง ul; การกำหนด li เป็นข้อความไม่ผูก node และ Date เกี่ยวกับเวลา",
        },
        {
          q: "ข้อใดลงทะเบียน click handler โดยไม่เรียกทันที?",
          options: [
            "button.addEventListener(\"click\", handleClick())",
            "button.addEventListener(\"click\", handleClick)",
            "button.click = handleClick()",
            "handleClick(button)"
          ],
          answer: 1,
          explanation:
            "ต้องส่งตัวฟังก์ชัน handleClick เป็นค่า หากใส่ () จะเรียกทันทีแล้วส่งค่าที่คืนมาแทน callback ตัวเลือกที่มี handleClick() เรียกทันทีทั้งหมด ส่วน handleClick(button) เป็นการเรียกโดยตรง ไม่ได้ลงทะเบียน event",
        },
      ],
    },
    "08": {
      cards: [
        ["Promise.resolve(\"พร้อม\").then(...) ทำ callback ทันทีหรือไม่?", "ไม่ทันที แม้ผลสำเร็จแล้ว callback ของ then ยังทำภายหลังคำสั่งต่อเนื่องชุดปัจจุบัน จึงต้องใช้ผลใน then หรือ await ให้ถูกจุด"],
        [
          "ECMAScript / JavaScript",
          "ECMAScript คือข้อกำหนดมาตรฐานภาษา ส่วน JavaScript คือภาษาที่ implementation ต่าง ๆ ทำตามมาตรฐานนี้; DOM เป็น Web API อีกส่วน",
        ],
        [
          "Promise",
          "ตัวแทนผลลัพธ์งานในอนาคต มีสถานะ pending, fulfilled หรือ rejected เมื่อ settled แล้วไม่เปลี่ยนสถานะอีก",
        ],
        [
          "async / await",
          "async ทำให้ฟังก์ชันคืน Promise; await พักการทำงานต่อของ async function จน Promise settled โดยไม่หยุดทั้งหน้าเว็บ",
        ],
        [
          "Spread / Rest",
          "... แบบ spread กระจายสมาชิกออก ส่วน rest รวบรวมส่วนที่เหลือเข้าด้วยกัน ดูตำแหน่งที่ใช้เพื่อแยกความหมาย",
        ],
        [
          "Destructuring",
          "ดึงสมาชิกจาก array หรือ property จาก object มาใส่ตัวแปรด้วยรูปแบบที่สั้นลง",
        ],
        [
          "Map / Set",
          "Map เก็บคู่ key–value และใช้ key ได้หลายชนิด; Set เก็บค่าไม่ซ้ำ",
        ],
        [
          "Nullish coalescing (??)",
          'ใช้ค่า fallback เฉพาะเมื่อฝั่งซ้ายเป็น null หรือ undefined จึงรักษา 0, false และ "" ไว้',
        ],
        [
          "Optional chaining (?.)",
          "หยุดการเข้าถึงที่ตำแหน่งตรวจสอบเมื่อฐานเป็น null/undefined แล้วคืน undefined แทนการเข้าถึง property ต่อ",
        ],
        [
          "Shallow copy",
          "สำเนาเฉพาะชั้นนอก object ที่ซ้อนอยู่ยังอ้างอิงก้อนเดิม เช่น [...array] และ {...object}",
        ],
        [
          "Feature detection",
          'ตรวจว่าฟีเจอร์มีอยู่ใน runtime จริง เช่น typeof Math.sumPrecise === "function" แทนการเดาจากปีมาตรฐาน',
        ],
        [
          "Proposal",
          "ข้อเสนอพัฒนาภาษาที่สถานะยังเปลี่ยนได้ อย่าตีความว่าทุกหัวข้อในสไลด์เป็น syntax ที่ browser ใช้ได้แล้ว",
        ],
        [
          "Change Array by Copy",
          "toSorted, toReversed, toSpliced และ with คืน array ใหม่ โดยไม่เปลี่ยนโครงสร้าง array ต้นฉบับ",
        ],
      ],
      quiz: [
        {
          q: "ECMAScript กับ JavaScript สัมพันธ์กันอย่างไร?",
          options: [
            "ECMAScript คือ CSS รุ่นใหม่",
            "ECMAScript คือ DOM เท่านั้น",
            "JavaScript เป็น implementation ของมาตรฐาน ECMAScript",
            "ทั้งสองไม่มีความเกี่ยวข้องกัน"
          ],
          answer: 2,
          explanation:
            "มาตรฐาน ECMAScript ระบุพฤติกรรมของภาษา ส่วน engine ของ JavaScript นำข้อกำหนดไปทำงานจริง; Web API ไม่ใช่ส่วนเดียวกัน CSS เป็นภาษาจัดรูปแบบ DOM เป็น Web API สำหรับเอกสาร และคำตอบว่าไม่เกี่ยวข้องขัดกับความสัมพันธ์มาตรฐาน/การนำไปใช้",
        },
        {
          q: "Promise ที่ fulfilled แล้วจะถูก reject ให้กลับเป็น rejected ได้หรือไม่?",
          options: [
            "ไม่ได้ สถานะ settled เปลี่ยนอีกไม่ได้",
            "ได้เฉพาะใน catch",
            "ได้ถ้ารอหนึ่งวินาที",
            "ได้เสมอ"
          ],
          answer: 0,
          explanation:
            "Promise เปลี่ยนจาก pending ไป fulfilled หรือ rejected ได้ครั้งเดียว การเรียก resolve/reject ซ้ำไม่เปลี่ยนผลที่ settled แล้ว catch จัดการความล้มเหลว ไม่เปลี่ยนผลสำเร็จของ Promise เดิม และเวลาที่ผ่านไปก็ไม่เปิดให้เปลี่ยนสถานะได้อีก",
        },
        {
          q: "async function getValue() { return 7; } คืนอะไร?",
          options: [
            "เลข 7 โดยตรง",
            "Promise ที่ fulfilled ด้วย 7",
            "undefined เสมอ",
            "callback"
          ],
          answer: 1,
          explanation:
            "async function คืน Promise เสมอ แม้ return ค่าธรรมดา ค่านั้นจะถูกห่อเป็นผลลัพธ์ fulfilled ของ Promise จึงไม่ใช่เลข 7 ตรง ๆ ไม่ใช่ undefined เพราะมี return 7 และไม่ได้คืนฟังก์ชัน callback",
        },
        {
          q: "ผลของ 0 || 10 และ 0 ?? 10 ตามลำดับคืออะไร?",
          options: [
            "0 และ 0",
            "10 และ 10",
            "0 และ 10",
            "10 และ 0"
          ],
          answer: 3,
          explanation:
            "|| เลือก fallback เมื่อค่าเป็น falsy จึงแทน 0 ด้วย 10 แต่ ?? แทนเฉพาะ null/undefined จึงรักษา 0 ไว้ ตัวเลือกอื่นใช้กฎของตัวดำเนินการอย่างน้อยหนึ่งตัวผิด: 0 เป็น falsy แต่ไม่เป็น nullish",
        },
        {
          q: "const user = {}; user.address?.city ได้ค่าอะไร?",
          options: [
            "undefined",
            "\"city\"",
            "null เสมอ",
            "เกิด SyntaxError"
          ],
          answer: 0,
          explanation:
            "user.address เป็น undefined การใช้ ?. ที่ตรงนี้จึงหยุดการเข้าถึง city และคืน undefined ไม่ได้คืนชื่อ property เป็นข้อความ และไม่ได้สร้าง null ขึ้นมาเอง รูปแบบ ?. ถูกต้องจึงไม่เกิด SyntaxError",
        },
        {
          q: "const a = [{ n: 1 }]; const b = [...a]; b[0].n = 2; ค่า a[0].n คืออะไร?",
          options: [
            "1",
            "undefined",
            "2",
            "เกิดข้อผิดพลาด"
          ],
          answer: 2,
          explanation:
            "spread สร้าง array ชั้นนอกใหม่ แต่ object ที่อยู่ในช่อง 0 ยังเป็นก้อนเดิม จึงเห็น n เป็น 2 ทั้งสองทาง a[0].n ไม่คงเป็น 1 เพราะ object ชั้นในร่วมกัน ไม่ใช่ undefined เพราะ n มีอยู่ และ const ไม่ห้ามแก้สมาชิก",
        },
        {
          q: "หากต้องการตัดค่าซ้ำออกจาก [1, 1, 2] ใช้โครงสร้างใดเหมาะที่สุด?",
          options: [
            "WeakRef",
            "Date",
            "Promise",
            "Set"
          ],
          answer: 3,
          explanation:
            "Set เก็บค่าไม่ซ้ำ เช่น [...new Set([1, 1, 2])] ให้ [1, 2] โดยคงลำดับที่เพิ่มค่าครั้งแรก Date ใช้แทนเวลา Promise แทนผลของงาน และ WeakRef เป็นการอ้างอิงแบบอ่อน ไม่ใช่ชุดเก็บค่าไม่ซ้ำ",
        },
        {
          q: "ข้อใดเรียงตัวเลขโดยไม่แก้ array ต้นฉบับ?",
          options: [
            "a.sort((x, y) => x - y)",
            "a.toSorted((x, y) => x - y)",
            "a.reverse()",
            "a.splice(0, 1)"
          ],
          answer: 1,
          explanation:
            "toSorted คืน array ใหม่ ส่วน sort, reverse และ splice เปลี่ยน array เดิม; comparator จำเป็นเมื่อต้องการเรียงตัวเลข reverse เพียงกลับลำดับและ splice ลบ/แทรกสมาชิก ทั้งคู่ยังแก้ต้นฉบับ ต่างจากเป้าหมายของโจทย์",
        },
        {
          q: "ข้อใดใช้จัดการข้อผิดพลาดจาก Promise ที่ await อยู่ได้?",
          options: [
            "ใช้ if โดยไม่ตรวจค่า",
            "เรียก JSON.stringify เสมอ",
            "เปลี่ยน let เป็น var",
            "ครอบ await ด้วย try…catch"
          ],
          answer: 3,
          explanation:
            "เมื่อ Promise rejected จุด await จะ throw เหตุผลของ rejection จึงรับด้วย try…catch ภายใน async function ได้ if ที่ไม่ตรวจผลไม่รับข้อผิดพลาด การเปลี่ยนคำประกาศตัวแปรไม่เกี่ยวกับ rejection และ JSON.stringify แปลงข้อมูลเป็นข้อความ",
        },
        {
          q: "วิธีใดตรวจว่าบราวเซอร์มี Math.sumPrecise โดยตรงได้เหมาะสมที่สุด?",
          options: [
            "typeof Math.sumPrecise === \"function\"",
            "เชื่อว่าอยู่ในสไลด์จึงใช้ได้ทุกเครื่อง",
            "เรียกฟังก์ชันเลยโดยไม่ตรวจ",
            "ดูปีที่ซื้อคอมพิวเตอร์"
          ],
          answer: 0,
          explanation:
            "feature detection ตรวจ runtime ที่กำลังใช้อยู่จริง ปีของมาตรฐานและการรองรับในแต่ละ browser ไม่จำเป็นต้องตรงกัน ปีที่ซื้อเครื่องและการอยู่ในสไลด์ไม่ยืนยันการรองรับ การเรียกเลยอาจเกิด TypeError เมื่อไม่มีฟังก์ชันนั้น",
        },
      ],
    },
  },
};
