# ITDS261 and visual learning implementation plan

> **For agentic workers:** Use the existing static HTML architecture, with independent content and illustration work reviewed together before completion.

**Goal:** Add source-grounded Thai ITDS261 lessons, exercises, supplied answer images, and explanatory visuals throughout existing ITDS241 / ITDS294 lessons.

**Architecture:** Retain buildless HTML, shared reader, theme, local progress, Flashcards and 10-question quizzes. Add `assets/software-content.js`, `assets/learning-visuals.css`, `subjects/itds261/` and local educational assets. No new framework or external service.

**Tech Stack:** HTML/CSS/JavaScript, SVG, Python for source extraction and slide rasterization.

**Spec:** User request in this chat: summarize the supplied ITDS261 folder and add to existing website; distinguish exercises/answers; enrich existing subjects with useful graphics.

## Global constraints

- Work in the user's existing `study-garden` checkout; preserve unmodified site behavior and current design.
- Thai explanations with original English technical vocabulary; cite source filenames and PDF page ranges per lesson.
- No invented L5; website chapter numbers are independent of lecture numbers.
- Exercises show a prompt before a collapsible worked answer. Newly authored answers must not be presented as instructor answers.
- Visuals need captions, meaningful alternatives, mobile readability, and dark-mode compatibility.
- Preserve current footer, theme, progress, quizzes and cache fingerprints.

## Review focus

- All 20 supplied files accounted for, including image-only answers, duplicate DOCX/PDF worksheet, lab, cheat sheet and guideline.
- No learner names or IDs copied from submitted lab into generated worked examples.
- New course appears in global search and progress; 10 questions per chapter match shared score logic.
- Reader navigation and anchors work on desktop/mobile and with JavaScript disabled.
- Local links resolve; images load; responsive figures do not cause document overflow.

## Tasks

- [x] 1. Extract every PDF/DOCX; visually inspect supplied screenshots and selected diagram slides. Record page references and coverage.
- [x] 2. Produce Thai ITDS261 summaries, examples, worked exercises, flashcards and quizzes from source, retaining the distinction between supplied and authored solutions.
- [x] 3. Add a minimum of two explanatory figures per existing chapter, grounded in its concepts, using local SVG/HTML assets.
- [x] 4. Integrate ITDS261 course directory, landing card, content registration, resources, visuals and all navigation.
- [x] 5. Run asset/link/content checks; exercise reader, theme, cards, quiz and persisted progress in browser; inspect mobile and desktop.
- [x] 6. Review the complete changes and fix findings. Publish through the existing GitHub Pages repository after verification.

## Decisions and progress

- Existing checkout is clean at `f55ac14` on `main`, hosted by GitHub Pages, not Sites. Use existing local source and hosting workflow rather than register a separate Site.
- Existing website has two subjects / 13 chapters; interpret the request to enrich all existing chapters, then add the third subject.
- Baseline `node tools/check-assets.mjs`: PASS, 281 references.
- All 16 PDFs extracted; DOCX extracted separately. Source intermediates live outside repository in `work-notes/itds261-sources`.
- Final curriculum: 3 courses, 25 chapters, 250 questions, 56 learning figures, 20 source inventory entries, 1,362 valid local references.
- Asset check: 584 references use current content fingerprints. `git diff --check` passes.
- Browser QA: all 25 chapters, 416 desktop/mobile topic checks; images, search, reader practice grouping, quiz validation/grading/retry, flashcards, saved independent progress, theme and no-JavaScript fallback pass.
- Existing footer regression: 51 checks pass; final chapter 12 added afterward and separately passes its footer check.
- Fresh content/code review found one inconsistency in the authored POS graphic: Apply discount extended a different base from the prose. Corrected graphic/caption to extend Complete sale. No outstanding important or critical findings.
- Source lab filenames and body identifiers are sanitized in published content. No raw student name/ID matches remain in the website.
