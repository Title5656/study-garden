# Teaching redesign — implementation batch, 22–23 October 2026

Branch: `codex/teaching-redesign`, based on `15f187e23ebcf6044c89e1dae8c194d59ad820c6`. This batch implements the shared reading experience and selected beginner teaching improvements in ITDS241 06–08. **The complete 34-chapter teaching redesign is not finished.** The supplied specification explicitly permits reviewable batches.

## Audit and source evidence

The repository contains four subjects and 34 lessons, static HTML/CSS/vanilla JS, existing activity engines, and detailed prior ITDS261 audits. The reader previously hid every section except the selected one. Chapter cards, nested notes and inherited heading tracking made the reading surface unnecessarily fragmented. NotoSansThai was already present locally but was not loaded by the reader.

[Structural audit and all 34 chapter statuses](teaching-redesign-audit.md) records individual teaching gaps and the next work. [Source coverage map](teaching-redesign-coverage.md) links each chapter to supplied files and destination anchors, with explicit verification limits. Existing ITDS261 coverage/audits are retained rather than represented as newly verified.

ITDS241 chapter 08 is backed by the 124-page ECMAScript document in the manifest; a separate Lecture08 PDF is not needed to establish that source. Selected original pages were rendered and inspected for this batch. The remaining pages were indexed/extracted but not fully visually checked. Thermodynamics originals remain absent; its nine chapters have numerical/browser regression evidence, not fresh source-page verification. No instructor PDF or rendered source image was added to the repository.

## Changes by chapter

| Chapter | Change and teaching purpose | Status / remaining work |
|---|---|---|
| ITDS241 06 | Add prerequisites/core glossary; begin variables with a price × quantity question, runnable source, explicit Console result and line-by-line reasoning; add controlled trace; explain types before the comparison table; move typeof-null/safe-integer discussion after fundamentals; connected summary and a new retrieval card | Selected teaching improvements complete. Full sequential terminology audit and every source example/figure still need checking; this is not a completed chapter under the full Definition of Done |
| ITDS241 07 | Add prerequisites linking to chapter 06, core glossary and summary; trace arguments → parameters → return → Console through a complete price/discount example; explain return versus printing and reversed argument order; retain callback/closure/DOM/event lessons and labs | Selected teaching improvements complete. Remaining advanced scope/OOP/DOM sections require a full beginner/terminology pass |
| ITDS241 08 | Verify actual source identity; add prerequisites/core glossary/summary; demonstrate Promise callback ordering with exact tested output and step reasoning; add misconception check and observation instructions to existing Promise lab | Selected teaching improvements complete. Full feature/year/status and source-page audit remains open; no claim that all contemporary API support was reverified |
| ITDS261 01–12 | Apply shared continuous reading, article layout and Thai typography; retain original substantive lessons, diagrams, exercises, assessments and print views | Shared reader QA complete; chapter teaching redesign remains in progress, using prior detailed audits |
| ITDS294 01–10 | Apply shared reader; inventory chapter-specific beginner gaps and opportunities to reuse business/payment/funnel activities | Shared reader QA complete; full source/teaching audit and rewrites pending |
| Thermodynamics 01–09 | Apply shared reader while preserving calculators, equations, source caveats and print behavior | Shared reader and numerical regression complete; original-source verification blocked by absent PDF |

All 30 ITDS241 quiz questions retain their question text, option sets and correct-answer identity. Explanations now explain distractors as well as the correct answer. Author-time option reordering removes the former repeated answer-position patterns; no runtime shuffle or storage migration was added. One new card per chapter connects assessments to the new teaching examples.

## Shared behavior and activity purpose

- All main sections remain visible. Sidebar links/category buttons still navigate to anchors; history Back/Forward and keyboard focus are preserved. Current-topic highlighting follows ordinary scrolling without adding history entries.
- Remove prose card backgrounds/side borders; use spacing and thin section separators. Notes use a left rule; tables retain horizontal rules and local scrolling. Functional activity/figure boundaries remain.
- Load the existing local Thai font only for the lesson, hero and table of contents. This avoids changing the global header's layout. Thai headings have normal letter spacing. Main reading text is 17px with 1.85 line height.
- **Variable tracer:** see exactly when a name receives a value, when multiplication happens, and when Console output occurs. Change constrained numeric price/quantity, step forward/back, reset to 100 × 2. Changing an input restarts the trace; blank/invalid input cannot silently become zero. No arbitrary code is evaluated. Static worked explanation survives disabled JavaScript, and decimal floating-point limits are stated.
- Reuse existing loop, counter, DOM, Promise, nullish, software, commerce and thermo activities. The new checks use native details/summary so they remain keyboard-usable without JavaScript. Other existing activities have not all received a fresh pedagogical audit.

## Files

- `assets/reader.js`, `assets/reader.css`: continuous reading, anchor navigation/scroll tracking, typography and article layout.
- `assets/labs.js`: reusable controlled trace initialization for each `[data-variable-tracer]` instance.
- `assets/content.js`: three cards, expanded explanations and static option reordering.
- `subjects/itds241/chapter-06.html`, `chapter-07.html`, `chapter-08.html`: authored teaching additions, summaries and reading estimates.
- Other chapter HTML, root/course index pages: asset fingerprint updates only, so GitHub Pages receives the current shared files.
- `tools/test-teaching-redesign.mjs`, `tools/test-teaching-examples.mjs`, `tools/update-reading-time.mjs`: behavioral checks, execution of actual copied examples, reproducible reading estimates.
- `docs/teaching-redesign-{audit,coverage,report}.md`, implementation plan and eight screenshots: audit trail and review evidence.

## Before / after

