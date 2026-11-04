/* L13 experiments, rewritten for Study Garden. No page navigation or storage here. */
(function () {
  'use strict';
  const integer = value => value !== '' && value !== null && Number.isSafeInteger(Number(value));
  function parkPrice(age) {
    if (!integer(age) || age < 0) return null;
    return age < 12 ? 0 : age < 18 ? 100 : age <= 60 ? 200 : 100;
  }
  function discount(value, mode = 'answer') {
    if (!integer(value) || value > 100000) return null;
    const n = Number(value);
    if (mode === 'problem' && (n <= 0 || n === 5000)) return 'unspecified';
    if (n <= 0) return null;
    return n < (mode === 'problem' ? 500 : 501) ? 0 : n < 1000 ? 5 : n < 5000 ? 10 : 20;
  }
  function zooTrace(age) {
    const decisions = [];
    for (const [yes, price] of [[age > 0 && age <= 12,50],[age >= 13 && age <= 20,100],[age >= 21 && age <= 60,150],[age > 60,100]]) {
      decisions.push(yes);
      if (yes) return {decisions, price};
    }
    return {decisions, price:null};
  }
  function report(counts) {
    if (counts.length !== 5 || counts.some(n => !integer(n) || n < 0)) return null;
    const [passed,failed,pending,progress,blocked] = counts.map(Number);
    const executed = passed + failed, planned = executed + pending + progress + blocked;
    if (!Number.isSafeInteger(planned)) return null;
    return {executed,planned,passRate:executed ? passed / executed * 100 : null,executionRate:planned ? executed / planned * 100 : null};
  }
  if (typeof module === 'object' && module.exports) module.exports = {parkPrice,discount,zooTrace,report};
  if (typeof document === 'undefined' || !document.querySelector('.levels-lab')) return;
  const $ = id => document.getElementById(id);
  const text = (id, value) => { $(id).textContent = value; };
  const on = (id, event, fn) => $(id).addEventListener(event, fn);
  const button = (label, fn) => { const b=document.createElement('button'); b.type='button'; b.className='btn'; b.textContent=label; b.addEventListener('click',fn); return b; };
  const presets = (id, values, input, update) => values.forEach(v => $(id).append(button(String(v), () => {$(input).value=v; update();})));
  const percent = n => n === null ? 'ยังคำนวณไม่ได้ (ตัวหารเป็น 0)' : n.toFixed(1)+'%';

  const quizzes = {
    phases: [
      ['ทดสอบ getDisplayName() ด้วยข้อมูลในหน่วยความจำ โดยไม่ต่อบริการอื่น', ['Unit','Integration','System'],0,'ขอบเขตคือ method เดียว ควบคุม input และสังเกต output ได้โดยตรง'],
      ['Repository ส่งคำสั่ง SQL ไปยังฐานข้อมูลทดสอบจริง แล้วอ่านข้อมูลกลับ', ['Unit','Integration','System'],1,'กำลังตรวจการเชื่อมต่อและสัญญาข้อมูลระหว่างสองส่วน แม้เริ่มจากการเรียกเพียง method เดียว'],
      ['เปิดเว็บจริงในสภาพแวดล้อมทดสอบ ตั้งแต่ login จนจ่ายเงิน ตาม requirements', ['Unit','Integration','System'],2,'ขอบเขตคือระบบที่รวมแล้วและเส้นทางใช้งานทั้งหมด'],
      ['เปลี่ยนฐานข้อมูลจริงเป็น stub ที่คืนข้อมูลคงที่ แล้วทดสอบกฎส่วนลด', ['Unit','Integration','System'],0,'stub ช่วยแยกกฎส่วนลด แต่ผลผ่านไม่ได้ยืนยันว่าฐานข้อมูลจริงเชื่อมต่อได้']
    ],
    regression: [
      ['แก้คำนวณค่าส่งแล้ว: ทดสอบเคสค่าส่งที่เคยผิดอีกครั้ง เรียกว่าอะไร?', ['Retest / confirmation','Regression ของส่วนอื่น','Usability'],0,'Retest ยืนยันว่า defect เดิมถูกแก้แล้ว (คำอธิบายเสริม) จากนั้นยังต้องตรวจการทำงานเดิมที่อาจได้รับผลกระทบ'],
      ['เพิ่มคูปองใหม่แล้วตรวจว่าส่วนลดสมาชิกและคืนเงินเดิมยังถูกต้อง', ['Unit อย่างเดียว','Regression','เลิกทดสอบของเก่า'],1,'Regression เป็นวัตถุประสงค์ของการทดสอบ ใช้ได้ทั้ง unit, integration และ system'],
      ['เปลี่ยน query ให้เร็วขึ้น แต่หน้าจอเหมือนเดิม ควรทำอะไร?', ['ข้าม test','ทดสอบเฉพาะสีปุ่ม','Regression และตรวจ performance'],2,'Optimization ก็เปลี่ยนพฤติกรรมได้ เช่น ลำดับข้อมูลหรือข้อมูลตกหล่น ต้องตรวจผลเดิมควบคู่กับความเร็ว']
    ],
    practices: [
      ['ทุกบรรทัดถูกรัน แต่ test ไม่ตรวจผลลัพธ์เลย สรุปได้อย่างไร?', ['ระบบถูก 100%','coverage สูงแต่หลักฐานความถูกต้องยังอ่อน','ไม่ต้องทำ test เพิ่ม'],1,'Coverage บอกสิ่งที่ถูกรันตามเกณฑ์ ไม่ได้บอกว่า assertion ตรวจสิ่งสำคัญครบหรือไม่'],
      ['Unit test ล้มเหลวเฉพาะเมื่อเครือข่ายช้า ควรเริ่มจากอะไร?', ['เพิ่มเวลารออย่างเดียว','จำลอง dependency ที่ขอบเขตแล้วแยก integration test','ลบ test'],1,'ทำให้ unit test คงที่โดยควบคุม dependency และใช้ integration test ตรวจเครือข่าย/บริการจริงแยกต่างหาก']
    ]
  };
  document.querySelectorAll('[data-level-quiz]').forEach(root => {
    const qs=quizzes[root.dataset.levelQuiz]; let index=0,score=0,answered=false;
    const out=root.querySelector('[role="status"]'), choices=root.querySelector('.level-choices'), prompt=root.querySelector('.level-prompt');
    prompt.tabIndex=-1;
    function draw() {
      answered=false; choices.replaceChildren(); out.textContent='';
      if (index === qs.length) {
        prompt.textContent=`จบชุด: ${score} / ${qs.length} ข้อ`;
        choices.append(button('ลองใหม่',()=>{index=0;score=0;draw();prompt.focus();})); return;
      }
      const [q,options,answer,why]=qs[index]; prompt.textContent=`${index+1}/${qs.length} · ${q}`;
      options.forEach((label,k)=>choices.append(button(label,()=>{
        if(answered)return; answered=true; if(k===answer)score++;
        choices.querySelectorAll('button').forEach((b,j)=>{b.disabled=true; if(j===answer)b.classList.add('level-correct');});
        out.textContent=(k===answer?'✓ ถูกต้อง · ':'ลองคิดอีกนิด · คำตอบคือ '+options[answer]+' · ')+why;
        const next=button(index===qs.length-1?'ดูคะแนน':'ข้อต่อไป →',()=>{index++;draw();prompt.focus();});
        choices.append(next); next.focus();
      })));
    }
    draw();
  });

  function junit() {
    const first=$('junit-first').value,last=$('junit-last').value,space=$('junit-space').checked;
    const actual=first+(space?' ':'')+last;
    text('junit-code','return firstName + '+(space?'" " + ':'')+'lastName;');
    const rows=$('junit-results');rows.replaceChildren();
    [['Space',first+' '+last],['Nospace',first+last]].forEach(([name,expected])=>{
      const row=document.createElement('tr');
      [name,JSON.stringify(expected),JSON.stringify(actual),expected===actual?'PASS':'FAIL'].forEach(v=>{const cell=document.createElement('td');cell.textContent=v;row.append(cell);});rows.append(row);
    });
    text('junit-feedback','สอง test คาดหวังคนละรูปแบบ จึงผ่านพร้อมกันไม่ได้ ต้องตัดสิน requirement ก่อนแก้โค้ดหรือแก้ test; ตัวจำลองใช้ชื่อที่กรอกเป็น fixture ของทั้งสอง test');
  }
  on('junit-run','click',junit);on('junit-space','change',junit);junit();

  const lifecycle=['@BeforeClass · เตรียมทรัพยากรร่วมครั้งเดียว','@Before · เตรียม fixture ใหม่สำหรับ test A','@Test A · รันและตรวจ assertion','@After · เก็บกวาดหลัง A','@Before · เตรียม fixture ใหม่สำหรับ test B','@Test B · รันและตรวจ assertion','@After · เก็บกวาดหลัง B','@AfterClass · ปิดทรัพยากรร่วมครั้งเดียว'];
  let step=0;
  on('life-next','click',()=>{const li=document.createElement('li');li.textContent=lifecycle[step++];$('life-log').append(li);$('life-next').disabled=step===lifecycle.length;text('life-status',`ขั้น ${step}/8 · ${lifecycle[step-1]}`);});
  on('life-reset','click',()=>{step=0;$('life-log').replaceChildren();$('life-next').disabled=false;text('life-status','พร้อมเริ่มใหม่');});
  const assertions=[
    ['assertEquals(a, b)','PASS · String คนละ object แต่เนื้อหา "abc" เท่ากัน'],
    ['assertSame(a, b)','FAIL · new String สองครั้งสร้างคนละ object; เนื้อหาเท่ากันไม่ใช่ identity เดียวกัน'],
    ['assertNotSame(a, b)','PASS · a และ b อ้างคนละ object'],
    ['assertTrue(5 < 6)','PASS · เงื่อนไขเป็น true'],
    ['assertFalse(5 > 6)','PASS · เงื่อนไขเป็น false'],
    ['assertNull(c)','PASS · c เป็น null'],
    ['assertNotNull(a)','PASS · a อ้าง String object'],
    ['assertArrayEquals(x, y)','PASS · สมาชิกและลำดับใน array เท่ากัน แม้เป็นคนละ array']
  ];
  assertions.forEach(([name,why])=>$('assert-choices').append(button(name,()=>text('assert-feedback',why))));

  const integration={
    ok:['Unit: PASS','Integration: PASS','ราคา 200 บาท → API ส่ง 200 บาท → Payment รับ 200 บาท','สัญญาระบุทั้งชื่อ field, ชนิด และหน่วยตรงกัน'],
    contract:['Unit: PASS ทั้งสองส่วนตามสเปกที่แต่ละทีมเข้าใจ','Integration: FAIL','ราคา 200 บาท → API ส่ง 200 → Payment ตีความเป็น 200 สตางค์ = 2 บาท','ย้อนตรวจ interface specification และการแบ่ง module; ตกลงหน่วยให้ตรงก่อนเพิ่ม contract test'],
    module:['Unit: ควร FAIL แต่ชุดเดิมไม่ทดสอบอายุ 18','Integration: FAIL','อายุ 18 → Price คืน 100 แทน 200 → Payment รับ 100','fault อยู่ใน module ราคา: เติม boundary unit test แล้วแก้กฎราคา; integration พบอาการแต่ทดแทน unit ที่ขาดไม่ได้'],
    stub:['Unit: PASS ด้วย stub','Integration จริง: ยังไม่มีหลักฐาน','Price → stub คืน success เสมอ (ไม่ได้เชื่อมฐานข้อมูล)','stub ช่วยควบคุมปัจจัยภายนอก แต่ตรวจ credentials, schema และ network ของจริงไม่ได้']
  };
  on('integration-case','change',()=>{
    const [unit,combined,flow,why]=integration[$('integration-case').value];text('integration-unit',unit);text('integration-result',combined);text('integration-flow',flow);text('integration-why',why);
  });$('integration-case').dispatchEvent(new Event('change'));
  const pairs=[['Requirements','Acceptance','ผู้ใช้จองตั๋วได้ตามความต้องการจริงหรือไม่ → Validation'],['High-level design','System','ระบบรวมทำงานและมีคุณภาพตามแบบระดับระบบหรือไม่ → Verification'],['Detailed design','Integration','ส่วนประกอบเชื่อมกันตาม interface และแบบรายละเอียดหรือไม่ → Verification'],['Coding','Unit','หน่วยย่อยทำงานตามสเปกที่ใช้พัฒนาหรือไม่ → Verification']];
  document.querySelectorAll('[data-v-pair]').forEach(b=>b.addEventListener('click',()=>{
    const n=Number(b.dataset.vPair);document.querySelectorAll('[data-v-pair]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    document.querySelectorAll('[data-v-line]').forEach(x=>x.classList.toggle('selected',Number(x.dataset.vLine)===n));
    text('vmodel-feedback',pairs[n][0]+' ↔ '+pairs[n][1]+' · '+pairs[n][2]);
  }));
  function updateReport(){const r=report(['report-pass','report-fail','report-pending','report-progress','report-blocked'].map(id=>$(id).value));text('report-feedback',r?`Executed = ${r.executed} · Planned = ${r.planned} · Pass rate = ${percent(r.passRate)} · Execution rate = ${percent(r.executionRate)}`:'กรอกจำนวนเต็มตั้งแต่ 0 ให้ครบทั้ง 5 ช่อง และให้ผลรวมอยู่ในช่วงจำนวนเต็มที่คำนวณได้');}
  ['report-pass','report-fail','report-pending','report-progress','report-blocked'].forEach(id=>on(id,'input',updateReport));updateReport();
  function traceability(){const selected=[...document.querySelectorAll('[data-trace-test]:checked')].map(x=>x.value);const covered=new Set(selected.flatMap(id=>({login:['R1'],discount:['R2'],denied:['R3'],journey:['R1','R2']}[id])));document.querySelectorAll('[data-trace-row]').forEach(row=>{const coveredNow=covered.has(row.dataset.traceRow);row.classList.toggle('selected',coveredNow);row.querySelector('.trace-state').textContent=coveredNow?'มี test เชื่อมโยง':'ยังไม่มี test';});text('trace-feedback',`เชื่อมโยง ${covered.size}/3 requirements · ${covered.size===3?'มี test ครบทุก requirement ในตัวอย่าง แต่ยังไม่ได้แปลว่ารันผ่าน':'ช่องว่าง: '+['R1','R2','R3'].filter(id=>!covered.has(id)).join(', ')} · เมื่อต้องเปลี่ยนกฎส่วนลด ให้เริ่มทบทวน TC-discount และ TC-journey`);}
  document.querySelectorAll('[data-trace-test]').forEach(x=>x.addEventListener('change',traceability));traceability();
  const qualities=[
    ['Functional suitability','ทำสิ่งที่ต้องทำครบและถูกต้อง','Completeness · Correctness · Appropriateness','คำนวณส่วนลดได้ครบทุกระดับและยอดสุทธิถูกต้อง'],
    ['Performance efficiency','ใช้เวลาและทรัพยากรเหมาะสม','Time behaviour · Resource utilization · Capacity','ค้นหาตั๋วภายในเวลาที่ตกลง แม้มีผู้ใช้พร้อมกันตามจำนวนที่กำหนด'],
    ['Compatibility','อยู่ร่วมและแลกเปลี่ยนข้อมูลกับระบบอื่นได้','Co-existence · Interoperability','Payment อ่านรูปแบบข้อมูลจากระบบจองได้'],
    ['Usability','ผู้ใช้เข้าใจและทำงานสำเร็จได้ง่าย','Appropriateness recognizability · Learnability · Operability · User error protection · User interface aesthetics · Accessibility','ผู้ใช้ใหม่จองตั๋วสำเร็จและแก้การกรอกวันผิดได้'],
    ['Reliability','ทำงานได้ต่อเนื่องและฟื้นตัวได้','Maturity · Availability · Fault tolerance · Recoverability','หลังบริการชำระเงินขัดข้อง ระบบกู้สถานะคำสั่งซื้อได้'],
    ['Security','ปกป้องข้อมูลและสิทธิ์การใช้งาน','Confidentiality · Integrity · Non-repudiation · Accountability · Authenticity','ผู้ใช้ A อ่านข้อมูลจองส่วนตัวของ B ไม่ได้'],
    ['Maintainability','แก้และทดสอบระบบได้สะดวก','Modularity · Reusability · Analysability · Modifiability · Testability','แก้กฎราคาใน module เดียวและทดสอบผลกระทบได้'],
    ['Portability','ย้ายและติดตั้งในสภาพแวดล้อมเป้าหมายได้','Adaptability · Installability · Replaceability','ติดตั้งระบบในสภาพแวดล้อมที่กำหนดได้โดยไม่แก้โค้ดธุรกิจ']
  ];
  qualities.forEach(([name,meaning,subs,example],i)=>{const b=button(name,()=>{[...$('quality-choices').children].forEach(x=>x.setAttribute('aria-pressed',String(x===b)));text('quality-feedback',`${name} — ${meaning}\nหัวข้อย่อยในภาพ: ${subs}\nตัวอย่างเสริม: ${example}`);});b.setAttribute('aria-pressed','false');$('quality-choices').append(b);if(i===0)b.click();});
  function usability(){const mode=$('usability-design').value;const d=mode==='a'?{seconds:90,success:6,errors:8,recover:24,help:5}:{seconds:55,success:9,errors:2,recover:8,help:1};text('usability-feedback',`ข้อมูลสมมติ ผู้ใช้กลุ่มละ 10 คน · แบบ ${mode.toUpperCase()}\nเวลามัธยฐานทำงาน ${d.seconds} วินาที · สำเร็จ ${d.success}/10 คน (${d.success*10}%) · ข้อผิดพลาดรวม ${d.errors} ครั้ง\nเวลากู้คืนเฉลี่ย ${d.recover} วินาที/ข้อผิดพลาด · เปิด Help รวม ${d.help} ครั้ง\n${mode==='b'?'แบบ B ดูดีกว่าในตัวอย่างนี้ แต่ต้องพิจารณาความเทียบเคียงของกลุ่มและความไม่แน่นอนก่อนสรุป':'ตัวเลขช่วยระบุปัญหา แต่ต้องสังเกตขั้นตอนที่ติดขัดด้วย'}; ความพึงพอใจต้องถามผู้ใช้ ไม่อนุมานจากความเร็วอย่างเดียว`);}
  on('usability-design','change',usability);usability();
  function park(){const p=parkPrice($('park-age').value);text('park-feedback',p===null?'Invalid age · แบบฝึกนี้รับอายุเต็มปีตั้งแต่ 0 เท่านั้น':`อายุ ${$('park-age').value} ปี → ${p===0?'Free (0 บาท)':p+' บาท'} · ตรวจเทียบค่าก่อนและหลังขอบด้วย เช่น 11 → 12 หรือ 60 → 61`);}
  on('park-age','input',park);presets('park-presets',[-1,0,11,12,17,18,60,61],'park-age',park);park();
  function shopping(){const n=$('discount-amount').value,mode=$('discount-mode').value,r=discount(n,mode);text('discount-feedback',r===null?'Invalid input · ต้องเป็นจำนวนเต็มบวกไม่เกิน 100,000 ตามตารางเฉลย (เว็บรับจำนวนเต็มบาท)':r==='unspecified'?'โจทย์ไม่ได้กำหนดผลของค่านี้ชัดเจน · อย่าเดา expected result ต้องยืนยัน requirement; ลองเปรียบเทียบกับตารางเฉลย':`กติกา${mode==='answer'?'ตารางเฉลย':'ข้อความโจทย์'} · ส่วนลด ${r}% = ${(Number(n)*r/100).toFixed(2)} บาท · จ่าย ${(Number(n)*(1-r/100)).toFixed(2)} บาท`);}
  on('discount-amount','input',shopping);on('discount-mode','change',shopping);presets('discount-presets',[-1,1,450,500,501,658,999,1000,2599,4999,5000,45100,100000,100001],'discount-amount',shopping);shopping();
  function cfg(){
    const age=$('cfg-age').value;
    document.querySelectorAll('[data-cfg-node],[data-cfg-true],[data-cfg-false]').forEach(x=>x.classList.remove('selected'));
    if(!integer(age)){
      text('cfg-feedback','กรอกอายุเป็นจำนวนเต็มเพื่อเทียบกับเส้นทางในตาราง');
      document.querySelectorAll('[data-cfg-decision]').forEach(x=>x.classList.remove('selected'));
      document.querySelectorAll('[data-cfg-result]').forEach(x=>x.textContent='—');return;
    }
    const r=zooTrace(Number(age));
    r.decisions.forEach((yes,i)=>{
      document.querySelector(`[data-cfg-node="${i}"]`).classList.add('selected');
      document.querySelector(`[data-cfg-${yes?'true':'false'}="${i}"]`).classList.add('selected');
    });
    document.querySelectorAll('[data-cfg-decision]').forEach((x,i)=>{x.classList.toggle('selected',i<r.decisions.length);x.querySelector('[data-cfg-result]').textContent=i<r.decisions.length?(r.decisions[i]?'True → return':'False → ไปเงื่อนไขถัดไป'):'ไม่ถูกรัน';});
    text('cfg-feedback',`P${r.price===null?5:r.decisions.length} · ${r.decisions.map(x=>x?'T':'F').join(' → ')} → ${r.price===null?'จบฟังก์ชันโดยไม่มี return จึงได้ None':r.price+' บาท'} · ต้องแยก actual จาก expected: โค้ดรันได้ไม่ได้แปลว่าตรง requirement`);
  }
  on('cfg-age','input',cfg);presets('cfg-presets',[-1,0,1,12,13,20,21,60,61],'cfg-age',cfg);cfg();
})();
