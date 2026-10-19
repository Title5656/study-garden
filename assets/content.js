/* ข้อมูลทบทวนแยกจากกลไกแสดงผล: เพิ่มบทใหม่โดยใช้โครงสร้างเดียวกัน
   answer ใช้เลขดัชนี 0–3; explanation อธิบายเหตุผลหลังส่งคำตอบ */
window.StudyContent = {
  itds241: {
    "06": {
      cards: [
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
            "HTML เพียงอย่างเดียว",
            "CSS เพียงอย่างเดียว",
            "JavaScript ร่วมกับ Web API",
            "ชื่อไฟล์ index.html",
          ],
          answer: 2,
          explanation:
            "HTML วางโครงสร้าง CSS จัดหน้าตา ส่วน JavaScript ผูก event และเปลี่ยนข้อมูลหรือ DOM ตามการกระทำของผู้ใช้",
        },
        {
          q: "const user = { score: 1 }; user.score = 2; ให้ผลอย่างไร?",
          options: [
            "เกิด SyntaxError เสมอ",
            "score กลายเป็น 2",
            "score คงเป็น 1",
            "user กลายเป็น null",
          ],
          answer: 1,
          explanation:
            "const ห้ามเปลี่ยนการอ้างอิงของ user แต่ไม่ได้แช่แข็งสมาชิกใน object จึงเปลี่ยน user.score ได้",
        },
        {
          q: 'ผลของ "5" + 2 และ "5" === 5 ตามลำดับคืออะไร?',
          options: [
            "7 และ true",
            '"52" และ true',
            "7 และ false",
            '"52" และ false',
          ],
          answer: 3,
          explanation:
            "เมื่อมี string ตัวดำเนินการ + จะต่อข้อความ ส่วน === ไม่แปลง string ให้เป็น number จึงได้ false",
        },
        {
          q: "let x; console.log(typeof x); จะแสดงอะไร?",
          options: ['"undefined"', '"null"', '"number"', "ReferenceError"],
          answer: 0,
          explanation:
            'x ถูกประกาศแล้วแต่ยังไม่มีค่า จึงเป็น undefined และ typeof คืนชื่อชนิดเป็น string "undefined"',
        },
        {
          q: "const a = { n: 1 }; const b = a; b.n = 9; ค่า a.n คืออะไร?",
          options: ["1", "undefined", "9", "เกิดข้อผิดพลาดจาก const"],
          answer: 2,
          explanation:
            "a และ b ชี้ไปยัง object เดียวกัน การแก้ผ่าน b จึงมองเห็นผ่าน a ได้ด้วย",
        },
        {
          q: "ข้อใดเปลี่ยน [1, 2, 3] เป็น [2, 4, 6] และคืน array ใหม่?",
          options: [
            "forEach(n => n * 2)",
            "map(n => n * 2)",
            "filter(n => n * 2)",
            "pop()",
          ],
          answer: 1,
          explanation:
            "map เก็บค่าที่ callback คืนใน array ใหม่ ส่วน forEach คืน undefined และ filter ใช้ค่าจริง/เท็จคัดสมาชิกเดิม",
        },
        {
          q: "2 + 3 * 4 ได้ค่าเท่าไร?",
          options: ["20", "14", "24", "9"],
          answer: 1,
          explanation:
            "คูณมีลำดับความสำคัญก่อนบวก จึงคำนวณ 3 * 4 = 12 แล้วบวก 2 หากต้องการ 20 ให้ใช้ (2 + 3) * 4",
        },
        {
          q: "เมื่อเงื่อนไขเป็น false ตั้งแต่เริ่ม โครงสร้างใดยังทำ body หนึ่งครั้ง?",
          options: ["while", "for", "if", "do…while"],
          answer: 3,
          explanation:
            "do…while ตรวจเงื่อนไขหลังทำ body จึงต่างจาก while และ for ที่ตรวจก่อนเข้ารอบแรก",
        },
        {
          q: "let s = 0; for (let i = 1; i <= 3; i++) { s += i; } ค่า s สุดท้ายคืออะไร?",
          options: ["3", "4", "6", "7"],
          answer: 2,
          explanation:
            "body ทำสามรอบโดย i เป็น 1, 2, 3 ผลรวมคือ 6 เมื่อ i เป็น 4 เงื่อนไขเป็น false จึงไม่บวกอีก",
        },
        {
          q: "ใน loop ที่ i เป็น 0 ถึง 4 หาก i === 2 แล้ว continue ก่อน console.log(i) จะพิมพ์อะไร?",
          options: ["0, 1, 3, 4", "0, 1", "2, 3, 4", "0, 1, 2, 3, 4"],
          answer: 0,
          explanation:
            "continue ข้ามเฉพาะการพิมพ์ในรอบ i = 2 แต่ loop ยังไปต่อ ถ้าใช้ break จะหยุดและพิมพ์เพียง 0, 1",
        },
      ],
    },
    "07": {
      cards: [
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
          options: ["5", "null", "undefined", '"23"'],
          answer: 2,
          explanation:
            "การคำนวณ expression อย่างเดียวไม่ใช่การคืนค่า ต้องเขียน return a + b; มิฉะนั้นฟังก์ชันจะคืน undefined",
        },
        {
          q: "ข้อใดเป็น higher-order function?",
          options: [
            "ฟังก์ชันที่มีชื่อยาว",
            "ฟังก์ชันที่รับ callback หรือคืนฟังก์ชัน",
            "ฟังก์ชันที่ใช้แต่ตัวเลข",
            "ฟังก์ชันที่ประกาศด้วย const เท่านั้น",
          ],
          answer: 1,
          explanation:
            "higher-order อธิบายการรับหรือคืนฟังก์ชัน เช่น map รับ callback เพื่อแปลงสมาชิกแต่ละตัว",
        },
        {
          q: "ข้อใดอธิบาย callback ได้ถูกต้อง?",
          options: [
            "ต้อง asynchronous ทุกครั้ง",
            "ต้องเป็น arrow function",
            "ใช้กับ event เท่านั้น",
            "อาจ synchronous หรือ asynchronous ก็ได้",
          ],
          answer: 3,
          explanation:
            "callback ของ map ถูกเรียกแบบ synchronous ขณะที่ callback ของ setTimeout จะถูกเรียกภายหลัง ชื่อ callback ไม่ได้กำหนดเวลาเอง",
        },
        {
          q: "if (true) { let x = 7; } แล้วอ่าน x นอก block โดยไม่มี x อื่น จะเกิดอะไร?",
          options: ["ReferenceError", "ได้ 7", "ได้ null", "ได้ 0"],
          answer: 0,
          explanation:
            "let มี block scope ตัวแปร x จึงไม่อยู่ในขอบเขตภายนอก ต่างจาก var ที่ยึดขอบเขตฟังก์ชัน",
        },
        {
          q: "ทำไมฟังก์ชัน counter ที่ถูก return ออกมาจึงยังเพิ่ม count เดิมได้?",
          options: [
            "ทุกตัวแปรเป็น global",
            "เพราะ const ทำให้ค่าอยู่ตลอดไป",
            "เพราะ closure อ้างอิง environment ที่มี count",
            "เพราะ DOM บันทึกค่าอัตโนมัติ",
          ],
          answer: 2,
          explanation:
            "closure ทำให้ environment ยังเข้าถึงได้ผ่านฟังก์ชันที่คืนมา ตัวแปร local จึงอาจอยู่ต่อหลังฟังก์ชันภายนอกจบ",
        },
        {
          q: "ใน constructor ของ subclass ที่ extends คลาสอื่น ต้องทำอะไรก่อนใช้ this?",
          options: [
            "เรียก super(...)",
            "เรียก this()",
            "return null",
            "ใช้ querySelector()",
          ],
          answer: 0,
          explanation:
            "derived constructor ต้องเรียก super เพื่อสร้างส่วนของ instance จากคลาสแม่ก่อนเข้าถึง this",
        },
        {
          q: 'querySelector(".item") กับ querySelectorAll(".item") ต่างกันอย่างไร?',
          options: [
            "ทั้งคู่คืน Array",
            "ตัวแรกคืน element แรกหรือ null; ตัวหลังคืน static NodeList",
            "ตัวแรกคืน HTMLCollection; ตัวหลังคืน String",
            "ตัวแรกค้นได้เฉพาะ id",
          ],
          answer: 1,
          explanation:
            "querySelector รองรับ CSS selector และเลือกตัวแรก ส่วน querySelectorAll คืนชุดผลลัพธ์แบบ snapshot ซึ่งอาจเป็นชุดว่าง",
        },
        {
          q: "ต้องการแสดงข้อความที่ผู้ใช้พิมพ์โดยไม่ให้ถูกตีความเป็น HTML ควรใช้ข้อใด?",
          options: ["innerHTML", "document.write", "eval", "textContent"],
          answer: 3,
          explanation:
            "textContent ใส่เป็นข้อความ ส่วน innerHTML แปลเป็น markup จึงไม่ควรนำข้อความที่ไม่เชื่อถือไปใส่โดยตรง",
        },
        {
          q: 'สร้าง li ด้วย document.createElement("li") แล้ว ต้องทำอะไรให้ปรากฏใน ul?',
          options: [
            "เรียก console.log(li)",
            'ตั้ง li = "ul"',
            "เรียก ul.appendChild(li)",
            "ใช้ new Date()",
          ],
          answer: 2,
          explanation:
            "createElement สร้าง node ที่ยังไม่ติดกับเอกสาร appendChild จึงนำ node เข้าไปอยู่ใต้ parent และปรากฏบนหน้า",
        },
        {
          q: "ข้อใดลงทะเบียน click handler โดยไม่เรียกทันที?",
          options: [
            'button.addEventListener("click", handleClick)',
            'button.addEventListener("click", handleClick())',
            "button.click = handleClick()",
            "handleClick(button)",
          ],
          answer: 0,
          explanation:
            "ต้องส่งตัวฟังก์ชัน handleClick เป็นค่า หากใส่ () จะเรียกทันทีแล้วส่งค่าที่คืนมาแทน callback",
        },
      ],
    },
    "08": {
      cards: [
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
            "JavaScript เป็น implementation ของมาตรฐาน ECMAScript",
            "ECMAScript คือ DOM เท่านั้น",
            "ทั้งสองไม่มีความเกี่ยวข้องกัน",
          ],
          answer: 1,
          explanation:
            "มาตรฐาน ECMAScript ระบุพฤติกรรมของภาษา ส่วน engine ของ JavaScript นำข้อกำหนดไปทำงานจริง; Web API ไม่ใช่ส่วนเดียวกัน",
        },
        {
          q: "Promise ที่ fulfilled แล้วจะถูก reject ให้กลับเป็น rejected ได้หรือไม่?",
          options: [
            "ได้เสมอ",
            "ได้เฉพาะใน catch",
            "ได้ถ้ารอหนึ่งวินาที",
            "ไม่ได้ สถานะ settled เปลี่ยนอีกไม่ได้",
          ],
          answer: 3,
          explanation:
            "Promise เปลี่ยนจาก pending ไป fulfilled หรือ rejected ได้ครั้งเดียว การเรียก resolve/reject ซ้ำไม่เปลี่ยนผลที่ settled แล้ว",
        },
        {
          q: "async function getValue() { return 7; } คืนอะไร?",
          options: [
            "Promise ที่ fulfilled ด้วย 7",
            "เลข 7 โดยตรง",
            "undefined เสมอ",
            "callback",
          ],
          answer: 0,
          explanation:
            "async function คืน Promise เสมอ แม้ return ค่าธรรมดา ค่านั้นจะถูกห่อเป็นผลลัพธ์ fulfilled ของ Promise",
        },
        {
          q: "ผลของ 0 || 10 และ 0 ?? 10 ตามลำดับคืออะไร?",
          options: ["0 และ 0", "10 และ 10", "10 และ 0", "0 และ 10"],
          answer: 2,
          explanation:
            "|| เลือก fallback เมื่อค่าเป็น falsy จึงแทน 0 ด้วย 10 แต่ ?? แทนเฉพาะ null/undefined จึงรักษา 0 ไว้",
        },
        {
          q: "const user = {}; user.address?.city ได้ค่าอะไร?",
          options: ['"city"', "undefined", "null เสมอ", "เกิด SyntaxError"],
          answer: 1,
          explanation:
            "user.address เป็น undefined การใช้ ?. ที่ตรงนี้จึงหยุดการเข้าถึง city และคืน undefined",
        },
        {
          q: "const a = [{ n: 1 }]; const b = [...a]; b[0].n = 2; ค่า a[0].n คืออะไร?",
          options: ["1", "undefined", "เกิดข้อผิดพลาด", "2"],
          answer: 3,
          explanation:
            "spread สร้าง array ชั้นนอกใหม่ แต่ object ที่อยู่ในช่อง 0 ยังเป็นก้อนเดิม จึงเห็น n เป็น 2 ทั้งสองทาง",
        },
        {
          q: "หากต้องการตัดค่าซ้ำออกจาก [1, 1, 2] ใช้โครงสร้างใดเหมาะที่สุด?",
          options: ["Set", "Date", "Promise", "WeakRef"],
          answer: 0,
          explanation:
            "Set เก็บค่าไม่ซ้ำ เช่น [...new Set([1, 1, 2])] ให้ [1, 2] โดยคงลำดับที่เพิ่มค่าครั้งแรก",
        },
        {
          q: "ข้อใดเรียงตัวเลขโดยไม่แก้ array ต้นฉบับ?",
          options: [
            "a.sort((x, y) => x - y)",
            "a.reverse()",
            "a.toSorted((x, y) => x - y)",
            "a.splice(0, 1)",
          ],
          answer: 2,
          explanation:
            "toSorted คืน array ใหม่ ส่วน sort, reverse และ splice เปลี่ยน array เดิม; comparator จำเป็นเมื่อต้องการเรียงตัวเลข",
        },
        {
          q: "ข้อใดใช้จัดการข้อผิดพลาดจาก Promise ที่ await อยู่ได้?",
          options: [
            "ใช้ if โดยไม่ตรวจค่า",
            "ครอบ await ด้วย try…catch",
            "เปลี่ยน let เป็น var",
            "เรียก JSON.stringify เสมอ",
          ],
          answer: 1,
          explanation:
            "เมื่อ Promise rejected จุด await จะ throw เหตุผลของ rejection จึงรับด้วย try…catch ภายใน async function ได้",
        },
        {
          q: "วิธีใดตรวจว่าบราวเซอร์มี Math.sumPrecise โดยตรงได้เหมาะสมที่สุด?",
          options: [
            "ดูปีที่ซื้อคอมพิวเตอร์",
            "เชื่อว่าอยู่ในสไลด์จึงใช้ได้ทุกเครื่อง",
            "เรียกฟังก์ชันเลยโดยไม่ตรวจ",
            'typeof Math.sumPrecise === "function"',
          ],
          answer: 3,
          explanation:
            "feature detection ตรวจ runtime ที่กำลังใช้อยู่จริง ปีของมาตรฐานและการรองรับในแต่ละ browser ไม่จำเป็นต้องตรงกัน",
        },
      ],
    },
  },
};
