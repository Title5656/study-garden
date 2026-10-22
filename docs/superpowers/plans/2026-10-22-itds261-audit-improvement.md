# ITDS261 Audit and Improvement Implementation Plan

> Execute inline using executing-plans; independent source audits may run in parallel. User's master prompt supplies the scope and sequence.

**Goal:** Improve all twelve ITDS261 chapters for beginners without losing original source coverage.
**Architecture:** Retain static HTML, existing reader and course-specific JavaScript. Add only scoped explanatory content and small interactive learning behavior. Audit before edits, pilot chapter 03, then apply verified improvements across chapters.
**Tech Stack:** HTML, CSS, vanilla JavaScript, Node test scripts, Python PDF inspection.
**Spec:** User's pasted master prompt; audit decisions in `docs/itds261-audit.md`.

## Global constraints

- Work on a branch separate from main; no push or merge.
- Preserve original source files and other subjects, URLs, anchors and storage namespaces.
- Separate original slides, external knowledge and hypothetical examples; no invented citations or exam promises.
- Read Exercise 2 DOCX and PDF independently; no assumed L5.
- Report incomplete checks honestly.

## Review focus

- No-JS reader retains all teaching explanations and alternative exercise answers.
- Option reordering preserves correct answers and explanations for every quiz.
- Mobile, tablet and desktop layouts preserve readable tables and diagrams in both themes.
- Removing badges does not remove exam rules or provenance.
- Input edge cases and keyboard operation remain valid in existing and new widgets.

## Tasks

- [x] Inspect repository, sources inventory and prior review; create working audit and coverage before production edits.
- [x] Read original sources and map topics/pages to section IDs; record precise corrections and unverified pages.
- [x] Remove specified redundant UI markup in ITDS261 only; revise shared provenance note; test DOM absence and navigation retention.
- [x] Improve chapter 03 explanations, worked reasoning and a requirement-classification exercise; verify answers, keyboard and no-JS fallback.
- [x] Apply source-driven corrections and beginner explanations to chapters 01–12; retain all substantive material and move summaries after teaching.
- [x] Fix percentile and untranslated quiz explanation; remove predictable answer placement while asserting all original correct answer texts are preserved.
- [x] Run curriculum/assets, widget, learning, layout at 375/768/1440, print and targeted UI checks; inspect screenshots and record actual results.
- [x] Consolidate coverage, external sources, QA, changed-file rationale and unresolved limitations; review final diff.

## Execution ledger

- Baseline `1c5e997`; clean checkout; created `codex/itds261-audit-improvement`.
- Ruling: use user's detailed specification and explicit continue instruction as authorization for the scoped work; no additional design approval required.
- Ruling: do not run legacy authoring scripts in ../work-notes blindly; they can restore removed markup. Keep repository HTML authoritative for this change and document regeneration caveat.

- Source-review completion means the audit and mapping were produced, not that every source detail is certified covered. Remaining gaps are explicitly retained in coverage/QA.
- Final checks: 798 layout topics, 488 learning topics, 72 UI DOM cases, all widget tests, source hashes, anchor/quiz preservation, assets/curriculum and diff whitespace passed.
- Final independent review unavailable after auditor usage-limit failures; primary integration review and executed checks recorded in QA. No push/merge/deploy.
