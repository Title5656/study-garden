# ITDS261 QA — 22 October 2026

Branch: `codex/itds261-audit-improvement`. Baseline: `1c5e997`. Local Chrome/Chromium through Playwright; tests route the actual local repository files and block unrelated network requests. No push, merge or GitHub Pages deployment was performed.

## Executed checks

| Check | Actual result |
|---|---|
| `node tools/check-curriculum.mjs` | PASS: 4 courses, 34 chapters, 340 questions, 92 learning figures, 20 ITDS261 source files, 1,705 local references |
| `node tools/check-assets.mjs` | PASS: 662 current content-fingerprinted asset references |
| `node tools/test-itds261-layout.mjs` | PASS: 798 topic checks at 375, 768, 1440 px in light/dark; inline SVG text bounds, no-JS reading, one-page A4, no browser errors |
| `node tools/test-learning.mjs` | PASS: 25 chapters in ITDS241/ITDS261/ITDS294, 488 desktop/mobile topic checks; images, search, reader, quiz/retry, flashcards, independent persisted progress, theme and no-JS |
| `node tools/test-itds261-audit-ui.mjs` | PASS: 72 chapter DOM checks; course search/status at three widths/two themes; source-note presence, no redundant badges/overview, takeaways after teaching, unique IDs, ten questions per chapter, static footer; two new SVG diagrams within bounds |
| `node tools/test-itds261-widgets.mjs` | PASS: channels endpoints; all 8 model choices; all 36 DFD endpoint pairs; missing/zero/negative/degenerate/decimal/large triangle cases; Git staging snapshot; use-case arrow keyboard control; four DFD steps |
| `node tools/test-itds261-requirements.mjs` | PASS: all four FR/NFR scenarios, wrong/correct explanatory feedback, keyboard Space, pressed/live states, 375 px overflow and no-JS answer guide |
| `node tools/test-itds261-print.mjs` | PASS: A4 figure widths and all eight Zoo process views remain printable |
| Baseline comparison against `1c5e997` | PASS: all existing chapter IDs retained; 120 question texts, option sets and correct-answer texts preserved; twelve distinct answer-position sequences |
| Source integrity | PASS: all 20 ITDS261 source sizes and SHA-256 hashes equal manifest |
| Scope comparison | PASS: no ITDS241, ITDS294 or Thermodynamics chapter page changed; shared scoring/storage/theme engine untouched; root index only changes ITDS261 content fingerprint |
| `git diff --check` | PASS after removing blank-line whitespace left by deleted markup |

The new requirements test was first run before implementation and failed on the absent exercise, then passed after implementation. The static-footer assertion likewise failed before removal of decorative motion and passed afterwards.

## Visual inspection

Screenshot artifacts were produced at all three widths in both themes under `../work-notes/itds261-audit-qa/` using `STUDY_GARDEN_OUTPUT`. Manually viewed the mobile course page, mobile dark requirements exercise and both new full-size Exercise 2 SVG renders. The diagrams have legible role names, ellipses and association lines; their captions identify them as authored role views, not official solutions. Automatic layout checks cover all chapters; do not describe every generated screenshot as manually inspected.

The initial screenshot harness stalled on a standalone SVG document. An attempted HTML replacement then failed because `document.open()` is invalid in an SVG document. The harness now checks SVG bounds, navigates to an HTML document, and captures the resource as an image exactly as the lesson embeds it. The final complete run passed. These were test-harness failures, not hidden application failures.

The user's three UI screenshots were not attached to this request; removal was checked against the exact text requirements. The three supplied source PNGs are Zoo instructional diagrams, not UI references.

## Assessment and content checks

- Retained ten cards and ten quiz questions per chapter. Correct-answer placement changed from the same repeated sequence to A/B/C/D counts 29/33/30/28; explanations remain paired with their question.
- Fixed Percentile to denote a threshold value in ordered measurements, not the proportion itself. Fixed the Chinese fragment in the balancing explanation and clarified regression-test wording.
- New examples identify hypothetical values and separate source statements from elaboration. The annual availability claim in the Lab is explicitly recognized as annual; a monthly example is not presented as an equivalent rewrite.
- DFD widget results explicitly cover endpoint-kind rules only. The exercise does not claim to validate all process semantics or balancing.
- Source conflicts remain visible: no L5, ITDS262 Lab provenance, original scoring discrepancy, DFD entity convention versus child diagrams, and AC/DoD terminology clarification.
- Broad baseline source omissions and current fixes are listed in the audit and coverage documents. Passing browser tests does not establish complete academic coverage of every slide.

## Limits and follow-up

1. Source coverage remains qualified. Text extraction was read for all original PDFs, but not every page/diagram was inspected at full resolution; exact page lists and remaining small-label/code limits are in the three detailed audits. DOCX body XML was compared independently; DOCX pagination/header/footer rendering was not checked.
2. No real screen-reader session or non-Chromium browser was tested. Native controls, semantic markup, live feedback and keyboard actions were checked.
3. No hosted deployment/network smoke test was performed; the user did not authorize pushing or merging to main.
4. No fresh independent final reviewer completed a pass after integration because the audit agents hit the account usage limit. Source audits were retained and the primary agent reviewed/integrated the changes and executed the checks above.
5. Existing distractor-length clues have not been comprehensively rewritten. Option ordering is improved, but this is not a psychometrically validated assessment bank.
6. Legacy generators outside the repository may overwrite these edits. Treat checked-in HTML and assets as current, or port the changes before regeneration.

## Reproduce

Use Node with Playwright and Chrome available. If Playwright is outside the repository, set `STUDY_GARDEN_PLAYWRIGHT` to its `index.mjs` file URL. `STUDY_GARDEN_OUTPUT` optionally writes screenshots. The UI test's `STUDY_GARDEN_DIAGRAMS_ONLY=1` mode is for two-image diagnostics only; unset it to run all 72 DOM checks. Run asset versioning before checking hashes after an asset edit:

```text
node tools/version-assets.mjs
node tools/check-assets.mjs
node tools/check-curriculum.mjs
node tools/test-itds261-requirements.mjs
node tools/test-itds261-audit-ui.mjs
node tools/test-itds261-widgets.mjs
node tools/test-itds261-layout.mjs
node tools/test-learning.mjs
node tools/test-itds261-print.mjs
```
