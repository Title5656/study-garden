# ITDS261 audit: chapters 09–12

> บันทึกนี้เป็นผลตรวจฐานก่อนแก้ สถานะหลังรวมงานและรายการแก้ล่าสุดอยู่ใน [Audit หลัก](itds261-audit.md#implementation-record--22-october-2026) และ [Coverage](itds261-coverage.md) ข้อความ missing/partial ด้านล่างไม่ใช่การยืนยันว่าแก้แล้วทุกข้อ


Audit date: 2026-10-22. Read-only production audit; no HTML, widget or quiz changes made. Page numbers below are PDF page numbers, not website chapter numbers. Priority P1 = correction needed before describing the material as comprehensive; P2 = substantive beginner expansion; P3 = presentation/traceability improvement.

## Evidence and limits

Read chapter-09.html through chapter-12.html and all 40 flashcards / 40 questions for keys 09–12 in assets/software-content.js. Reviewed actual PDF text through PyMuPDF as well as existing text extracts. Original PDFs: L10 (58 pages), L11 (33), Midterm guideline (46), Git cheat sheet (2), Lab3 student submission (5), and L3 relevant pages 12–16 and 34–44. The Lab file is ITDS262 Software Engineering Lab, supporting ITDS261; page 1 is the task, pages 2–5 are a student submission, not an instructor answer key.

Visually inspected render contact sheets from original PDFs: L10 pp.11,18,20,22,25,27–35,42–43,45,47–48,50–51,53; L11 pp.5,11–14,18–19,24,28–33; Midterm pp.1,32–46; Lab pp.1–5; cheat sheet pp.1–2. Also inspected separate larger renders of L3 pp.14,15,39,41. Contact sheets establish layouts and diagram relationships, but fine code/Thai text in portrait Lab/cheat-sheet thumbnails was read through extraction rather than certified visually character by character. Remaining PDF pages were text-reviewed, not visually inspected. Midterm p.8 is image-only in extraction and was NOT visually inspected: do not claim its framework fully audited. Browser rendering and widget behavior were NOT tested. L6 p.43 and L8 pp.9–21 cited by chapter 11 were not independently checked in this assigned audit; coordinate with the chapters 05–08 auditor. Original PNG sources elsewhere in inventory were outside this scope.

Evidence renders/extracted verification text are under ../work-notes/audit-09-12/. They are working evidence, not website assets, and contain private student headers; do not publish them. All findings below concern the current content, not a demand to discard working activities.

## Preserve these strengths

- Keep every existing anchor, source image, supplementary figure, #w-git widget, flashcard/quiz controls and learning-progress behavior. Expand lessons around them.
- Chapter 09 correctly separates refactoring from behavior changes and provides a labeled supplementary code example. PR discussion is explicitly a proposed answer, with no invented grading rules.
- Chapter 10 correctly explains add as a snapshot, commit versus push, staged diff, fetch versus configured pull, tracked files versus ignore, and dangers of hard reset. It appropriately qualifies the slide's universal-sounding claims about master and production readiness.
- Chapter 11 accurately gives 40%, Part 1 15 points / Part 2 25 points, permitted A4 and names/IDs/return requirement, without inventing sides, handwriting, exam counts or ERD scope. Interface Design remains in Part 1 despite absent UI review slides. No L5 reconstruction should be introduced.
- Chapter 12 already states ITDS262 provenance, distinguishes student answer from task, protects identity in displayed labels, labels proposed workload/cost figures, preserves optional image attachment, and explains person-hours versus money.

## Findings requiring action

### P1: Percentile definition is wrong

Location: assets/software-content.js, chapter `12`, cards[8] (ninth card), term `Percentile`, current answer `สัดส่วนของผลวัดที่อยู่ภายในเกณฑ์ เช่น 95%` (around line 1766). That defines the proportion meeting a threshold, not a percentile. Replace with e.g. `ค่าเกณฑ์ในชุดผลวัดที่เรียงลำดับ เช่น P95 = 2 วินาที หมายถึงประมาณ 95% ของเวลาตอบสนองไม่เกิน 2 วินาที (วิธีคำนวณขึ้นกับ convention)`; explain in #practice-nfr with 100 measurements and avoid confusing 95th percentile with 95 percent uptime. This is a supplementary statistics explanation; neither Lab p.5 nor L3 p.16 provides a percentile definition. Preserve the card and its position.

### P1: Chapter 10 has almost no explanation of the Gitflow sequence it cites

Location: #branches-merge; source L11 pp.28–33. Current text lists master/develop/feature/release/hotfix but does not teach their role, start branch, merge destination or release timing. The source diagrams are substantive content, not decorative pages. Add a table and a trace of the pictured workflow: develop integrates next-release changes; feature forks from and rejoins develop; release prepares a production version while develop can receive later features and merges back to relevant long-lived branches; hotfix branches from production/master and returns its fix to production and ongoing development. Explain tags in the pictured release history, distinguishing source workflow from a Git requirement. Keep the current simpler #branch-graph; add a clearly labeled source-derived explanation. No need to recommend Gitflow universally.

### P1: Chapter 09 condenses a 58-page lecture into definitions and loses teachable source material

Locations #implementation, #style-comments, #debug-refactor, #review-process. Four paradigms are described in one paragraph; no-code/low-code/vibe coding are collapsed without explicit definitions or separate trade-offs. The nine comment rules are implicit fragments, not a complete numbered lesson. Six inspection steps are listed without all operational objectives. Ten review checklist categories are compressed and `Experts Opinion` is missing explicitly. Expand with source-page citations and short Thai examples. Treat existing summaries as introductions, not replacements.

### P2: Chapter 11 is a revision index, not a self-contained explanation of the guideline

Location #part1-revision, #part2-method. The four-row table asks the learner what they should be able to explain but generally does not explain it. Add compact worked explanations or explicit deep links to the exact teaching section for each guideline range. Cover code-and-fix, two incremental variants, Scrum, six elicitation dimensions, and modeling/notation review explicitly. Do not interpret every review slide as a new exam requirement: p.1 remains the scope authority.

### P2: Lab original answers are generalized so far that learners cannot see what was corrected

Locations #story-ac, #nfr-review. Preserve the improved examples, but add anonymized `ข้อความคำตอบผู้เรียน / ปัญหา / หลักคิดในการปรับ` rows tied to Lab page/criterion. For NFRs show the actual student claims (3 seconds for all information/maps; >20 million users at all times; 99% annually; quarterly feature update; immediate/fast response), clearly marked as submitted answers rather than source requirements. Current availability critique says a percentage lacks a measurement window, but the original explicitly says annually. Correct the critique to `ระบุรายปีแล้ว แต่ยังต้องนิยามบริการ จุดวัด downtime และ maintenance`; the proposed monthly 99% target is a new example, not an equivalent rewrite. Preserve the existing caution not to change annual to monthly silently.

### P2: Complete beginner story/criterion foundations

Location #story-ac; L3 pp.40–44, especially image p.41. Add the user need → epic → user story → tasks/acceptance criteria distinction using the actual diagram, plus a short labeled supplementary example. Clarify criteria are measurable conditions; Given–When–Then is a common form, not the only accepted form (p.42 also allows bullets). L3 p.40 uses Acceptance Criteria / DoD loosely; teach that story-specific acceptance criteria and a team's shared Definition of Done should not be conflated, labeling that clarification rather than silently attributing it to the slide. Existing chapter avoids explicitly equating them but omits the distinction entirely.

### P2: Original Lab fields/statuses should be fully recoverable

Location #phtrs-scope. The original lists Work in Progress, Temporary Repaired, Not Repaired, Completed; current text says status generically and examples only expose two. Add all four with Thai explanation without inventing a mandatory state-transition graph (the task says examples, not an allowed-transition specification). Explicitly map citizens / staff / supervisor to story numbers 1–3 / 4 / 5 so role coverage is inspectable. Retain login, district, map location, optional photos, report/workorder creation, repair inputs and the three supervisor report types.

### P3: Source traceability and readability

- #sources chapter 09 omits pp.42–43 (actual refactoring examples) and 45 (quality-practice chart). Once taught, include them. Current page ranges are citations, not proof all content is taught.
- #sources chapter 10 omits pp.11–14 despite visually important centralized/distributed comparisons. Add them when teaching that comparison.
- Chapter 09 #style-comments displays review checklist p.53 rather than a style/comment example. Preserve the image but place a cross-reference or add appropriate source examples, so beginners understand its function.
- Numerous joined English tokens (`reviewchanges`, `automatedtests`, `distributedVCS`, `stagedsnapshot`, `localcommits`, `Givenworkorder`, `sessions200`, `requests40`, `securityNFR`) impair beginner reading. Add spaces without changing concepts.
- Recall headings `จำสำหรับสอบ` in chapters 09/10/12 can imply exam scope despite correct badges. Prefer `ทบทวน 30 วินาที` for these supporting/non-listed topics. This is clarity, not evidence of an actual exam prediction.
- Chapter 12 #sources deliberately masks the filename; retain masking and state `ITDS262 Lab 3` explicitly in the source label as well as the hero.

## Source-page coverage ledger

Legend: covered = the main concept is correctly represented; partial = mentioned but not taught at source depth; absent = no meaningful explanation in this chapter; contextual = title/reference/decorative page, not an independent lesson obligation. Every range has a proposed destination; existing section IDs are exact.

### L10 → chapter 09

| PDF pages | Source content | Current coverage / target section | Required addition |
|---|---|---|---|
| 1–3 | Cover, lecture title, topics | Contextual; #implementation | Optional source orientation |
| 4 | Imperative/declarative/OOP/logic, multiparadigm | Partial; #implementation | Four-row comparison, tiny same-task examples labeled extra, preserve language examples |
| 5–7 | No-code, low-code, vibe coding; benefits/limitations | Partial; #implementation | Define each separately; tool dependence, customization/scale, technical skill, AI overreliance |
| 8–9 | Book reference; implementation opener/Fowler quote | Contextual; #sources/#implementation | Bibliographic context optional, no need to reproduce full quote |
| 10–12 | Implementation activities and six quality properties; decorative p.11 | Covered but shallow; #implementation | Explain each quality with consequence and example |
| 13–17 | Style-guide rationale, danger/best-practice/consistency categories; danger examples | Partial; #style-comments | Explain category differences and why organization context matters |
| 18 | Caught exceptions not ignored screenshot | Absent example; #style-comments | Explain documented justified exception versus silently swallowing errors |
| 19–20 | Best practices/comments screenshot | Partial; #style-comments | Show comment style/file comments as organization choices |
| 21–22 | Three consistency benefits and formatting screenshot | Partial; #style-comments | Concrete team/tool/time examples; formatting is not algorithm correctness |
| 23 | Six good implementation practices | Covered summary; #style-comments | One before/after or symptom per practice |
| 24–25 | Comments opener and referenced article screenshot | Contextual; #style-comments | Keep attribution |
| 26–35 | Nine rules, repeated overview with separate code examples | Partial; #style-comments | Explicitly teach all nine, especially unclear comment as code warning, unidiomatic code, copied-code source versus external-reference links |
| 36 | Four debugging stages | Covered; #debug-refactor / #debug-cycle | Add one bug traced through all stages |
| 37 | Error-location heuristics and tool list | Partial; #debug-refactor | Error clustering/new code heuristics; comparators, checkers, debugger, libraries, profiler, pre/postconditions, coverage and what each reveals |
| 38–40 | Refactoring references, invariant, implications | Covered definition; #debug-refactor | Explain emergent design and small/large scope, not arbitrary restructuring |
| 41 | Six smells; extract method/substitute algorithm/move method/extract class | Partial; #debug-refactor | Explain feature envy/intimacy, map smell to possible action without mechanical rule |
| 42–43 | Before/after extracted condition variables and price calculation | Absent source examples; #debug-refactor | Explain source before/after stepwise; retain current additional extract-method example |
| 44 | Review opener | Contextual | None |
| 45 | Bar chart on quality practices (review, tests, etc.) | Absent; #review-process | Explain chart as a particular cited survey, not proof review always best; do not invent survey methodology |
| 46–47 | Fagan history, applicability beyond code, resource/schedule chart | Partial; #review-process | Broader artifacts; explain early inspection effort versus later rework without causal guarantees from chart |
| 48 | Six-stage operation/objective table | Partial; #review-process / #fagan-cycle | Entry criteria, roles, preparation, author rework, moderator/team follow-up and secondary defects |
| 49–50 | Tool-assisted review and PR/suggested changes/feedback visual | Partial; #review-process | Describe what author and reviewer exchange |
| 51–52 | Motivation chart and six benefits | Benefits covered; chart absent; #review-process | Explain chart cautiously; preserve all benefits |
| 53–56 | Ten checklist categories | Partial; #review-process | Category → question → simple problem example; add expert/cross-team opinion |
| 57 | Junior PR scenario and four questions | Mostly covered; #practice-review | Make four-question mapping visible, no invented official minimum/rubric |
| 58 | Conclusion and two precommit questions | Covered across chapter | Optional recap questions |

### L11 + Git cheat sheet → chapter 10

| PDF pages | Source content | Current coverage / target | Required addition |
|---|---|---|---|
| L11 1–3 | Cover/title/topics | Contextual | None |
| L11 4–5 | CM definition, standards, process diagram | Definition covered, diagram absent; #cm-vcs | Explain CM connects project management and product-development work products/change requests/status; standards as slide references, not current compliance advice |
| L11 6–7 | Configuration items and identification | Covered summary; #cm-vcs | Small release configuration example, numeric versus attribute identification |
| L11 8–9 | VCS opener / lost changes image | Contextual | Optional motivation |
| L11 10–11 | VCS purposes and version evolution | Covered purposes, visual absent; #cm-vcs | Trace created/modified/deleted items through versions |
| L11 12–14 | CVS/Subversion centralized diagrams versus Git distributed diagram | Absent comparison; #cm-vcs | Explain central history versus each clone's local repository, checkout/update vs local commit/push; do not infer every implementation detail from schematic |
| L11 15–16 | Git identity/features, almost-local/offline/history | Covered; #cm-vcs | Preserve qualified language |
| L11 17–21 | Staging and untracked/staged/unmodified/modified lifecycle | Partly covered; #git-areas / #w-git | Explain all four file states and arrows; four storage areas and four lifecycle states are different concepts |
| L11 22–23 | Pull, push, rejected push; patches | Main operations covered; patches absent; #branches-merge | Brief patches idea; retain configured-pull qualification |
| L11 24 | Decentralized repos sharing origin | Partial; #branches-merge | Explain origin is a chosen shared remote convention, not privileged Git architecture |
| L11 25–27 | Stable master convention, branch occasions, merging/conflicts | Covered with appropriate caveat; #branches-merge | Keep |
| L11 28–33 | Main/supporting branches and full Gitflow | Mostly names only; #branches-merge | Full role/origin/destination walkthrough as finding above |
| Cheat p.1 installation/GUI | Historical installer links | Absent contextual; #git-cheatsheet | Avoid copying stale download promises; source orientation enough |
| Cheat p.1 setup/init | name/email/color/init/clone | Partial; #git-cheatsheet | Actual placeholder commands and explain global scope, init vs clone |
| Cheat p.1 stage/snapshot | status/add/reset/diff/staged diff/commit | Covered; #git-areas | Add runnable paper exercise with expected observations, preserve widget |
| Cheat p.1 branch/merge | list/create/checkout/merge/log | Partial; #branches-merge | Show `git branch` listing/current `*`, exact merge direction, explicit syntax |
| Cheat p.2 share/update | remote add/fetch/remote-tracking merge/push/pull | Partial; #branches-merge/#git-cheatsheet | remote alias/URL, `origin/main` versus local `main`, command flow |
| Cheat p.2 inspect/compare | log range/follow/three-dot diff/show | Partial; #git-cheatsheet | log B..A versus diff B...A are distinct; explain merge-base comparison, not generic branch difference |
| Cheat p.2 paths/ignore | rm/mv/log --stat -M/patterns/global excludes | Partial; #git-cheatsheet | Add path-history command and pattern examples, global ignore context |
| Cheat p.2 rewrite | rebase/reset --hard | Covered warning not worked behavior; #history-workflow | Small before/after history diagram with no execution/destructive exercise |
| Cheat p.2 temporary | stash/list/pop/drop | Partial; #git-cheatsheet | Add drop discards stashed entry, pop conflict caveat; preserve tracked/untracked distinction |
| Cheat p.2 education/footer | Promotional/footer | Contextual | No lesson obligation |

### Midterm guideline → chapter 11

| PDF pages | Source content | Current coverage / target | Proposed treatment |
|---|---|---|---|
| 1 | Actual scope, weights and A4/equipment rules | Covered; #exam-scope | Add no borrowing stationery detail if exhaustive; preserve no invented sides/counts/rubric |
| 2 | L1 title | Contextual | None |
| 3–7 | Software components/traits/SE/aspects/project needs | Partial prompt list; #part1-revision | Explain or deep-link each, including aspects/team/business and project prerequisites |
| 8 | PM framework image | Unverified visually and not taught; #part1-revision | Inspect full original before describing; flag pending |
| 9–12 | Detailed POMA activities | Only named; #part1-revision | Four rows with actions, outputs and monitoring-to-adjustment example |
| 13–14 | WBS and five PM goals | WBS named, goals absent; #part1-revision | Small WBS hierarchy and goals; link chapter 01 |
| 15 | L2 title | Contextual | None |
| 16–17 | Six activities and model purpose | Partial; #part1-revision | Explicit sequence/purpose/roles/artifacts, link chapter 02 |
| 18 | Code-and-fix diagram/cautions | Absent; #part1-revision | Explain missing requirements/testing risks |
| 19–21 | Waterfall and two incremental variants | Names only; #part1-revision | Compare sequencing, common integration bucket vs multiple release |
| 22–24 | Spiral, four Agile values, Scrum | Partial; #part1-revision | Risk-driven loop, value comparisons, Scrum characteristics; no invented exam weighting |
| 25 | L3 title | Contextual | None |
| 26–29 | Requirements axes and iterative four-process RE | Partial; #part1-revision | Explicit two-axis example and loop outputs |
| 30–31 | Six elicitation dimensions/techniques | Techniques mentioned, dimensions absent; #part1-revision | Six dimensions + technique choice scenario |
| 32 | L4 title | Contextual | None |
| 33–34 | Five modeling approaches, scenario purpose | Mostly absent; #part2-method | Compare viewpoints; additional models are review content, not added exam scope |
| 35–36 | Use-case symbols/relations | Procedure references, little teaching; #part2-method | Symbol examples and include/extend/generalization arrow directions with links |
| 37 | Eight narrative fields | Covered names; #part2-method/#practice-midterm | Complete sample, distinguish precondition from trigger, exception from postcondition |
| 38 | Flow lecture title (says Lecture 7 in this compilation) | Contextual | Use PDF page references; do not invent missing L5 |
| 39–41 | Two notation families, data flow, packet concept | Mostly absent; #part2-method | Four symbols, input→transform→output, phone bill packet example |
| 42 | Context one process 0 + entities/flows | Covered; #part2-method | Keep and link model |
| 43–44 | Hierarchy/numbering consistency diagrams | Absent here; #part2-method | Brief link/recap without turning Level 1/2 into p.1 exam requirements |
| 45–46 | Named logical flows/process endpoints; invalid split/links/missing input-output | Partial checklist; #part2-method | Annotated invalid/correct mini examples and data versus control warning |

### Lab3 and L3 → chapter 12

| PDF pages | Source content | Current coverage / target | Proposed treatment |
|---|---|---|---|
| Lab 1 instructions | Individual task, 5 stories/all roles, 2 criteria each, 5 NFR; filename/submission | Learning counts covered; #phtrs-scope | Keep learning requirements; submission logistics are historical task context, not new instruction to submit |
| Lab 1 scenario | PHTRS roles, fields, optional photos, report/workorder, repair and cost reports | Mostly covered; #phtrs-scope | Four named statuses and explicit role mapping; preserve rate ambiguity |
| Lab 2 | Student story 1 / criteria; story 2 success criterion | Critiqued generally; #story-ac/#practice-stories-citizen | Show exact anonymized original fragment before repair; avoid treating post-report staff work as immediate system guarantee |
| Lab 3 | Story 2 failure, story 3 tracking, start story 4 | Covered examples; #story-ac/#practice-stories-citizen | Explain identical Given/When with contrary Then needs discriminating input/state |
| Lab 4 | Staff story/criteria; supervisor story and first criterion | Mostly covered via replacement; #practice-stories-staff | Map original→improved; clear status persistence and report totals, no invented rates |
| Lab 5 | Supervisor second criterion introduces extra actors; five submitted NFRs | Critiqued but original wording omitted; #nfr-review | Show exact numeric/time claims safely; annual window already present; classify organizational constraint carefully |
| L3 12–13 | FR/NFR definitions and FR examples | Covered concept, not original examples; #phtrs-scope/#nfr-review | Link chapter 03; one classification example enough |
| L3 14 | Product/organizational/external NFR taxonomy image | Absent here; #nfr-review | Explain quarterly updates may be organizational/process constraint, not automatically invalid NFR |
| L3 15–16 | Measurable property/measure table and classification exercise | Partially applied; #practice-nfr | Add property→measure→test-condition scaffold, avoid presenting proposed values as original |
| L3 34–36 | Clear consistent specification, shall/should, rationale | Only implicit; #story-ac | Short writing checklist or exact link to chapter 03 |
| L3 37–39 | Ten structured fields/template | Absent; #story-ac | Explicitly say story/criteria is a different representation; cross-link structured template rather than overloading Lab task |
| L3 40 | Story role/capability/value, AC/DoD wording | Main template covered; #story-ac | Explain AC versus DoD distinction as clarification |
| L3 41 | Need/epic/story/task/criteria image | Absent; #story-ac | Explain granularity with labeled additional PHTRS decomposition |
| L3 42 | Measurable criteria, GWT or bullets | GWT covered; #story-ac | Add bullet option; show measurable observable outcome |
| L3 43–44 | Zoo story with four criteria | Not reproduced; #story-ac | Link to chapter 03's source-derived example; demonstrate Lab count is assignment-specific, not universal rule of two |

## Cards/quiz disposition and later acceptance checks

Chapter 09: 10 cards/10 questions align with current concepts. Q10 explanation `regression test ช่วยตรวจพฤติกรรมเดิมกลับมา` is ambiguous: say it detects recurrence of the previously fixed bug. Add explanation depth when broadening lessons; keep source facts and added exercises distinct.

Chapter 10: 10 cards/10 questions are consistent with the explained caveats. No wrong keyed answer found. Gitflow/source diagram comprehension currently untested. Consider additional practice outside the fixed 10-question widget instead of silently removing existing questions.

Chapter 11: 10 cards/10 questions correctly avoid invented exam facts. Q7 extend direction is correct but deserves an explicit diagram/link in the chapter. Q9 references a visitor scenario whose independent L6 verification is outside this audit.

Chapter 12: 10 cards/10 questions; Percentile card needs correction. Q8 correctly allows quarterly update as release/process constraint, which must stay consistent with source taxonomy. Q9/Q10 properly identify NFR context and invented 200-session example. Preserve those safeguards.

After edits: verify anchors/TOC remain valid, 40 existing cards and questions remain usable unless an intentional documented count change is made, and #w-git still shows v2 committed when edit(v3) occurs after staging(v2). Check source figures and added Thai tables at desktop and narrow widths. No such functional or visual website test was performed in this read-only audit; do not report it as passing.
