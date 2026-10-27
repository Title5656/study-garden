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
    setup(host, 'ทดลองเวลา CPU: จำนวนคำสั่ง × CPI ÷ ความถี่', field('instructions', 'Instruction count (จำนวนคำสั่ง)', 1e9, 'min="1"') + field('cpi', 'CPI (รอบต่อคำสั่ง)', 2, 'min="0.01" step="any"') + field('ghz', 'Clock rate (GHz)', 2, 'min="0.01" step="any"'), v => {
      const n = Number(v('instructions')), cpi = Number(v('cpi')), ghz = Number(v('ghz')), r = C.cpuTime({ instructions: n, cpi, ghz });
      return `<div class="itds211-metrics">${metric(f(r.seconds), 'CPU time · วินาที')}${metric(f(r.cycles), 'Clock cycles · รอบ')}</div><ol><li>แปลง GHz เป็น Hz: ${f(ghz)} × 10⁹ = ${f(r.hertz)} รอบ/วินาที</li><li>รอบที่ต้องใช้ = ${f(n)} × ${f(cpi)} = ${f(r.cycles)} รอบ</li><li>เวลา = ${f(r.cycles)} ÷ ${f(r.hertz)} = ${f(r.seconds)} วินาที</li></ol><p>ตรึงสองค่าแล้วเปลี่ยนอีกค่าหนึ่ง: เพิ่ม Clock rate เป็นสองเท่า หรือลด Instruction count ลงครึ่งหนึ่ง ให้ผลต่อเวลาต่างกันหรือไม่ภายใต้สมมติฐานนี้?</p>`;
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
    setup(host, 'จำนวนเต็มมีเครื่องหมาย และ IEEE 754 แบบ 32 บิต', field('integer', 'จำนวนเต็มสำหรับ 2’s complement', -5, 'step="1"') + select('bits', 'ความกว้าง', [[8, '8 บิต'], [16, '16 บิต'], [32, '32 บิต']]) + field('real', 'จำนวนจริงสำหรับ float32', 10.25, 'step="any"'), v => {
      const r = C.representInteger(Number(v('integer')), Number(v('bits'))), p = C.float32(Number(v('real')));
      return `<h4>2’s complement · ${r.value}</h4><p>ช่วงที่แทนได้: ${r.min} ถึง ${r.max}</p><div class="itds211-bits"><span>${r.bits}</span></div><ol>${r.steps.map(s => `<li>${escape(s)}</li>`).join('')}</ol>${r.carrySteps.length ? table(['ตำแหน่งจากขวา', 'บิตเดิม', 'ทดเข้า', 'รวม', 'บิตผล', 'ทดออก'], r.carrySteps.map(x => [x.position, x.bit, x.carryIn, x.sum, x.result, x.carryOut])) : ''}<h4>IEEE 754 · Sign | Exponent | Fraction</h4><div class="itds211-bits"><span>${p.sign}</span><span>${p.exponent}</span><span>${p.fraction}</span></div><ol><li>Sign=${p.sign}; Exponent field=${p.exponentValue}</li><li>ชนิด=${p.classification}; ${p.classification === 'normal' ? `เลขชี้กำลังจริง = ${p.exponentValue} − 127 = ${p.unbiasedExponent}` : p.classification === 'subnormal' ? 'เลขชี้กำลังสำหรับสูตร subnormal = −126' : 'ช่อง Exponent เป็นรหัสกรณีพิเศษ จึงไม่ใช้สูตรเลขชี้กำลังของจำนวนปกติ'}</li><li>${p.classification === 'normal' ? 'ใช้ 1.fraction × 2^exponent' : p.classification === 'subnormal' ? 'ใช้ 0.fraction × 2^(−126) จึงไม่มี leading 1' : p.classification === 'zero' ? 'ทุกช่องขนาดเป็นศูนย์; เครื่องหมายแยก +0 และ −0' : 'ค่าที่ป้อนเกินช่วงของ float32 จึงเกิด overflow'}</li><li>ค่าหลังปัดเป็น float32: ${p.classification === 'overflow' ? 'เกินช่วงที่แทนได้' : Object.is(p.rounded, -0) ? '−0' : escape(p.rounded)}</li></ol>`;
    });
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
    const instructions = [
      { text: 'add x1,x2,x3', dest: 'x1', src: ['x2', 'x3'], type: 'alu' },
      { text: 'sub x4,x1,x5', dest: 'x4', src: ['x1', 'x5'], type: 'alu' },
      { text: 'ld x6,0(x4)', dest: 'x6', src: ['x4'], type: 'load' },
      { text: 'add x7,x6,x8', dest: 'x7', src: ['x6', 'x8'], type: 'alu' }
    ];
    let forwarding = true, cycle = 1;
    host.innerHTML = `<h3>Pipeline 5 ขั้น · ดูการรอข้อมูลทีละรอบ</h3><p>IF ดึงคำสั่ง · ID แปล/อ่านรีจิสเตอร์ · EX คำนวณ · MEM อ่านเขียนข้อมูล · WB เขียนผลกลับ แบบจำลองนี้มีหน่วยความจำคำสั่งและข้อมูลแยกกัน ไม่มี branch และอ่านรีจิสเตอร์ได้ในรอบเดียวกับที่เขียนกลับ</p><label><input name="forwarding" type="checkbox" checked> เปิด Forwarding (ส่งค่าล่วงหน้า)</label><div class="itds211-controls"><button class="btn" data-prev type="button">← รอบก่อน</button><button class="btn primary" data-next type="button">รอบถัดไป →</button><button class="btn" data-reset type="button">เริ่มใหม่</button></div><div class="itds211-output" aria-live="polite"></div>`;
    function update() {
      const r = C.pipelineTrace(instructions, { forwarding }); cycle = Math.min(cycle, r.cycles);
      const columns = Array.from({ length: r.cycles }, (_, i) => i + 1);
      const rows = r.rows.map(row => `<tr><th scope="row"><code>${escape(row.text)}</code></th>${columns.map(col => {
        const cell = row.cells.find(x => x.cycle === col);
        return `<td class="${cell?.stalled ? 'wait ' : ''}${col === cycle ? 'active' : ''}">${cell && col <= cycle ? cell.stage + (cell.stalled ? '*' : '') : '·'}</td>`;
      }).join('')}</tr>`).join('');
      host.querySelector('.itds211-output').innerHTML = `<div class="itds211-metrics">${metric(`${cycle} / ${r.cycles}`, 'Clock cycle')}${metric(r.stalls, 'รอบหยุดรอทั้งหมด')}</div><div class="table-wrap" tabindex="0" role="region" aria-label="ตาราง pipeline"><table class="itds211-pipeline"><thead><tr><th>คำสั่ง</th>${columns.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><p>* IF/ID ถูกพักในรอบนั้น; ต่อให้เปิด Forwarding ค่า Load ยังพร้อมช้ากว่าค่า ALU จึงเหลือ Load-use stall หนึ่งรอบ</p>`;
      host.querySelector('[data-prev]').disabled = cycle === 1; host.querySelector('[data-next]').disabled = cycle === r.cycles;
    }
    host.querySelector('[name=forwarding]').onchange = event => { forwarding = event.target.checked; cycle = 1; update(); };
    host.querySelector('[data-prev]').onclick = () => { cycle--; update(); }; host.querySelector('[data-next]').onclick = () => { cycle++; update(); }; host.querySelector('[data-reset]').onclick = () => { cycle = 1; update(); }; update();
  }
  function parallel(host) {
    setup(host, 'แบ่งงานขนาน: ส่วนที่แบ่งไม่ได้ยังจำกัดความเร็ว', field('workers', 'จำนวนหน่วยประมวลผล', 4, 'min="1" max="64" step="1"') + field('serial', 'งานที่ต้องทำตามลำดับ (%)', 20, 'min="0" max="100" step="1"'), v => {
      const workers = Number(v('workers')), serial = Number(v('serial'));
      if (!Number.isInteger(workers) || workers < 1 || workers > 64 || !Number.isFinite(serial) || serial < 0 || serial > 100) throw new Error('ใช้หน่วยประมวลผล 1–64 ตัว และส่วนตามลำดับ 0–100%');
      const fraction = serial / 100, time = fraction + (1 - fraction) / workers, speedup = 1 / time;
      return `<div class="itds211-metrics">${metric(f(time * 100) + '%', 'เวลาเทียบกับใช้ 1 ตัว')}${metric(f(speedup) + '×', 'Speedup ในแบบจำลองอุดมคติ')}</div><ol><li>สมมติเวลาเดิม=1 หน่วย ส่วนที่แบ่งไม่ได้=${fraction}</li><li>ส่วนขนานต่อเครื่อง=(1−${fraction})/${workers}=${f((1 - fraction) / workers)}</li><li>เวลาใหม่=${fraction}+${f((1 - fraction) / workers)}=${f(time)}</li><li>Speedup=1/${f(time)}=${f(speedup)}</li></ol><p>[อธิบายเสริม] ใช้แบบจำลอง Amdahl แบบอุดมคติ ไม่รวมค่าใช้จ่ายแบ่งงาน ส่งข้อความ หรือแย่งหน่วยความจำ จึงไม่ใช่การทำนายความเร็ว GPU/CPU จริง</p>`;
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
    let step = Infinity;
    host.innerHTML = `<h3>CPU Scheduling · กำหนดงานแล้วตรวจเส้นเวลาทีละการตัดสินใจ</h3><p>รูปแบบ: ชื่อ, Arrival, CPU burst, Priority หน่วยเวลาเป็นจำนวนเต็ม; Priority เลขน้อยสำคัญกว่า แบบจำลองใช้ CPU burst เดียวต่อ process และไม่มีค่าใช้จ่ายสลับงาน</p><label>งานแต่ละงานอยู่คนละบรรทัด<textarea name="jobs">A,0,5,2\nB,1,2,1\nC,2,1,3</textarea></label><div class="itds211-controls">${select('algorithm', 'อัลกอริทึม', [['FCFS', 'FCFS · มาก่อนได้ก่อน'], ['SJF', 'SJF · สั้นก่อน ไม่แย่ง'], ['STCF', 'STCF · เหลือสั้นสุด แย่งได้'], ['PRIORITY', 'Priority · ไม่แย่ง'], ['RR', 'Round Robin']])}${field('quantum', 'Quantum ของ RR', 2, 'min="1" step="1"')}<button class="btn" data-start type="button">เริ่มดูทีละขั้น</button><button class="btn primary" data-next type="button">ขั้นถัดไป →</button><button class="btn" data-all type="button">ดูครบทุกขั้น</button></div><div class="itds211-output" aria-live="polite"></div>`;
    function update() {
      const output = host.querySelector('.itds211-output');
      try {
        const lines = host.querySelector('[name=jobs]').value.trim().split(/\n/).filter(x => x.trim());
        const jobs = lines.map(line => {
          const cells = line.split(',').map(x => x.trim());
          if (cells.length < 3 || cells.length > 4 || cells.some(x => x === '')) throw new Error('แต่ละบรรทัดใช้ ชื่อ,Arrival,Burst,Priority เช่น A,0,5,2');
          return { id: cells[0], arrival: Number(cells[1]), burst: Number(cells[2]), priority: cells[3] === undefined ? 0 : Number(cells[3]) };
        });
        const algorithm = host.querySelector('[name=algorithm]').value, quantum = Number(host.querySelector('[name=quantum]').value), r = C.schedule(jobs, algorithm, quantum);
        step = Math.min(step, r.steps.length); const shown = r.steps.slice(0, step), until = shown.at(-1)?.end ?? 0;
        const gantt = r.segments.filter(x => x.start < until).map(x => ({ ...x, end: Math.min(x.end, until) }));
        output.innerHTML = `<p>ดูแล้ว ${shown.length} / ${r.steps.length} การตัดสินใจ</p><div class="table-wrap" tabindex="0" role="region" aria-label="Gantt chart"><div class="itds211-gantt">${gantt.map(x => `<div class="itds211-gantt-block" style="flex-basis:${Math.max(55, (x.end - x.start) * 24)}px" data-end="${x.end}"><b>${escape(x.id)}</b><small>${x.start}</small></div>`).join('')}</div></div>${table(['ช่วง', 'CPU', 'เหลือ', 'เหตุผล'], shown.map(x => [`${x.start}–${x.end}`, escape(x.id), x.remaining ?? '—', escape(x.reason)]))}${shown.length === r.steps.length ? `<h4>ตรวจตัวเลขรายงาน</h4>${table(['งาน', 'Arrival', 'Burst', 'เริ่มครั้งแรก', 'เสร็จ', 'Turnaround', 'Waiting', 'Response'], r.metrics.map(x => [escape(x.id), x.arrival, x.burst, x.first, x.completion, `${x.completion}−${x.arrival}=${x.turnaround}`, `${x.turnaround}−${x.burst}=${x.waiting}`, `${x.first}−${x.arrival}=${x.response}`]))}<div class="itds211-metrics">${metric(f(r.averages.waiting), 'Average waiting')}${metric(f(r.averages.response), 'Average response')}${metric(f(r.averages.turnaround), 'Average turnaround')}</div><p>Waiting=Turnaround−Burst ใช้ได้ตรงนี้เพราะตัวอย่างไม่มี I/O burst; งานมาถึงตรงขอบ Quantum ของ RR เข้าคิวก่อนนำงานเดิมไปต่อท้าย</p>` : '<p>คำนวณค่ารวมหลังเดินเส้นเวลาครบ เพื่อไม่เฉลยก่อนดูการตัดสินใจทั้งหมด</p>'}`;
        host.querySelector('[data-next]').disabled = step >= r.steps.length;
      } catch (error) { output.innerHTML = `<p class="itds211-error" role="alert">${escape(error.message)}</p>`; }
    }
    host.querySelectorAll('input,select,textarea').forEach(node => { node.addEventListener('input', () => { step = Infinity; update(); }); });
    host.querySelector('[data-start]').onclick = () => { step = 1; update(); }; host.querySelector('[data-next]').onclick = () => { step++; update(); }; host.querySelector('[data-all]').onclick = () => { step = Infinity; update(); }; update();
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
