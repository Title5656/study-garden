/* Progressive enhancement: keep every lesson available without JavaScript and in print. */
(function () {
  "use strict";
  // Read one complete topic at a time across every course.
  if (document.querySelector(".lesson-content > .lesson-section") && document.querySelector(".toc")) {
    document.body.dataset.readerMode = "paged";
  }
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const footer = document.querySelector(".motion-footer");
  const reveal = document.querySelector(".footer-reveal");
  if (footer && reveal) {
    const printMedia = matchMedia("print");
    const progressTargets = [...reveal.querySelectorAll(
      ".motion-footer, .footer-curtain, .footer-reveal-link, .footer-contact-title, .footer-actions, .footer-wordmark"
    )];
    const footerLinks = [...footer.querySelectorAll("a, button")];
    const curtain = reveal.querySelector(".footer-curtain");
    const stage = reveal.querySelector(".footer-stage");
    const artwork = footer.querySelector(".footer-art");
    const video = artwork?.querySelector("video");
    const motionToggle = footer.querySelector(".footer-motion-toggle");
    let artworkPaused = false;
    let scheduled = false;
    let covered = false;
    function artworkCanPlay() {
      if (!artwork || reducedMotion.matches || printMedia.matches || document.hidden || artworkPaused) return false;
      const bounds = artwork.getBoundingClientRect();
      const visibleTop = reveal.classList.contains("reveal-enabled")
        ? Math.max(0, curtain.getBoundingClientRect().bottom) : 0;
      return bounds.bottom > visibleTop && bounds.top < innerHeight && bounds.bottom > 0;
    }
    function updateArtwork() {
      const bounds = footer.getBoundingClientRect();
      const visible = bounds.top < innerHeight && bounds.bottom > 0 &&
        (!reveal.classList.contains("reveal-enabled") ||
         Number(reveal.style.getPropertyValue("--reveal-progress")) > 0.08);
      const canPlay = artworkCanPlay();
      footer.classList.toggle("is-motion-active",
        visible && !reducedMotion.matches && !printMedia.matches && !document.hidden && !artworkPaused);
      footer.dispatchEvent(new CustomEvent("footer-motion-change"));
      if (!video) return;
      const toggleHidden = reducedMotion.matches || printMedia.matches;
      if (motionToggle.hidden !== toggleHidden) motionToggle.hidden = toggleHidden;
      if (!canPlay) {
        if (!video.paused) video.pause();
        if (artwork.classList.contains("is-playing")) artwork.classList.remove("is-playing");
        return;
      }
      // Fetch the small baked animation only after the curtain uncovers the art.
      if (!video.getAttribute("src")) video.src = video.dataset.src;
      if (video.paused) video.play().catch(() => artwork.classList.remove("is-playing"));
    }
    // Small, bounded magnetic movement; touch and reduced motion stay still.
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    footer.querySelectorAll(".footer-contact, .footer-pill, .footer-back-top").forEach(link => {
      let frame = 0;
      let x = 0;
      let y = 0;
      const reset = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        link.style.removeProperty("--magnetic-x");
        link.style.removeProperty("--magnetic-y");
      };
      link.addEventListener("pointermove", event => {
        if (event.pointerType === "touch" || reducedMotion.matches || !finePointer.matches || artworkPaused) return;
        const rect = link.getBoundingClientRect();
        x = Math.max(-7, Math.min(7, (event.clientX - rect.left - rect.width / 2) * 0.12));
        y = Math.max(-5, Math.min(5, (event.clientY - rect.top - rect.height / 2) * 0.16));
        if (!frame) frame = requestAnimationFrame(() => {
          link.style.setProperty("--magnetic-x", x.toFixed(2) + "px");
          link.style.setProperty("--magnetic-y", y.toFixed(2) + "px");
          frame = 0;
        });
      });
      link.addEventListener("pointerleave", reset);
      link.addEventListener("blur", reset);
      reducedMotion.addEventListener("change", reset);
      finePointer.addEventListener("change", reset);
      motionToggle?.addEventListener("click", reset);
    });
    if (video) {
      video.muted = true;
      video.addEventListener("playing", () => {
        if (artworkCanPlay()) artwork.classList.add("is-playing");
        else video.pause();
      });
      video.addEventListener("error", () => artwork.classList.remove("is-playing"));
      document.addEventListener("visibilitychange", updateArtwork);
      motionToggle?.addEventListener("click", () => {
        artworkPaused = !artworkPaused;
        motionToggle.setAttribute("aria-pressed", String(artworkPaused));
        motionToggle.setAttribute("aria-label", artworkPaused ? "เล่นภาพเคลื่อนไหว" : "หยุดภาพเคลื่อนไหว");
        updateArtwork();
      });
    }
    function updateReveal(fromScroll = false) {
      scheduled = false;
      const enabled = document.body.dataset.readerMode !== "paged" && !reducedMotion.matches && !printMedia.matches && innerHeight >= 580;
      reveal.classList.toggle("reveal-enabled", enabled);
      if (!enabled) {
        covered = false;
        if (footer.inert) footer.inert = false;
        footerLinks.forEach(link => { if (link.inert) link.inert = false; });
        updateArtwork();
        return;
      }
      const bounds = reveal.getBoundingClientRect();
      const distance = bounds.height - innerHeight;
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, distance)));
      // Ordinary page scrolling cannot change a fully covered footer. Still read
      // the wrapper each frame so crossing into the reveal updates immediately.
      // Layout, media and preference changes always take the complete path.
      if (fromScroll === true && covered && progress === 0) return;
      covered = progress === 0;
      const value = progress.toFixed(4);
      if (reveal.style.getPropertyValue("--reveal-progress") !== value) {
        reveal.style.setProperty("--reveal-progress", value);
        progressTargets.forEach(element => element.style.setProperty("--reveal-progress", value));
      }
      // Enable each link as soon as the curtain uncovers it.
      const visibleTop = Math.max(0, curtain.getBoundingClientRect().bottom);
      const visibleBottom = Math.min(innerHeight, stage.getBoundingClientRect().bottom);
      // Read all geometry before changing inert attributes, which invalidate style.
      const linkStates = footerLinks.map(link => {
        const rect = link.getBoundingClientRect();
        return rect.top < visibleTop || rect.bottom > visibleBottom;
      });
      updateArtwork();
      if (footer.inert !== (progress === 0)) footer.inert = progress === 0;
      footerLinks.forEach((link, index) => {
        if (link.inert !== linkStates[index]) link.inert = linkStates[index];
      });
    }
    let scrollOnly = true;
    function scheduleReveal(fromScroll = false) {
      scrollOnly = scrollOnly && fromScroll === true;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          const onlyScroll = scrollOnly;
          scrollOnly = true;
          updateReveal(onlyScroll);
        });
      }
    }
    window.addEventListener("scroll", () => scheduleReveal(true), { passive: true });
    window.addEventListener("resize", scheduleReveal);
    reducedMotion.addEventListener("change", updateReveal);
    printMedia.addEventListener("change", updateReveal);
    // Topic changes alter the document height even when the viewport stays still.
    if ("ResizeObserver" in window) new ResizeObserver(scheduleReveal).observe(document.body);
    reveal.querySelector(".footer-reveal-link")?.addEventListener("click", event => {
      if (!reveal.classList.contains("reveal-enabled") || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const bounds = reveal.getBoundingClientRect();
      window.scrollTo({ top: scrollY + bounds.top + bounds.height - innerHeight, behavior: "instant" });
      updateReveal();
      footer.querySelector(".footer-contact")?.focus({ preventScroll: true });
    });
    updateReveal();
  }

  const article = document.querySelector(".lesson-content");
  const sidebar = document.querySelector(".toc");
  if (!article || !sidebar) return;
  const sections = [...article.querySelectorAll(":scope > .lesson-section")];
  if (!sections.length) return;
  const chapter = document.body.dataset.chapter;
  const subject = document.body.dataset.subject;
  const paged = document.body.dataset.readerMode === "paged";
  const categories = [
    { id: "learn", label: "เนื้อหา", icon: "01" },
    { id: "practice", label: "กิจกรรม", icon: "02" },
    { id: "flashcards", label: "Flashcards", icon: "03" },
    { id: "quiz", label: "Quiz", icon: "04" },
    { id: "sources", label: "แหล่งอ้างอิง", icon: "05" },
  ];
  const activities = {
    itds241: { "06": ["loops", "game"], "07": ["dom", "events"], "08": ["timeline", "nullish"] },
    itds294: {
      "01": ["uber"], "02": ["revenue", "twitter"], "03": ["request", "platform"],
      "04": ["sdlc", "skyscanner"], "05": ["plan", "walletcase"],
      "06": ["programmatic", "metrics"], "07": ["social", "location", "campaign"],
      "08": ["scamper", "practice"], "09": ["bmc", "journey", "practice"],
      "10": ["break-even", "assessment"],
    },
  };
  const topics = sections.map((section, index) => ({
    section, index, id: section.id,
    title: section.querySelector("h2").textContent.trim().replace(/^\d+\s*[·./](?!\d)\s*/, ""),
    category: ["flashcards", "quiz", "sources"].includes(section.id) ? section.id
      : document.body.dataset.readerInline === "true" ? "learn"
      : section.dataset.readerCategory === "practice" || activities[subject]?.[chapter]?.includes(section.id) ? "practice" : "learn",
  }));
  const activeCategories = categories.filter(group => topics.some(topic => topic.category === group.id));
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  sidebar.classList.add("reader-sidebar");
  sidebar.replaceChildren();
  const back = element("a", "reader-back", "← กลับไปบทเรียนทั้งหมด");
  back.href = "index.html";
  sidebar.append(back);
  const courseCard = element("div", "reader-course");
  courseCard.append(window.StudyApp.createCourseProgressRing(subject));
  const courseName = element("div");
  courseName.append(element("strong", "", subject.toUpperCase()), element("span", "", `กำลังอ่านบทที่ ${Number(chapter)}`));
  courseCard.append(courseName);
  sidebar.append(courseCard);
  const menuButton = element("button", "reader-menu-toggle", "สารบัญบทเรียน  ☰");
  menuButton.type = "button";
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", "reader-topics");
  const menu = element("nav", "reader-topics");
  menu.id = "reader-topics";
  menu.setAttribute("aria-label", "หมวดหมู่ในบทนี้");
  sidebar.append(menuButton, menu);
  function closeMenu() {
    sidebar.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
  menuButton.addEventListener("click", () => {
    const open = sidebar.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  sidebar.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeMenu(); menuButton.focus(); }
  });
  for (const group of activeCategories) {
    const container = element("div", "reader-group");
    const groupTopics = topics.filter(topic => topic.category === group.id);
    container.append(element("h2", "reader-group-label", `${group.label} · ${groupTopics.length}`));
    groupTopics.forEach(topic => {
      const link = element("a", "reader-topic");
      link.href = "#" + topic.id;
      link.append(element("span", "reader-topic-number", String(topic.index + 1).padStart(2, "0")), element("span", "", topic.title));
      topic.link = link;
      container.append(link);
    });
    menu.append(container);
  }
  const toolbar = element("nav", "reader-categories");
  toolbar.setAttribute("aria-label", "เลือกหมวดการเรียน");
  activeCategories.forEach(group => {
    const button = element("button", "reader-category", group.label);
    button.type = "button";
    button.dataset.readerCategory = group.id;
    button.addEventListener("click", () => navigate(topics.find(topic => topic.category === group.id)));
    toolbar.append(button);
  });
  const position = element("div", "reader-position");
  const positionText = element("span");
  positionText.setAttribute("role", "status");
  const positionBar = element("div", "reader-position-track");
  const positionFill = element("span");
  positionBar.setAttribute("aria-hidden", "true");
  positionBar.append(positionFill);
  position.append(positionText, positionBar);
  article.prepend(toolbar, position);
  const pager = element("nav", "reader-pager");
  pager.setAttribute("aria-label", "เปลี่ยนหัวข้อ");
  const previous = element("a", "btn", "← หัวข้อก่อนหน้า");
  previous.dataset.readerPrevious = "";
  const next = element("a", "btn primary");
  next.dataset.readerNext = "";
  pager.append(previous, next);
  sections.at(-1).after(pager);

  const chapterEnd = article.querySelector(".chapter-end");
  const nextChapter = chapterEnd?.querySelector("a:last-child");
  if (nextChapter) {
    const isLast = nextChapter.getAttribute("href") === "index.html";
    nextChapter.textContent = isLast ? "กลับไปเลือกบทเรียน ↗" : "อ่านบทถัดไป →";
    nextChapter.dataset.completeChapter = "";
    chapterEnd.prepend(element("span", "chapter-end-label", "อ่านบทนี้จบแล้ว?"));
  }
  const learningTopics = topics.filter(topic => ["learn", "practice"].includes(topic.category));
  let current;
  function show(topic, focus = false) {
    current = topic;
    if (paged) {
      if (chapterEnd) chapterEnd.hidden = topic.index !== topics.length - 1;
      const markRead = article.querySelector('[data-mark-read]');
      if (markRead) markRead.hidden = topic.index !== topics.length - 1;
    }
    topics.forEach(item => {
      // Keep the whole topic scrollable; Next opens the following topic.
      item.section.hidden = paged && item !== topic;
      if (item === topic) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
    toolbar.querySelectorAll("button").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.readerCategory === topic.category));
    });
    positionText.textContent = `${activeCategories.find(group => group.id === topic.category).label} / หัวข้อ ${topic.index + 1} จาก ${topics.length}`;
    positionFill.style.width = `${(topic.index + 1) / topics.length * 100}%`;
    previous.hidden = topic.index === 0;
    previous.href = "#" + (topics[topic.index - 1]?.id || topic.id);
    const atLearningEnd = topic === learningTopics.at(-1);
    const atEnd = topic === topics.at(-1);
    if (((!paged && atLearningEnd) || atEnd) && nextChapter) {
      next.href = nextChapter.getAttribute("href");
      next.textContent = nextChapter.textContent;
      next.dataset.completeChapter = "";
    } else {
      next.href = "#" + topics[topic.index + 1].id;
      next.textContent = "หัวข้อถัดไป →";
      delete next.dataset.completeChapter;
    }
    if (focus) {
      closeMenu();
      const heading = topic.section.querySelector("h2");
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      topic.section.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }
  const readingHistoryKey = "studyGardenReading";
  // Native restoration may retain the initial fragment position instead of the
  // position reached by scrolling. Save each entry explicitly, including entry 1.
  history.scrollRestoration = "manual";
  function rememberReadingPosition() {
    const state = history.state && typeof history.state === "object" ? history.state : {};
    history.replaceState({ ...state, [readingHistoryKey]: {
      url: location.href, x: scrollX, y: scrollY,
    } }, "");
  }
  function restoreReadingPosition() {
    const saved = history.state?.[readingHistoryKey];
    if (!saved || saved.url !== location.href) return false;
    window.scrollTo({left: saved.x, top: saved.y, behavior: "instant"});
    return true;
  }
  function navigate(topic) {
    if (!topic) return;
    rememberReadingPosition();
    if (location.hash !== "#" + topic.id) history.pushState(null, "", "#" + topic.id);
    show(topic, true);
    rememberReadingPosition();
  }
  function topicFromHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return null; }
    const target = document.getElementById(id);
    return topics.find(topic => topic.section === target || topic.section.contains(target));
  }
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href^='#']");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const topic = topics.find(item => "#" + item.id === link.getAttribute("href"));
    if (!topic) return;
    event.preventDefault();
    navigate(topic);
  });
  function restore() {
    const topic = topicFromHash();
    if (topic) {
      show(topic, true);
      if (document.body.dataset.readerInline === 'true') {
        let target;try {target=document.getElementById(decodeURIComponent(location.hash.slice(1)));} catch {}
        if(target && target!==topic.section) target.scrollIntoView({block:'start',behavior:'instant'});
      }
    }
    else if (!location.hash) show(topics[0], true);
  }
  // Back/Forward restores saved reading coordinates, not a potentially stale
  // fragment. Explicit fragment changes remain separate from history traversal.
  let restoredHistoryUrl = null;
  window.addEventListener("popstate", () => {
    restoredHistoryUrl = location.href;
    show(topicFromHash() || topics[0]);
    if (!restoreReadingPosition()) restore();
  });
  window.addEventListener("hashchange", () => {
    if (restoredHistoryUrl === location.href) {
      restoredHistoryUrl = null;
      return;
    }
    restoredHistoryUrl = null;
    restore();
  });
  document.body.classList.add("reader-ready");
  show(topicFromHash() || topics[0]);
  window.addEventListener("pageshow", restoreReadingPosition);
  // Follow ordinary scrolling without adding history entries or moving focus.
  // A single animation frame coalesces scroll events; no polling or animation.
  let readingFrame = 0;
  window.addEventListener('scroll', () => {
    if (paged) { rememberReadingPosition(); return; }
    if (readingFrame) return;
    readingFrame = requestAnimationFrame(() => {
      readingFrame = 0;
      let visible = topics[0];
      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      for (const topic of topics) {
        const margin = parseFloat(getComputedStyle(topic.section).scrollMarginTop) || 0;
        if (topic.section.getBoundingClientRect().top > Math.max(170, scrollPadding + margin + 2)) break;
        visible = topic;
      }
      if (visible !== current) show(visible);
      rememberReadingPosition();
    });
  }, {passive: true});
})();
