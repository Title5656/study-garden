(function () {
"use strict";

/* =====================================================================
   ตัวช่วยเล็ก ๆ ที่ทุกวิดเจ็ตใช้ร่วมกัน
   ===================================================================== */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const SVG_NS = 'http://www.w3.org/2000/svg';

// สร้างองค์ประกอบ SVG: svgEl('line', {x1: 0, ...}, พ่อ, ข้อความ)
function svgEl(name, attrs = {}, parent = null, text = '') {
  const el = document.createElementNS(SVG_NS, name);
  for (const key in attrs) el.setAttribute(key, attrs[key]);
  if (text) el.textContent = text;
  if (parent) parent.appendChild(el);
  return el;
}

// สร้างหัวลูกศร (marker) ในสี/คลาสที่ต้องการ
function addMarker(svg, id, cls) {
  const defs = svg.querySelector('defs') || svgEl('defs', {}, svg);
  const m = svgEl('marker', { id, markerWidth: 10, markerHeight: 10, refX: 9, refY: 5, orient: 'auto' }, defs);
  svgEl('path', { d: 'M0,0 L10,5 L0,10 z', class: cls }, m);
}

/* =====================================================================
   วิดเจ็ต 1: ช่องทางสื่อสาร n(n-1)/2
   ===================================================================== */
function initRequirements() {
  const scenarios = {
    booking: { answer: 'fr', text: 'ระบบต้องปฏิเสธการจองเวลาที่มีผู้จองแล้ว', reason: 'กำหนดพฤติกรรมเมื่อพบเวลาซ้ำ จึงเป็น functional requirement (FR) และนำไปสร้างกรณีทดสอบจองซ้ำได้' },
    speed: { answer: 'nfr', text: '95% ของคำขอค้นหาต้องตอบภายใน 2 วินาที ภายใต้ภาระงานที่ตกลงกัน', reason: 'กำหนดคุณภาพด้านเวลา จึงเป็น non-functional requirement (NFR) ยังต้องระบุภาระงาน ชุดข้อมูล และวิธีวัดให้ทดสอบซ้ำได้' },
    security: { answer: 'fr', text: 'ระบบต้องขอรหัสยืนยันอีกครั้งก่อนเปลี่ยนบัญชีรับเงิน', reason: 'แม้เกี่ยวกับความปลอดภัย แต่ประโยคนี้ระบุพฤติกรรมที่ระบบต้องทำ จึงเป็น FR อย่าจัดประเภทจากคำว่า security เพียงคำเดียว' },
    platform: { answer: 'nfr', text: 'ระบบต้องติดตั้งได้บนระบบปฏิบัติการที่องค์กรกำหนด', reason: 'เป็นข้อจำกัดของสภาพแวดล้อม จัดเป็น NFR ต้องระบุชื่อและรุ่นระบบปฏิบัติการก่อนตรวจรับจริง' },
  };
  const select = $('#req-scenario'), prompt = $('#req-prompt'), feedback = $('#req-feedback');
  const buttons = $$('[data-req-answer]');
  function reset() {
    const item = scenarios[select.value];
    if (!item) return;
    prompt.textContent = item.text;
    feedback.textContent = 'เลือกประเภท แล้วอ่านเหตุผลว่าประโยคกำหนดพฤติกรรมหรือคุณภาพ/ข้อจำกัด';
    buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));
  }
  select.addEventListener('change', reset);
  buttons.forEach(button => button.addEventListener('click', () => {
    const item = scenarios[select.value];
    if (!item) return;
    buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    feedback.textContent = (button.dataset.reqAnswer === item.answer ? 'ถูกต้อง — ' : 'ลองทบทวน — ') + item.reason;
  }));
  reset();
  $('#req-controls').hidden = false;
}

