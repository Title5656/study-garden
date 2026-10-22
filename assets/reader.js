/* Progressive enhancement: keep every lesson available without JavaScript and in print. */
(function () {
  "use strict";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const footer = document.querySelector(".motion-footer");
  const reveal = document.querySelector(".footer-reveal");
  if (footer && reveal) {
    const printMedia = matchMedia("print");
    const footerLinks = [...footer.querySelectorAll("a, button")];
    const curtain = reveal.querySelector(".footer-curtain");
    const stage = reveal.querySelector(".footer-stage");
    const artwork = footer.querySelector(".footer-art");
    const video = artwork?.querySelector("video");
    const motionToggle = footer.querySelector(".footer-motion-toggle");
    let artworkPaused = false;
    let scheduled = false;
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
    function updateReveal() {
      scheduled = false;
      const enabled = !reducedMotion.matches && !printMedia.matches && innerHeight >= 580;
      reveal.classList.toggle("reveal-enabled", enabled);
      if (!enabled) {
        if (footer.inert) footer.inert = false;
        footerLinks.forEach(link => { if (link.inert) link.inert = false; });
        updateArtwork();
        return;
      }
      const bounds = reveal.getBoundingClientRect();
      const distance = bounds.height - innerHeight;
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, distance)));
      const value = progress.toFixed(4);
      if (reveal.style.getPropertyValue("--reveal-progress") !== value) {
        reveal.style.setProperty("--reveal-progress", value);
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
    function scheduleReveal() {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateReveal);
      }
    }
    window.addEventListener("scroll", scheduleReveal, { passive: true });
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
    title: section.querySelector("h2").textContent.trim().replace(/^\d+\s*[·./]\s*/, ""),
    category: ["flashcards", "quiz", "sources"].includes(section.id) ? section.id
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
  courseCard.append(element("span", "reader-course-icon", "▦"));
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
    topics.forEach(item => {
      item.section.hidden = item !== topic;
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
    if ((atLearningEnd || atEnd) && nextChapter) {
      next.href = nextChapter.getAttribute("href");
      next.textContent = nextChapter.textContent;
      next.dataset.completeChapter = "";
    } else {
      next.href = "#" + topics[topic.index + 1].id;
      next.textContent = "หัวข้อถัดไป →";
      delete next.dataset.completeChapter;
    }
    closeMenu();
    // Hidden canvases need their layout updated when their activity is shown.
    window.dispatchEvent(new Event("resize"));
    if (focus) {
      const heading = topic.section.querySelector("h2");
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      toolbar.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }
  function navigate(topic) {
    if (!topic) return;
    if (location.hash !== "#" + topic.id) history.pushState(null, "", "#" + topic.id);
    show(topic, true);
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
    if (topic) show(topic, true);
    else if (!location.hash) show(topics[0], true);
  }
  window.addEventListener("popstate", restore);
  window.addEventListener("hashchange", restore);
  document.body.classList.add("reader-ready");
  show(topicFromHash() || topics[0]);
})();
