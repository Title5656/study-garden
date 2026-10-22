# ITDS261 source and learning audit

Started 2026-10-21; continued 2026-10-22 (Asia/Bangkok). Baseline `1c5e997`; work branch `codex/itds261-audit-improvement`. This is a working audit, not a declaration of complete source verification.

## Scope and evidence

Preserve the existing static HTML/CSS/JavaScript site, chapter URLs, anchors, quiz/progress storage, themes and GitHub Pages compatibility. Only ITDS261 changes are intended. The user-provided master prompt is the implementation specification. No push or merge to main is authorized.

`sources/README.md` and `sources/manifest.json` identify 20 ITDS261 sources: 16 PDFs, one DOCX and three PNGs. L5 is absent. Exercise 2 DOCX and PDF must be inspected separately. ITDS262 Lab3 is supplementary student work, not an ITDS261 lecture or official answer key.

Prior review `itds261-review-2026-10-21.md` explicitly audited selected source portions, not all pages. Its test results are historical evidence only; they will not be presented as results of this run. Source-page findings are tracked in companion audit files and consolidated in `itds261-coverage.md`.

## Initial issues identified before production changes

| Priority | Problem and cause | Required action | Files |
|---|---|---|---|
| P1 | Source verification is incomplete; existing source notes cite broad ranges without per-topic coverage evidence | Read original material, distinguish verified coverage and remaining visual checks | sources/itds261/*; docs/itds261-coverage.md |
| P1 | Percentile flashcard flagged as misleading in previous review | Verify wording against source and revise threshold interpretation | assets/software-content.js, chapter-12.html |
| P2 | All chapter quizzes share predictable answer positions | Reorder options deterministically while preserving correct-answer identity and explanations; test every question | assets/software-content.js |
| P2 | Chapter 05 explanation contains untranslated `内部` | Replace with precise Thai wording in context | assets/software-content.js |
| P2 | Repeated authored-example badges and exam badges distract from reading | Remove actual markup; retain provenance once per chapter and specific hypothetical assumptions locally | subjects/itds261/*.html, assets/itds261-source-note.html |
| P2 | Course overview delays chapter access and cards repeat long descriptions | Remove overview section, repeated scope note and card topic paragraphs; preserve searchable metadata, navigation and reading status | subjects/itds261/index.html |
| P2 | Exam summary precedes explanatory text; beginners encounter many unexplained terms together | Move takeaways after explanations; expand chapter 03 first, then apply consistent introductory learning guidance to other chapters | subjects/itds261/chapter-*.html |
| P2 | Chapter 03 lacks an interactive requirement-classification exercise despite having useful static examples | Add a small keyboard-operable exercise only if it demonstrates classification and gives reasons; retain no-JS answer text | chapter-03.html, assets/widgets/itds261-widgets.js |

## Preservation decisions

Keep the six existing widgets, DFD steppers, diagrams, worked answers, flashcards, quizzes, theme and reader engine. Evaluate their correctness before replacing anything. The pre-existing root CODEX_HANDOFF.md concerns thermodynamics and does not authorize pushing this work or changing another course.

## Limitations at start

The pasted request refers to three UI screenshots but none accompanies the request; the three source PNGs are Zoo teaching diagrams, not UI-removal screenshots. Use the explicit textual removal requirements and do not claim visual matching to unavailable UI screenshots. No external source has yet been used. Independent audit agents initially hit an account usage limit; any incomplete agent work must be completed or explicitly marked unverified.

## Implementation record — 22 October 2026

The statements above describe the pre-edit audit. The source-group reports preserve that baseline and their precise inspection limits. They are not rewritten to imply that every original omission is now closed.

| Area | Implemented change | Evidence / remaining scope |
|---|---|---|
| All 12 chapters | Added beginner starting points where absent, expanded source-driven explanations, preserved old anchors, moved takeaways after teaching | Baseline ID-set comparison passes; existing substantive sections retained |
| Chapter 03 pilot | NFR taxonomy/measurements, Mentcare refinement, structured record, epic/story/task, Zoo criteria, prototype/ERD/SRS, validation examples, source exercise and FR/NFR interactive | New exercise first failed because absent, then passed all four scenarios, wrong/correct feedback, keyboard, mobile and no-JS alternatives |
| Chapters 01–02 | Business/software layers and types, project roles/framework, testing/support, WBS dependency calculation, process/Agile distinctions and source cases | New numerical schedule explicitly hypothetical; incident descriptions attributed to lecture rather than claimed independent historical investigation |
| Chapter 04 | Two role-view SVG diagrams for Exercise 2; actor, boundary, dental per-dentist capacity and automatic behavior notes | Preserves existing relationship widget; diagrams are authored explanatory views, not an official exhaustive answer key |
| Chapters 05–06 | DFD consistency and source contradiction, error-reading practice, Zoo identifier mapping, Structured English CASE/loops and decision/state reasoning | DFD widget now explicitly tests endpoint kinds only; source material and stepper retained |
| Chapters 07–08 | Eight UI types, quality goals/subrules, objects/actions, transform/transaction walkthrough, architecture-level reasoning and cohesion/coupling practice | Source figures moved beside their relevant explanations; not a line-by-line translation of all source code examples |
| Chapters 09–12 | Comments nine rules, implementation quality, debugging/Fagan/checklist expansion, Gitflow/state/command distinctions, guideline reasoning, lab criteria/NFR corrections | Annual 99% is no longer described as missing a measurement window; ITDS262/student provenance retained |
| Quiz/cards | Correct Percentile and three unclear/mixed-language explanations; reorder options | All 120 question identities, option sets and correct answer texts preserved; answer positions A/B/C/D = 29/33/30/28; no shared repeated sequence |
| Course UI | Remove overview/route-map, redundant badges/scope notes/topic descriptions; retain names, numbers, open links, status and searchable metadata | Markup removed rather than CSS-hidden; actual exam scope stays in chapter 11 |
| Motion | Static ITDS261 footer retaining navigation; remove reveal curtain, decorative video, particles and unused motion control | Shared reader/footer behavior and other subjects are not edited |

## Files changed and why

- `subjects/itds261/index.html`: declutter chapter discovery and static footer.
- `subjects/itds261/chapter-01.html` through `chapter-12.html`: teaching expansions, provenance, summary order, source-figure placement and static footer.
- `assets/software-content.js`: assessment corrections and option order; no changes to scoring/storage engine.
- `assets/widgets/itds261-widgets.js`: requirements classifier and precise DFD endpoint-check wording.
- `assets/software-visuals/04-dental-role-views.svg`, `04-pos-role-views.svg`: original explanatory diagrams based on both Exercise 2 formats.
- `assets/itds261-source-note.html`: one shared provenance note without reliance on removed badges.
- `assets/software.css`: compact static footer rules, scoped to the new course wrapper.
- `index.html`: updated content fingerprint for the changed ITDS261 question asset only.
- `tools/test-itds261-requirements.mjs`, `test-itds261-audit-ui.mjs`: behavioral and DOM/visual regression checks; `test-itds261-layout.mjs` adds tablet width 768.
- Audit/coverage/QA documents and implementation plan: evidence, current changes and limitations.

`sources/itds261` files remain byte-identical to manifest size/SHA-256. No other course page or shared scoring/progress engine changed. The legacy authoring scripts in `../work-notes/` are not the repository source of truth for this patch; running old generators can restore removed UI or overwrite expansions. Maintain the checked-in HTML, or port these changes before regenerating.

## External sources and remaining limits

See `itds261-coverage.md` for the exact official Scrum Guide and Pro Git references actually used, source separation, complete original-file inventory and remaining inspection/coverage limits. See `itds261-qa.md` for executed checks. Independent auditors completed their source reports and part of the expansions, then hit an account usage limit; the primary agent integrated and continued the work. A fresh independent final review could not be obtained in that state. Do not characterize this as a fully verified transcription of all source pages.