function initChannels() {
  const range = $('#ch-range');
  const svg = $('#ch-svg');
  const out = $('#ch-out');

  function draw() {
    const n = Number(range.value);
    svg.replaceChildren();                       // ล้างภาพเดิม
    const cx = 150, cy = 150, r = 112;

    // วางจุดสมาชิกเป็นวงกลม เริ่มจากด้านบน
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });

    // ลากเส้นให้ "ทุกคู่" คุยกันได้
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        svgEl('line', { x1: pts[i].x, y1: pts[i].y, x2: pts[j].x, y2: pts[j].y, class: 'ch-line' }, svg);
      }
    }
    pts.forEach(p => svgEl('circle', { cx: p.x, cy: p.y, r: 8, class: 'ch-node' }, svg));

    const pairs = (n * (n - 1)) / 2;
    out.innerHTML = `ทีม <strong>${n}</strong> คน → n(n−1)/2 = ${n}×${n - 1}÷2 = <strong>${pairs}</strong> ช่องทาง`;
  }

  range.addEventListener('input', draw);
  draw();
}

/* =====================================================================
   วิดเจ็ต 2: เลือกโมเดลกระบวนการ
   ===================================================================== */
function initModelChooser() {
  const state = { req: 'clear', risk: 'low', feedback: 'rare' };
  const out = $('#mc-out');

  // กติกาเลือกโมเดล (ตรงกับเหตุผลที่บท 2 ใช้)
  function recommend(s) {
    if (s.risk === 'high') {
      return { cls: 'ok', name: 'Spiral',
        why: 'ความเสี่ยงสูง จึงให้ความเสี่ยงนำการวนรอบ: ทดลองจุดเสี่ยงก่อน (เช่น เชื่อมระบบชำระเงิน) แล้วค่อยขยาย ต้องมีคนประเมินความเสี่ยงได้' };
    }
    if (s.req === 'clear' && s.feedback === 'rare') {
      return { cls: 'ok', name: 'Waterfall',
        why: 'requirements ชัดและคงที่ แต่ละระยะมี deliverable ใช้ตรวจรับได้ ข้อควรระวังคือพบความเข้าใจผิดช้า' };
    }
    if (s.req === 'clear' && s.feedback === 'frequent') {
      return { cls: 'ok', name: 'Incremental',
        why: 'แบ่งความสามารถเป็นชุดย่อยแล้วส่งมอบทีละชุด ได้ feedback ระหว่างทาง ต้องจัดการ dependency และการรวมระบบ' };
    }
    if (s.req === 'unclear' && s.feedback === 'frequent') {
      return { cls: 'ok', name: 'Agile',
        why: 'requirements เปลี่ยนได้และมี feedback สม่ำเสมอ ทีมนำ feedback กลับไปปรับงานจริง ยังต้องมีวินัยและรักษาคุณภาพ' };
    }
    return { cls: 'warn', name: 'ยังเลือก Agile ไม่ได้',
      why: 'Agile ต้องมี feedback สม่ำเสมอ ถ้า requirements ไม่ชัดและผู้ใช้ไม่พร้อมให้ feedback ให้ทำ prototype สั้น ๆ เพื่อดึงความต้องการก่อน แล้วค่อยเลือกโมเดล' };
  }

  function render() {
    const r = recommend(state);
    out.className = 'result ' + r.cls;
    out.innerHTML = `<strong>${r.name}</strong><br>${r.why}`;
  }

  $$('#mc [data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      state[key] = btn.dataset.val;
      // ปรับสถานะปุ่มในกลุ่มเดียวกัน
      $$(`#mc [data-key="${key}"]`).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      render();
    });
  });
  render();
}

/* =====================================================================
   วิดเจ็ต 3: ตรวจ data flow ของ DFD
   ===================================================================== */
