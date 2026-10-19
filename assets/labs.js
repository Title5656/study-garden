/* กิจกรรมเฉพาะบท: ใช้สถานะที่จำกัดและไม่ประมวลผลโค้ดจากผู้ใช้ด้วย eval */
(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);

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
    let count = 1;
    function message(text) {
      $("#dom-message").textContent = text;
    }
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
    compare();
  }
})();
