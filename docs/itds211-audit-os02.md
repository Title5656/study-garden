# OS02 Process authoring audit

- Authoritative content: `tools/itds211-authoring/lessons/11.json`.
- Source: `C:/Users/wpras/Desktop/LW/ITDS211_Computer Architecture and Operating Systems/Lecture 2 - Process.pdf`, 41 PDF pages, cover dated 10 September 2026.
- Scope: OS02 only. No shared renderer, other lecture JSON, git state, or publication changes by this author.
- Lesson: 22 source-order sections, 7 worked traces, 11 reconstructed figure descriptions, 40 glossary entries, 8 confusion comparisons, 13 recap points, 10 review questions with separate detailed answers, 28 cards, exactly 10 four-option quiz questions. Lab key: `process`.

## Visual inspection

All 41 pages were rendered with pypdfium2 and inspected in four contact sheets (1–12, 13–24, 25–36, 37–41). Dense material was additionally inspected as enlarged individual pages: 6, 7, 9, 10, 11, 15, 17, 18, 19, 21, 23, 25, 28, 31, 32, 33, 34, 35, 36, 40, 41.

Local QA images remain outside the public repository at `C:/Users/wpras/Desktop/LW/work-notes/itds211-source-audit/os02-visual/`. Raw PDF pages, slide images and extracted dumps were not copied into the tracked course.

The main teaching text explains all source diagrams, including the baking analogy, loading disk→memory, address-space regions and growth arrows, thread-pointer/priority scheduler illustration, process monitors, four state-transition arrows, process-table pointers and PCB fields, parent/child spaces, privilege transitions, printf→library→write, all 11 numbered read steps, boot/system-call lifecycle, save/restore images, and the detailed A→B kernel-stack/context-switch path.

Preserved source data includes the 10-row process-state table; every field of the process/memory/file management table; complete xv6 `struct proc`, `struct context`, and `enum proc_state`; all first/fork1/fork2/exec example statements; PID 2326/2327 example; all six listed exec variants; all 17 named service APIs; and every cell of the system-call/library-call comparison table. Monitor screenshots are explained with their columns and representative original numerical readings, rather than copying an entire operating-system screen.

## Coverage and limitations

41 one-to-one coverage rows: 35 `explained`, 6 `context` (pages 1, 2, 3, 20, 29, 37), 0 `needs-review`. Each row links to a section that cites that page. No separate self-study assignment or Q&A page appears in this source.

The 14 source issues are documented in the JSON and explained at the relevant point of instruction. They include simplified startup/cleanup; `void main`; the scope of “exact copy”; omitted fork failure handling; duplicated wait bullets; the fork2 screenshot's strings differing from the displayed code; one wait versus all descendants and the return/exit note; the `/bin/ls`/`run echo` mismatch and `/home` used as argv[0]; exec wrappers/GNU extension and exec error handling; API-wrapper terminology; obsolete gets; incorrect argument order in the read heading; and differing PCB notation across illustrative figures.

Clarifications checked against primary documentation: Linux man-pages fork(2), wait(2), exec(3), read(2), gets(3), and WG14 N1570 §5.1.2.2.1. Links appear beside the relevant supplemental explanations. Added analogies, numerical exercises, reviews and quiz questions are marked `[อธิบายเสริม]`.

The C programs were visually transcribed and traced; they were not compiled/run in the Windows host. No claim is made that the fork2 screenshot is an exact run of the shown code, or that PID/output order is deterministic. The fork-tree derivation assumes every fork succeeds, every process continues, and every process reaches the final print: 1→2→4→8 total, 7 newly created, 8 final “42” lines.

## Verification

Fresh checks passed: `build_course.validate(lesson)`; UTF-8 JSON parsing; balanced HTML in 48 authored fragments; source-order sections; citations and coverage links; 10 unique valid quizzes; separate nonempty review answers; and supplement labels on every newly authored worked example/review/quiz. Integration, rendered-page browser QA, and publication belong to the parent task.
