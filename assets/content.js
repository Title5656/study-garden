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

/* Node.js Part I registry */
window.StudyContent.itds241["09"] = {
  "cards": [
    [
      "Node.js",
      "JavaScript runtime นอก browser สร้างบน V8"
    ],
    [
      "Non-blocking I/O",
      "เริ่มงาน I/O แล้วให้ event loop รับงานอื่นต่อ ระหว่างรอผล"
    ],
    [
      "CPU-bound",
      "งานคำนวณ JS นานบน main thread ยังบล็อก event loop"
    ],
    [
      "CommonJS",
      "ระบบ module ที่ใช้ require และ module.exports ในบทนี้"
    ],
    [
      "module.exports",
      "ค่าที่ไฟล์อื่นได้รับเมื่อ require module นี้"
    ],
    [
      "./ ใน require",
      "relative path ของ module ที่เขียนเอง; built-in เช่น http ไม่ต้องมี ./"
    ],
    [
      "__dirname / __filename",
      "โฟลเดอร์ของ module / path เต็มรวมชื่อไฟล์ ใน CommonJS"
    ],
    [
      "path.parse",
      "แยก root, dir, base, name, ext"
    ],
    [
      "host / hostname",
      "host รวม port ที่ไม่ใช่ค่า default; hostname ไม่มี port"
    ],
    [
      "readFile / readFileSync",
      "async callback / sync ที่บล็อกเธรด"
    ],
    [
      "req / res",
      "ข้อมูล request ที่เข้ามา / object สำหรับตอบ response"
    ],
    [
      "res.end()",
      "ส่งข้อมูลส่วนสุดท้ายและจบ response"
    ],
    [
      "200 / 404",
      "สำเร็จ / ไม่พบ resource"
    ],
    [
      "listen(8081)",
      "ให้ server ฟัง port 8081; ไม่ระบุ host ไม่ได้แปลว่ารับแค่ localhost"
    ]
  ],
  "quiz": [
    {
      "q": "สร้าง server ควรทำอะไรก่อน listen(8081)?",
      "options": [
        "เรียก res.end() นอก callback",
        "import http แล้วเรียก createServer",
        "อ่าน window.document",
        "ส่ง status 404 ทุกครั้ง"
      ],
      "answer": 1,
      "explanation": "ต้องมี server object จาก http.createServer ก่อนเรียก listen ส่วน res.end อยู่ใน callback เมื่อมี request เข้ามา"
    },
    {
      "q": "module.exports.sayHi = sayHello ทำให้ require ได้ค่าแบบใด?",
      "options": [
        "string เสมอ",
        "ชื่อ sayHello เพียงอย่างเดียว",
        "object ที่มี property sayHi เป็นฟังก์ชัน",
        "HTML document"
      ],
      "answer": 2,
      "explanation": "ชื่อที่ส่งออกคือ sayHi เรียกผ่าน object.sayHi() แม้ฟังก์ชันต้นทางชื่อ sayHello"
    },
    {
      "q": "fs.readFile ต่างจาก fs.readFileSync อย่างไร?",
      "options": [
        "readFile ใช้ callback แบบ async; readFileSync บล็อกและคืนผลโดยตรง",
        "ทั้งคู่บล็อกเหมือนกัน",
        "readFileSync ใช้ได้เฉพาะใน browser",
        "readFile ไม่รับ error"
      ],
      "answer": 0,
      "explanation": "readFile เริ่มงาน I/O แล้วให้ event loop ทำงานต่อ ผลมาใน callback ส่วน readFileSync รออ่านจบก่อนทำบรรทัดต่อไป"
    },
    {
      "q": "อ่านไฟล์ต่อกัน 1 → 2 → 3 โดยไม่บล็อก ใช้วิธีใด?",
      "options": [
        "readFileSync สามครั้ง",
        "เรียก readFile สามครั้งพร้อมกันแล้วหวังลำดับ",
        "เพิ่มเวลารอเท่ากัน",
        "await fs.promises.readFile ทีละไฟล์"
      ],
      "answer": 3,
      "explanation": "await ทีละงานใน async function รอผลแบบไม่บล็อก event loop; nested callback ก็ทำได้ แต่โค้ดซ้อนมากขึ้น"
    },
    {
      "q": "https://example.com:8080/p/a?country=TH มี protocol, port, pathname อะไร?",
      "options": [
        "http:, 80, /country",
        "https:, 8080, /p/a",
        "https:, 443, ?country=TH",
        "example.com, 8080, /p/a"
      ],
      "answer": 1,
      "explanation": "protocol คือ https: ส่วน port ที่ระบุคือ 8080 และ pathname ไม่รวม query string"
    },
    {
      "q": "สิ่งใดไม่มีใน Node.js แบบเดียวกับ browser?",
      "options": [
        "console.log",
        "module http",
        "document และ window",
        "process"
      ],
      "answer": 2,
      "explanation": "Node ไม่มี DOM ของ browser จึงไม่มี document/window ในสภาพแวดล้อม Node ปกติ"
    },
    {
      "q": "request ขอภาพที่มีเป็นไฟล์อยู่แล้วในโมเดล static ข้ามขั้นใด?",
      "options": [
        "อ่านฐานข้อมูลและรวมข้อมูลกับ HTML template",
        "ส่ง request",
        "รับ response",
        "ส่ง response"
      ],
      "answer": 0,
      "explanation": "static server ส่ง resource ที่เตรียมไว้ได้โดยไม่ต้องเรียก web app/DB เพื่อสร้าง HTML ใหม่"
    },
    {
      "q": "path.parse(\"/a/b/c.txt\") มี name และ base อย่างไร?",
      "options": [
        "name=c.txt, base=c",
        "name=/a/b, base=c.txt",
        "name=c, base=/a/b/c.txt",
        "name=c, base=c.txt"
      ],
      "answer": 3,
      "explanation": "name ไม่รวมนามสกุล ส่วน base คือชื่อไฟล์พร้อมนามสกุล; dir คือ /a/b"
    },
    {
      "q": "เทียบ req.url === \"/bbq\" แล้วรับ /BBQ จะได้อะไรในตัวอย่าง?",
      "options": [
        "200 และหน้า BBQ",
        "404 เพราะตัวพิมพ์ต่างกัน",
        "301 โดยอัตโนมัติ",
        "เปลี่ยนเป็น /bbq เสมอ"
      ],
      "answer": 1,
      "explanation": "การเทียบ string ด้วย === ตรงตามตัวอักษร จึงไม่ normalize ตัวพิมพ์หรือ slash ให้เอง"
    },
    {
      "q": "งานใดทำให้ event loop ติดค้างได้ แม้แอปใช้ async I/O?",
      "options": [
        "รอ callback อ่านไฟล์",
        "รอ response จากฐานข้อมูล",
        "วนคำนวณ JavaScript หนักบน main thread",
        "รับ request ใหม่ขณะที่รอ I/O"
      ],
      "answer": 2,
      "explanation": "การคำนวณ JS บน main thread ยังบล็อก event loop ต้องแบ่งงานหรือย้ายงานคำนวณไป worker ตามความเหมาะสม"
    }
  ]
};

