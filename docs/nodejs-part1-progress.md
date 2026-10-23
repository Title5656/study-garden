# Progress — plan: docs/nodejs-part1-plan.md

- Repository baseline: 3a4ea04, clean working tree on codex/teaching-redesign. Work in current authorized workspace.
- Part II explicitly deferred by user. No content is invented for it.
- Pre-flight: reader currently keeps all sections visible; add opt-in pagination only. app.js expects 10-question scores; keep final score /10 and isolate formative recall scores.
- Task 1: complete — chapter 09 has 59 short topic pages; opt-in pagination preserves the existing continuous lessons; previous/next, hash links, history, print, and no-JavaScript fallback verified.
- Task 2: complete — all 10 activity blocks, all 34 original questions across 8 quizzes, 14 flashcards, plus 10 automatically graded final questions. Original source Markdown preserved byte for byte.
- Task 3: complete — navigation, course/home totals and search, asset fingerprints, desktop/mobile themes, and regression checks.
- Final review: self-review. The requested fresh reviewer could not run because its model usage allowance was exhausted; no independent reviewer verdict is claimed.
- Final fix: shared progress cache could overwrite the new quiz score after toggling the read marker on the same page. Added a browser regression, observed RED, moved score recording into StudyApp.recordQuizScore, observed GREEN across all four viewport/theme combinations.
- Final fix: mobile routing table overflow; wrapped authored tables in the existing scrollable table layout. All 59 pages pass horizontal overflow checks at 390 and 1440 px.
- Final fix: home totals/search include the new lesson; Flashcard and Quiz counts derive from the content registry.
- Teaching decision: CPU calculations are explicitly simulated on the main JS thread and still block in non-blocking I/O mode; they are not automatically depicted as background work. Supplementary final questions and technical clarifications are labeled as additional explanation.
- Validation: test-nodejs-core.cjs; test-nodejs-browser.mjs (4 viewport/theme combinations, all pages and all 10 activities); check-curriculum.mjs (35 chapters, 350 dashboard questions, 1938 local links); check-assets.mjs (736 references); test-learning.mjs (26 chapters, 706 topic checks); test-teaching-redesign.mjs; JavaScript syntax and git diff whitespace checks.
- Deferred minors: none recorded. Independent review remains unavailable as noted above. Changes remain in the working tree for review; no publishing or branch integration was requested.

## Follow-up — exam folders

- Additional user correction: exam folders now navigate to dedicated Midterm/Final pages containing chapter folders. Chapter folders expose summary/Flashcards/Quiz links. Six responsive/theme layouts, keyboard, no-JS navigation, and per-exam progress counts are covered by test-exam-navigation.mjs (also used by the original test-itds241-exams.mjs entry point).

- User requested two top-level course folders: Midterm holds all previous chapters (06–08); Final holds Node.js Part I (09) and future parts.
- Implemented with the existing folder artwork and native details navigation; chapter URLs and progress keys remain intact. Future registered chapters outside 06–08 are included in Final by the authoring tool.
- Verified six viewport/theme combinations (320/390/1440, light/dark), keyboard opening, search, chapter links, stored read/score status, and no-JavaScript navigation. Original Node.js browser suite and university search regressions pass.
- Rebuilding course navigation is repeatable and preserves both exam folders. Curriculum/local links and 737 asset fingerprints pass. Screenshots: docs/screenshots/exam-folders/.
