# Teaching redesign implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Track results in docs/teaching-redesign-report.md.

**Goal:** Make the existing lessons readable as continuous Thai teaching, with verified beginner examples and honest source coverage.

**Architecture:** Preserve static HTML, CSS and vanilla JavaScript. Enhance the existing reader and labs; keep source material and anchors. Author lesson explanations directly in HTML so they survive disabled JavaScript.

**Tech Stack:** HTML, CSS, JavaScript, Node and existing Playwright tests.

**Spec:** User-approved `C:/Users/wpras/Downloads/study-garden-codex-prompt-clean.md`.

## Global constraints

- New branch; meaningful commits; prepare PR without merging or force pushing.
- Preserve all substantive existing content, quiz score out of ten and storage keys.
- No eval/new Function for learner input. No new external runtime dependencies.
- Distinguish instructor material, authored explanations and hypothetical examples.
- Do not claim complete source or terminology verification without evidence.
- Work in reviewable batches as explicitly allowed in phase 3 of the supplied specification.

## Review focus

- Continuous reader must preserve deep links, Back/Forward and keyboard focus.
- Mobile text/figures must fit without document-wide overflow in both themes.
- No-JS and print must retain the whole lesson and static experiment explanation.
- Controlled numeric inputs must reject empty/non-finite/out-of-range values and reset predictably.
- Existing quizzes, source links and progress must survive shared changes.

### Task 1: Source and teaching audit

Files: docs/teaching-redesign-audit.md; docs/teaching-redesign-coverage.md.

- [ ] Inventory all 34 chapter structures and mapped sources; extend existing ITDS261 evidence rather than repeat it.
- [ ] Extract ITDS241 source text and inspect selected relevant figures/pages; explicitly record partial visual inspection.
- [ ] Record chapter-specific teaching gaps, proposed activity purposes, source limitations and status.
- [ ] Run baseline curriculum, asset and learning checks; capture four before images.
- [ ] Commit audit and plan.

### Task 2: Continuous article reader

Files: assets/reader.js, assets/reader.css; tools/test-teaching-redesign.mjs.
Interface: existing sidebar/category/pager links continue to navigate to original section IDs; every section remains readable.

- [ ] Add failing browser tests: all main sections visible, hash navigation scrolls to its target, Back restores location, no-JS/print retain text, mobile width fits.
- [ ] Remove single-section hiding and scroll selected heading into view; update current topic during reading without changing browser history.
- [ ] Remove decorative section cards, lighten notes/tables, use local Thai font, preserve functional diagram/tool borders and theme variables.
- [ ] Run new tests and existing layout/print tests; commit.

### Task 3: Source-backed ITDS241 teaching batch

Files: subjects/itds241/chapter-06.html through chapter-08.html, assets/labs.js, assets/content.js; tools/test-teaching-redesign.mjs.
Interface: `[data-variable-tracer]` uses constrained price/quantity inputs and Next/Previous/Reset; no arbitrary source execution.

- [ ] Add failing tests for default trace 100 × 2 = 200, changed values, zero/decimals, invalid inputs, keyboard reset and static fallback.
- [ ] Add prerequisites, chapter glossaries and connected summaries; explain core terms before the rewritten examples.
- [ ] Expand variable/function/async examples with question, precise definition, execution reasoning and common mistakes. Keep advanced material after fundamentals.
- [ ] Build the controlled variable trace beside its static equivalent; reuse existing labs and native details for checks.
- [ ] Align cards/quiz explanations with examples; estimate reading time from Thai word segmentation plus activity time.
- [ ] Record coverage per source topic and remaining full-chapter teaching/terminology gaps; do not label partial chapters complete.
- [ ] Run examples, new browser tests and learning regression; commit.

### Task 4: Verification and review

Files: docs/teaching-redesign-report.md, docs/screenshots/teaching-redesign/*.

- [ ] Run curriculum/assets/version-assets, learning, all ITDS261 and thermodynamics tests without weakening assertions.
- [ ] Capture and inspect matching before/after desktop/mobile light/dark images.
- [ ] Obtain independent whole-branch code review; address actionable defects and rerun affected tests.
- [ ] Commit results and prepare a draft PR description with exact completed scope and remaining work.
