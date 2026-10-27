(function () {
  'use strict';
  const C = window.ITDS211Core;
  if (!C) return;
  const escape = x => String(x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const f = x => x !== 0 && (Math.abs(x) < 1e-6 || Math.abs(x) >= 1e12)
    ? Number(x.toPrecision(7)).toExponential()
    : Number.isInteger(x) ? String(x) : Number(x.toPrecision(7)).toLocaleString('en-US', { maximumFractionDigits: 9 });
  function table(headers, rows, classes = '') {
    return `<div class="table-wrap" tabindex="0" role="region" aria-label="ผลการทดลอง เลื่อนแนวนอนเพื่ออ่านครบ"><table class="${classes}"><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const metric = (value, label) => `<div class="itds211-metric"><strong>${escape(value)}</strong><small>${escape(label)}</small></div>`;
  const field = (name, label, value, more = '') => `<label>${label}<input name="${name}" type="number" value="${value}" ${more}></label>`;
  const select = (name, label, options) => `<label>${label}<select name="${name}">${options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>`;
  function setup(host, title, controls, calculate) {
    host.innerHTML = `<h3>${title}</h3><div class="itds211-controls">${controls}</div><div class="itds211-output" aria-live="polite"></div>`;
    const output = host.querySelector('.itds211-output');
    const value = name => host.querySelector(`[name="${name}"]`)?.value;
    const update = () => {
      try {
        for (const input of host.querySelectorAll('input[type="number"]')) {
          if (!input.value.trim() || input.validity.badInput) throw new Error('กรอกตัวเลขให้ครบทุกช่องก่อนคำนวณ');
        }
        output.innerHTML = calculate(value);
      }
      catch (error) { output.innerHTML = `<p class="itds211-error" role="alert">${escape(error.message)}</p>`; }
    };
    host.addEventListener('input', update); host.addEventListener('change', update); update();
  }
  function stepper(host, title, controls, steps, draw) {
    let index = 0;
    host.innerHTML = `<h3>${title}</h3>${controls}<div class="itds211-controls"><button class="btn" type="button" data-prev>← ย้อนขั้น</button><button class="btn primary" type="button" data-next>ขั้นถัดไป →</button><button class="btn" type="button" data-reset>เริ่มใหม่</button></div><p data-step-count class="small muted" aria-live="polite"></p><div class="itds211-output" aria-live="polite"></div>`;
    const update = () => {
      host.querySelector('[data-step-count]').textContent = `ขั้น ${index + 1} / ${steps.length}`;
      host.querySelector('.itds211-output').innerHTML = draw(steps[index], index);
      host.querySelector('[data-prev]').disabled = index === 0; host.querySelector('[data-next]').disabled = index === steps.length - 1;
    };
    host.querySelector('[data-prev]').onclick = () => { index = Math.max(0, index - 1); update(); };
    host.querySelector('[data-next]').onclick = () => { index = Math.min(steps.length - 1, index + 1); update(); };
    host.querySelector('[data-reset]').onclick = () => { index = 0; update(); };
    update();
  }
  function overview(host) {
    const topics = [
      ['CA00–CA02', 'รู้จักเครื่องและวงจรคำสั่ง', 'ก่อนคิดว่าโปรแกรมทำงานพร้อมกันอย่างไร ต้องเห็นก่อนว่าเครื่องทำคำสั่งหนึ่งคำสั่งอย่างไร'],
      ['CA03', 'ข้อมูลและภาษาเครื่อง', 'ตัวเลข อักขระ และคำสั่งลงท้ายด้วยรูปแบบบิต จึงต้องรู้การแทนข้อมูลก่อนอ่านการทำงานระดับเครื่อง'],
      ['CA04–CA06', 'หน่วยความจำ อุปกรณ์ และที่เก็บข้อมูล', 'ความเร็วของ CPU เพียงอย่างเดียวไม่พอ ต้องคิดเวลารอข้อมูลและการคุยกับอุปกรณ์ด้วย'],
      ['CA07–CA08', 'งานซ้อนและงานขนาน', 'เมื่อรู้คำสั่งและทรัพยากรแล้ว จึงตรวจได้ว่าซ้อนงานตรงไหนได้และตรงไหนต้องรอ'],
      ['OS01–OS03', 'จัดการทรัพยากรและเลือกงาน', 'OS เก็บสถานะงานและกำหนดนโยบายให้หลายโปรแกรมอยู่ร่วมกันอย่างมีระเบียบ']
    ];
    setup(host, 'แผนที่: บทนี้นำไปใช้อะไรต่อ', select('topic', 'เลือกช่วงบท', topics.map((x, i) => [i, `${x[0]} · ${x[1]}`])), v => {
      const x = topics[Number(v('topic'))];
      return `<div class="itds211-step-state"><strong>${x[0]} · ${x[1]}</strong><p>${x[2]}</p></div><p>ลองอธิบายด้วยคำของตัวเองว่า “ถ้ายังไม่รู้ช่วงนี้ จะติดตรงไหนเมื่ออ่านช่วงถัดไป” แล้วใช้สารบัญกลับไปปูพื้น</p>`;
    });
  }
  function performance(host) {
    host.dataset.widget = 'cpu-time';
    setup(host, 'เวลา CPU · เทียบเครื่อง A กับ B', '<p>เร่งความถี่ให้สูงขึ้น แต่โปรแกรมเร็วขึ้นเสมอหรือไม่? ใช้โปรแกรมเดียวกันและ IC เท่ากัน แล้วเปลี่ยน CPI และ GHz ทีละค่า</p>' + field('instructions', 'IC · จำนวนคำสั่ง (500 ล้าน = 500000000)', 500e6, 'min="1" step="1"') + field('cpi', 'เครื่อง A · CPI', 2, 'min="0.01" step="any"') + field('ghz', 'เครื่อง A · GHz', 2, 'min="0.01" step="any"') + field('cpiB', 'เครื่อง B · CPI', 2.6, 'min="0.01" step="any"') + field('ghzB', 'เครื่อง B · GHz', 3, 'min="0.01" step="any"'), v => {
      const n = Number(v('instructions')), cpi = Number(v('cpi')), ghz = Number(v('ghz')), r = C.cpuTime({ instructions: n, cpi, ghz });
      const b = C.cpuTime({instructions:n,cpi:Number(v('cpiB')),ghz:Number(v('ghzB'))});
      const comparison = r.seconds === b.seconds ? 'ทั้งสองเครื่องใช้เวลาเท่ากัน' : `เครื่อง ${r.seconds < b.seconds ? 'A' : 'B'} เร็วกว่า ${f(Math.max(r.seconds,b.seconds)/Math.min(r.seconds,b.seconds))} เท่า`;
      return `<div class="itds211-metrics">${metric(f(r.seconds), 'เครื่อง A · วินาที')}${metric(f(b.seconds), 'เครื่อง B · วินาที')}</div><p><strong>${comparison}</strong> · เปรียบเทียบจากเวลา ไม่ใช่ GHz เพียงอย่างเดียว</p><ol><li>แปลง GHz เป็น Hz: ${f(ghz)} × 10⁹ = ${f(r.hertz)} รอบ/วินาที; รอบเวลา A = ${f(1/ghz)} ns</li><li>รอบที่ A ต้องใช้ = ${f(n)} × ${f(cpi)} = ${f(r.cycles)} รอบ</li><li>เวลา A = ${f(r.cycles)} ÷ ${f(r.hertz)} = ${f(r.seconds)} วินาที</li><li>เวลา B = ${f(n)} × ${f(Number(v('cpiB')))} ÷ (${f(Number(v('ghzB')))} × 10⁹) = ${f(b.seconds)} วินาที</li></ol>`;
    });
  }
  function machine(host) {
    const steps = [
      ['เริ่ม', 'PC=0 ชี้คำสั่ง LOAD 100; หน่วยความจำ M[100]=7 และ M[101]=5', 0, '—', 0, '—'],
      ['Fetch', 'นำ PC=0 ไปขอคำสั่ง เก็บ LOAD 100 ใน IR แล้วเลื่อน PC เป็น 1', 1, 'LOAD 100', 0, '—'],
      ['Decode', 'แปลว่าให้นำค่าจากตำแหน่ง 100 มาใส่ AC', 1, 'LOAD 100', 0, '—'],
      ['Execute', 'อ่าน M[100]=7 แล้ว AC ← 7', 1, 'LOAD 100', 7, '—'],
      ['Fetch', 'ดึง ADD 101 จาก PC=1 เก็บใน IR แล้ว PC ← 2', 2, 'ADD 101', 7, '—'],
      ['Execute', 'อ่าน M[101]=5 แล้ว AC ← 7+5 = 12', 2, 'ADD 101', 12, '—'],
      ['Fetch', 'ดึง STORE 102 แล้ว PC ← 3', 3, 'STORE 102', 12, '—'],
      ['Execute', 'เขียน AC=12 ลงหน่วยความจำตำแหน่ง 102', 3, 'STORE 102', 12, 12],
      ['HALT', 'คำสั่งหยุดจบโปรแกรม ผลรวมยังอยู่ที่ M[102]=12', 4, 'HALT', 12, 12]
    ];
    stepper(host, 'เดินคำสั่งแบบ MARIE ทีละขั้น', '<p>ตัวอย่างเสริม: บวก 7 กับ 5 ด้วย LOAD → ADD → STORE หน้าต่างนี้ย่อรายละเอียดสัญญาณควบคุมเพื่อเน้นค่าที่เปลี่ยน</p>', steps, x => `<div class="itds211-step-state"><strong>${x[0]}</strong>${x[1]}</div>${table(['PC · คำสั่งถัดไป', 'IR · คำสั่งปัจจุบัน', 'AC · ค่าสะสม', 'M[102]'], [[x[2], x[3], x[4], x[5]]])}<p>สังเกตว่า PC เปลี่ยนหลัง Fetch แต่ผลบวกยังไม่เปลี่ยนจนถึง Execute</p>`);
  }
  function numbers(host) {
    host.dataset.widget = 'bits';
    setup(host, 'บิตจำนวนเต็ม และ IEEE 754 แบบ 32 บิต', field('real', 'จำนวนจริงสำหรับ float32', 10.25, 'step="any"'), v => {
      const p = C.float32(Number(v('real')));
      return `<h4>IEEE 754 · Sign | Exponent | Fraction</h4><div class="itds211-bits"><span>${p.sign}</span><span>${p.exponent}</span><span>${p.fraction}</span></div><ol><li>Sign=${p.sign}; Exponent field=${p.exponentValue}</li><li>ชนิด=${p.classification}; ${p.classification === 'normal' ? `เลขชี้กำลังจริง = ${p.exponentValue} − 127 = ${p.unbiasedExponent}` : p.classification === 'subnormal' ? 'เลขชี้กำลังสำหรับสูตร subnormal = −126' : 'ช่อง Exponent เป็นรหัสกรณีพิเศษ จึงไม่ใช้สูตรเลขชี้กำลังของจำนวนปกติ'}</li><li>${p.classification === 'normal' ? 'ใช้ 1.fraction × 2^exponent' : p.classification === 'subnormal' ? 'ใช้ 0.fraction × 2^(−126) จึงไม่มี leading 1' : p.classification === 'zero' ? 'ทุกช่องขนาดเป็นศูนย์; เครื่องหมายแยก +0 และ −0' : 'ค่าที่ป้อนเกินช่วงของ float32 จึงเกิด overflow'}</li><li>ค่าหลังปัดเป็น float32: ${p.classification === 'overflow' ? 'เกินช่วงที่แทนได้' : Object.is(p.rounded, -0) ? '−0' : escape(p.rounded)}</li></ol>`;
    });
    const bitWidget = document.createElement('div');
    bitWidget.className = 'itds211-bit-widget';
    bitWidget.innerHTML = `<h4>กดบิต · ข้อมูลชุดเดียว ตีความได้สองแบบ</h4><p>บิตชุดเดียวกัน ทำไมเป็นได้ทั้ง 200 และ −56?</p><div class="itds211-bit-buttons">${Array.from({length:8},(_,i)=>`<button type="button" class="btn" data-bit="${i}" aria-label="สลับบิตน้ำหนัก ${128>>i}"></button>`).join('')}</div><label>ฐานสิบ (−128 ถึง 255)<input name="unsigned" type="number" min="-128" max="255" step="1" value="200"></label><div class="itds211-controls"><button type="button" class="btn" data-not>กลับบิตทั้งหมด (NOT)</button><button type="button" class="btn" data-negate>ติดลบ (NOT + 1)</button></div><div data-bit-result aria-live="polite"></div>`;
    host.querySelector('h3').after(bitWidget);
    let unsigned = 200, overflow = false;
    function drawBits() {
      const bits = unsigned.toString(2).padStart(8,'0'), signed = unsigned >= 128 ? unsigned - 256 : unsigned;
      bitWidget.querySelectorAll('[data-bit]').forEach((button,i)=>{button.textContent=bits[i];button.setAttribute('aria-pressed',String(bits[i]==='1'));});
      bitWidget.querySelector('[name=unsigned]').value=unsigned;
      bitWidget.querySelector('[data-bit-result]').innerHTML=`<p>ฐานสอง <code>${bits}</code> · ฐานสิบหก <code>0x${unsigned.toString(16).toUpperCase().padStart(2,'0')}</code><br>ไม่มีเครื่องหมาย = <b>${unsigned}</b> · two’s complement = <b>${String(signed).replace('-','−')}</b><br>น้ำหนักแบบมีเครื่องหมาย: ${[...bits].flatMap((b,i)=>b==='1'?[i===0?'−128':String(128>>i)]:[]).join(' + ')||'0'} = ${signed}</p>${overflow?'<p>Signed overflow: −128 ไม่มีค่าบวกคู่กันใน 8 บิต; NOT + 1 จึงได้ 10000000 (−128) เหมือนเดิม</p>':''}`;
    }
    bitWidget.querySelectorAll('[data-bit]').forEach(button=>button.onclick=()=>{unsigned^=128>>Number(button.dataset.bit);overflow=false;drawBits();});
    bitWidget.querySelector('[name=unsigned]').addEventListener('input',event=>{
      event.stopPropagation(); const n=Number(event.target.value);
      if(!event.target.value.trim()||!Number.isInteger(n)||n < -128||n>255){bitWidget.querySelector('[data-bit-result]').textContent='กรอกจำนวนเต็ม −128 ถึง 255';return;}
      unsigned=(n+256)%256;overflow=false;drawBits();
    });
    bitWidget.querySelector('[data-not]').onclick=()=>{unsigned^=255;overflow=false;drawBits();};
    bitWidget.querySelector('[data-negate]').onclick=()=>{overflow=unsigned===128;unsigned=(-unsigned+256)%256;drawBits();};
    drawBits();
  }
  function cache(host) {
    setup(host, 'แคช 4 บรรทัด · เปรียบเทียบ Direct / Set / Fully associative', '<label>Byte addresses (คั่นด้วย comma)<input name="addresses" type="text" value="0,4,0,16,0"></label>' + select('ways', 'จำนวนทาง · ใช้ LRU เมื่อเต็ม', [[1, '1-way · Direct'], [2, '2-way set associative'], [4, '4-way · Fully associative']]) + field('virtual', 'Virtual address · page size 4096 B', 4099, 'min="0" step="1"') + select('present', 'หน้า 1 อยู่ในหน่วยความจำหรือไม่', [['yes', 'อยู่ใน Frame 5'], ['no', 'ยังอยู่บนดิสก์']]), v => {
      const text = v('addresses').trim();
      if (!text || text.split(',').some(s => !s.trim())) throw new Error('ใส่ที่อยู่เป็นจำนวนเต็ม คั่นด้วย comma เช่น 0,4,0,16,0');
      const r = C.cacheTrace(text.split(',').map(s => Number(s.trim())), { lines: 4, blockBytes: 4, ways: Number(v('ways')) });
      const a = C.translateAddress({ virtualAddress: Number(v('virtual')), pageBytes: 4096, table: [{ vpn: 0, pfn: 2, present: true }, { vpn: 1, pfn: 5, present: v('present') === 'yes' }] });
      return `<p>Block size=4 bytes; Sets=${r.setCount}; แคชเริ่มว่างทุกครั้งที่เปลี่ยนค่า</p><div class="itds211-metrics">${metric(r.hits, 'Hits · พบข้อมูล')}${metric(r.misses, 'Misses · ไม่พบ')}</div>${table(['ครั้ง', 'ที่อยู่', 'Block=⌊A/4⌋', 'Set=Block mod Sets', 'Tag', 'Offset', 'ผล', 'Block ที่ออก'], r.trace.map((x, i) => [i + 1, x.address, x.block, x.index, x.tag, x.offset, x.hit ? 'Hit' : 'Miss', x.evictedBlock ?? '—']))}<p>Tag=⌊Block/Sets⌋; เมื่อเต็มเอาบล็อกที่ไม่ได้ใช้นานที่สุดใน Set นั้นออก เปลี่ยนเป็น 4-way แล้วลองสังเกตความขัดแย้งของที่อยู่ 0 กับ 16</p><h4>แปลที่อยู่ทีละขั้น</h4><ol><li>VPN=⌊${v('virtual')}/4096⌋=${a.vpn}</li><li>Offset=${v('virtual')} mod 4096=${a.offset}</li><li>${a.pageFault ? 'Page fault: ตารางไม่มีหน้าที่พร้อมใช้ ต้องให้ OS จัดการก่อน จึงยังหาที่อยู่จริงไม่ได้' : `พบ Frame=${a.pfn}; Physical address=${a.pfn}×4096+${a.offset}=${a.physicalAddress}`}</li></ol>`;
    });
  }
  function io(host) {
    const descriptions = {
      poll: ['CPU สั่งอุปกรณ์เริ่มทำงาน', 'CPU อ่าน status: ยังไม่พร้อม', 'CPU อ่าน status ซ้ำ: ยังไม่พร้อม', 'CPU อ่าน status: พร้อมแล้ว', 'CPU อ่านข้อมูลจากอุปกรณ์', 'CPU เขียนข้อมูลลงหน่วยความจำ'],
      interrupt: ['CPU สั่งอุปกรณ์แล้วไปทำงานอื่น', 'อุปกรณ์ทำงาน ขณะ CPU ทำโปรแกรมอื่น', 'อุปกรณ์พร้อมและยก Interrupt', 'CPU เก็บสถานะแล้วเข้า ISR', 'CPU ย้ายข้อมูลอุปกรณ์ไปหน่วยความจำ', 'CPU คืนสถานะและกลับโปรแกรมเดิม'],
      dma: ['CPU ตั้งที่อยู่ จำนวนข้อมูล และทิศทางให้ DMA', 'DMA ขอใช้ bus ขณะที่ CPU ทำงานอื่นได้บางช่วง', 'อุปกรณ์ส่งข้อมูลผ่าน DMA ไปหน่วยความจำ', 'DMA ย้ายข้อมูลต่อและปรับ address/count', 'count ครบแล้ว DMA แจ้ง Interrupt', 'CPU รับการแจ้งว่าโอนเสร็จและใช้ข้อมูล']
    };
    let method = 'poll';
    function draw() {
      stepper(host, 'ตามข้อมูลจากอุปกรณ์ไปหน่วยความจำ', `<div class="itds211-controls">${select('method', 'วิธีรับข้อมูล', [['poll', 'Programmed I/O'], ['interrupt', 'Interrupt-driven I/O'], ['dma', 'DMA']])}</div>`, descriptions[method], (x, i) => `<div class="itds211-step-state"><strong>ช่วง ${i + 1}</strong>${x}</div><p>${method === 'dma' ? 'ข้อมูลแต่ละคำไม่ต้องวิ่งผ่านรีจิสเตอร์ CPU; DMA ยังใช้ bus และมีค่าใช้จ่ายการตั้งงาน/แจ้งเสร็จ' : method === 'interrupt' ? 'CPU ไม่ต้องวนตรวจสถานะตลอด แต่ยังเป็นผู้ย้ายข้อมูลในตัวอย่างนี้' : 'เวลารออุปกรณ์ยังใช้ CPU ตรวจสถานะซ้ำ จึงเสียโอกาสทำงานอื่น'}</p>`);
      const choice = host.querySelector('[name=method]'); choice.value = method; choice.onchange = () => { method = choice.value; draw(); };
    }
    draw();
  }
  function storage(host) {
    setup(host, 'เวลาอ่านดิสก์และแผนผัง RAID 4 ลูก', field('rpm', 'ความเร็วหมุน RPM', 15000, 'min="1"') + field('seek', 'Seek time (ms)', 4, 'min="0" step="0.1"') + field('bytes', 'ขนาดข้อมูล (bytes)', 512, 'min="0"') + field('rate', 'Transfer rate (MB/s)', 100, 'min="0.1" step="1"') + select('raid', 'RAID level', [[0, 'RAID 0'], [1, 'RAID 1 · สำเนาเดียวกัน 4 ลูก'], [5, 'RAID 5'], [6, 'RAID 6']]) + select('failed', 'จำลองลูกเสียหนึ่งลูก', [[-1, 'ไม่มี'], [0, 'Disk 0'], [1, 'Disk 1'], [2, 'Disk 2'], [3, 'Disk 3']]), v => {
      const r = C.diskTime({ rpm: Number(v('rpm')), seekMs: Number(v('seek')), bytes: Number(v('bytes')), megabytesPerSecond: Number(v('rate')), overheadMs: 0.2 });
      const level = Number(v('raid')), failed = Number(v('failed')), rows = [];
      let block = 0;
      for (let stripe = 0; stripe < 3; stripe++) {
        const row = [stripe];
        for (let disk = 0; disk < 4; disk++) {
          let value;
          if (level === 1) value = 'D' + stripe;
          else if (level === 5 && disk === 3 - stripe % 4) value = 'P · parity';
          else if (level === 6 && disk === 3 - stripe % 4) value = 'P · parity';
          else if (level === 6 && disk === (2 - stripe % 4 + 4) % 4) value = 'Q · parity';
          else value = 'D' + block++;
          row.push(disk === failed ? '✕ เสีย' : value);
        }
        rows.push(row);
      }
      return `<ol><li>เวลาหมุนหนึ่งรอบ=60,000/${escape(v('rpm'))} ms; รอเฉลี่ยครึ่งรอบ=${f(r.rotationMs)} ms</li><li>Transfer=${escape(v('bytes'))}/(${escape(v('rate'))}×10⁶)×1000=${f(r.transferMs)} ms</li><li>รวม Seek+Rotation+Transfer+Controller=${f(r.seekMs)}+${f(r.rotationMs)}+${f(r.transferMs)}+0.2=<strong>${f(r.totalMs)} ms</strong></li></ol><h4>แผนผัง RAID ${level}</h4>${table(['Stripe', 'Disk 0', 'Disk 1', 'Disk 2', 'Disk 3'], rows)}<p>ความจุใช้งานเมื่อแต่ละลูกจุเท่ากัน: ${level === 0 ? '4 ลูกเต็ม' : level === 1 ? 'เทียบเท่า 1 ลูก' : level === 6 ? 'เทียบเท่า 2 ลูก' : 'เทียบเท่า 3 ลูก'}; ${failed < 0 ? 'ยังไม่มีลูกเสีย' : level === 0 ? 'RAID 0 ไม่มีข้อมูลสำรอง บล็อกของลูกเสียหายไปจากชุด' : level === 1 ? 'ลูกอื่นในชุดยังมีสำเนาข้อมูลเดียวกันให้อ่านได้' : level === 5 ? 'หนึ่งลูกเสียยังสร้างข้อมูลคืนจากข้อมูลที่เหลือและ parity ได้' : 'สองชุด parity รองรับดิสก์เสียได้สูงสุดสองลูก'}</p><p>[อธิบายเสริม] RAID 1 ในแบบจำลองนี้ใช้ 4 ลูกเป็นสำเนาของชุดข้อมูลเดียว จึงจุเทียบเท่า 1 ลูก ถ้าแบ่งเป็นสองคู่สำเนาแล้ว stripe ข้ามคู่จะเป็น RAID 10 ตามภาพหน้า 19</p><p>ตารางแสดงตำแหน่งข้อมูลและค่าตรวจคืน ไม่ใช่สำเนาสำรองแยกเครื่อง; RAID ไม่ทดแทนการสำรองข้อมูล</p>`;
    });
  }
  function pipeline(host) {
    host.dataset.widget = 'pipeline';
    setup(host, 'Pipeline 5 ขั้น · ป้อนคำสั่งและทดลอง hazard', `<p>คำสั่งที่ใช้ผลของคำสั่งก่อนหน้า ต้องรอกี่รอบ? IF ดึงคำสั่ง · ID อ่านรีจิสเตอร์ · EX คำนวณ · MEM เข้าหน่วยความจำ · WB เขียนผล รองรับ lw/ld, sw/sd และ add/sub/and/or/xor/sll/srl/slt รูปแบบ op rd,rs,rt (x0–x31) สูงสุด 16 คำสั่ง</p><label>คำสั่ง RISC-V<textarea name="code" rows="5">lw x1,0(x2)
add x3,x1,x4
sub x5,x3,x6
or x7,x8,x9</textarea></label><label><input name="forwarding" type="checkbox" checked> เปิด Forwarding</label>`, v => {
      const lines=v('code').split(/\n/).map(x=>x.trim()).filter(Boolean);
      const reg='x(?:[0-9]|[12][0-9]|3[01])';
      const memory=new RegExp(`^(lw|ld|sw|sd)\\s+(${reg})\\s*,\\s*(-?\\d+)\\s*\\(\\s*(${reg})\\s*\\)$`,'i');
      const alu=new RegExp(`^(add|sub|and|or|xor|sll|srl|slt)\\s+(${reg})\\s*,\\s*(${reg})\\s*,\\s*(${reg})$`,'i');
      const instructions=lines.map((text,i)=>{
        const m=text.match(memory),a=text.match(alu);
        if(m){const store=/^s/i.test(m[1]);return {text,dest:store?null:m[2].toLowerCase(),src:store?[m[2].toLowerCase(),m[4].toLowerCase()]:[m[4].toLowerCase()],type:store?'store':'load'};}
        if(a)return {text,dest:a[2].toLowerCase(),src:[a[3].toLowerCase(),a[4].toLowerCase()],type:'alu'};
        throw new Error(`บรรทัด ${i+1}: ใช้คำสั่งและรูปแบบที่รองรับ เช่น add x3,x1,x4 หรือ lw x1,0(x2)`);
      });
      const r=C.pipelineTrace(instructions,{forwarding:host.querySelector('[name=forwarding]').checked});
      const columns=Array.from({length:r.cycles},(_,i)=>i+1);
      return `<p><strong>${instructions.length} คำสั่งใช้ ${r.cycles} รอบ</strong> · ไม่มี stall จะใช้ ${instructions.length+4} รอบ · stall รวม ${r.stalls} รอบ · CPI ≈ ${f(r.cycles/instructions.length)}</p>${table(['คำสั่ง',...columns],r.rows.map(row=>[escape(row.text),...columns.map(col=>{const cell=row.cells.find(x=>x.cycle===col);return cell?`<span class="itds211-stage stage-${cell.stage} ${cell.stalled?'wait':''}">${cell.stage}${cell.stalled?'*':''}</span>`:'·';})]),'itds211-pipeline')}<p>* IF/ID ถูกพักในรอบนั้น แบบจำลองมีหน่วยความจำคำสั่งและข้อมูลแยกกัน ไม่มี branch; WB เขียนครึ่งแรกและ ID อ่านครึ่งหลังของรอบเดียวกันได้ เปิด Forwarding แล้ว ALU ส่งผลต่อได้ทัน แต่ load-use ยังรอ 1 รอบ การส่งค่า store ใช้ทางข้อมูลจาก EX ในแบบจำลองนี้</p>`;
    });
  }
  function parallel(host) {
    host.dataset.widget = 'amdahl';
    setup(host, 'กฎของ Amdahl · ส่วนที่ขนานไม่ได้กำหนดเพดานอย่างไร?', '<label>สัดส่วนที่ขนานได้ p <input name="parallel" type="range" min="0" max="0.99" step="0.01" value="0.9"></label><label>จำนวนแกน n <input name="workers" type="range" min="1" max="64" step="1" value="8"></label>', v => {
      const p=Number(v('parallel')),n=Number(v('workers')),time=1-p+p/n,speedup=1/time,ceiling=1/(1-p),scale=Math.max(n,ceiling);
      return `<div class="itds211-metrics">${metric('p = '+p.toFixed(2),'สัดส่วนที่ขนานได้')}${metric(n,'จำนวนแกน')}${metric(f(speedup)+'×','Speedup')}${metric(f(ceiling)+'×','เพดานเมื่อแกนไม่จำกัด')}</div><p>เวลาใหม่ = (1−${p}) + ${p}/${n} = ${f(time)} เท่าของเวลาเดิม<br>Speedup = 1 / ${f(time)} = ${f(speedup)} เท่า · ${f(speedup/ceiling*100)}% ของเพดาน</p>${[['ทำได้จริง',speedup],['เพดาน 1/(1−p)',ceiling],['อุดมคติ n เท่า',n]].map(([label,value])=>`<p>${label}: ${f(value)}×</p><div class="itds211-speed-bar"><span style="width:${value/scale*100}%"></span></div>`).join('')}<p>ลองเพิ่มแกนจาก 8 เป็น 64 โดยตรึง p=0.90 แล้วสังเกตว่าเข้าใกล้เพดาน 10 เท่า แต่ไม่ถึง 64 เท่า [อธิบายเสริม] แบบจำลองไม่รวมค่าใช้จ่ายแบ่งงาน ส่งข้อความ และแย่งหน่วยความจำ</p>`;
    });
  }
  function os(host) {
    const steps = [
      ['เครื่องจริง', 'มี CPU หนึ่งตัวในแบบจำลอง และหน่วยความจำก้อนเดียว โปรแกรมทั้งสามจึงต้องแบ่งทรัพยากรจริง', ['CPU 1 ตัว', 'Physical memory']],
      ['มุมมองโปรแกรม', 'แต่ละโปรแกรมมองเห็น CPU เสมือนและที่อยู่เริ่ม 0 ของตนเอง แต่การมีที่อยู่เลขเดียวกันไม่ได้แปลว่าใช้พื้นที่จริงเดียวกัน', ['โปรแกรม A: address 0', 'โปรแกรม B: address 0', 'โปรแกรม C: address 0']],
      ['OS จัดสรร', 'OS เลือกงานและจับคู่ที่อยู่เสมือนกับพื้นที่จริง พร้อมควบคุมสิทธิ์ให้โปรแกรมหนึ่งไม่เขียนทับอีกโปรแกรม', ['A → CPU ช่วงแรก', 'B → CPU ช่วงถัดไป', 'C → รอคิว']],
      ['ขอบริการ', 'เมื่ออยากอ่านไฟล์ โปรแกรมเรียกช่องทางบริการ OS ตรวจสิทธิ์และสั่งอุปกรณ์ จากนั้นคืนผลให้โปรแกรม', ['โปรแกรมขออ่าน', 'OS ตรวจและสั่งงาน', 'อุปกรณ์ส่งผล', 'OS คืนผล']]
    ];
    stepper(host, 'เครื่องจริงหนึ่งชุด → มุมมองที่หลายโปรแกรมใช้งานได้', '', steps, x => `<div class="itds211-step-state"><strong>${x[0]}</strong><p>${x[1]}</p></div><div class="itds211-flow">${x[2].map(part => `<span>${part}</span>`).join('<i>→</i>')}</div>`);
  }
  function process(host) {
    let state = 'ready', history = ['เริ่มที่ Ready: มีข้อมูลพร้อม แต่ยังไม่ได้ CPU'];
    const events = [['dispatch', 'Scheduler เลือกเข้า CPU'], ['io', 'ขอ I/O'], ['complete', 'I/O เสร็จ'], ['timeout', 'หมดช่วงเวลา'], ['exit', 'ทำงานเสร็จ']];
    host.innerHTML = `<h3>สถานะ Process · เหตุใดจึงเปลี่ยนสถานะได้</h3><div class="itds211-controls">${events.map(([event, text]) => `<button class="btn" type="button" data-event="${event}">${text}</button>`).join('')}<button class="btn" type="button" data-reset>เริ่มใหม่</button></div><div class="itds211-output" aria-live="polite"></div>`;
    function update() {
      host.querySelector('.itds211-output').innerHTML = `<div class="itds211-step-state"><strong>สถานะปัจจุบัน: ${state.toUpperCase()}</strong>${state === 'running' ? 'CPU กำลังทำคำสั่งของงานนี้' : state === 'ready' ? 'พร้อมทำงาน แต่ต้องรอ Scheduler เลือก' : state === 'blocked' ? 'ยังทำต่อไม่ได้ ต้องรอเหตุการณ์ I/O' : 'งานจบแล้ว ต้องเริ่มตัวอย่างใหม่'}</div><ol>${history.map(x => `<li>${escape(x)}</li>`).join('')}</ol>`;
      host.querySelectorAll('[data-event]').forEach(button => { try { C.processTransition(state, button.dataset.event); button.disabled = false; } catch { button.disabled = true; } });
    }
    host.querySelectorAll('[data-event]').forEach(button => { button.onclick = () => { const before = state; state = C.processTransition(state, button.dataset.event); history.push(`${before} → ${state}: ${button.textContent}`); update(); }; });
    host.querySelector('[data-reset]').onclick = () => { state = 'ready'; history = ['เริ่มที่ Ready']; update(); }; update();
  }
  function scheduling(host) {
    host.dataset.widget = 'cpu-scheduling';
    setup(host, 'CPU Scheduling · เปรียบเทียบทั้ง 4 แบบ', `<p>อัลกอริทึมไหนให้เวลารอเฉลี่ยน้อยที่สุดสำหรับชุดงานนี้? ใส่ชื่อ เวลามาถึง และเวลาใช้ CPU คั่นด้วยช่องว่างหรือ comma หน่วยเวลาเป็นจำนวนเต็ม ใช้ CPU burst เดียวและไม่มีค่าใช้จ่ายสลับงาน</p><label>งานแต่ละงานอยู่คนละบรรทัด<textarea name="jobs" rows="5">P1 0 8
P2 1 4
P3 2 9
P4 3 5</textarea></label>${field('quantum','Quantum ของ Round Robin',4,'min="1" max="1000" step="1"')}`, v => {
      const lines=v('jobs').trim().split(/\n/).filter(x=>x.trim());
      const jobs=lines.map((line,i)=>{
        const cells=line.trim().split(/[,\s]+/);
        if(cells.length!==3)throw new Error(`บรรทัด ${i+1}: ใช้ ชื่อ Arrival Burst เช่น P1 0 8`);
        return {id:cells[0],arrival:Number(cells[1]),burst:Number(cells[2])};
      });
      const results=[['FCFS','FCFS'],['SJF','SJF · ไม่แย่งคิว'],['STCF','SRTF (STCF) · แย่งคิว'],['RR','Round Robin · q='+v('quantum')]].map(([algorithm,label])=>({algorithm,label,result:C.schedule(jobs,algorithm,Number(v('quantum')))}));
      const best=Math.min(...results.map(x=>x.result.averages.waiting));
      return `<p>Waiting = Completion − Arrival − Burst · Turnaround = Completion − Arrival · ชุดงานเดียวกันทุกแบบ เริ่มคำนวณใหม่เมื่อเปลี่ยนข้อมูล</p>${results.map(({algorithm,label,result:r})=>`<div data-schedule-result="${algorithm}"><h4>${escape(label)}${r.averages.waiting===best?' · ✓ รอเฉลี่ยน้อยที่สุดในชุดนี้':''}</h4><div class="table-wrap" tabindex="0" role="region" aria-label="Gantt chart ${algorithm}"><div class="itds211-gantt">${r.segments.map(x=>`<div class="itds211-gantt-block" style="flex:0 0 ${(x.end-x.start)*32}px" data-end="${x.end}"><b>${escape(x.id==='idle'?'ว่าง':x.id)}</b><small>${x.start}</small></div>`).join('')}</div></div>${table(['งาน','เสร็จ','Waiting','Turnaround','Response'],r.metrics.map(x=>[escape(x.id),x.completion,x.waiting,x.turnaround,x.response]))}<p>รอเฉลี่ย <strong>${f(r.averages.waiting)}</strong> · Turnaround เฉลี่ย <strong>${f(r.averages.turnaround)}</strong></p></div>`).join('')}<p>SJF เลือก Burst สั้นที่สุดในงานที่มาถึงแล้วและทำจนเสร็จ; SRTF เลือกเวลาที่เหลือสั้นที่สุดใหม่ทุกหน่วยเวลา; RR ให้งานใหม่ที่มาถึงตรงขอบ Quantum เข้าคิวก่อนนำงานเดิมต่อท้าย เมื่อเสมอกันใช้เวลามาถึงแล้วตามลำดับที่กรอก ผลดีที่สุดนี้ใช้กับชุดงานนี้และเกณฑ์เวลารอเฉลี่ยเท่านั้น</p>`;
    });
  }
  const labs = { overview, performance, machine, numbers, cache, io, storage, pipeline, parallel, os, process, scheduling };
  document.querySelectorAll('[data-itds211-lab]').forEach(host => { try { labs[host.dataset.itds211Lab]?.(host); } catch (error) { host.textContent = `ห้องทดลอง: ${error.message}`; } });

  // Files selected here remain in a browser-local Blob; there is no upload request.
  if (document.body.dataset.sourceFile) {
    let objectURL = null, page = 1;
    const dialog = document.createElement('dialog'); dialog.className = 'itds211-source-dialog'; dialog.id = 'itds211-source-dialog';
    dialog.innerHTML = `<div class="itds211-source-toolbar"><strong>เทียบกับสไลด์ต้นฉบับ</strong><button class="btn tiny" type="button" data-close>ปิด ✕</button></div><p class="itds211-source-label">${escape(document.body.dataset.sourceFile)}</p><label>เลือก PDF ต้นฉบับจากเครื่อง <input type="file" accept="application/pdf,.pdf" data-pdf-file></label><p class="itds211-source-label" data-pdf-status aria-live="polite">เลือกไฟล์เพื่อเปิดดูหน้าอ้างอิง</p><iframe title="สไลด์ต้นฉบับที่เลือกจากเครื่อง" hidden></iframe>`;
    document.body.append(dialog);
    const frame = dialog.querySelector('iframe'), status = dialog.querySelector('[data-pdf-status]');
    const showPage = () => { if (objectURL) { frame.src = objectURL + '#page=' + page; frame.hidden = false; status.textContent = `เปิดหน้า PDF ${page} · ถ้าโปรแกรมอ่าน PDF ไม่เลื่อนอัตโนมัติ ให้ใส่เลขหน้านี้ในแถบของโปรแกรมอ่าน`; } else status.textContent = `ต้องการเปิดหน้า PDF ${page} · เลือกไฟล์ต้นฉบับด้านบนก่อน`; };
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-source-page]'); if (!trigger) return;
      event.preventDefault(); page = Number(trigger.dataset.sourcePage) || 1;
      if (!dialog.open) dialog.showModal(); showPage();
    });
    dialog.querySelector('[data-close]').onclick = () => dialog.close();
    dialog.querySelector('[data-pdf-file]').addEventListener('change', async event => {
      const file = event.target.files[0]; if (!file) return;
      if (file.name.toLocaleLowerCase() !== document.body.dataset.sourceFile.toLocaleLowerCase()) { status.textContent = 'ชื่อไฟล์ไม่ตรงกับ lecture นี้ โปรดเลือก ' + document.body.dataset.sourceFile; return; }
      try {
        if (!(await file.slice(0, 1024).text()).includes('%PDF-')) throw new Error('ไฟล์นี้ไม่ใช่ PDF ที่อ่านได้');
        if (objectURL) URL.revokeObjectURL(objectURL);
        objectURL = URL.createObjectURL(file); showPage();
      } catch (error) { status.textContent = error.message; }
    });
    window.addEventListener('pagehide', event => {
      // A cached document resumes with its existing iframe and Blob reference.
      if (!event.persisted && objectURL) { URL.revokeObjectURL(objectURL); objectURL = null; }
    });
  }
})();