/* Node.js Part II registry */
window.StudyContent.itds241["10"] = {
  "cards": [
    [
      "Express",
      "Web application framework บน Node.js"
    ],
    [
      "npm init",
      "สร้าง package.json ของโครงการ"
    ],
    [
      "package-lock.json",
      "บันทึก dependency tree เพื่อการติดตั้งซ้ำ"
    ],
    [
      "nodemon",
      "เครื่องมือพัฒนา: ตรวจไฟล์แล้ว restart server"
    ],
    [
      "express()",
      "สร้าง Express application"
    ],
    [
      "express.Router()",
      "สร้าง router สำหรับจัดกลุ่มเส้นทาง"
    ],
    [
      "Route",
      "HTTP method และ path ที่เลือก handler"
    ],
    [
      "Middleware",
      "ฟังก์ชันในลำดับ request ที่ใช้ req/res/next"
    ],
    [
      "res.send / res.sendFile",
      "ส่งข้อมูล / ส่งไฟล์ตาม path"
    ],
    [
      "express.static",
      "ให้บริการไฟล์จาก directory ที่ระบุ"
    ],
    [
      "Mount prefix",
      "ส่วนต้น URL ที่เพิ่มให้ router หรือ static middleware"
    ],
    [
      "action / method",
      "ปลายทางการส่งฟอร์ม / HTTP method"
    ],
    [
      "name",
      "ชื่อ key ของข้อมูล input ที่ส่ง"
    ],
    [
      "req.query",
      "ค่าจาก query string"
    ],
    [
      "req.body",
      "ข้อมูล body หลัง parser ที่เหมาะสม"
    ],
    [
      "urlencoded / json",
      "parser ของ form ปกติ / parser ของ JSON"
    ]
  ],
  "quiz": [
    {
      "q": "Express ต่างจาก Node.js อย่างไร?",
      "options": [
        "เป็น framework ที่ทำงานบน Node.js",
        "เป็น browser engine",
        "แทนระบบปฏิบัติการ",
        "เป็นฐานข้อมูล"
      ],
      "answer": 0,
      "explanation": "Node.js คือ runtime ส่วน Express ช่วยจัดการ web application และ routing บน runtime นั้น"
    },
    {
      "q": "คำสั่งใดสร้าง package.json แบบใช้ค่าเริ่มต้น?",
      "options": [
        "npm start",
        "npm install nodemon",
        "npm init -y",
        "node app.cjs"
      ],
      "answer": 2,
      "explanation": "npm init -y สร้างข้อมูลโครงการตามค่าเริ่มต้น ไม่ได้เริ่ม server หรือติดตั้ง Express"
    },
    {
      "q": "สั่ง npm start แล้วทำงานจากที่ใด?",
      "options": [
        "ชื่อโฟลเดอร์ html",
        "scripts.start ใน package.json",
        "คำสั่งใน CSS",
        "req.body"
      ],
      "answer": 1,
      "explanation": "npm start เรียกคำสั่ง start ที่กำหนดใน scripts เช่น node app.cjs หรือ nodemon app.cjs"
    },
    {
      "q": "มีเพียง router.get(\"/add\", handler) การส่ง POST /add จะตรงหรือไม่?",
      "options": [
        "ตรงทุก method",
        "ตรงเมื่อมี query",
        "ตรงถ้ามีพอร์ต 3000",
        "ไม่ตรง เพราะ method ต่างกัน"
      ],
      "answer": 3,
      "explanation": "Route ผูกทั้ง method และ path การกำหนด GET ไม่ได้สร้าง POST handler ให้เอง"
    },
    {
      "q": "ต้องการส่งไฟล์ HTML ด้วย absolute path ใช้อะไร?",
      "options": [
        "res.sendFile(path.join(__dirname,\"html\",\"shabu.html\"))",
        "req.query(\"shabu.html\")",
        "express.json(\"shabu.html\")",
        "npm start html"
      ],
      "answer": 0,
      "explanation": "sendFile ใช้ส่งไฟล์ ส่วน path.join กับ __dirname ให้ absolute path ในตัวอย่าง CommonJS นี้"
    },
    {
      "q": "วาง middleware ส่ง 404 ก่อน routes และไม่เรียก next() จะเกิดอะไรขึ้น?",
      "options": [
        "ส่งต่อทุก route",
        "ทำให้ทุก route เป็น GET",
        "คำขอจบก่อนถึง route ที่อยู่หลัง",
        "ติดตั้ง router เพิ่ม"
      ],
      "answer": 2,
      "explanation": "Middleware ประมวลผลตามลำดับ เมื่อส่ง response จบแล้วและไม่ส่งต่อ handler หลังจากนั้นจะไม่ทำงาน"
    },
    {
      "q": "mount static ที่ /assets และมี public/mystyle.css ต้องขอ URL ใด?",
      "options": [
        "/public/mystyle.css",
        "/assets/mystyle.css",
        "/assets/public/mystyle.css",
        "/mystyle.css เท่านั้น"
      ],
      "answer": 1,
      "explanation": "URL ใช้ mount prefix ตามด้วย path ภายใน public โดยไม่รวมชื่อโฟลเดอร์ public อีกครั้ง"
    },
    {
      "q": "mount product router ที่ /product และ route ภายในคือ /add จะใช้ path ใด?",
      "options": [
        "/add/product",
        "/product/product/add",
        "/add",
        "/product/add"
      ],
      "answer": 3,
      "explanation": "Mount prefix รวมกับ route ภายในทำให้ endpoint เป็น /product/add แยกจาก /user/add ของ router อื่น"
    },
    {
      "q": "GET form มี input name=\"fname\" ควรอ่านค่าจากไหน?",
      "options": [
        "req.query.fname",
        "req.body เสมอ",
        "res.fname",
        "input.id บน server"
      ],
      "answer": 0,
      "explanation": "GET form ส่งคู่ name/value ใน query string จึงอ่านจาก req.query และต้องตรวจค่าก่อนใช้งาน"
    },
    {
      "q": "ฟอร์ม HTML POST แบบปกติต้องใช้ parser ใดก่อน handler?",
      "options": [
        "express.static()",
        "express.Router() อย่างเดียว",
        "express.urlencoded()",
        "express.json() อย่างเดียว"
      ],
      "answer": 2,
      "explanation": "Form ปกติส่ง application/x-www-form-urlencoded จึงใช้ urlencoded ส่วน JSON parser รับ JSON ตาม Content-Type"
    }
  ]
};
/* End Node.js Part II registry */
/* Web services registry */
window.StudyContent.itds241["11"] = {
  "label": "L11",
  "cards": [
    [
      "Environment variable",
      "คู่ชื่อ/ค่าที่แยก configuration ออกจากโค้ด อ่านผ่าน process.env"
    ],
    [
      "Set-Cookie / Cookie",
      "response ขอให้ browser เก็บ / request ส่งค่าที่เข้าเงื่อนไขกลับ"
    ],
    [
      "cookie-parser",
      "อ่าน Cookie header เป็น req.cookies ไม่ใช่ตัวจัดเก็บ session"
    ],
    [
      "maxAge",
      "อายุ cookie หน่วยมิลลิวินาทีใน Express"
    ],
    [
      "Session ID",
      "กุญแจอ้างอิงสถานะบน server ไม่ใช่ข้อมูล session ทั้งก้อน"
    ],
    [
      "MemoryStore",
      "session store ในหน่วยความจำสำหรับพัฒนา restart แล้วข้อมูลหาย"
    ],
    [
      "MySQL Server / Workbench",
      "ระบบฐานข้อมูล / เครื่องมือจัดการฐานข้อมูล"
    ],
    [
      "SQL placeholder",
      "ตำแหน่งค่าที่แยกจากข้อความ SQL ไม่ต่อ input ตรง ๆ"
    ],
    [
      "affectedRows",
      "จำนวนแถวที่ผลการเขียนรายงาน ไม่ใช่แถวข้อมูล SELECT"
    ],
    [
      "dotenv",
      "โหลดค่าจาก .env เข้า process.env ก่อนใช้งาน"
    ]
  ],
  "quiz": [
    {
      "q": "ติดตั้ง dotenv ใช้คำสั่งใด?",
      "options": [
        "npm init dotenv",
        "npm install dotenv",
        "node dotenv init",
        "npm start dotenv"
      ],
      "answer": 1,
      "explanation": "npm install เพิ่มแพ็กเกจ ส่วน npm init สร้าง package.json"
    },
    {
      "q": "server ขอให้ browser เก็บ cookie ผ่านอะไร?",
      "options": [
        "req.body",
        "Cookie ใน response",
        "Set-Cookie ใน response",
        "SQL INSERT"
      ],
      "answer": 2,
      "explanation": "Set-Cookie อยู่ใน response ส่วน Cookie ส่งกลับใน request ตามเงื่อนไข"
    },
    {
      "q": "cookie-parser ช่วยอะไร?",
      "options": [
        "สร้าง MySQL",
        "เข้ารหัสทุก cookie",
        "เก็บ session ใน DB",
        "แปลง Cookie header เป็น req.cookies"
      ],
      "answer": 3,
      "explanation": "การอ่าน req.cookies ต้องมี parser แต่การส่ง cookie ไม่ต้องอาศัย parser"
    },
    {
      "q": "maxAge: 360000 เท่ากับกี่นาที?",
      "options": [
        "6",
        "60",
        "360",
        "0.36"
      ],
      "answer": 0,
      "explanation": "Express ใช้มิลลิวินาที: 360000 / 1000 / 60 = 6 นาที"
    },
    {
      "q": "express-session เก็บข้อมูล numviews ที่ไหนโดยแนวทางนี้?",
      "options": [
        "URL",
        "server store",
        "CSS",
        "ตัว cookie ทั้ง object"
      ],
      "answer": 1,
      "explanation": "cookie ถือ session ID ส่วน numviews อยู่ใน server store"
    },
    {
      "q": "restart server ที่ใช้ MemoryStore แล้วจะเกิดอะไร?",
      "options": [
        "MySQL หาย",
        "cookie ทุกเว็บหาย",
        "ข้อมูล session ในหน่วยความจำหาย",
        "JS ถูกลบ"
      ],
      "answer": 2,
      "explanation": "MemoryStore อยู่ใน process ของ server และไม่ใช่ข้อมูลถาวร"
    },
    {
      "q": "dotenv.config() ควรเรียกเมื่อไร?",
      "options": [
        "หลัง query เสร็จ",
        "หลัง res.send",
        "ก่อนอ่าน process.env ที่พึ่ง .env",
        "เฉพาะ browser"
      ],
      "answer": 2,
      "explanation": "ต้องโหลด configuration ก่อนนำค่ามาสร้าง connection หรือ session"
    },
    {
      "q": "SELECT ไม่พบแถว ผลปกติเป็นอะไร?",
      "options": [
        "อาร์เรย์ว่าง",
        "affectedRows 1",
        "ลบตาราง",
        "401 เสมอ"
      ],
      "answer": 0,
      "explanation": "SELECT สำเร็จแต่ไม่พบข้อมูลต่างจาก query ล้มเหลว"
    },
    {
      "q": "ตัวเลือกใดตรงกับวันหมดอายุ cookie ใน Express?",
      "options": [
        "expire: 100",
        "expires: new Date(...)",
        "expiry: true",
        "ttl: 6"
      ],
      "answer": 1,
      "explanation": "expires รับ Date ส่วน maxAge รับอายุเป็นมิลลิวินาที"
    },
    {
      "q": "ทำไมไม่ควรเช็กแค่มี cookie tokenID แล้วให้ผ่าน?",
      "options": [
        "cookie อ่านไม่ได้เสมอ",
        "MySQL ไม่รู้จัก cookie",
        "cookie ใช้ได้แค่ CSS",
        "ผู้ใช้แก้ข้อมูล client ได้ ต้องตรวจหลักฐาน"
      ],
      "answer": 3,
      "explanation": "การมีชื่อ cookie ไม่พิสูจน์ว่า server ออกหลักฐานที่ถูกต้องและยังใช้ได้"
    }
  ]
};
window.StudyContent.itds241["12"] = {
  "label": "L12",
  "cards": [
    [
      "Web service / API",
      "Web service คือ API ผ่านเครือข่าย; API อาจเป็น interface ภายในเครื่อง"
    ],
    [
      "3-tier",
      "แยก presentation, application และ data management"
    ],
    [
      "Accept / Content-Type",
      "รูป response ที่รับได้ / ชนิด body ของข้อความนั้น"
    ],
    [
      "localStorage",
      "เก็บ string ต่อ origin ไม่ส่ง HTTP อัตโนมัติและไม่มีวันหมดอายุใน API"
    ],
    [
      "sessionStorage",
      "เก็บ string แยกตาม origin และ tab; refresh ยังอยู่"
    ],
    [
      "JSON.stringify / JSON.parse",
      "ค่า → JSON text / JSON text → ค่า"
    ],
    [
      "REST",
      "architectural style ที่มี constraints ไม่ใช่ protocol หรือ JSON"
    ],
    [
      "HATEOAS",
      "response ให้ links เพื่อค้นทางไปทรัพยากร/การเปลี่ยนสถานะ"
    ],
    [
      "Idempotent",
      "ทำคำขอเดิมซ้ำแล้วผลที่ตั้งใจต่อสถานะเหมือนทำครั้งเดียว"
    ],
    [
      "fetch + response.json",
      "รอ Response ก่อน แล้วรออ่าน/parse body อีกครั้ง"
    ]
  ],
  "quiz": [
    {
      "q": "API ทุกตัวต้องใช้เครือข่ายไหม?",
      "options": [
        "ต้องใช้เสมอ",
        "เฉพาะ JSON",
        "ไม่จำเป็น",
        "ต้องมี MySQL"
      ],
      "answer": 2,
      "explanation": "API อาจเรียกใน process หรือเครื่องเดียว ส่วน web service ต้องผ่านเครือข่าย"
    },
    {
      "q": "Content-Type บอกอะไร?",
      "options": [
        "ชนิด body ของข้อความ",
        "ชื่อคนส่ง",
        "อายุ session",
        "จำนวน API"
      ],
      "answer": 0,
      "explanation": "Accept บอกรูป response ที่รับได้ แต่ Content-Type บอกชนิด body ที่ส่ง"
    },
    {
      "q": "ข้อมูลใดส่งกลับ HTTP อัตโนมัติเมื่อเข้าเงื่อนไข?",
      "options": [
        "localStorage",
        "ตัวแปร let",
        "sessionStorage",
        "Cookie"
      ],
      "answer": 3,
      "explanation": "browser ส่ง cookie ตามขอบเขตและนโยบาย ส่วน storage ไม่ส่งเอง"
    },
    {
      "q": "ปิด tab แล้วโดยทั่วไปข้อมูลใดจบตาม tab?",
      "options": [
        "ฐานข้อมูล",
        "sessionStorage",
        "ไฟล์ .env",
        "source code"
      ],
      "answer": 1,
      "explanation": "sessionStorage ผูกกับ page session ของ tab ไม่ใช่ session store บน server"
    },
    {
      "q": "ข้อความใดเป็น JSON ที่ถูกต้อง?",
      "options": [
        "{name:\"Mali\"}",
        "{\"name\":\"Mali\",}",
        "{\"name\":\"Mali\"}",
        "{name:undefined}"
      ],
      "answer": 2,
      "explanation": "JSON ต้องใช้ double quotes และไม่รับ trailing comma/undefined"
    },
    {
      "q": "REST คืออะไร?",
      "options": [
        "รูปแบบสถาปัตยกรรม",
        "protocol แทน HTTP",
        "package ของ Express",
        "รูปแบบฐานข้อมูล"
      ],
      "answer": 0,
      "explanation": "REST วาง constraints ของระบบ ส่วน HTTP/JSON เป็นสิ่งที่นำมาใช้ได้"
    },
    {
      "q": "ข้อใดเป็น constraint ทางเลือก?",
      "options": [
        "Stateless",
        "Uniform interface",
        "Client–server",
        "Code on demand"
      ],
      "answer": 3,
      "explanation": "Code on demand เป็น optional constraint ไม่จำเป็นทุกบริการ"
    },
    {
      "q": "DELETE ซ้ำแล้ว 200 ตามด้วย 404 ยัง idempotent ได้หรือไม่?",
      "options": [
        "ไม่ได้เด็ดขาด",
        "ได้ ถ้าผลต่อ resource ยังคือถูกลบ",
        "ได้เฉพาะไม่มี body",
        "ต้องตอบ 200 เท่านั้น"
      ],
      "answer": 1,
      "explanation": "idempotence ดูผลที่ตั้งใจต่อสถานะ ไม่ใช่ status code เหมือนกัน"
    },
    {
      "q": "Fetch ได้ HTTP 404 จะเป็นอย่างไรโดยปกติ?",
      "options": [
        "reject อัตโนมัติเสมอ",
        "ลบ localStorage",
        "resolve เป็น Response ที่ ok=false",
        "retry เองเสมอ"
      ],
      "answer": 2,
      "explanation": "ต้องตรวจ response.ok/status เอง HTTP error ต่างจาก network failure"
    },
    {
      "q": "REST stateless ห้ามเก็บตารางนักศึกษาหรือไม่?",
      "options": [
        "ไม่ห้าม resource state",
        "ห้ามฐานข้อมูลทุกแบบ",
        "ห้าม JSON",
        "ห้าม server"
      ],
      "answer": 0,
      "explanation": "ไม่พึ่ง conversation context ของคำขอก่อน แต่ยังเก็บ resource state ได้"
    }
  ]
};
window.StudyContent.itds241["13"] = {
  "label": "L13",
  "cards": [
    [
      "CRUD",
      "Create/Read/Update/Delete สัมพันธ์กับ INSERT/SELECT/UPDATE/DELETE"
    ],
    [
      "express.json()",
      "parser JSON body ต้องวางก่อน handler ที่อ่าน req.body"
    ],
    [
      "req.params / req.body",
      "ค่าจาก path parameters / body ที่ parse แล้ว"
    ],
    [
      "CORS origin",
      "scheme + host + port ตรงกันจึงเป็น origin เดียวกัน"
    ],
    [
      "Preflight",
      "OPTIONS ตรวจการอนุญาตก่อนคำขอจริงบางประเภท"
    ],
    [
      "JWT signature",
      "ตรวจความถูกต้องและการแก้ไข ไม่ใช่เข้ารหัส payload"
    ],
    [
      "sign / verify",
      "สร้าง token / ตรวจ token ตาม key และเงื่อนไข"
    ],
    [
      "401 / 403",
      "ไม่มีหลักฐานตัวตนที่ใช้ได้ / รู้ตัวตนแต่ไม่มีสิทธิ์"
    ],
    [
      "Axios response.data",
      "ข้อมูล body ที่ client แปลงให้ ไม่ต้อง response.json() แบบ fetch"
    ],
    [
      "Breakpoint",
      "หยุดที่จุดโค้ดเพื่อดูค่าและเส้นทางจริงของ request"
    ]
  ],
  "quiz": [
    {
      "q": "ต้องวางอะไรก่อน route ที่อ่าน JSON body?",
      "options": [
        "express.json()",
        "res.send()",
        "axios.get()",
        "JWT payload"
      ],
      "answer": 0,
      "explanation": "JSON parser ต้องทำงานก่อน handler จึงอ่าน req.body ได้"
    },
    {
      "q": "body ใช้ STU_ID แต่ handler อ่าน student_id จะเกิดอะไร?",
      "options": [
        "Express แปลงให้เอง",
        "MySQL สร้าง ID เสมอ",
        "อาจได้ undefined เพราะ key ไม่ตรง",
        "CORS เปลี่ยน key"
      ],
      "answer": 2,
      "explanation": "ชื่อ field เป็นส่วนของสัญญา ต้องใช้ให้ตรงและตรวจ parent object ก่อน"
    },
    {
      "q": "localhost:3100 กับ localhost:3000 เป็น origin เดียวไหม?",
      "options": [
        "เป็นเสมอ",
        "ไม่ใช่เพราะ port ต่าง",
        "เป็นถ้าใช้ JSON",
        "ขึ้นกับ JWT"
      ],
      "answer": 1,
      "explanation": "Origin รวม scheme, host และ port ไม่ใช่แค่ host"
    },
    {
      "q": "CORS แทน authentication ได้ไหม?",
      "options": [
        "ได้ถ้า *",
        "ได้เมื่อใช้ POST",
        "ได้เฉพาะ MySQL",
        "ไม่ได้"
      ],
      "answer": 3,
      "explanation": "CORS ควบคุมการอ่านโดย browser ไม่ใช่พิสูจน์ตัวตนหรือสิทธิ์"
    },
    {
      "q": "JWT payload อ่านได้หรือไม่ใน signed JWT ที่เรียน?",
      "options": [
        "อ่านไม่ได้เพราะเข้ารหัสเสมอ",
        "ได้ เพราะ encoding ไม่ใช่ encryption",
        "อ่านได้แค่ root",
        "ได้หลังลบ secret"
      ],
      "answer": 1,
      "explanation": "Header/payload เป็น Base64URL ลายเซ็นช่วยตรวจความถูกต้องไม่ปกปิดข้อมูล"
    },
    {
      "q": "JWT verify ต้องตรวจสิ่งใด?",
      "options": [
        "เพียงมีจุดสองจุด",
        "เพียง decode ได้",
        "ลายเซ็นและเงื่อนไข เช่นอายุ/issuer/audience",
        "เฉพาะสี header"
      ],
      "answer": 2,
      "explanation": "Token มีรูปถูกยังปลอมได้ ต้อง verify และตรวจ claims ตามสัญญา"
    },
    {
      "q": "token ผ่านแต่ไม่มีสิทธิ์ ควรตอบสถานะใดตามบทเรียน?",
      "options": [
        "200",
        "201",
        "401",
        "403"
      ],
      "answer": 3,
      "explanation": "403 แยกผู้ใช้ที่ตรวจตัวตนผ่านแล้วแต่ไม่อนุญาตทำรายการ"
    },
    {
      "q": "Axios ได้ข้อมูล body จากไหน?",
      "options": [
        "response.data",
        "response.json() เสมอ",
        "req.params",
        "process.env.body"
      ],
      "answer": 0,
      "explanation": "Axios แปลงข้อมูลให้ตามรูปแบบที่รองรับ ส่วน fetch ใช้ body-reading methods"
    },
    {
      "q": "GET ID ไม่มีแถวควรทำอะไรก่อน data.STU_ID?",
      "options": [
        "ตั้ง 200 เสมอ",
        "ตรวจ not-found/error",
        "ลบ DB",
        "sign token ใหม่"
      ],
      "answer": 1,
      "explanation": "ต้องแยกไม่พบข้อมูลจากผลสำเร็จที่มี record เพื่อไม่ให้ UI อ่าน undefined"
    },
    {
      "q": "Postman เรียกได้แต่ browser อ่านไม่ได้ควรเริ่มตรงไหน?",
      "options": [
        "เขียน SQL ใหม่ทันที",
        "เปลี่ยนฐานข้อมูล",
        "ตรวจ CORS/origin/preflight",
        "ลบ package.json"
      ],
      "answer": 2,
      "explanation": "Postman ไม่ถูกจำกัด CORS เหมือน scripts ใน browser จึงช่วยแยกชั้นที่ผิดได้"
    }
  ]
};
/* End Web services registry */
/* Webtech labels */
window.StudyContent.itds241["10"].label = "L10";
window.StudyContent.itds241["11"].label = "L11";
window.StudyContent.itds241["12"].label = "L12";
window.StudyContent.itds241["13"].label = "L13";
window.StudyContent.itds241["06"].label = "L6";
window.StudyContent.itds241["07"].label = "L7";
window.StudyContent.itds241["08"].label = "ECMAScript";
window.StudyContent.itds241["09"].label = "L9";
/* End Webtech labels */
