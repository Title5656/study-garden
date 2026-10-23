# Mahidol teaching revision — completed 2026-10-23

## Current scope and outcome

**Editorial work completed across all 25 Mahidol chapters:** ITDS241 06–08, ITDS261 01–12, ITDS294 01–10. This supersedes the [partial report from 2026-10-22](teaching-redesign-report-2026-10-22.md).

The user explicitly requested that **Thermodynamics remain in the project in its existing version and receive no content revision**. All nine Thermodynamics chapter files, course index, course assets and source map are unchanged against `abe9b00`; the home page retains its four courses and 34 chapters. Only changed asset fingerprints on the home/Mahidol pages refresh.

## Per-chapter work and source coverage

- [ITDS241: all 3 chapters](itds241-teaching-completion.md): sequential reasoning, first-use terminology fixes, complete runnable DOM/event HTML, actual example output tests and reset controls.
- [ITDS261: all 12 chapters](itds261-teaching-completion.md): linked prerequisites, chapter terminology, three-step worked scenario and misconception check in each chapter, connected summaries, all 120 quiz distractor explanations. Builds on the existing extensive source-driven lessons and coverage maps.
- [ITDS294: all 10 chapters](itds294-teaching-completion.md): 54 topic-specific explanatory bridges, prerequisites/terminology, authored practice and connected summaries; all 100 quiz distractor explanations; 18 activity guides and static interpretations with resets.
- [Consolidated coverage and scope](teaching-redesign-coverage.md): source documents, exact selected visual-review pages, original topic destinations, and explicit limits.

Original topic anchors are retained in all 25 chapters. The original 250 correct-answer meanings are checked against the last delivered version. No arbitrary-code evaluation or new external services were added to the website. Static HTML/CSS/vanilla JavaScript architecture remains.

Reading estimates were recalculated using Thai word segmentation at 180 words/minute plus explicit activity time: ITDS241 30–42 minutes depending on chapter/range; ITDS294 21–39 minutes. These estimates exclude quiz completion time. ITDS261 had no reading-time badges to replace.

## Verification executed after changes

| Check | Result |
|---|---|
| `test-mahidol-scope.mjs` | 25 chapter structures and all original anchors; 250 correct-option identities; 9 Thermodynamics chapters/course assets and navigation unchanged; numeric funnel/finance examples and zero-domain cases |
| `check-curriculum.mjs` | 4 courses, 34 chapters, 340 questions, 92 figures, 1,841 local references |
| `version-assets.mjs` + `check-assets.mjs` | 718 current asset references; no stale hash remains |
| `test-teaching-examples.mjs` | 9 exact authored JavaScript examples produce stated outputs; 30 quiz contracts |
| `test-teaching-redesign.mjs` | Continuous reading/history, Thai font, themes/no-JS/print; 3 exact complete HTML examples; keyboard DOM/nullish reset and blank/zero inputs |
| `test-learning.mjs` | 25 chapters, 588 desktop/mobile topic checks, images, reader, flashcards, quiz/retry, progress persistence, no-JS |
| `test-ecommerce-teaching.mjs` | All 10 revised quiz/retry flows; explorer/calculator/worksheet reset state and keyboard; five no-JS activity alternatives |
| `test-itds261-layout.mjs` | 942 mobile/desktop light/dark topic checks, SVG bounds, no-JS and one-page A4 |
| `test-itds261-audit-ui.mjs` | 72 chapter DOM checks, index filters, 375/768/1440 themes, source-derived diagrams |
| `test-itds261-widgets.mjs` | Team channels 1/66, model choices, 36 DFD endpoint pairs, triangle invalid/decimal/large values, Git snapshots, use-case arrow, DFD stepper |
| `test-itds261-requirements.mjs` | Four classification cases, wrong/correct feedback, keyboard, mobile, no-JS |
| `test-itds261-print.mjs` | A4 figures and all eight Zoo process views printable |
| `test-thermo.mjs` + `test-thermo-install.mjs` | Retained nine chapters/calculators, 90 questions/cards; installer LF/CRLF regression |
| `test-thermo-browser.mjs` | 244 topic checks, 18 labs, 12 assessment flows, independent progress |
| `test-university-groups.mjs` | Existing four-course search/navigation and 10 responsive/theme layouts |
| `test-footer.mjs` | 54 passed, 0 failed |
| `git diff --check` | No whitespace errors |

A checkbox reset test exposed the difference between default value and checked state; reset now restores `defaultChecked` for checkboxes and `defaultValue` for numeric inputs. The test then passed. A transient Windows file-write failure during asset versioning was retried successfully and all hashes rechecked.

## Screenshots

24 matched screenshots compare `abe9b00` with the final editorial version at 390px and 1440px in light and dark modes. They show ITDS241 chapter07 callbacks, ITDS261 chapter02 process model and ITDS294 chapter02 business model, using the same section, viewport and shared reader. Source images remain local work notes; these screenshots contain the authored website.

| Course | Mobile after | Desktop after |
|---|---|---|
| ITDS241 | [Light](screenshots/mahidol-completion/itds241-after-390-light.png) · [Dark](screenshots/mahidol-completion/itds241-after-390-dark.png) | [Light](screenshots/mahidol-completion/itds241-after-1440-light.png) · [Dark](screenshots/mahidol-completion/itds241-after-1440-dark.png) |
| ITDS261 | [Light](screenshots/mahidol-completion/itds261-after-390-light.png) · [Dark](screenshots/mahidol-completion/itds261-after-390-dark.png) | [Light](screenshots/mahidol-completion/itds261-after-1440-light.png) · [Dark](screenshots/mahidol-completion/itds261-after-1440-dark.png) |
| ITDS294 | [Light](screenshots/mahidol-completion/itds294-after-390-light.png) · [Dark](screenshots/mahidol-completion/itds294-after-390-dark.png) | [Light](screenshots/mahidol-completion/itds294-after-1440-light.png) · [Dark](screenshots/mahidol-completion/itds294-after-1440-dark.png) |

Matching `before` files are in the same folder. Rendered after screenshots were visually inspected in all listed layouts: prose remains continuous, diagrams/table scrolling stay usable, and dark/light text is legible.

## Review and practical limits

Independent review found two ITDS241 issues (incomplete DOM fixtures and definitions after use), both fixed and re-reviewed. Whole-revision review then read all ITDS261/294 additions and quiz explanations, independently verified all 220 changed correct-option identities and scope invariants, and reported no remaining P1/P2 finding.

Completion means the requested editorial pass is applied to all 25 chapters. It is not a guarantee of exam coverage, zero unexplained transitive jargon, or visual verification of every supplied PDF page. Exact selected source pages are recorded; ITDS261's missing supplied L5 remains a source limitation. Chromium/Chrome was tested; Firefox and WebKit were not. Thermodynamics is not a pending content task under the user's revised scope.

Work stays on `codex/teaching-redesign`, without merging. The previous attempt to create a PR returned GitHub integration HTTP 403; no PR is claimed. [Prepared current PR description](teaching-redesign-pr.md).

Local implementation commits: `fe067dd` (ITDS241), `623c852` (ITDS261), `9c1459c` (ITDS294), `934d86f` (verification/report). The attempted push to `https://github.com/Title5656/study-garden.git`, branch `codex/teaching-redesign`, was blocked by automatic approval review: explicit authorization for that external destination/payload was not established. No workaround was attempted. These new commits remain local pending explicit user approval to push; the live website has not been updated by this completion turn.