Same chapter and anchor: ITDS241 06, `#variables`; viewport height 1000px; reduced motion. Screenshots have been visually inspected for Thai text and layout. The preceding prose visible above the new section is expected because reading is now continuous.

| View | Before | After |
|---|---|---|
| Desktop 1440 light | [Before](screenshots/teaching-redesign/before-1440-light.png) | [After](screenshots/teaching-redesign/after-1440-light.png) |
| Desktop 1440 dark | [Before](screenshots/teaching-redesign/before-1440-dark.png) | [After](screenshots/teaching-redesign/after-1440-dark.png) |
| Mobile 390 light | [Before](screenshots/teaching-redesign/before-390-light.png) | [After](screenshots/teaching-redesign/after-390-light.png) |
| Mobile 390 dark | [Before](screenshots/teaching-redesign/before-390-dark.png) | [After](screenshots/teaching-redesign/after-390-dark.png) |

## Verification

Tests run with the bundled Playwright import through `STUDY_GARDEN_PLAYWRIGHT`; Chrome headless serves real local files. No deployed site or external CDN is needed for these checks.

| Command | Result |
|---|---|
| `node tools/check-curriculum.mjs` | PASS: four courses, 34 chapters, 340 questions, 92 figures; references valid |
| `node tools/version-assets.mjs` / `check-assets.mjs` | PASS: current content hashes, including local Thai font |
| `node tools/test-teaching-redesign.mjs` | PASS: continuous content, history/anchor/scroll navigation, typography, mobile/light/dark, no-JS/print; variable trace 200, 37.5, zero, invalid inputs and keyboard reset |
| `node tools/test-teaching-examples.mjs` | PASS: exact authored examples output 200, 80, and เริ่ม → ทำงานอื่นต่อ → ข้อมูลพร้อม; quiz shape remains ten questions |
| `node tools/test-learning.mjs` | PASS: 25 chapters, 500 desktop/mobile topic checks, search/figures/quiz/cards/progress/theme/no-JS |
| `node tools/test-itds261-audit-ui.mjs` | PASS: 72 chapter DOM checks, search/status, three widths, both themes, source-derived diagrams |
| `node tools/test-itds261-layout.mjs` | PASS: 798 topic checks, SVG bounds, no-JS and A4 |
| `node tools/test-itds261-print.mjs` | PASS: print figures fit; all eight Zoo process views printable |
| `node tools/test-itds261-requirements.mjs` | PASS: four scenarios, correct/wrong feedback, keyboard/mobile/no-JS |
| `node tools/test-itds261-widgets.mjs` | PASS: existing widget suite including DFD/UML and numerical SVG cases |
| `node tools/test-thermo.mjs` | PASS: nine chapters, 59 sections, 62 exercise guides, 90 quiz, 90 cards, nine calculators |
| `node tools/test-thermo-install.mjs` | PASS: LF/CRLF integration and safe repeated installation |
| `node tools/test-thermo-browser.mjs` | PASS: 244 topic checks, 18 labs, 12 quiz/card flows and independent saved progress |
| `node tools/test-footer.mjs` | PASS: 54 checks |
| `node tools/test-university-groups.mjs` | PASS: search, ten responsive/theme layouts and course navigation |
| `python tools/fix_thai_latin_spacing.py subjects/itds241 --write` | No spacing corrections needed |

The continuous-reader test first failed because eight sections were hidden. The trace test first failed because no trace existed. The scroll-tracking test first failed because active-topic state did not follow scrolling. All were implemented and rerun. An existing thermo browser assertion caught a 3px header overflow after broad font application; scoping the font to reading areas fixed the cause without weakening the assertion. Existing test assertions were not removed or relaxed. A new test's border check was corrected from top border to side border because the approved article design explicitly permits thin horizontal separators.

Reading estimates use Thai `Intl.Segmenter` word segmentation at an assumed 180 words/minute plus activity allowances: chapter 06, 2594 words + 12 activity minutes → 27–37 minutes; chapter 07, 2263 + 10 → 23–33; chapter 08, 2833 + 10 → 26–36. These are planning estimates, not measured learner completion times.

## Remaining work and review boundary

No chapter is declared fully finished under the supplied nine-point Definition of Done. Full zero-first-use-undefined-term checking, page/figure-level source coverage, remaining code examples and every activity's teaching contract still require further batches. ITDS294 needs direct source reading; ITDS261 should continue from its existing audits; Thermodynamics needs the missing originals for source verification. Scientific calculations were regression-tested, not redesigned.

Independent review identified a history regression: ordinary scrolling left the URL fragment at an earlier heading, and Back incorrectly scrolled to that old heading. New tests reproduced both the initial history-entry case and subsequent navigation before the fix. Back/Forward now restore reading coordinates explicitly stored per history entry; explicit fragment navigation remains separate. Regression checks cover a fresh page and ordinary scrolling → Quiz → Back → Forward on both widths and themes. They pass after the fix.

The reviewer independently verified the authored examples and all 30 quiz answer identities. Follow-up review approved the delivered scope after checking real mouse-wheel scrolling on a fresh entry, Back/Forward, active TOC, reload restoration and subsequent native fragment navigation. Chrome was tested; Firefox/WebKit and full assistive-technology behavior remain unverified. Complete source coverage, first-use terminology and whole-course beginner readiness remain outside review certification.

Final learning regression after the history fix passed all 500 topic checks. All original element anchors were compared against main and retained across 34 chapters. Remote main was fetched and matched the original base. Changes are committed as a reviewable batch on `codex/teaching-redesign`; the accompanying PR description is in [teaching-redesign-pr.md](teaching-redesign-pr.md). No merge or force push is performed.