const DFD_NODES = [
  { id: 'visitor',  label: 'ผู้เยี่ยมชม',        kind: 'entity'  },
  { id: 'provider', label: 'ผู้ให้บริการบัตร',   kind: 'entity'  },
  { id: 'p1',       label: '1 จำหน่ายตั๋ว',       kind: 'process' },
  { id: 'p4',       label: '4 สร้างรายงาน',       kind: 'process' },
  { id: 'd1',       label: 'D1 การจอง/ตั๋ว',     kind: 'store'   },
  { id: 'd4',       label: 'D4 ธุรกรรมชำระ',     kind: 'store'   },
];
const KIND_TH = { entity: 'external entity', process: 'process', store: 'data store' };

// กฎ: ทุก flow ต้องมี process อย่างน้อยหนึ่งปลาย
function checkFlow(from, to) {
  if (from.id === to.id) {
    return { ok: false, text: 'flow ต้องเชื่อมสองจุดที่ต่างกัน' };
  }
  if (from.kind === 'process' && to.kind === 'process') return { ok: true, text: 'process ส่งข้อมูลให้ process อื่น' };
  if (from.kind === 'process' && to.kind === 'store')   return { ok: true, text: 'process เขียนข้อมูลลง data store' };
  if (from.kind === 'store'   && to.kind === 'process') return { ok: true, text: 'process อ่านข้อมูลจาก data store' };
  if (from.kind === 'entity'  && to.kind === 'process') return { ok: true, text: 'ข้อมูลไหลเข้าระบบจากภายนอก' };
  if (from.kind === 'process' && to.kind === 'entity')  return { ok: true, text: 'ข้อมูลไหลออกจากระบบไปภายนอก' };
  return { ok: false, text: `${KIND_TH[from.kind]} → ${KIND_TH[to.kind]} ไม่มี process ที่ปลายด้านใดด้านหนึ่ง จึงไม่ใช่ data flow ที่ถูกต้อง` };
}

function initDfd() {
  const selFrom = $('#dfd-from'), selTo = $('#dfd-to');
  const svg = $('#dfd-svg'), out = $('#dfd-out');

  // เติมตัวเลือกลง select ทั้งสองอัน
  [selFrom, selTo].forEach(sel => {
    DFD_NODES.forEach(n => {
      const o = document.createElement('option');
      o.value = n.id;
      o.textContent = `${n.label} (${KIND_TH[n.kind]})`;
      sel.appendChild(o);
    });
  });
  selFrom.value = 'visitor';
  selTo.value = 'd1';          // เริ่มที่กรณีผิด เพื่อให้เห็นผลทันที

  const halfWidth = n => (n.kind === 'process' ? 40 : 55);

  // วาดสัญลักษณ์: entity = สี่เหลี่ยม, process = วงกลม, store = เส้นขนานสองเส้น
  function drawNode(node, cx, cy) {
    if (node.kind === 'entity') {
      svgEl('rect', { x: cx - 55, y: cy - 22, width: 110, height: 44, class: 'dfd-shape' }, svg);
    } else if (node.kind === 'process') {
      svgEl('circle', { cx, cy, r: 40, class: 'dfd-shape' }, svg);
    } else {
      svgEl('line', { x1: cx - 55, y1: cy - 20, x2: cx + 55, y2: cy - 20, class: 'dfd-line' }, svg);
      svgEl('line', { x1: cx - 55, y1: cy + 20, x2: cx + 55, y2: cy + 20, class: 'dfd-line' }, svg);
    }
    const labels = node.kind === 'entity' ? [node.label] : [node.label.split(' ')[0], node.label.split(' ').slice(1).join(' ')];
    const label = svgEl('text', { x: cx, y: cy + (labels.length === 1 ? 4 : -4), class: 'dfd-text' }, svg);
    labels.forEach((part, i) => svgEl('tspan', {x:cx,dy:i ? 18 : 0},label,part));
  }

  function render() {
    const from = DFD_NODES.find(n => n.id === selFrom.value);
    const to = DFD_NODES.find(n => n.id === selTo.value);
    const res = checkFlow(from, to);

    svg.replaceChildren();
    addMarker(svg, 'arrow-ok', 'm-ok');
    addMarker(svg, 'arrow-bad', 'm-bad');
    const compact = matchMedia('(max-width: 600px)').matches;
    svg.setAttribute('viewBox', compact ? '0 0 220 250' : '0 0 360 110');
    drawNode(from, compact ? 110 : 70, 55);
    drawNode(to, compact ? 110 : 290, compact ? 195 : 55);

    const x1 = compact ? 110 : 70 + halfWidth(from) + 4;
    const x2 = compact ? 110 : 290 - halfWidth(to) - 4;
    const y1 = compact ? 55 + (from.kind === 'process' ? 40 : 22) + 4 : 55;
    const y2 = compact ? 195 - (to.kind === 'process' ? 40 : 22) - 4 : 55;
    svgEl('line', {
      x1, y1, x2, y2,
      class: res.ok ? 'flow-ok' : 'flow-bad',
      'marker-end': `url(#${res.ok ? 'arrow-ok' : 'arrow-bad'})`,
    }, svg);
    if (!res.ok) svgEl('text', { x: compact ? 133 : (x1 + x2) / 2, y: compact ? 130 : 46, class: 'flow-mark' }, svg, '✕');

    out.className = 'result ' + (res.ok ? 'ok' : 'bad');
    out.innerHTML = `<strong>${res.ok ? '✓ ผ่านกฎชนิดปลายทาง' : '✕ ไม่ผ่านกฎชนิดปลายทาง'}</strong> — ${res.text} การตรวจนี้ยังไม่ตรวจชื่อข้อมูล ความหมาย input/output ของ process หรือ balancing ทั้งแผนภาพ`;
  }

  selFrom.addEventListener('change', render);
  selTo.addEventListener('change', render);
  matchMedia('(max-width: 600px)').addEventListener('change', render);
  render();
}

