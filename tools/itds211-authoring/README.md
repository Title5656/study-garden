# ITDS211 lesson authoring contract

Sources live outside the public repository at `C:/Users/wpras/Desktop/LW/ITDS211_Computer Architecture and Operating Systems/`.
Extracted UTF-8 per-PDF text and `source-manifest.json` are at `C:/Users/wpras/Desktop/LW/work-notes/itds211-source-audit/`.
Bundled Python: `C:/Users/wpras/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe` (`pypdf`, `pypdfium2`, Pillow available). Use `sys.stdout.reconfigure(encoding='utf-8')` for Thai output. Render individual pages with pypdfium2 and inspect with `view_image`; do not assume image-only slide text is absent material. Keep QA images outside public site.

One JSON per lecture, UTF-8, no Markdown fences. File/id mapping:

| id | code | source | pages |
|---|---|---|---:|
| 01 | CA00 | itds-210_comp_arch_Chapter00.pdf | 9 |
| 02 | CA01 | itds-211_comp_arch_Chapter01.pdf | 43 |
| 03 | CA02 | itds-211_comp_arch_Chapter02.pdf | 46 |
| 04 | CA03 | itds-211_comp_arch_Chapter03_RiscV.pdf | 118 |
| 05 | CA04 | itds-211_comp_arch_Chapter04.pdf | 112 |
| 06 | CA05 | itds-211_comp_arch_Chapter05.pdf | 52 |
| 07 | CA06 | itds-211_comp_arch_Chapter06.pdf | 45 |
| 08 | CA07 | itds-211_comp_arch_Chapter07.pdf | 53 |
| 09 | CA08 | itds-211_comp_arch_Chapter08.pdf | 41 |
| 10 | OS01 | Lecture 1 - Introduction.pdf | 40 |
| 11 | OS02 | Lecture 2 - Process.pdf | 41 |
| 12 | OS03 | Lecture 3 - Process Scheduling.pdf | 48 |

## Schema (all fields required unless noted)

```json
{
  "id":"01", "code":"CA00", "title":"ชื่อไทย", "englishTitle":"Exact source title",
  "sourceFile":"exact.pdf", "sourcePages":9,
  "overview":["3–5 separate lines"],
  "prerequisitesHtml":"<p>English (ไทย): immediate simple definition…</p>",
  "sections":[{"id":"unique-english-slug","title":"English (ชื่อไทย)","pages":[1,2],"question":"สิ่งนี้มีไว้แก้ปัญหาอะไร / ทำไมต้องมี","html":"<p>Source-based detailed Thai teaching. Mark EVERY supplemental analogy/prerequisite/example [อธิบายเสริม]. Include definitions, operation, analogy, all diagrams/tables/examples relevant to these pages.</p>"}],
  "workedExamples":[{"title":"โจทย์ตามสไลด์/ระบุเสริม","pages":[3],"html":"<ol><li>every substitution/calculation step</li></ol>"}],
  "figures":[{"title":"ภาพที่สอน","pages":[3],"description":"Explain source diagram, elements, arrows/data flow, meaning.","parts":["part1: meaning","part2: meaning"],"flow":["step1","step2"],"kind":"flow"}],
  "glossary":[{"term":"English","thai":"ไทย","meaning":"plain beginner explanation","note":"source distinctions","pages":[3]}],
  "confusions":[{"title":"A vs B","pages":[3],"html":"<table>…</table>"}],
  "recap":["short Thai bullet"],
  "review":[{"question":"…","pages":[3],"answerHtml":"<p>detailed separate answer</p>"}],
  "cards":[["English (ไทย)","plain definition"]],
  "quiz":[{"q":"…","options":["a","b","c","d"],"answer":0,"explanation":"Why correct and why alternatives are incorrect."}],
  "coverage":[{"page":1,"sectionIds":["unique-english-slug"],"status":"explained","note":"What was accounted for; visual check where applicable."}],
  "sourceIssues":["genuine ambiguity/typo explained, or empty array"],
  "lab":"overview"
}
```

Use 5–10 `review` items, exactly 10 shared-engine `quiz` items and at least 10 `cards`. `coverage` has one row for EVERY PDF page, including covers/outline/admin/Q&A (use status `context` there). Source content pages use `explained` only when meaningfully taught; use `needs-review` honestly if not. Never generate repetitive placeholder explanations by looping over extracted headings. Important tables keep actual cells/numbers. Explain every source diagram in the relevant section; `figures` creates additional reconstructed concept visuals, not replacements for explanations. Source filenames/page numbers are added by the builder to each section; authors must supply correct page arrays. All supplements, analogy text and new practice questions carry `[อธิบายเสริม]`. Separate lecture bodies, do not combine lectures into a short overview. Preserve source self-study material. No raw PDF, complete slide image, or raw extracted slide dump belongs in tracked source.

Supported lab keys owned by parent: `overview`, `performance`, `machine`, `numbers`, `cache`, `io`, `storage`, `pipeline`, `parallel`, `os`, `process`, `scheduling` in lecture order.

Content authors edit only assigned `lessons/*.json`, optional local QA artifacts, and their own `docs/itds211-audit-<code>.md` audit notes. Do not edit shared renderer, CSS/JS, index, git state, other lessons, or deploy. Return clear source issues and any remaining incompleteness.

## Build and verification

### Inline teaching aids

`inline-visuals.json` contains 48 authored concept maps mapped to teaching-section IDs, with supplementary examples explicitly labelled. `inline_visuals.py` renders their static explanations and eight simulator introductions; `assets/itds211-inline.js` enhances them in place. Edit these sources to preserve the aids through a future course rebuild. Keep explanations accurate to the adjacent topic, and state assumptions on numerical demonstrations.

For an inline-only update that preserves hand edits elsewhere in the rendered pages, run `python tools/itds211-authoring/sync_inline.py`. It updates only the 12 ITDS211 lessons and the course's asset hashes. Run `node tools/test-itds211-inline.mjs` for embedded placement, map interactions, numerical results, keyboard use, mobile themes, and no-JavaScript fallback. Existing full labs remain independent.

Run `python tools/itds211-authoring/build_course.py --release` after authoring all twelve files, then `node tools/version-assets.mjs`. Release mode rejects missing lectures, mismatched source identities/lab assignments, invalid citation pages, and unresolved page coverage. It refreshes the ITDS211 folder's Flashcard total from the lesson data. Plain build mode is for local drafting only.

Use `node --test tools/test-itds211-core.cjs`, `node tools/test-itds211-browser.mjs`, `node tools/test-itds211-layout.mjs`, `node tools/check-curriculum.mjs`, and `node tools/check-assets.mjs`. Browser checks use `STUDY_GARDEN_PLAYWRIGHT` when Playwright is provided by the desktop runtime. Do not use `STUDY_ITDS211_PARTIAL` for release verification. SVGs are original supplementary diagrams generated by `visuals.py`; PDFs and render QA stay outside the public repository.
