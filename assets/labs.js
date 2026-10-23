/* กิจกรรมเฉพาะบท: ใช้สถานะที่จำกัดและไม่ประมวลผลโค้ดจากผู้ใช้ด้วย eval */
(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);

  // Controlled inputs only: this traces four fixed operations, never learner code.
  document.querySelectorAll('[data-variable-tracer]').forEach(lab => {
    const price = lab.querySelector('[data-price]');
    const quantity = lab.querySelector('[data-quantity]');
    const next = lab.querySelector('[data-trace-next]');
    const previous = lab.querySelector('[data-trace-prev]');
    const state = lab.querySelector('[data-trace-state]');
    const output = lab.querySelector('[data-trace-output]');
    const reason = lab.querySelector('[data-trace-reason]');
    const lines = [...lab.querySelectorAll('.trace-lines li')];
    let position = 0;
    function render() {
      const unitPrice = price.valueAsNumber;
      const count = quantity.valueAsNumber;
      const valid = price.value !== '' && quantity.value !== '' &&
        price.checkValidity() && quantity.checkValidity() &&
        Number.isFinite(unitPrice) && Number.isFinite(count);
      next.disabled = !valid || position === 4;
      previous.disabled = !valid || position === 0;
      output.textContent = '—';
      lines.forEach((line, index) => {
        if (valid && index === position - 1) line.setAttribute('aria-current', 'step');
        else line.removeAttribute('aria-current');
      });
      if (!valid) {
        state.textContent = 'ยังไม่เริ่มคำนวณ';
        reason.textContent = 'กรอกราคา 0–1,000,000 ไม่เกินสองตำแหน่งทศนิยม และจำนวนเต็ม 0–1,000 ช่องว่างไม่ใช่เลขศูนย์';
        return;
      }
      const total = unitPrice * count;
      const code = [`let price = ${unitPrice};`, `let quantity = ${count};`,
        'let total = price * quantity;', 'console.log(total);'];
      lines.forEach((line, index) => { line.querySelector('code').textContent = code[index]; });
      state.textContent = position === 0 ? 'ยังไม่ประกาศตัวแปรทั้งสาม' :
        `price = ${unitPrice}` + (position >= 2 ? ` · quantity = ${count}` : ' · quantity ยังไม่ประกาศ') +
        (position >= 3 ? ` · total = ${total}` : ' · total ยังไม่ประกาศ');
      reason.textContent = [
        'ก่อนรัน: อ่านโค้ดจากบนลงล่าง แล้วกดบรรทัดถัดไปเพื่อดูว่าชื่อใดเพิ่งมีค่า',
        `บรรทัด 1: ประกาศ price และผูกกับราคา ${unitPrice} ยังไม่ได้คำนวณยอดรวม`,
        `บรรทัด 2: ประกาศ quantity และผูกกับจำนวน ${count} ตอนนี้มีข้อมูลทั้งสองตัวพร้อมแล้ว`,
        `บรรทัด 3: อ่านค่าทางขวาก่อน คูณ ${unitPrice} × ${count} แล้วผูกผล ${total} กับ total`,
        `บรรทัด 4: console.log อ่าน total แล้วแสดง ${total} ใน Console ไม่ได้เปลี่ยนค่าตัวแปรหรือข้อความบนหน้าเว็บ`,
      ][position];
      if (position === 4) output.textContent = String(total);
    }
    next.addEventListener('click', () => { position = Math.min(4, position + 1); render(); });
    previous.addEventListener('click', () => { position = Math.max(0, position - 1); render(); });
    [price, quantity].forEach(input => input.addEventListener('input', () => { position = 0; render(); }));
    lab.querySelector('[data-trace-reset]').addEventListener('click', () => {
      price.value = '100'; quantity.value = '2'; position = 0; render();
    });
    lab.querySelectorAll('[data-trace-enhanced]').forEach(node => { node.hidden = false; });
    render();
  });

  if ($("#loop-lab")) {
    let trace, position, chart;
    const select = $("#loop-limit");
    chart = StudyApp.makeChart($("#loop-chart"), [], [], "ผลรวมสะสม");
    if (!chart) $("#loop-chart").parentElement.hidden = true;
    function render() {
      const state = trace[position];
      $("#loop-i").textContent = state.i;
      $("#loop-sum").textContent = state.sum;
      $("#loop-message").textContent = state.message;
      $("#loop-step").textContent = `ขั้น ${position + 1} / ${trace.length}`;
      $("#loop-next").disabled = position === trace.length - 1;
      $("#loop-prev").disabled = position === 0;
      document
        .querySelectorAll("[data-phase]")
        .forEach((el) =>
          el.classList.toggle("active", el.dataset.phase === state.phase),
        );
      const additions = trace
        .slice(0, position + 1)
        .filter((item) => item.phase === "add");
      $("#loop-values").textContent = additions.length
        ? "ผลรวมหลังแต่ละรอบ: " + additions.map((item) => item.sum).join(" → ")
        : "ยังไม่ได้บวกค่าใน loop";
      if (chart) {
        chart.data.labels = additions.map((item) => "รอบ " + item.i);
        chart.data.datasets[0].data = additions.map((item) => item.sum);
        chart.update();
      }
    }
    function reset() {
      trace = StudyCore.loopTrace(Number(select.value));
      position = 0;
      render();
    }
    $("#loop-next").addEventListener("click", () => {
      position++;
      render();
    });
    $("#loop-prev").addEventListener("click", () => {
      position--;
      render();
    });
    $("#loop-reset").addEventListener("click", reset);
    select.addEventListener("change", reset);
    reset();
  }

  if ($("#game-board")) {
    let board = Array(9).fill("");
    let player = "X";
    let ended = false;
    const buttons = [...$("#game-board").querySelectorAll("button")];
    buttons.forEach((button, index) =>
      button.addEventListener("click", () => {
        if (ended || board[index]) return;
        board[index] = player;
        button.textContent = player;
        button.setAttribute("aria-label", `ช่อง ${index + 1}: ${player}`);
        button.disabled = true;
        const result = StudyCore.boardResult(board);
        ended = result !== null;
        $("#game-trace").textContent =
          `click ช่อง ${index + 1} → ผ่านการตรวจ → board[${index}] = "${player}" → ${result ? "พบสถานะจบเกม" : "ยังไม่จบ จึงสลับผู้เล่น"}`;
        if (ended) {
          $("#game-status").textContent =
            result === "draw"
              ? "เสมอ! ไม่มีช่องว่างเหลือ"
              : `ผู้เล่น ${result} ชนะ!`;
          buttons.forEach((el) => {
            el.disabled = true;
          });
        } else {
          player = player === "X" ? "O" : "X";
          $("#game-status").textContent = `ตาของ ${player}`;
        }
      }),
    );
    $("#game-reset").addEventListener("click", () => {
      board = Array(9).fill("");
      player = "X";
      ended = false;
      buttons.forEach((button, i) => {
        button.textContent = "";
        button.disabled = false;
        button.setAttribute("aria-label", `ช่อง ${i + 1}: ว่าง`);
      });
      $("#game-status").textContent = "ตาของ X";
      $("#game-trace").textContent =
        "รีเซ็ต array และสถานะผู้เล่น พร้อมเริ่มรอบใหม่";
    });
  }

  if ($("#closure-lab")) {
    // ทุกครั้งที่เรียก factory จะได้ environment ของ count คนละชุด
    function makeCounter() {
      let count = 0;
      return () => ++count;
    }
    let counters = [makeCounter(), makeCounter()];
    ["a", "b"].forEach((id, i) =>
      $("#counter-" + id).addEventListener("click", () => {
        const value = counters[i]();
        $("#count-" + id).textContent = value;
        $("#closure-message").textContent =
          `counter ${id.toUpperCase()} จำ count ของตัวเองได้ → ${value} โดยไม่เปลี่ยน counter อีกตัว`;
      }),
    );
    $("#closure-reset").addEventListener("click", () => {
      counters = [makeCounter(), makeCounter()];
      $("#count-a").textContent = "0";
      $("#count-b").textContent = "0";
      $("#closure-message").textContent =
        "สร้าง closure ใหม่สองชุด แต่ละชุดเริ่ม count = 0";
    });
  }

  if ($("#dom-lab")) {
    const list = $("#dom-list");
    const initialNodes = [...list.childNodes].map(node => node.cloneNode(true));
    let count = 1;
    function message(text) {
      $("#dom-message").textContent = text;
    }
    $("#dom-reset").addEventListener("click", () => {
      list.replaceChildren(...initialNodes.map(node => node.cloneNode(true)));
      $("#dom-input").value = "";
      count = 1;
      message("เริ่มใหม่: คืนรายการตั้งต้น มี li หนึ่งตัว");
    });
    $("#dom-add").addEventListener("click", () => {
      if (list.children.length >= 5) {
        message("ตัวอย่างนี้จำกัด 5 node เพื่อให้เห็นต้นไม้ได้ชัด");
        return;
      }
      const li = document.createElement("li");
      li.textContent =
        "li · " + ($("#dom-input").value.trim() || `บทเรียน ${++count}`);
      list.appendChild(li);
      message(
        'createElement("li") → textContent → appendChild(li): เพิ่ม node เป็นลูกตัวสุดท้ายของ ul',
      );
    });
    $("#dom-edit").addEventListener("click", () => {
      if (!list.firstElementChild) {
        message("ไม่มี node ให้แก้ไข ลองเพิ่มก่อน");
        return;
      }
      list.firstElementChild.textContent =
        "li · " + ($("#dom-input").value.trim() || "ทบทวนเรียบร้อย ✓");
      message(
        'querySelector("li") → textContent: แก้ข้อความของ element แรก โดยไม่แปลเป็น HTML',
      );
    });
    $("#dom-remove").addEventListener("click", () => {
      if (!list.lastElementChild) {
        message("ไม่มี node ให้ลบแล้ว");
        return;
      }
      list.removeChild(list.lastElementChild);
      message(
        "removeChild(lastElementChild): ลบลูกตัวสุดท้าย จำนวนที่เหลือ = " +
          list.children.length,
      );
    });
  }

  if ($("#promise-lab")) {
    let settled = false;
    function settle(success) {
      if (settled) return;
      settled = true;
      $("#promise-state").textContent = success ? "fulfilled ✓" : "rejected ↺";
      $("#promise-log").textContent = success
        ? 'resolve("พร้อมอ่าน") → then รับค่า "พร้อมอ่าน" → finally ทำงาน'
        : 'reject(new Error("โหลดไม่สำเร็จ")) → catch รับ error → finally ทำงาน';
      $("#promise-resolve").disabled = true;
      $("#promise-reject").disabled = true;
    }
    $("#promise-resolve").addEventListener("click", () => settle(true));
    $("#promise-reject").addEventListener("click", () => settle(false));
    $("#promise-reset").addEventListener("click", () => {
      settled = false;
      $("#promise-state").textContent = "pending …";
      $("#promise-log").textContent =
        "สร้าง Promise ใหม่ ยังไม่มีผลลัพธ์ เลือกจำลองผลสำเร็จหรือล้มเหลว";
      $("#promise-resolve").disabled = false;
      $("#promise-reject").disabled = false;
    });
  }

  if ($("#nullish-lab")) {
    const values = {
      zero: 0,
      empty: "",
      no: false,
      nil: null,
      undef: undefined,
      text: "พร้อม",
    };
    const show = (value) =>
      value === undefined ? "undefined" : JSON.stringify(value);
    function compare() {
      const value = values[$("#nullish-value").value];
      $("#or-output").textContent = show(value || "สำรอง");
      $("#nullish-output").textContent = show(value ?? "สำรอง");
    }
    $("#nullish-value").addEventListener("change", compare);
    $("#nullish-reset").addEventListener("click", () => {
      $("#nullish-value").value = "zero";
      compare();
    });
    compare();
  }
})();
