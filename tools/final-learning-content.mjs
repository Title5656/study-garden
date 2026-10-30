// Canonical authored additions. Both the installer and Node/Express generators use this file.
const prompt = (predict, experiment, explain) => ({predict, experiment, explain});
export const lessons = {
  'itds241/09': {
    title: 'Node.js Part I', start: 'before-start',
    goal: 'ตามคำขอจาก browser ไปจนถึง response ได้ และอธิบายได้ว่าบรรทัดใดรันตอนนี้ บรรทัดใดรอผลภายหลัง',
    route: [
      ['topic-2','ภาพรวมเว็บ → request/response → IP/port','แยกหน้าที่ client, server, app และฐานข้อมูล แล้วประกอบ URL ไปยังบริการที่ต้องการ'],
      ['topic-7','Runtime → event loop → งาน I/O และ CPU','อธิบายว่าการรอ I/O ต่างจากการคำนวณบน JS thread อย่างไร'],
      ['topic-12','ติดตั้ง → รันไฟล์ → globals','รัน node filename.js และแยก environment ของ Node ออกจาก DOM ใน browser'],
      ['topic-16','Module → exports → require','ไล่ได้ว่าค่าที่ module ส่งออกถูกเรียกใช้ด้วยชื่อใด'],
      ['topic-20','Path → URL','แยก path ของไฟล์ออกจาก URL ของ request และอ่าน field ได้'],
      ['topic-25','File I/O → callback → ลำดับการอ่าน','เลือกอ่านขนานหรืออ่านต่อกันจาก dependency ของข้อมูล'],
      ['topic-30','HTTP → req/res → routing','ตามเงื่อนไขจนถึง status และจุดจบ response ได้']
    ],
    prompts: {
      'p1-ch1-reqres': prompt('ขอไฟล์ภาพที่มีอยู่แล้ว ต้องผ่าน Database เหมือนหน้ารายงานหรือไม่?', 'เปลี่ยน Dynamic เป็น Static แล้วเดิน request ทีละขั้น ดูว่าเส้นทางใดถูกข้าม', 'ในแบบจำลอง static ส่ง resource ที่เตรียมไว้ ส่วน dynamic ใช้ app และข้อมูลสร้างคำตอบ ตัวระบบจริงอาจมี cache หรือส่วนประกอบอื่นเพิ่ม'),
      'p1-ch1-url-build': prompt('ถ้า hostname เดิมแต่เปลี่ยน port จะยังหมายถึงบริการเดิมเสมอหรือไม่?', 'ประกอบ http://localhost:8081 แล้วชี้ว่าส่วนใดบอก protocol เครื่อง และบริการ', 'port แยกบริการบนเครื่องเดียวกัน ไม่ใช่ path ของหน้าเว็บ; localhost หมายถึงเครื่องที่กำลังส่งคำขอ'),
      'p1-ch2-eventloop': prompt('ส่งงาน I/O สองงานที่ใช้เวลาเท่ากัน ถ้าไม่บล็อก งานที่สองต้องรอให้งานแรกจบหรือไม่?', 'กำหนดเวลา 3 ขั้น ส่ง 2 requests แล้วเดินเวลา เปรียบเทียบ Blocking กับ Non-blocking จากนั้นเปลี่ยนเป็น CPU', 'I/O แบบ non-blocking เปิดโอกาสให้ JS รับงานอื่นระหว่างรอ แต่ CPU ที่รันบน JS thread ยังบล็อกอยู่ ตัวเลขเป็นเวลาในโมเดล ไม่ใช่ผล benchmark หรือรายละเอียดทุก phase ของ Node'),
      'p1-ch3-hello': prompt('บันทึกไฟล์ .js แล้วข้อความจะปรากฏใน terminal ทันทีหรือไม่?', 'เดินถึงขั้นรันโปรแกรม สังเกตว่า node เป็นคำสั่ง ส่วน helloworld.js เป็นไฟล์ที่ส่งให้ runtime', 'การเขียนไฟล์กับการรันเป็นคนละขั้น console.log ในตัวอย่างนี้ออก terminal ของ process ที่รัน Node'),
      'p1-ch4-modules': prompt('ชื่อ sayHello ภายในไฟล์ต้องเหมือนชื่อ sayHi ที่ผู้ใช้ module เรียกหรือไม่?', 'เปลี่ยนเฉพาะชื่อ export เป็น other แล้ว Run จากนั้นแก้ผู้เรียกให้ตรง', 'require รับค่าจาก module.exports ผู้ใช้จึงต้องเรียก key ที่ส่งออก ไม่ใช่เดาชื่อฟังก์ชันภายในไฟล์'),
      'p1-ch5-path': prompt('ใน /notes/report.txt ค่า name ต่างจาก base ตรงไหน?', 'เปลี่ยนเป็น /notes/report.csv แล้วดู field ที่เปลี่ยนและ field ที่คงเดิม', 'base รวมชื่อกับนามสกุล name ไม่รวมนามสกุล ส่วน dir ระบุโฟลเดอร์ ไม่ใช่ URL ของเว็บ'),
      'p1-ch5-url': prompt('ใน https://example.com:8080/a?x=1#top ส่วนใดเป็น pathname?', 'เปลี่ยนเฉพาะ query แล้วเปรียบเทียบ pathname, search และ hash', 'pathname คือ /a; query อยู่ใน search ส่วน fragment หลัง # ใช้ฝั่ง client และไม่ถูกส่งเป็นส่วนของ HTTP request target'),
      'p1-ch6-asyncorder': prompt('เรียกอ่านไฟล์ 1, 2, 3 ตามลำดับ แปลว่า callback ต้องจบเรียงกันหรือไม่?', 'ตั้งเวลา 300, 100, 200 ms แล้วเทียบ Parallel, Sync และ Nested โดยไม่เปลี่ยนเวลา', 'Parallel ในโมเดลจบ 2 → 3 → 1; Nested และ Sync จบ 1 → 2 → 3 แต่ Nested ไม่บล็อก JS ระหว่างรอ ลำดับจริงขึ้นกับการเสร็จของงาน ไม่ใช่เลขชื่อไฟล์'),
      'p1-ch7-serverbuilder': prompt('callback ของ createServer รันตอนสร้าง server หรือเมื่อ request เข้ามา?', 'เรียงโค้ดแล้ว Run แยกลำดับตั้งค่า server ออกจากลำดับส่ง response', 'require → createServer → listen เป็นการตั้งค่า ส่วน status/header/write/end อยู่ใน callback ที่ถูกเรียกเมื่อรับ request'),
      'p1-ch7-routetester': prompt('ในตัวอย่างที่เทียบ req.url ด้วย === คำขอ /bbq?x=1 จะตรง /bbq หรือไม่?', 'ลอง /bbq, /BBQ และ /bbq?x=1 แล้วดู branch ที่ถูกเลือก', 'ตัวอย่างนี้เทียบ string ตรงตัว หากต้องการใช้เฉพาะ pathname ต้อง parse URL ก่อน อย่าเหมารวมว่าทุก router มีพฤติกรรมนี้')
    },
    checks: [
      {id:'io-order', q:'อ่าน A ใช้ 80 ms และ B ใช้ 20 ms แบบขนานในโมเดลนี้ แต่ต้องแสดง A ก่อน B เสมอ วิธีใดอธิบายได้ถูกต้อง?', options:['เริ่ม A ก่อนจึงแสดง A ก่อนแน่นอน','รอผลทั้งสองแล้วเรียงการแสดงตามชื่อ หรือรอ A แล้วค่อยอ่าน B','เพิ่มเวลา B แบบสุ่ม'], answer:1, why:'เวลาเริ่มไม่รับประกันลำดับ callback ถ้าต้องรักษาลำดับการแสดงสามารถเก็บผลแล้วเรียงได้ ถ้า B ต้องใช้ข้อมูลจาก A จึงต้องรอ A ก่อนเริ่ม B', link:'topic-28'},
      {id:'module-route', q:'module.exports.lookup = find; const catalog = require("./catalog"); handler ควรเรียกอะไรเพื่อใช้สิ่งที่ส่งออก?', options:['catalog.find() เพราะเป็นชื่อฟังก์ชันภายใน','require.find()','catalog.lookup() ตาม key ที่ export'], answer:2, why:'ชื่อภายในกับ public interface เป็นคนละเรื่อง lookup เป็น key ที่ module ส่งออก; เรียกได้หรือไม่ยังขึ้นกับค่าที่ export ว่าเป็นฟังก์ชัน', link:'topic-17'}
    ]
  },
  'itds241/10': {
    title:'Node.js Part II · Express', start:'before-start',
    goal:'ตาม method, path และข้อมูลของ request ผ่าน middleware จนถึง response แล้วหาจุดที่ต้องแก้ได้',
    route:[
      ['p2-topic-1','HTTP เดิม → Express → template','แยก runtime, framework และการสร้าง HTML จากข้อมูล'],
      ['p2-topic-5','npm → server → start/nodemon','รู้ว่าแต่ละคำสั่งสร้างหรือติดตั้งอะไร และเมื่อใด server ต้อง restart'],
      ['p2-topic-9','Method/path → sendFile → middleware/404','หาว่า handler ใดตอบ และ response จบก่อนถึง route หรือไม่'],
      ['p2-topic-13','Static mount → Router prefix','สร้าง URL จาก mount path โดยไม่เอาชื่อโฟลเดอร์ public มาต่อซ้ำ'],
      ['p2-topic-18','Form → action/method/name → GET/POST → parser','ระบุว่าข้อมูลอยู่ใน query หรือ body และต้อง parse อย่างไร']
    ],
    prompts:{
      'p2-template':prompt('ถ้า template เดิม แต่ชื่อในข้อมูลเปลี่ยน ต้องเขียนหน้า HTML ใหม่ทั้งหน้าหรือไม่?', 'เปลี่ยนชื่อและดูผลข้อความ แยกส่วน template ที่คงเดิมจากข้อมูลที่เปลี่ยน', 'Template engine รวมโครงกับข้อมูล การ escape ต้องเหมาะกับบริบท; ตัวอย่างนี้แสดงข้อความ ไม่ได้รัน EJS/Pug จริง'),
      'p2-setup':prompt('npm install express กับ npm start มีหน้าที่เดียวกันหรือไม่?', 'เดินขั้นตั้งโครงการ แล้วบอกว่าแต่ละขั้นเปลี่ยนไฟล์ ติดตั้ง package หรือเริ่ม process', 'package.json อธิบายโครงการและ scripts; package-lock.json เก็บ dependency tree; nodemon เป็นตัวช่วย restart ระหว่างพัฒนา'),
      'p2-middleware':prompt('ถ้า 404 middleware ตอบก่อน routes จะมี route ที่ถูกต้องช่วยแก้คำตอบได้อีกหรือไม่?', 'ส่ง GET /product/add สองครั้ง โดยเปลี่ยนตำแหน่ง 404 เพียงอย่างเดียว', 'middleware ทำงานตามลำดับ เมื่อจบ response แล้วไม่ส่งต่อ route ด้านหลังจึงไม่ถูกเรียก; middleware ที่ไม่ตอบต้อง next() หากต้องการให้สายงานเดินต่อ'),
      'p2-static':prompt('mount /assets ไปที่ public แล้วไฟล์ public/images/sample.png ต้องใช้ URL ใด?', 'ลอง /assets/images/sample.png เทียบกับ /assets/public/images/sample.png', 'mount เป็น prefix ฝั่ง URL ส่วน public เป็น directory ฝั่ง server จึงไม่นำชื่อ public มาต่อใน URL อีกครั้ง'),
      'p2-route':prompt('Router มี /add และ mount ที่ /product ถ้าส่ง POST ไปยัง GET route จะตรงหรือไม่?', 'เทียบ GET กับ POST ที่ /product/add และเปลี่ยนเป็น /user/add', 'ต้องตรงทั้ง HTTP method และ path ที่รวม prefix แล้ว ไม่ใช่ตรงข้อความ /add อย่างเดียว'),
      'p2-form':prompt('ข้อมูล JSON จะเข้า req.body ได้หรือไม่ ถ้าใช้ urlencoded parser หรือวาง parser หลัง handler?', 'เปลี่ยนทีละอย่าง: Content-Type → parser → ตำแหน่ง → name ของ input แล้วอ่านเส้นทางข้อมูล', 'parser ต้องอยู่ก่อน handler และรับ Content-Type นั้น ตัวอย่าง handler เลือกคืน 400 เมื่อข้อมูลไม่ครบเอง ไม่ใช่สถานะที่ Express คืนให้อัตโนมัติทุกกรณี')
    },
    checks:[
      {id:'form-parser',q:'POST ส่ง JSON และ handler อยู่ก่อน express.json() ข้อมูลยังไม่พร้อม ควรแก้อย่างไร?',options:['ย้าย express.json() ไปก่อน handler และตรวจข้อมูลที่รับ','เปลี่ยนชื่อ req.body เป็น req.query','เพิ่ม 404 middleware ไว้ข้างหน้า'],answer:0,why:'การรับ JSON ต้องผ่าน JSON parser ก่อนที่ handler จะอ่าน body จากนั้น handler ยังต้องตรวจค่าตามกติกาของแอป',link:'p2-form'},
      {id:'mount-path',q:'app.use("/assets", express.static("public")) และมี public/logo.png ต้องขอ URL ใด?',options:['/public/logo.png','/assets/public/logo.png','/assets/logo.png'],answer:2,why:'ตัด mount prefix /assets แล้วค้น logo.png ภายใน directory public ชื่อ directory ไม่ใช่ส่วนหนึ่งของ URL โดยอัตโนมัติ',link:'p2-static'}
    ]
  },
  'itds261/08': {
    title:'L9 · Architecture',start:'before-you-start',
    goal:'เลือกโครงสร้างจาก requirement และอธิบายผลของการเปลี่ยนแปลง พร้อมข้อแลกเปลี่ยนที่ต้องยอมรับ',
    route:[
      ['design-levels','Requirement → architecture → detailed design','แยกสิ่งที่ระบบต้องทำ โครงสร้างใหญ่ และรายละเอียดแต่ละส่วน'],
      ['architecture-styles','Architectural styles','เลือกจากการไหลของข้อมูล การกระจายงาน และคุณภาพที่ต้องการ'],
      ['mapping','DFD → structure chart','แยกภาพการไหลของข้อมูลออกจากภาพการเรียกใช้โมดูล'],
      ['modularity','Cohesion → coupling','จัดหน้าที่ที่เกี่ยวข้องไว้ด้วยกันและลดความรู้ที่ต้องมีเกี่ยวกับส่วนอื่น'],
      ['design-principles','หลักออกแบบและ trade-offs','ระบุว่าขอบเขตที่เพิ่มช่วยการเปลี่ยนแปลงใด และเพิ่มภาระใด']
    ],
    bridges:{
      'design-levels':'ลองใช้คำขอเดียวกันสามระดับ: “ลูกค้าจ่ายเงินได้” เป็น requirement; “แยก Checkout กับ Payment” เป็นการตัดสินโครงสร้าง; “ฟังก์ชัน charge รับ amount และคืน receipt” เป็นรายละเอียด interface การตอบชื่อเทคโนโลยีอย่างเดียวยังไม่อธิบายว่ารองรับความต้องการอย่างไร',
      'architecture-styles':'เริ่มจากคำถามว่าข้อมูลและความรับผิดชอบอยู่ที่ใด: ถ้าหลายส่วนต้องใช้ข้อมูลกลาง ให้พิจารณาข้อดีและจุดเสี่ยงของ repository; ถ้าแยกผู้ขอบริการกับผู้ให้บริการ ให้พิจารณา client/server ทุกตัวเลือกต้องกลับมาตรวจคุณภาพที่ requirement ต้องการ',
      'mapping':'อ่าน DFD ว่า “ข้อมูลอะไรไหลผ่านการแปลงใด” ก่อน แล้วจึงวางโมดูลและความสัมพันธ์การเรียกใน structure chart ลูกศรข้อมูลไม่ใช่คำสั่งเรียกฟังก์ชันโดยอัตโนมัติ จึงต้องใช้เหตุผลในการจัดกลุ่มและแบ่งระดับ',
      'modularity':'นับจำนวนไฟล์อย่างเดียวบอก modularity ไม่ได้ ฟังก์ชันที่ทำเรื่องเดียวกันควรอยู่ด้วยกัน (cohesion) ขณะเดียวกันผู้เรียกควรรู้เพียงสัญญาที่จำเป็น (coupling) การแยกไฟล์แต่ยังอ่านตัวแปรภายในของกันและกันอาจไม่ได้ลดผลกระทบ',
      'design-principles':'เพิ่ม abstraction เมื่อมีความต่างที่ต้องซ่อนหรือการเปลี่ยนที่คาดหมายได้ แล้วชั่งกับโค้ดและภาระดูแลที่เพิ่ม ความยืดหยุ่นไม่มีต้นทุนเป็นศูนย์และไม่จำเป็นต้องเตรียมรองรับทุกอนาคต'
    },
    lab:{id:'learn-impact',after:'modularity',kind:'architecture',title:'ลองเปลี่ยนผู้ให้บริการจ่ายเงิน',predict:'เปลี่ยน Provider แล้ว Checkout, Refund และ Report จำเป็นต้องรู้รูปแบบใหม่ทุกส่วนหรือไม่?',fallback:'กรณีเรียก Provider โดยตรง ผู้ใช้ทั้งสามส่วนอาจได้รับผลกระทบ ถ้าผ่าน Adapter ที่รักษาสัญญาเดิมได้ การเปลี่ยนรูปแบบภายในอาจจบที่ Adapter แต่ถ้าสัญญาเปลี่ยน ผู้ใช้ก็ต้องตรวจตามไปด้วย',limit:'โมเดลแสดงส่วนที่อาจต้องตรวจ ไม่ได้ยืนยันว่าต้องแก้โค้ดทุกจุด ลูกศรหมายถึง “เรียกใช้/พึ่งพา” ไม่ใช่การไหลของข้อมูลใน DFD'},
    checks:[
      {id:'stable-contract',q:'เปลี่ยนผู้ให้บริการ แต่ Adapter ยังคืน receipt รูปแบบเดิมได้ เหตุผลใดช่วยจำกัดผลกระทบต่อ Checkout?',options:['จำนวนไฟล์มากขึ้นจึงปลอดภัยกว่า','Checkout อาศัยสัญญาที่คงเดิม แทนรายละเอียดของ Provider','Adapter ทำให้ไม่ต้องทดสอบอีก'],answer:1,why:'ขอบเขตซ่อนรายละเอียดที่เปลี่ยนได้ แต่ยังต้องทดสอบ Adapter และ integration เพื่อยืนยันสัญญา ไม่ใช่สรุปจากจำนวนไฟล์',link:'learn-impact'},
      {id:'cohesion',q:'โมดูลเดียวรวมคิดราคา ส่งอีเมล และอ่าน sensor ที่ไม่เกี่ยวกัน ควรเริ่มพิจารณาอะไร?',options:['เปลี่ยนชื่อไฟล์ให้สั้นลง','เพิ่ม global variable ให้ทุกส่วนใช้ร่วมกัน','แบ่งตามความรับผิดชอบเพื่อเพิ่ม cohesion แล้วตรวจ interface ระหว่างส่วน'],answer:2,why:'หน้าที่ที่ไม่เกี่ยวกันทำให้โมดูลเปลี่ยนด้วยหลายเหตุผล การแบ่งต้องดูความสัมพันธ์และ coupling ที่ตามมา ไม่ใช่แยกทุกฟังก์ชันเป็นไฟล์',link:'modularity'}
    ]
  },
  'itds261/09': {
    title:'L10 · Implementation / Code Review',start:'before-you-start',
    goal:'แยก defect ออกจากข้อเสนอด้านโครงสร้าง และเขียน feedback ที่ผู้อื่นนำไปแก้พร้อมตรวจผลได้',
    route:[
      ['implementation','Paradigms → เครื่องมือ → คุณภาพ implementation','เลือกวิธีทำงานโดยยังรับผิดชอบความถูกต้องและการดูแลต่อ'],
      ['style-comments','Style → comments','อธิบายเหตุผลหรือข้อจำกัดที่โค้ดอย่างเดียวไม่สื่อ'],
      ['debug-refactor','Debugging → refactoring','ใช้หลักฐานแยกพฤติกรรมผิดจากการปรับโครงสร้างโดยคงพฤติกรรม'],
      ['review-process','Inspection → modern review','รู้หน้าที่ผู้เขียน ผู้ตรวจ และขั้นติดตามการแก้'],
      ['practice-review','PR feedback → การตรวจซ้ำ','ผูกข้อเสนอเข้ากับตำแหน่ง ผลกระทบ และวิธีตรวจ']
    ],
    bridges:{
      'implementation':'การเลือกภาษา paradigm หรือเครื่องมือสร้างโค้ดเปลี่ยนวิธีผลิตงาน แต่ไม่ยกเลิกการตรวจ requirement ตัวอย่างเช่นโปรแกรมที่รันได้แต่คิดส่วนลดที่ค่าขอบผิดยังเป็น implementation ที่ไม่ตรงงาน ต้องหาหลักฐานจาก input และ output',
      'style-comments':'comment ที่บอกว่า “ลดราคา” ซ้ำกับชื่อฟังก์ชันเพิ่มข้อมูลน้อยกว่า comment ที่บอกเหตุผลของเกณฑ์ 1000 หรือที่มาของกติกา ถ้า comment กับโค้ดขัดกันให้ตรวจ requirement ไม่ใช่เลือกเชื่อสิ่งใดโดยไม่มีหลักฐาน',
      'debug-refactor':'ก่อนแก้ให้เขียน input ที่ทำให้ผลผิดและผลที่ควรได้ จากนั้นระบุสาเหตุ แก้ และตรวจซ้ำ การเปลี่ยน > เป็น >= เปลี่ยนพฤติกรรมตรงค่าขอบ จึงเป็น bug fix เมื่อกติกากำหนดรวมค่าขอบ ไม่ใช่เพียง refactor',
      'review-process':'แยกการหา defect ออกจากการถกความชอบส่วนตัว ผู้ตรวจควรชี้หลักฐานและความเสี่ยง ผู้เขียนแก้ แล้วมีการติดตามว่าปัญหาเดิมหายและไม่สร้างปัญหาใหม่ automated tests ช่วยให้การสนทนาตรวจซ้ำได้ แต่ไม่ได้ครอบคลุมทุกคุณภาพ',
      'practice-review':'feedback ที่นำไปทำต่อได้มีสามส่วน: “เงื่อนไขนี้ใช้ > 1000” → “ยอด 1000 จึงไม่ได้ส่วนลดตาม requirement” → “เปลี่ยนให้รวมค่าขอบและเพิ่มกรณี 999/1000/1001” ส่วนการตั้งชื่อควรอธิบายว่าช่วยสื่ออะไรและแยกจาก defect'
    },
    lab:{id:'learn-review',after:'debug-refactor',kind:'review',title:'รีวิวการคิดส่วนลดด้วยหลักฐาน',predict:'กติกา: ยอดตั้งแต่ 1000 บาทลด 10% ถ้าโค้ดใช้ amount > 1000 ยอด 1000 จะจ่ายเท่าไร?',fallback:'ยอด 999 จ่าย 999; ยอด 1000 ควรจ่าย 900; ยอด 1001 จ่าย 900.90 โค้ดเดิมที่ใช้ > ให้ผลผิดเฉพาะค่าขอบในชุดนี้ การดึงเงื่อนไขเดิมไปไว้ในตัวแปรช่วยอ่าน แต่ยังคง defect จนกว่าจะเปลี่ยนเป็น >=',limit:'ตัวอย่างฝึกที่เรียบเรียงเพิ่ม จำนวนเงินไม่ติดลบและปัดสองตำแหน่ง; การผ่านกรณีตัวอย่างไม่ใช่หลักฐานว่าถูกต้องกับ input ทุกชนิด'},
    checks:[
      {id:'refactor',q:'ดึง amount > 1000 ไปไว้ในตัวแปร eligible โดยใช้เงื่อนไขเดิม และผลเหมือนเดิม จัดเป็นอะไร?',options:['Refactoring ที่ยังคง defect ตรง 1000','แก้บั๊กแล้วเพราะอ่านง่ายขึ้น','เปลี่ยน requirement'],answer:0,why:'โครงสร้างเปลี่ยนแต่พฤติกรรมเดิมยังอยู่ การแก้ defect ต้องทำให้ผลตรง requirement โดยมีกรณีทดสอบรองรับ',link:'learn-review'},
      {id:'feedback',q:'comment ใน PR แบบใดช่วยให้ผู้เขียนแก้ได้ชัดที่สุด?',options:['โค้ดไม่ดี แก้ใหม่','ใช้ >= แทน > ที่เงื่อนไขส่วนลด เพราะยอด 1000 ต้องลดด้วย แล้วทดสอบ 999/1000/1001','ผ่านแล้วเพราะโปรแกรมรันได้'],answer:1,why:'ระบุจุด เงื่อนไขที่ผิด ผลกระทบ และวิธีตรวจซ้ำ ทำให้ feedback ตรวจสอบได้และมุ่งที่งาน',link:'practice-review'}
    ]
  },
  'itds261/10': {
    title:'L11 · Version Control',start:'before-you-start',
    goal:'บอกสถานะของงานแต่ละพื้นที่ได้ และรวมการเปลี่ยนของทีมโดยตรวจทั้งประวัติและความหมายของผลลัพธ์',
    route:[
      ['cm-vcs','Configuration management → VCS','แยกการควบคุมรุ่นของสิ่งส่งมอบออกจากเพียงเก็บไฟล์โค้ด'],
      ['git-areas','Working tree → index → local → remote','ทำนาย snapshot ที่ commit และสิ่งที่เพื่อนเห็นหลัง push'],
      ['branches-merge','Branch → fetch/pull → merge → Gitflow','อ่านสายประวัติและแยกการรับข้อมูลออกจากการรวมงาน'],
      ['git-cheatsheet','History → move/remove → stash → ignore','เลือกคำสั่งจากสถานะและคำถามที่ต้องการตอบ'],
      ['history-workflow','Undo → reset/rebase → workflow','พิจารณาผลต่อไฟล์ index และประวัติที่แชร์ก่อนทำงาน']
    ],
    bridges:{
      'cm-vcs':'ถามก่อนว่าต้องส่งมอบอะไรให้ทำซ้ำได้: source, configuration และเอกสารที่เกี่ยวข้องอาจต้องระบุรุ่นสัมพันธ์กัน VCS เป็นเครื่องมือส่วนหนึ่งของ configuration management ไม่ได้ตัดสินให้เองว่าชุดใดผ่าน review หรือพร้อม release',
      'git-areas':'ก่อนกด commit ให้อ่าน git diff --staged เป็น “สิ่งที่กำลังจะบันทึกเทียบ HEAD” ไม่ใช่ดูไฟล์ใน editor อย่างเดียว ลอง edit → add → edit → commit แล้วเทียบ working tree กับ local repository ก่อนค่อย push',
      'branches-merge':'branch เป็นชื่อที่ชี้ปลายประวัติ การ merge ต้องดูฐานร่วมและงานทั้งสองฝั่ง การไม่มี conflict บอกเพียงว่ารวมเนื้อหาได้ตามกลไก ยังต้องตรวจว่าเงื่อนไขทางธุรกิจทำงานร่วมกันได้ Gitflow เป็นวิธีจัดสายงานแบบหนึ่ง',
      'git-cheatsheet':'เริ่มจากคำถาม: “แก้อะไรค้าง?” ดู diff; “อะไรจะเข้า commit?” ดู staged diff; “งานนี้มาจากไหน?” ดู log/show การจำชื่อคำสั่งโดยไม่รู้พื้นที่ที่อ่านหรือเปลี่ยนอาจทำให้เลือกคำสั่งผิด',
      'history-workflow':'ถ้า commit ที่แชร์ไปแล้วต้องย้อนผล revert สร้าง commit ใหม่เพื่อย้อนการเปลี่ยน ส่วน reset ย้ายตำแหน่ง branch และอาจเปลี่ยน index/working tree ตามโหมด จึงต้องแยกเป้าหมาย “ย้อนผล” ออกจาก “เขียนประวัติใหม่”'
    },
    lab:{id:'learn-merge',after:'branches-merge',kind:'merge',title:'รวมงานสอง branch จากฐานเดียวกัน',predict:'ทั้งสอง branch แก้คนละ field กับแก้ field เดียวกันเป็นคนละค่า ผลรวมจะต่างกันอย่างไร?',fallback:'ฐานมี title=Shop และ fee=50 ถ้า main เปลี่ยน title เป็น Garden ส่วน feature เปลี่ยน fee เป็น 0 ผลรวมเก็บทั้งสองอย่างได้ แต่ถ้า main เปลี่ยน fee เป็น 20 และ feature เปลี่ยนเป็น 0 ต้องตัดสินค่าที่ต้องการร่วมกัน การเลือกค่าโดยไม่มีเครื่องหมาย conflict ไม่ได้ยืนยันความถูกต้องของกติกา',limit:'แบบจำลอง three-way merge แยกตาม field เพื่อสอนฐานร่วม; Git จริงรวมข้อความตามบรรทัดและบริบท จึงไม่ได้ตัดสิน conflict ตาม field แบบนี้เสมอ ทุกอย่างเกิดในเบราว์เซอร์ ไม่ใช่ repository จริง'},
    checks:[
      {id:'snapshot',q:'เริ่ม v1 → edit เป็น v2 → add → edit เป็น v3 → commit โดยไม่ add ซ้ำ และยังไม่ push สถานะใดถูก?',options:['local=v3, remote=v3','local=v2, working=v3, remote=v1','local=v1, index=v3'],answer:1,why:'add เก็บ snapshot v2 ไว้ commit จึงบันทึก v2; v3 ยังอยู่ใน working tree และ remote ยังเป็น v1 จนกว่าจะ push',link:'git-areas'},
      {id:'merge-meaning',q:'merge ไม่มี conflict แต่ส่วนลดใหม่ทำให้ยอดชำระผิด ควรสรุปอย่างไร?',options:['Git รับประกันผลรวมถูกเสมอ','ควร force push เพื่อให้ตรงกัน','ยังต้องตรวจ requirement และทดสอบผลรวม แม้รวมข้อความได้'],answer:2,why:'การรวมข้อความสำเร็จไม่ได้ตรวจตรรกะทางธุรกิจ การ review และ test หลังรวมงานจึงยังจำเป็น',link:'learn-merge'}
    ]
  }
};
