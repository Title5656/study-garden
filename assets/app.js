/* ฟังก์ชันร่วมทุกวิชา: ธีม ความคืบหน้า เปิดเฉลย flashcard และ quiz */
(function () {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const chapter = document.body.dataset.chapter;
  // แต่ละวิชามี namespace ของเนื้อหาและคะแนน จึงใช้เลขบทซ้ำกันได้
  const subject = document.body.dataset.subject || "itds241";
  const subjectContent = window.StudyContent?.[subject] || {};
  const chapterIds = Object.keys(subjectContent).sort();
  const data = subjectContent[chapter];
  const charts = [];
  const memory = {};

  // storage อาจถูกปิดในโหมดส่วนตัว จึงเก็บในหน่วยความจำสำรองและแจ้งผู้ใช้
  function storageNotice() {
    const notice = $("#storage-notice");
    if (notice) notice.hidden = false;
  }
  function read(key, fallback) {
    // ถ้าเคยเขียนในหน้านี้ ให้ใช้ค่าล่าสุด แม้ storage ยังมีค่าเก่าเพราะเขียนไม่สำเร็จ
    if (Object.prototype.hasOwnProperty.call(memory, key)) return memory[key];
    try {
      const raw = localStorage.getItem("study-garden:" + key);
      return raw === null ? (memory[key] ?? fallback) : JSON.parse(raw);
    } catch {
      storageNotice();
      return memory[key] ?? fallback;
    }
  }
  function write(key, value) {
    memory[key] = value;
    try {
      localStorage.setItem("study-garden:" + key, JSON.stringify(value));
    } catch {
      storageNotice();
    }
  }
  function getProgress(course = subject) {
    const saved = read(course, {});
    return saved && typeof saved === "object" && !Array.isArray(saved)
      ? saved
      : {};
  }
  function progressEntry(id, course = subject) {
    const entry = getProgress(course)[id];
    return entry && typeof entry === "object" ? entry : {};
  }
  function scoreValue(value) {
    return Number.isInteger(value) && value >= 0 && value <= 10 ? value : null;
  }
  function updateProgress(id, patch) {
    const all = getProgress();
    all[id] = { ...progressEntry(id), ...patch };
    write(subject, all);
    refreshProgress();
  }

  // ธีมตามระบบในครั้งแรก และจำตัวเลือกหลังผู้ใช้กดสลับ
  const themeButton = $("[data-theme-toggle]");
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
      themeButton.textContent = theme === "dark" ? "☀ สว่าง" : "☾ มืด";
      themeButton.setAttribute(
        "aria-label",
        theme === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด",
      );
    }
    charts.forEach((chart) => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--muted")
        .trim();
      Object.values(chart.options.scales || {}).forEach((scale) => {
        scale.ticks.color = color;
      });
      chart.update();
    });
  }
  const savedTheme = read("theme", null);
  setTheme(
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
  );
  themeButton?.addEventListener("click", () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    write("theme", theme);
    setTheme(theme);
  });

  $$("[data-reveal]").forEach((button) => {
    const answer = document.getElementById(button.dataset.reveal);
    if (!answer) return;
    button.addEventListener("click", () => {
      answer.hidden = !answer.hidden;
      button.setAttribute("aria-expanded", String(!answer.hidden));
      button.textContent = answer.hidden ? "ดูคำตอบ ↓" : "ซ่อนคำตอบ ↑";
    });
  });

  function makeChart(canvas, labels, values, label, max) {
    if (!canvas || typeof window.Chart !== "function") return null;
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--muted")
      .trim();
    const chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label,
            data: values,
            backgroundColor: [
              "#b9a7d5",
              "#a6bea0",
              "#e5bb9c",
              "#b9a7d5",
              "#a6bea0",
            ],
            borderRadius: 6,
            maxBarThickness: 42,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? false
          : { duration: 250 },
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max,
            ticks: { color, precision: 0 },
            grid: { color: "#8b938425" },
          },
          x: { ticks: { color }, grid: { display: false } },
        },
      },
    });
    charts.push(chart);
    return chart;
  }
  const progressChart = makeChart(
    $("#progress-chart"),
    chapterIds.map((id) => "บท " + Number(id)),
    chapterIds.map((id) => scoreValue(progressEntry(id).best)),
    "คะแนนดีที่สุด / 10",
    10,
  );
  if ($("#progress-chart") && !progressChart)
    $("#progress-chart").parentElement.hidden = true;
  function refreshProgress() {
    const ids = chapterIds;
    const courses = document.body.hasAttribute("data-all-courses")
      ? Object.keys(window.StudyContent || {}) : [subject];
    const allChapters = courses.flatMap(course =>
      Object.keys(window.StudyContent?.[course] || {}).sort().map(id => ({course, id})));
    const readCount = allChapters.filter(
      ({course, id}) => progressEntry(id, course).read === true,
    ).length;
    $$("[data-read-count]").forEach((el) => {
      el.textContent = readCount;
    });
    $$("[data-progress-bar]").forEach((el) => {
      el.style.width = `${allChapters.length ? (readCount / allChapters.length) * 100 : 0}%`;
    });
    $$("[data-chapter-status]").forEach((el) => {
      const entry = progressEntry(el.dataset.chapterStatus, el.dataset.progressSubject || subject);
      const score = scoreValue(entry.best);
      el.textContent =
        score !== null
          ? `คะแนนดีที่สุด ${score}/10`
          : entry.read === true
            ? "อ่านแล้ว ✓"
            : "ยังไม่ได้อ่าน";
    });
    if ($("#score-summary")) {
      $("#score-summary").textContent = allChapters
        .map(({course, id}) => {
          const score = scoreValue(progressEntry(id, course).best);
          return `${courses.length > 1 ? course.toUpperCase() + " · " : ""}บท ${Number(id)}: ${score === null ? "ยังไม่ทำ quiz" : score + "/10"}`;
        })
        .join(" · ");
    }
    if (progressChart) {
      progressChart.data.datasets[0].data = ids.map((id) =>
        scoreValue(progressEntry(id).best),
      );
      progressChart.update();
    }
    const readButton = $("[data-mark-read]");
    if (readButton) {
      const done = progressEntry(chapter).read === true;
      readButton.textContent = done
        ? "อ่านแล้ว ✓ · ยกเลิกเครื่องหมาย"
        : "ทำเครื่องหมายว่าอ่านแล้ว ✓";
      readButton.setAttribute("aria-pressed", String(done));
    }
  }
  $("[data-mark-read]")?.addEventListener("click", () =>
    updateProgress(chapter, { read: progressEntry(chapter).read !== true }),
  );
  refreshProgress();

  const search = $("#subject-search");
  search?.addEventListener("input", () => {
    const term = search.value.trim().toLocaleLowerCase("th");
    let count = 0;
    $$("[data-search-text]").forEach((card) => {
      card.hidden = !card.dataset.searchText
        .toLocaleLowerCase("th")
        .includes(term);
      if (!card.hidden) count++;
    });
    $("#search-empty").hidden = count !== 0;
  });

  // Flashcard ใช้ปุ่มจริง จึงพลิกด้วย Enter / Space ได้โดยไม่ต้องเขียน keyboard handler ซ้ำ
  if (data && $("#flashcard")) {
    let index = 0;
    let flipped = false;
    const card = $("#flashcard");
    function renderCard() {
      card.classList.toggle("is-flipped", flipped);
      card.setAttribute("aria-pressed", String(flipped));
      $("#flash-label").textContent = flipped ? "คำอธิบาย" : "คำศัพท์";
      $("#flash-text").textContent = data.cards[index][flipped ? 1 : 0];
      $("#flash-text").className = flipped ? "" : "flashcard-term";
      $("#flash-position").textContent = `${index + 1} / ${data.cards.length}`;
      $("#flash-prev").disabled = index === 0;
      $("#flash-next").disabled = index === data.cards.length - 1;
    }
    card.addEventListener("click", () => {
      flipped = !flipped;
      renderCard();
    });
    $("#flash-prev").addEventListener("click", () => {
      index--;
      flipped = false;
      renderCard();
    });
    $("#flash-next").addEventListener("click", () => {
      index++;
      flipped = false;
      renderCard();
    });
    renderCard();
  }

  // สร้างตัวเลือกด้วย textContent เพื่อให้ตัวอย่างโค้ดแสดงเป็นข้อความอย่างปลอดภัย
  if (data && $("#quiz-form")) {
    const form = $("#quiz-form");
    const questions = $("#quiz-questions");
    data.quiz.forEach((question, i) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "quiz-question";
      const legend = document.createElement("legend");
      legend.textContent = `${i + 1}. ${question.q}`;
      fieldset.append(legend);
      question.options.forEach((option, j) => {
        const label = document.createElement("label");
        label.className = "quiz-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q${i}`;
        input.value = j;
        const text = document.createElement("span");
        text.textContent = option;
        label.append(input, text);
        fieldset.append(label);
      });
      const explanation = document.createElement("p");
      explanation.className = "explanation";
      explanation.hidden = true;
      fieldset.append(explanation);
      questions.append(fieldset);
    });
    function countAnswers() {
      $("#quiz-count").textContent =
        `ตอบแล้ว ${$$("input:checked", form).length} / ${data.quiz.length} ข้อ`;
    }
    form.addEventListener("change", countAnswers);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const answers = data.quiz.map((q, i) => {
        const selected = $(`input[name="q${i}"]:checked`, form);
        return selected ? Number(selected.value) : null;
      });
      const result = StudyCore.gradeQuiz(data.quiz, answers);
      if (result.unanswered) {
        $("#quiz-error").textContent =
          `ยังเหลือ ${result.unanswered} ข้อ กรุณาตอบให้ครบก่อนตรวจ`;
        $(`input[name="q${answers.indexOf(null)}"]`, form).focus();
        return;
      }
      $("#quiz-error").textContent = "";
      data.quiz.forEach((q, i) => {
        const fieldset = questions.children[i];
        const labels = $$(".quiz-option", fieldset);
        labels[q.answer].classList.add("correct");
        if (answers[i] !== q.answer) labels[answers[i]].classList.add("wrong");
        const explanation = $(".explanation", fieldset);
        explanation.textContent = `${answers[i] === q.answer ? "✓ ถูกต้อง" : "ไม่ถูกต้อง"} — เฉลย: ${q.options[q.answer]} · ${q.explanation}`;
        explanation.hidden = false;
      });
      $$("input", form).forEach((input) => {
        input.disabled = true;
      });
      $("#quiz-submit").hidden = true;
      $("#quiz-retry").hidden = false;
      $("#quiz-result").hidden = false;
      $("#quiz-score").textContent =
        `ได้ ${result.score} / ${result.total} คะแนน`;
      $("#quiz-message").textContent =
        result.score === 10
          ? "ตอบถูกทุกข้อ"
          : "ดูเฉลยและคำอธิบายใต้แต่ละข้อ";
      updateProgress(chapter, {
        last: result.score,
        best: Math.max(
          scoreValue(progressEntry(chapter).best) ?? 0,
          result.score,
        ),
      });
      $("#quiz-result").focus();
    });
    $("#quiz-retry").addEventListener("click", () => {
      form.reset();
      $$("input", form).forEach((input) => {
        input.disabled = false;
      });
      $$(".quiz-option", form).forEach((label) =>
        label.classList.remove("correct", "wrong"),
      );
      $$(".explanation", form).forEach((el) => {
        el.hidden = true;
      });
      $("#quiz-result").hidden = true;
      $("#quiz-submit").hidden = false;
      $("#quiz-retry").hidden = true;
      countAnswers();
      $("input", form).focus();
    });
  }
  // กิจกรรมเฉพาะบทเรียกใช้กราฟจากที่เดียวกัน เพื่อรองรับโหมดมืดและลดการเคลื่อนไหว
  window.StudyApp = { makeChart };
})();
