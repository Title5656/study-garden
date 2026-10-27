/* ITDS211: pure educational calculations, shared by the labs and Node checks. */
(function (root) {
  'use strict';
  function number(value, name, min = 0, max = Number.MAX_SAFE_INTEGER, integer = false) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isSafeInteger(value))) {
      throw new RangeError(`${name}: โปรดใส่${integer ? 'จำนวนเต็ม' : 'ตัวเลข'}ตั้งแต่ ${min} ถึง ${max}`);
    }
    return value;
  }
  function powerOfTwo(value, name) {
    number(value, name, 1, 2 ** 30, true);
    if (!Number.isInteger(Math.log2(value))) throw new RangeError(`${name} ต้องเป็นกำลังของ 2`);
    return value;
  }
  function cpuTime({ instructions, cpi, ghz }) {
    number(instructions, 'Instruction count', 1, Number.MAX_SAFE_INTEGER, true); number(cpi, 'CPI', Number.MIN_VALUE, 1e6); number(ghz, 'Clock rate (GHz)', Number.MIN_VALUE, 1e6);
    const cycles = instructions * cpi, hertz = ghz * 1e9, seconds = cycles / hertz;
    if (!Number.isFinite(seconds) || seconds <= 0) throw new RangeError('ผลลัพธ์เวลา CPU อยู่นอกช่วงตัวเลขที่แบบจำลองคำนวณได้ โปรดใช้ค่าที่เล็กหรือใหญ่สุดขั้วน้อยลง');
    return { cycles, hertz, seconds };
  }
  function representInteger(value, width = 8) {
    number(width, 'จำนวนบิต', 2, 32, true);
    const min = -(2 ** (width - 1)), max = 2 ** (width - 1) - 1;
    number(value, 'จำนวนเต็มมีเครื่องหมาย', min, max, true);
    let remaining = Math.abs(value);
    const steps = [];
    do {
      const quotient = Math.floor(remaining / 2), remainder = remaining % 2;
      steps.push(`${remaining} ÷ 2 = ${quotient} เศษ ${remainder}`);
      remaining = quotient;
    } while (remaining > 0);
    const magnitude = Math.abs(value).toString(2).padStart(width, '0');
    steps.push(`อ่านเศษจากล่างขึ้นบน และเติม 0 ทางซ้ายให้ครบ ${width} บิต → ${magnitude}`);
    let bits = magnitude;
    const carrySteps = [];
    if (value < 0) {
      const inverted = [...magnitude].map(x => x === '0' ? '1' : '0').join('');
      steps.push(`กลับบิตทุกตำแหน่ง (1’s complement) → ${inverted}`);
      let carry = 1;
      const result = [...inverted];
      for (let i = width - 1; i >= 0; i--) {
        const bit = Number(inverted[i]), carryIn = carry, sum = bit + carry;
        result[i] = String(sum % 2); carry = Math.floor(sum / 2);
        carrySteps.push({ position: width - 1 - i, bit, carryIn, sum, result: sum % 2, carryOut: carry });
      }
      bits = result.join('');
      steps.push(`บวก 1 จากขวาสุด โดยทดไปทางซ้าย → ${bits} (2’s complement ของ ${value})`);
    }
    return { value, width, bits, magnitude, min, max, steps, carrySteps };
  }
  function float32(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new RangeError('ใส่จำนวนจริงที่มีค่าจำกัด');
    const data = new DataView(new ArrayBuffer(4)); data.setFloat32(0, value, false);
    const bits = data.getUint32(0, false).toString(2).padStart(32, '0');
    const exponentValue = parseInt(bits.slice(1, 9), 2), fractionValue = parseInt(bits.slice(9), 2);
    const classification = exponentValue === 255 ? 'overflow' : exponentValue === 0 ? (fractionValue === 0 ? 'zero' : 'subnormal') : 'normal';
    return { bits, sign: bits[0], exponent: bits.slice(1, 9), fraction: bits.slice(9), exponentValue, unbiasedExponent: classification === 'normal' ? exponentValue - 127 : classification === 'subnormal' ? -126 : null, fractionValue, classification, rounded: data.getFloat32(0, false) };
  }
  function cacheTrace(addresses, { lines = 4, blockBytes = 4, ways = 1 } = {}) {
    powerOfTwo(lines, 'จำนวนบรรทัด'); powerOfTwo(blockBytes, 'ขนาดบล็อก'); powerOfTwo(ways, 'จำนวนทาง');
    if (lines > 64 || ways > lines) throw new RangeError('ใช้แคชไม่เกิน 64 บรรทัดและจำนวนทางไม่เกินจำนวนบรรทัด');
    if (!Array.isArray(addresses) || addresses.length < 1 || addresses.length > 64) throw new RangeError('ใส่ที่อยู่ 1–64 ค่า');
    const setCount = lines / ways, sets = Array.from({ length: setCount }, () => []), trace = [];
    addresses.forEach((address, tick) => {
      number(address, 'Byte address', 0, 2 ** 40, true);
      const block = Math.floor(address / blockBytes), offset = address % blockBytes, index = block % setCount, tag = Math.floor(block / setCount), set = sets[index];
      let line = set.find(x => x.tag === tag), hit = Boolean(line), evictedBlock = null;
      if (!line) {
        if (set.length === ways) {
          const victim = set.reduce((a, b) => a.last < b.last ? a : b);
          evictedBlock = victim.block; set.splice(set.indexOf(victim), 1);
        }
        line = { block, tag, last: tick }; set.push(line);
      }
      line.last = tick;
      trace.push({ address, block, offset, index, tag, hit, evictedBlock, snapshot: sets.map(s => s.map(x => ({ ...x }))) });
    });
    const hits = trace.filter(x => x.hit).length;
    return { trace, hits, misses: trace.length - hits, setCount, ways, lines, blockBytes };
  }
  function translateAddress({ virtualAddress, pageBytes = 4096, table }) {
    number(virtualAddress, 'Virtual address', 0, 2 ** 40, true); powerOfTwo(pageBytes, 'Page bytes');
    if (!Array.isArray(table)) throw new TypeError('ต้องมีตารางหน้า');
    const vpn = Math.floor(virtualAddress / pageBytes), offset = virtualAddress % pageBytes, entry = table.find(x => x.vpn === vpn);
    if (!entry || !entry.present) return { vpn, offset, pageFault: true, physicalAddress: null, pfn: null };
    number(entry.pfn, 'Frame number', 0, 2 ** 30, true);
    const physicalAddress = entry.pfn * pageBytes + offset;
    if (!Number.isSafeInteger(physicalAddress)) throw new RangeError('ที่อยู่จริงเกินช่วงจำนวนเต็มที่แบบจำลองเก็บได้อย่างแม่นยำ');
    return { vpn, offset, pageFault: false, physicalAddress, pfn: entry.pfn };
  }
  function diskTime({ rpm, seekMs, bytes, megabytesPerSecond, overheadMs = 0 }) {
    number(rpm, 'RPM', 1, 1e6); number(seekMs, 'Seek time', 0, 1e6); number(bytes, 'Bytes', 0, 1e12); number(megabytesPerSecond, 'MB/s', Number.MIN_VALUE, 1e6); number(overheadMs, 'Overhead', 0, 1e6);
    const rotationMs = 30000 / rpm, transferMs = bytes / (megabytesPerSecond * 1e6) * 1000;
    const totalMs = seekMs + rotationMs + transferMs + overheadMs;
    if (!Number.isFinite(totalMs)) throw new RangeError('เวลาถ่ายข้อมูลเกินช่วงที่แบบจำลองคำนวณได้ โปรดเพิ่มอัตรา MB/s');
    return { seekMs, rotationMs, transferMs, overheadMs, totalMs };
  }
  function pipelineTrace(instructions, { forwarding = true } = {}) {
    if (!Array.isArray(instructions) || instructions.length < 1 || instructions.length > 16) throw new RangeError('ใช้ 1–16 คำสั่ง');
    instructions.forEach(x => { if (!Array.isArray(x.src) || !['alu', 'load', 'store'].includes(x.type)) throw new TypeError('ชนิดคำสั่งต้องเป็น alu/load/store และมี src'); });
    const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'], rows = instructions.map(x => ({ text: x.text, cells: [] }));
    let slots = [0, null, null, null, null], next = 1, cycles = 0, stalls = 0;
    const trace = [];
    const writesUsedByID = index => index !== null && instructions[index].dest && instructions[index].dest !== 'x0' && instructions[slots[1]].src.includes(instructions[index].dest);
    while (slots.some(x => x !== null)) {
      cycles++;
      let stalled = false;
      if (slots[1] !== null) stalled = forwarding
        ? slots[2] !== null && instructions[slots[2]].type === 'load' && writesUsedByID(slots[2])
        : writesUsedByID(slots[2]) || writesUsedByID(slots[3]);
      if (stalled) stalls++;
      slots.forEach((index, stage) => { if (index !== null) rows[index].cells.push({ cycle: cycles, stage: stages[stage], stalled: stalled && stage < 2 }); });
      trace.push({ cycle: cycles, slots: [...slots], stalled });
      const following = [null, null, null, slots[2], slots[3]];
      if (stalled) { following[0] = slots[0]; following[1] = slots[1]; }
      else { following[2] = slots[1]; following[1] = slots[0]; if (next < instructions.length) following[0] = next++; }
      slots = following;
    }
    return { cycles, stalls, rows, trace, forwarding };
  }
  function schedule(input, algorithm = 'FCFS', quantum = 2) {
    if (!Array.isArray(input) || input.length < 1 || input.length > 12) throw new RangeError('ใส่กระบวนการ 1–12 งาน');
    if (!['FCFS', 'SJF', 'STCF', 'PRIORITY', 'RR'].includes(algorithm)) throw new RangeError('ไม่รู้จักอัลกอริทึม');
    if (algorithm === 'RR') number(quantum, 'Quantum', 1, 1000, true);
    const jobs = input.map((p, index) => {
      if (typeof p.id !== 'string' || !p.id.trim() || p.id.length > 20 || p.id === 'idle') throw new TypeError('ชื่องานต้องไม่ว่าง และไม่ใช้ชื่อ idle');
      number(p.arrival, 'Arrival', 0, 10000, true); number(p.burst, 'Burst', 1, 1000, true); number(p.priority ?? 0, 'Priority', -100, 100, true);
      return { ...p, priority: p.priority ?? 0, index, remaining: p.burst, first: null, completion: null };
    });
    if (new Set(jobs.map(x => x.id)).size !== jobs.length) throw new RangeError('ชื่องานต้องไม่ซ้ำ');
    if (jobs.reduce((n, x) => n + x.burst, 0) > 5000) throw new RangeError('ผลรวม Burst ต้องไม่เกิน 5000');
    const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival || a.index - b.index), queue = [], segments = [], steps = [];
    let time = 0, arrived = 0, finished = 0;
    function enqueue() { while (arrived < sorted.length && sorted[arrived].arrival <= time) queue.push(sorted[arrived++]); }
    function segment(id, start, end) {
      if (segments.at(-1)?.id === id && segments.at(-1).end === start) segments.at(-1).end = end;
      else segments.push({ id, start, end });
    }
    while (finished < jobs.length) {
      enqueue();
      if (!queue.length) {
        const target = sorted[arrived].arrival;
        segment('idle', time, target); steps.push({ start: time, end: target, id: 'idle', reason: 'ยังไม่มีงานที่มาถึงและพร้อมทำงาน' }); time = target; enqueue();
      }
      if (algorithm !== 'RR') queue.sort((a, b) => {
        const score = x => algorithm === 'SJF' ? x.burst : algorithm === 'STCF' ? x.remaining : algorithm === 'PRIORITY' ? x.priority : x.arrival;
        return score(a) - score(b) || a.arrival - b.arrival || a.index - b.index;
      });
      const job = queue.shift(), start = time, ready = queue.map(x => `${x.id}(${x.remaining})`);
      if (job.first === null) job.first = time;
      const duration = algorithm === 'STCF' ? 1 : algorithm === 'RR' ? Math.min(quantum, job.remaining) : job.remaining;
      time += duration; job.remaining -= duration;
      segment(job.id, start, time);
      steps.push({ start, end: time, id: job.id, remaining: job.remaining, ready, reason: algorithm === 'RR' ? `ใช้ได้ไม่เกิน q=${quantum}` : algorithm === 'STCF' ? 'ตรวจเลือกงานที่เหลือเวลาสั้นสุดใหม่ทุก 1 หน่วย' : algorithm === 'SJF' ? 'เลือก Burst สั้นสุดจากงานที่มาถึงแล้ว และทำจนเสร็จ' : algorithm === 'PRIORITY' ? 'เลือกเลข Priority น้อยสุดจากงานที่มาถึงแล้ว และทำจนเสร็จ' : 'งานที่มาถึงก่อนใช้ก่อน และทำจนเสร็จ' });
      enqueue();
      if (job.remaining === 0) { job.completion = time; finished++; } else queue.push(job);
    }
    const metrics = jobs.map(p => ({ id: p.id, arrival: p.arrival, burst: p.burst, first: p.first, completion: p.completion, turnaround: p.completion - p.arrival, waiting: p.completion - p.arrival - p.burst, response: p.first - p.arrival }));
    const averages = Object.fromEntries(['turnaround', 'waiting', 'response'].map(k => [k, metrics.reduce((n, p) => n + p[k], 0) / metrics.length]));
    return { segments, steps, metrics, averages, elapsed: time, busy: jobs.reduce((n, p) => n + p.burst, 0) };
  }
  function processTransition(state, event) {
    const transitions = { ready: { dispatch: 'running' }, running: { io: 'blocked', timeout: 'ready', exit: 'terminated' }, blocked: { complete: 'ready' }, terminated: {} };
    const next = transitions[state]?.[event];
    if (!next) throw new RangeError(`สถานะ ${state} ใช้เหตุการณ์ ${event} ไม่ได้`);
    return next;
  }
  const api = { cpuTime, representInteger, float32, cacheTrace, translateAddress, diskTime, pipelineTrace, schedule, processTransition };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.ITDS211Core = api;
})(typeof window === 'object' ? window : globalThis);
