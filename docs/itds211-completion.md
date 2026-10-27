# ITDS211 publication and verification record

Date: 2026-10-27 (Asia/Bangkok). Destination: the new ITDS211 course folder within Mahidol University on the existing Study Garden site.

Course URL: https://title5656.github.io/study-garden/subjects/itds211/index.html

The authorized release uses the existing GitHub Pages source `main:/`. Original PDFs stay outside the public repository. GitHub Pages build status and the live URL are checked after pushing the release commit.

## Delivered teaching material

- 12 separate source lectures: CA00–CA08, then OS01–OS03; 648 PDF pages indexed with exact filenames and page numbers.
- 299 source-order teaching sections, 108 worked examples/traces, 366 glossary entries, 96 detailed review answers at the end of their respective lessons.
- 91 reconstructed explanatory figures plus 12 original SVG overview illustrations, 12 interactive activities, 335 Flashcards and 120 multiple-choice practice questions.
- Every lesson includes overview, prerequisites and links to earlier lessons, problem-first teaching, labelled supplements, source diagrams explained in words, worked examples, vocabulary, comparisons/confusions, recap, review questions and separate final answers.
- Learning proceeds one visible topic at a time; static teaching and detailed answers remain available without JavaScript. Long tables and assembly traces scroll within their own regions.
- Page audit: 580 explained pages, 68 context/admin/separator pages, zero `needs-review` rows. A page entry identifies the actual teaching section; this is an authoring audit rather than lecturer certification.

| Lecture | Exact source filename | PDF pages | Teaching sections | Worked examples | Cards | Review answers |
|---|---|---:|---:|---:|---:|---:|
| CA00 | itds-210_comp_arch_Chapter00.pdf | 9 | 6 | 3 | 15 | 6 |
| CA01 | itds-211_comp_arch_Chapter01.pdf | 43 | 25 | 7 | 26 | 8 |
| CA02 | itds-211_comp_arch_Chapter02.pdf | 46 | 24 | 8 | 25 | 8 |
| CA03 | itds-211_comp_arch_Chapter03_RiscV.pdf | 118 | 36 | 22 | 30 | 8 |
| CA04 | itds-211_comp_arch_Chapter04.pdf | 112 | 34 | 10 | 35 | 8 |
| CA05 | itds-211_comp_arch_Chapter05.pdf | 52 | 27 | 6 | 35 | 8 |
| CA06 | itds-211_comp_arch_Chapter06.pdf | 45 | 26 | 6 | 30 | 8 |
| CA07 | itds-211_comp_arch_Chapter07.pdf | 53 | 21 | 8 | 24 | 8 |
| CA08 | itds-211_comp_arch_Chapter08.pdf | 41 | 22 | 9 | 28 | 8 |
| OS01 | Lecture 1 - Introduction.pdf | 40 | 26 | 8 | 26 | 8 |
| OS02 | Lecture 2 - Process.pdf | 41 | 22 | 7 | 28 | 10 |
| OS03 | Lecture 3 - Process Scheduling.pdf | 48 | 30 | 14 | 33 | 8 |

## Interactive activities

Course prerequisite map; CPU time and units; MARIE instruction/register trace; two's-complement carries and binary32 fields; direct/set/fully associative cache traces with LRU and page-address translation; programmed/interrupt/DMA I/O paths; disk latency and RAID layouts; pipeline timing with and without forwarding; an explicitly supplemental ideal parallel-speed model; OS abstraction layers; valid process state transitions; FCFS/SJF/STCF/Priority/Round Robin with editable arrivals, tie conventions, Gantt chart and per-job metrics.

The scheduling lab assumes one CPU burst per process, integer time units and zero context-switch cost. The pipeline lab states its forwarding/memory/register assumptions. Model inputs are bounded and errors are displayed. RAID examples distinguish the lecture's broad mirrored-pair terminology from its separately labelled RAID10 inset and the lab's explicit four-way mirror.

## Source fidelity and limits

All 648 source-page visuals were inspected during authoring, with dense code/tables enlarged. Source PDF hashes were rechecked against the initial inventory. The lecture JSON and `docs/itds211-source-map.json` retain 155 page-specific ambiguity/correction notes, including self-study material and historical product tables.

Important examples include source cache penalty500 versus the consistent400-cycle equation; IEEE/assembly transcription issues; DMA control-bit labels and I/O units; RAID naming/layout conventions; scheduling missing bursts, conflicting seconds/milliseconds and underspecified MLFQ bar durations; and the Process lecture's fork/wait/exec/read examples. Added clarifications are labelled `[อธิบายเสริม]`; source values and the reason for any correction remain visible.

The supplied OS files stop at Process Scheduling. Synchronization, Memory Management, File Systems, Disk/I/O Management and Deadlock have no dedicated OS source files in this upload. Related content that actually appears in the CA lectures is taught there. No replacement OS lectures were invented. OS01 p14 contains a still from an externally linked video; only the supplied still and stated instruction-cycle content are explained. It does not supply a complete opcode/program trace. C/assembly examples were traced for teaching; the POSIX C examples were not compiled on this Windows host.

Source-audit details: `itds211-audit-memory-io.md`, `itds211-audit-ca08.md`, `itds211-audit-os02.md`, and the per-page source map. Original lecture PDFs, extracted raw text and QA screenshots are local-only.

## Verification evidence

- Release builder: all12 lectures/648 pages, exact file/code/lab identities, citation bounds, unique section anchors and no unresolved coverage; release guard was also observed rejecting an incomplete draft.
- `node --test tools/test-itds211-core.cjs`:15/15; literal arithmetic and scheduling fixtures, late arrivals/ties/idle time, signed bounds, cache conflicts/LRU, page faults and exact offsets, load-use stalls, finite numeric results and special binary32 encodings.
- `node tools/test-itds211-browser.mjs`: all12 lessons/labs, own Mahidol folder, filtering/navigation, cards/quiz, read persistence, invalid/fractional/empty inputs, RR-only quantum, source chooser/local Blob retention, four desktop/mobile theme screenshots and no-JS reading.
- `node tools/test-itds211-layout.mjs`:467 teaching/review/source topics at320px, including code, tables, citations and figures; no page overflow.
- `node tools/check-curriculum.mjs`:5 courses/48 chapters/480 shared quiz questions,186 figures sitewide,4,495 local references; ITDS21112-source/648-page contract.
- `node tools/check-assets.mjs`: current content hashes for all988 referenced assets.
- Existing-site regression checks: university filtering and10 layouts,8 theme scenarios,27 existing Mahidol chapters/766 topic checks,48 lesson progress pages in desktop light/mobile dark with persistence/storage scenarios, and Node.js reader/quiz/history/print compatibility.
- Independent framework review: no remaining Critical/Important/Minor findings after fixes; additional1,000 scheduling invariant probes passed. That review did not claim exhaustive source fidelity of other authors' content or live deployment.

The historical `test-mahidol-scope.mjs` predates the delivered Node.js lessons and fails on a path absent from its old reference commit; its file is unchanged. Current teaching/navigation regression checks above are the applicable release checks.

## Workspace preservation

Only ITDS211 files and necessary homepage/test totals are included in the release. Pre-existing README edits, two existing screenshot edits, the untracked Node.js screenshots and `tools/capture-readme.mjs` are preserved outside this commit. No original PDF is staged.
