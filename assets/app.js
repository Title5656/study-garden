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
  const examChapterIds = document.body.dataset.examChapters?.split(',');
  const chapterIds = Object.keys(subjectContent).filter(id => !examChapterIds || examChapterIds.includes(id)).sort();
  const data = subjectContent[chapter];
  const chapterLabel = (id, course = subject) =>
    window.StudyContent?.[course]?.[id]?.label || `บท ${Number(id)}`;
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
  // Shared course indicator: count only real chapters explicitly marked as read.
  // Always use the full course, even on Midterm/Final lesson pages.
  function refreshCourseProgressRing(ring) {
    const course = ring.dataset.courseProgress;
    const ids = Object.keys(window.StudyContent?.[course] || {});
    const completed = ids.filter(id => progressEntry(id, course).read === true).length;
    const ratio = ids.length ? completed / ids.length : 0;
    const percent = Math.round(ratio * 100);
    ring.setAttribute("aria-valuenow", String(percent));
    ring.setAttribute("aria-valuetext", `อ่านแล้ว ${completed} จาก ${ids.length} บท (${percent}%)`);
    ring.querySelector(".course-progress-label").textContent = `${percent}%`;
    ring.querySelector(".course-progress-value").setAttribute("stroke-dashoffset", String(100 - ratio * 100));
  }
  function createCourseProgressRing(course = subject) {
    const ring = document.createElement("span");
    ring.className = "course-progress";
    ring.dataset.courseProgress = course;
    ring.setAttribute("role", "progressbar");
    ring.setAttribute("aria-label", `ความคืบหน้าวิชา ${course.toUpperCase()}`);
    ring.setAttribute("aria-valuemin", "0");
    ring.setAttribute("aria-valuemax", "100");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 42 42");
    svg.setAttribute("aria-hidden", "true");
    for (const className of ["course-progress-track", "course-progress-value"]) {
      const circle = document.createElementNS(svg.namespaceURI, "circle");
      circle.setAttribute("class", className);
      circle.setAttribute("cx", "21");
      circle.setAttribute("cy", "21");
      circle.setAttribute("r", "18.5");
      circle.setAttribute("pathLength", "100");
      svg.append(circle);
    }
    const label = document.createElement("span");
    label.className = "course-progress-label";
    ring.append(svg, label);
    refreshCourseProgressRing(ring);
    return ring;
  }
  function updateProgress(id, patch) {
    const all = getProgress();
    all[id] = { ...progressEntry(id), ...patch };
    write(subject, all);
    refreshProgress();
  }

  // ธีมตามระบบในครั้งแรก และจำตัวเลือกหลังผู้ใช้กดสลับ
  const themeButton = $("[data-theme-toggle]");
  if (themeButton) {
    themeButton.classList.add("sky-toggle");
    themeButton.type = "button";
    themeButton.setAttribute("role", "switch");
    themeButton.setAttribute("aria-label", "โหมดมืด");
    // Decorative sky adapted from the supplied 21st.dev Sky Toggle component.
    themeButton.innerHTML = `
      <span class="sky-toggle__scene" aria-hidden="true">
        <span class="sky-toggle__clouds"></span>
        <span class="sky-toggle__stars">
          <svg viewBox="0 0 144 55" fill="currentColor" focusable="false">
            <path d="M137 0q0 4.35-4 4.35 4 .2 4 4.38 0-4.18 4-4.38-4 0-4-4.35ZM35 19q0 4.35-4 4.35 4 .2 4 4.38 0-4.18 4-4.38-4 0-4-4.35ZM4 32q0 4.35-4 4.35 4 .2 4 4.38 0-4.18 4-4.38-4 0-4-4.35ZM58 21q0 4.35-4 4.35 4 .2 4 4.38 0-4.18 4-4.38-4 0-4-4.35ZM85 21q0 4.35-4 4.35 4 .2 4 4.38 0-4.18 4-4.38-4 0-4-4.35ZM140 32q0 4.35-4 4.35 4 .2 4 4.38 0-4.18 4-4.38-4 0-4-4.35ZM103 46q0 4.35-4 4.35 4 .2 4 4.38 0-4.18 4-4.38-4 0-4-4.35Z" />
          </svg>
        </span>
        <span class="sky-toggle__halo">
          <span class="sky-toggle__sun">
            <span class="sky-toggle__moon">
              <span class="sky-toggle__crater"></span>
              <span class="sky-toggle__crater"></span>
              <span class="sky-toggle__crater"></span>
            </span>
          </span>
        </span>
      </span>`;
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
      themeButton.setAttribute("aria-checked", String(theme === "dark"));
      themeButton.title = theme === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด";
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
    chapterIds.map((id) => chapterLabel(id)),
    chapterIds.map((id) => scoreValue(progressEntry(id).best)),
    "คะแนนดีที่สุด / 10",
    10,
  );
  if ($("#progress-chart") && !progressChart)
    $("#progress-chart").parentElement.hidden = true;
  function refreshProgress() {
    $$("[data-course-progress]").forEach(refreshCourseProgressRing);
    const ids = chapterIds;
    const courses = document.body.hasAttribute("data-all-courses")
      ? Object.keys(window.StudyContent || {}) : [subject];
    const allChapters = courses.flatMap(course =>
      Object.keys(window.StudyContent?.[course] || {}).sort().map(id => ({course, id})))
      .filter(({course, id}) => course !== subject || !examChapterIds || examChapterIds.includes(id));
    const readCount = allChapters.filter(
      ({course, id}) => progressEntry(id, course).read === true,
    ).length;
    $$("[data-read-count]").forEach((el) => {
      el.textContent = readCount;
    });
    $$("[data-progress-bar]").forEach((el) => {
      el.style.width = `${allChapters.length ? (readCount / allChapters.length) * 100 : 0}%`;
    });
    $$("[data-course-read-count]").forEach((el) => {
      const course = el.dataset.courseReadCount;
      el.textContent = Object.keys(window.StudyContent?.[course] || {}).filter(
        (id) => progressEntry(id, course).read === true,
      ).length;
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
          return `${courses.length > 1 ? course.toUpperCase() + " · " : ""}${chapterLabel(id, course)}: ${score === null ? "ยังไม่ทำ quiz" : score + "/10"}`;
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
  // Keep restored pages and other open lessons in sync with the existing store.
  window.addEventListener("pageshow", refreshProgress);
  window.addEventListener("storage", (event) => {
    if (event.key !== null && !event.key.startsWith("study-garden:")) return;
    if (event.key === null) Object.keys(memory).forEach(key => delete memory[key]);
    else delete memory[event.key.slice("study-garden:".length)];
    refreshProgress();
  });

  // Explicitly finishing a chapter is idempotent, unlike the manual toggle.
  document.addEventListener("click", (event) => {
    if (chapter && event.target.closest("[data-complete-chapter]") &&
        event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      updateProgress(chapter, { read: true });
    }
  });

  // Unpublished courses stay visible/searchable without promising a destination.
  const courseStatuses = {
    "coming-soon": { label: "Coming Soon", description: "เร็ว ๆ นี้ · ยังไม่เปิดให้เรียน" },
    "in-progress": { label: "In Progress", description: "กำลังจัดทำเนื้อหา · ยังไม่เปิดให้เรียน" },
  };
  $$(".subject-grid .folder-card").forEach((card) => {
    const folder = $(".subject-folder", card);
    if (!folder) return;
    const href = folder.getAttribute("href")?.trim();
    const status = Object.hasOwn(courseStatuses, card.dataset.courseStatus)
      ? card.dataset.courseStatus
      : !href || href === "#" ? "coming-soon" : null;
    if (!status) return;
    const { label, description } = courseStatuses[status];
    card.dataset.courseStatus = status;
    card.setAttribute("aria-disabled", "true");
    const code = $(".folder-code", card)?.textContent.trim() || "";
    const name = $(".folder-label strong", card)?.textContent.trim() || $("h3", card)?.textContent.trim() || "";
    card.setAttribute("aria-label", `${code} ${name} · ${label}`.trim());
    // Plain spans remove mouse, keyboard, and open-in-new-tab navigation together.
    $$("a", card).forEach((link) => {
      const text = document.createElement("span");
      text.className = link.className;
      text.append(...link.childNodes);
      link.replaceWith(text);
    });
    $$(".folder-key, .folder-caption h3 [aria-hidden]", card).forEach((arrow) => arrow.remove());
    $$(".folder-meta", card).forEach((meta) => { meta.textContent = description; });
    const caption = $(".folder-caption", card);
    if (caption) {
      const badge = document.createElement("span");
      badge.className = "course-status";
      badge.lang = "en";
      badge.textContent = label;
      const progress = $(":scope > span", caption);
      if (progress) progress.replaceWith(badge);
      else caption.append(badge);
    }
  });

  // Shared native-link feedback for subject, exam, and chapter folders.
  function initFolderNavigation() {
    const cards = $$(".folder-card");
    if (!cards.length) return;
    let activeCard = null;
    let restore = [];
    let navigationFrame = null;
    let pendingHref = null;
    const progress = document.createElement("div");
    progress.className = "folder-navigation-progress";
    progress.hidden = true;
    progress.setAttribute("aria-hidden", "true");
    const status = document.createElement("span");
    status.className = "sr-only folder-navigation-status";
    status.setAttribute("role", "status");
    document.body.append(progress, status);

    $$(".folder-key").forEach((key) => {
      const arrow = document.createElement("span");
      arrow.className = "folder-key-arrow";
      arrow.append(...key.childNodes);
      key.append(arrow);
    });

    function resetNavigation() {
      cancelAnimationFrame(navigationFrame);
      navigationFrame = null;
      pendingHref = null;
      document.body.classList.remove("folder-navigating");
      activeCard?.classList.remove("is-navigating");
      restore.forEach(reset => reset());
      restore = [];
      activeCard = null;
      progress.hidden = true;
      status.textContent = "";
    }
    function navigateToFolder() {
      if (!activeCard || !pendingHref) return;
      const href = pendingHref;
      pendingHref = null;
      navigationFrame = null;
      location.assign(href);
    }
    function rememberAttribute(element, name) {
      const value = element.getAttribute(name);
      restore.push(() => {
        if (value === null) element.removeAttribute(name);
        else element.setAttribute(name, value);
      });
    }
    function blockRepeatedActivation(event) {
      if (!activeCard || !event.target.closest(".folder-card")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    document.addEventListener("click", blockRepeatedActivation, true);
    document.addEventListener("auxclick", blockRepeatedActivation, true);
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 ||
          event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      const card = link?.closest(".folder-card");
      if (!card || card.getAttribute("aria-disabled") === "true" || link.hasAttribute("download")) return;
      const target = (link.getAttribute("target") ?? $("base[target]")?.getAttribute("target") ?? "_self").toLowerCase();
      if (target && target !== "_self") return;
      const href = link.getAttribute("href").trim();
      if (!href || href.startsWith("#")) return;
      const destination = new URL(link.href);
      if (destination.origin !== location.origin || !["http:", "https:"].includes(destination.protocol)) return;
      if (destination.pathname === location.pathname && destination.search === location.search &&
          (destination.hash || href.includes("#"))) return;

      event.preventDefault();
      // Freeze the current hover/open pose, including an in-flight transition.
      const poses = $$(".folder-front, .folder-sheet", card).map(element =>
        [element, getComputedStyle(element).transform]);
      poses.forEach(([element, transform]) => {
        rememberAttribute(element, "style");
        element.style.transform = transform;
      });
      $$(".folder-meta", card).forEach(meta => {
        const original = [...meta.childNodes];
        restore.push(() => meta.replaceChildren(...original));
        meta.textContent = "กำลังเปิดบทเรียน…";
      });
      cards.forEach(item => {
        rememberAttribute(item, "aria-disabled");
        item.setAttribute("aria-disabled", "true");
      });
      rememberAttribute(card, "aria-busy");
      card.setAttribute("aria-busy", "true");
      activeCard = card;
      card.classList.add("is-navigating");
      document.body.classList.add("folder-navigating");
      progress.hidden = false;
      status.textContent = "กำลังเปิดบทเรียน…";
      pendingHref = destination.href;
      // A cached document can replace this page before its next paint. Allow
      // one rendered frame of acknowledgement, without a fixed loading delay.
      if (document.hidden) navigateToFolder();
      else navigationFrame = requestAnimationFrame(() => {
        navigationFrame = requestAnimationFrame(navigateToFolder);
      });
    });
    window.addEventListener("pagehide", resetNavigation);
    window.addEventListener("pageshow", (event) => {
      // Initial pageshow can follow an early click while images are loading.
      // Only a restored document needs to clear a previous navigation.
      if (event.persisted) resetNavigation();
    });
    // A canceled/failed navigation should also release the original page.
    window.navigation?.addEventListener("navigateerror", resetNavigation);
    document.addEventListener("visibilitychange", () => {
      // Background tabs may pause animation frames; navigation must still finish.
      if (document.hidden) {
        cancelAnimationFrame(navigationFrame);
        navigateToFolder();
      }
    });
  }
  initFolderNavigation();

  const search = $("#subject-search");
  search?.addEventListener("input", () => {
    const term = search.value.trim().toLocaleLowerCase("th");
    let count = 0;
    $$("[data-search-text]").forEach((card) => {
      const university = card.closest("[data-university-search]");
      const searchText = `${card.dataset.searchText} ${university?.dataset.universitySearch || ""}`;
      card.hidden = !searchText
        .toLocaleLowerCase("th")
        .includes(term);
      if (!card.hidden) count++;
    });
    $$("[data-university-search]").forEach((group) => {
      group.hidden = !group.querySelector("[data-search-text]:not([hidden])");
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
  window.StudyApp = {
    makeChart,
    createCourseProgressRing,
    // Activities share this page's storage fallback/cache with the read marker.
    recordQuizScore(score) {
      if (!chapter || !data || scoreValue(score) === null) return;
      updateProgress(chapter, {
        last: score,
        best: Math.max(scoreValue(progressEntry(chapter).best) ?? 0, score),
      });
    },
  };
})();