/* =====================================================================
   วิดเจ็ต 4: สามเหลี่ยม + ไฮไลต์บรรทัด pseudocode ที่ทำงาน
   ===================================================================== */
function classifyTriangle(a, b, c) {
  if (![a, b, c].every(Number.isFinite)) return { line: null, text: 'กรอกตัวเลขให้ครบทั้งสามด้าน', cls: 'warn' };
  if (a <= 0 || b <= 0 || c <= 0)         return { line: 'l1', text: 'ด้านต้องเป็นค่าบวก (รวมถึงห้ามเป็น 0)', cls: 'bad' };
  const longest = Math.max(a, b, c);
  // Normalize before adding to avoid overflow; allow four ULPs at the strict boundary.
  // This treats decimal 0.1 + 0.2 = 0.3 as degenerate rather than a spurious thin triangle.
  const normalized = [a / longest, b / longest, c / longest].sort((x,y) => x-y);
  const others = normalized[0] + normalized[1];
  if (others - 1 <= 4 * Number.EPSILON)    return { line: 'l2', text: 'ไม่เป็นสามเหลี่ยม: ด้านยาวที่สุดต้องน้อยกว่าผลบวกของอีกสองด้าน', cls: 'bad' };
  if (a === b && b === c)                 return { line: 'l3', text: '✓ สามเหลี่ยมด้านเท่า (equilateral)', cls: 'ok', draw: true };
  if (a === b || b === c || a === c)      return { line: 'l4', text: '✓ สามเหลี่ยมหน้าจั่ว (isosceles)', cls: 'ok', draw: true };
  return { line: 'l5', text: '✓ สามเหลี่ยมด้านไม่เท่า (scalene)', cls: 'ok', draw: true };
}

function drawTriangle(svg, a, b, c) {
  svg.replaceChildren();
  // วางด้าน a เป็นฐาน แล้วหาจุดยอดจากระยะ b (จากซ้าย) และ c (จากขวา)
  const magnitude = Math.max(a,b,c);
  const [A,B,C] = [a/magnitude,b/magnitude,c/magnitude];
  const x = (A * A + B * B - C * C) / (2 * A);
  const y = Math.sqrt(Math.max(B * B - x * x, 0));
  const raw = [[0, 0], [A, 0], [x, y]];

  const xs = raw.map(p => p[0]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const scale = Math.min(230 / (maxX - minX), 100 / y);
  const offsetX = (300 - (maxX - minX) * scale) / 2;
  const P = raw.map(([px, py]) => [offsetX + (px - minX) * scale, 135 - py * scale]);

  svgEl('polygon', { points: P.map(p => p.join(',')).join(' '), class: 'tri-shape' }, svg);
  const mid = (p, q, dx, dy) => [(p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy];
  const la = mid(P[0], P[1], 0, 16), lb = mid(P[0], P[2], -12, -4), lc = mid(P[1], P[2], 12, -4);
  svgEl('text', { x: la[0], y: la[1], class: 'tri-label' }, svg, `A=${a}`);
  svgEl('text', { x: lb[0], y: lb[1], class: 'tri-label' }, svg, `B=${b}`);
  svgEl('text', { x: lc[0], y: lc[1], class: 'tri-label' }, svg, `C=${c}`);
}

function initTriangle() {
  const inA = $('#tri-a'), inB = $('#tri-b'), inC = $('#tri-c');
  const svg = $('#tri-svg'), out = $('#tri-out');

  function render() {
    const a = parseFloat(inA.value), b = parseFloat(inB.value), c = parseFloat(inC.value);
    const res = classifyTriangle(a, b, c);
    $$('#w-triangle [data-preset]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.preset === [a,b,c].join(',')));
    });

    // ไฮไลต์เฉพาะบรรทัดที่ทำงาน
    $$('#tri-code [data-line]').forEach(s => s.classList.toggle('hit', s.dataset.line === res.line));

    if (res.draw) drawTriangle(svg, a, b, c); else svg.replaceChildren();
    out.className = 'result ' + res.cls;
    out.textContent = res.text;
  }

  [inA, inB, inC].forEach(i => i.addEventListener('input', render));
  $$('#w-triangle [data-preset]').forEach(btn => btn.addEventListener('click', () => {
    const [a, b, c] = btn.dataset.preset.split(',');
    inA.value = a; inB.value = b; inC.value = c;
    render();
  }));
  render();
}

/* =====================================================================
   วิดเจ็ต 5: สี่พื้นที่ของ Git
   ===================================================================== */
function initGit() {
  const AREAS = [
    { key: 'work',   title: 'Working tree',     sub: 'ไฟล์ที่กำลังแก้' },
    { key: 'index',  title: 'Index (staging)',  sub: 'สิ่งที่จะเข้า commit ถัดไป' },
    { key: 'repo',   title: 'Local repository', sub: 'ประวัติที่ commit แล้ว' },
    { key: 'remote', title: 'Remote',           sub: 'เช่น GitHub' },
  ];
  const fresh = () => ({ work: 1, index: 1, repo: 1, remote: 1 });   // เริ่มต้นทุกที่เป็น v1
  let s = fresh();

  const areasBox = $('#git-area-cards'), diffBox = $('#git-diff'), msg = $('#git-msg');

  function render() {
    // พื้นที่ทั้งสี่ — กรอบเหลืองเมื่อเวอร์ชันต่างจากพื้นที่ถัดไป
    areasBox.replaceChildren();
    AREAS.forEach((a, i) => {
      const next = AREAS[i + 1];
      const dirty = next && s[a.key] !== s[next.key];
      const box = document.createElement('div');
      box.className = 'area';
      box.innerHTML = `<h3>${a.title}</h3><small>${a.sub}</small><span class="file${dirty ? ' dirty' : ''}">A v${s[a.key]}${dirty ? " · ยังไม่ส่งต่อ" : ""}</span>`;
      areasBox.appendChild(box);
    });

    // ผลของคำสั่งดูความต่าง
    const rows = [
      ['git diff',          s.work !== s.index ? `A: v${s.index} → v${s.work} (ยังไม่ stage)` : 'ไม่มีความต่าง'],
      ['git diff --staged', s.index !== s.repo ? `A: v${s.repo} → v${s.index} (จะเข้า commit ถัดไป)` : 'ไม่มีความต่าง'],
      ['commit ที่ยังไม่ push', s.repo !== s.remote ? 'มี (local นำหน้า remote)' : 'ไม่มี'],
    ];
    diffBox.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  }

  const say = text => { msg.textContent = text; };

  const actions = {
    edit() { s.work += 1; say(`แก้ไฟล์เป็น v${s.work} — เปลี่ยนเฉพาะ working tree`); },
    add() {
      if (s.index === s.work) return say('ไม่มีอะไรให้ add: index ตรงกับ working tree แล้ว');
      s.index = s.work;
      say(`add เก็บ v${s.index} เข้า index (ยังไม่ใช่ commit และยังไม่ถึง remote)`);
    },
    commit() {
      if (s.repo === s.index) return say('ไม่มีอะไรใน index ที่ต่างจาก commit ล่าสุด');
      s.repo = s.index;
      const left = s.work !== s.index ? ` — แต่ v${s.work} ยังค้างใน working tree ต้อง add ใหม่ถ้าต้องการให้เข้า commit` : '';
      say(`commit บันทึก v${s.repo} ลง local repository${left}`);
    },
    push() {
      if (s.repo === s.remote) return say('ไม่มี commit ใหม่ให้ push');
      s.remote = s.repo;
      say(`push ส่ง commit v${s.remote} ไปยัง remote`);
    },
    reset() { s = fresh(); say('เริ่มใหม่: ทุกพื้นที่เป็น v1'); },
  };

  $$('#w-git [data-act]').forEach(btn => btn.addEventListener('click', () => {
    actions[btn.dataset.act]();
    render();
  }));
  render();
}

/* =====================================================================
   วิดเจ็ต 6: include / extend — ทิศลูกศร
   ===================================================================== */
function initUseCase() {
  const svg = $('#uc-svg'), flip = $('#uc-flip'), note = $('#uc-note');
  let reversed = false;

  const N = {
    sale: { cx: 250, cy: 125, rx: 74, ry: 28, label: 'Complete sale' },
    calc: { cx: 430, cy: 46,  rx: 68, ry: 24, label: 'Calculate total' },
    disc: { cx: 90,  cy: 200, rx: 68, ry: 24, label: 'Apply discount' },
  };

  // จุดบนขอบวงรีของ "from" ที่หันไปหา "to"
  function edge(from, to) {
    const dx = to.cx - from.cx, dy = to.cy - from.cy;
    const t = 1 / Math.sqrt((dx / from.rx) ** 2 + (dy / from.ry) ** 2);
    return { x: from.cx + dx * t, y: from.cy + dy * t };
  }

  // ลูกศรเส้นประจาก from ไป to พร้อมป้ายกำกับ
  function relation(from, to, label) {
    const p = edge(from, to), q = edge(to, from);
    svgEl('line', { x1: p.x, y1: p.y, x2: q.x, y2: q.y, class: 'uc-rel', 'marker-end': 'url(#arrow-uc)' }, svg);
    const vertical = Math.abs(p.x-q.x) < 20;
    svgEl('text', { x: (p.x + q.x) / 2 + (vertical ? 75 : 0), y: (p.y + q.y) / 2 + (vertical ? 4 : -8), class: 'uc-label' }, svg, label);
  }

  function draw() {
    const compact = matchMedia('(max-width: 600px)').matches;
    svg.setAttribute('viewBox', compact ? '0 0 360 340' : '0 0 520 240');
    Object.assign(N.sale, compact ? {cx:200,cy:160,rx:85} : {cx:250,cy:125,rx:74});
    Object.assign(N.calc, compact ? {cx:200,cy:44,rx:85} : {cx:430,cy:46,rx:68});
    Object.assign(N.disc, compact ? {cx:200,cy:286,rx:85} : {cx:90,cy:200,rx:68});
    svg.replaceChildren();
    flip.setAttribute('aria-pressed', String(reversed));
    svg.setAttribute('aria-label', reversed ? 'ตัวอย่างลูกศรผิดทิศ: Calculate total include Complete sale และ Complete sale extend Apply discount' : 'Complete sale include Calculate total และ Apply discount extend Complete sale');
    addMarker(svg, 'arrow-uc', 'm-ink');
    const head = svg.querySelector('marker path');
    head.setAttribute('d', 'M1,1 L9,5 L1,9');
    head.setAttribute('fill', 'none');
    head.setAttribute('style', 'fill:none;stroke:var(--ink);stroke-width:1.5');

    // วงรี use case ทั้งสาม
    Object.values(N).forEach(n => {
      svgEl('ellipse', { cx: n.cx, cy: n.cy, rx: n.rx, ry: n.ry, class: 'uc-shape' }, svg);
      svgEl('text', { x: n.cx, y: n.cy + 4, class: 'uc-text' }, svg, n.label);
    });

    // actor (Cashier) + เส้น association ที่ไม่มีหัวลูกศร
    svgEl('circle', { cx: 45, cy: 40, r: 9, class: 'uc-shape' }, svg);
    [[45, 49, 45, 80], [30, 58, 60, 58], [45, 80, 33, 100], [45, 80, 57, 100]]
      .forEach(([x1, y1, x2, y2]) => svgEl('line', { x1, y1, x2, y2, class: 'uc-assoc' }, svg));
    svgEl('text', { x: 45, y: 118, class: 'uc-text' }, svg, 'Cashier');
    const a = edge(N.sale, { cx: 45, cy: 70 });
    svgEl('line', { x1: 62, y1: 70, x2: a.x, y2: a.y, class: 'uc-assoc' }, svg);

    // include: base → included    extend: extension → base
    if (reversed) {
      relation(N.calc, N.sale, '«include»');
      relation(N.sale, N.disc, '«extend»');
    } else {
      relation(N.sale, N.calc, '«include»');
      relation(N.disc, N.sale, '«extend»');
    }

    if (reversed) {
      note.className = 'result bad';
      note.innerHTML = '<strong>✕ ทิศกลับ — ความหมายผิด:</strong> ภาพนี้อ่านได้ว่า Calculate total include Complete sale และ Complete sale extend Apply discount ซึ่งไม่ตรงกับ narrative';
      flip.textContent = 'กลับเป็นทิศที่ถูก';
    } else {
      note.className = 'result ok';
      note.innerHTML = '<strong>✓ อ่านถูกทิศ:</strong> Complete sale «include» Calculate total (การขายเรียกใช้การคำนวณยอด) · Apply discount «extend» Complete sale (ส่วนลดเพิ่มให้การขายเมื่อเข้าเงื่อนไข)';
      flip.textContent = 'ลองกลับทิศลูกศร';
    }
  }

  flip.addEventListener('click', () => { reversed = !reversed; draw(); });
  matchMedia('(max-width: 600px)').addEventListener('change', draw);
  draw();
}

/* =====================================================================
   เริ่มทำงานทุกวิดเจ็ตเมื่อหน้าโหลดเสร็จ
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if ($('#w-requirements')) initRequirements();
  if ($('#w-channels')) initChannels();
  if ($('#w-model')) initModelChooser();
  if ($('#w-dfd')) initDfd();
  if ($('#w-triangle')) initTriangle();
  if ($('#w-git')) initGit();
  if ($('#w-usecase')) initUseCase();
});

})();
