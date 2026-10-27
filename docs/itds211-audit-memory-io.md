# ITDS211 content audit: CA04, CA05, OS03

Authored only `tools/itds211-authoring/lessons/05.json`, `06.json`, and reassigned `12.json`. No shared renderer, CSS, index, Git operation, or deployment.

| Lesson | Source pages | Sections | Worked examples | Figures | Glossary / cards | Detailed review answers | MCQ |
|---|---:|---:|---:|---:|---:|---:|---:|
| CA04 / 05 | 112 | 34 | 10 | 8 | 35 | 8 | 10 |
| CA05 / 06 | 52 | 27 | 6 | 8 | 35 | 8 | 10 |
| OS03 / 12 | 48 | 30 | 14 | 7 | 33 | 8 | 10 |

Each PDF page has one coverage row, tied to a section that actually contains that page. Context/administrative/separator pages are identified separately. Source diagram explanations are in the relevant section bodies; `figures` entries are explicitly labelled supplemental reconstructions. Questions, extra analogies and added practice are labelled `[อธิบายเสริม]`.

## Reading evidence

Read the complete extracted UTF-8 source text for all three PDFs and inspected their diagram/table pages with pypdfium2 renders and view_image. QA images are outside the public repository in `C:/Users/wpras/Desktop/LW/work-notes/itds211-memory-io-qa/`.

CA04 image checks include hierarchy, DRAM/bandwidth, disk geometry, all cache lookup organizations, address subdivision, DGEMM access/blocked charts, Hamming parity coverage, paging/TLB diagrams, FSM transitions, processor cache/TLB tables and DGEMM optimization results. Additional direct checks confirmed page29 word3, page55 printed500 versus calculated400, page68 SEC/DEC wording.

CA05 image checks include module/device blocks, all three I/O flowcharts, MMIO/isolated register/program example, interrupt save/restore, PIC cascade, 8255 ports/pins/control word/keyboard-display handshake, DMA configurations/bus breakpoints/8237 registers, Xeon layout, all four DMA/DDIO paths, selector/multiplexor channels and all three IBM figures.

OS03 image checks include administrative table, queueing paths, every literal numeric Gantt (FIFO, convoy, SJF, late SJF, STCF, RR, SJF comparison, CPU/disk overlap), all MLFQ diagrams and full Windows priority table. The MLFQ fine burst diagrams do not provide a numerical duration for each tiny bar or an explicit S; explanations therefore distinguish visible behavior and approximate axis readings from stated inputs.

## Material source issues

The JSON `sourceIssues` arrays contain the full page-specific notes. Most consequential:

- CA04 p55: extra penalty500 cycles conflicts with100ns /0.25ns =400 and the printed equation. Uses400 transparently.
- CA04 p68: SEC/DEC is SECDED; decoding must use syndrome zero/nonzero plus overall parity, not integer even/odd of H. Notes distance3 detection versus correction limits.
- CA05 p30: Status D5-D7 incorrectly repeat channel0 requests; corrected to1,2,3 and disclosed.
- CA05 p43/p46: SCSI Mbps/MB/s and width generalizations; SATA6Gbps versus300Mbps conflict. Source values remain visible alongside explanation/correction.
- CA05 p49:1024 partitions label is inconsistent with60 partitions and4×256 channels; corrected to1024 channels.
- OS03 p13: turnaround=CPU+waiting excludes I/O; general identity uses completion-arrival and counts blocked time.
- OS03 p14: P3 burst is absent. Gives waiting27 and T=27+B3 under the stated order; a numerical burst is only a labelled supplement.
- OS03 p27:15s/job text conflicts with5s/job graph and completions13,14,15. Shows consistent graph computation and alternative15s/job result43,44,45.
- OS03 p32:50s CPU conflicts with millisecond I/O/axis and results; uses50ms with disclosure.
- OS03 p36/p38/p42: queue number direction changes between examples; explicitly taught.
- OS03 p44: CFS is historical and introduced in2.6.23 rather than every2.6 release.
- OS03 p48: “3x priority boost” lacks version/configuration and cannot be treated as priority=3×base. Preserved as ambiguity; no unsupported numeric formula taught.

Primary supplemental checks are linked near their claims in the lessons: Intel DDIO Primer, Renesas82C37A datasheet, SATA-IO Revision3.0 FAQ, IBM Ultra160/Seagate SCSI revision levels, Linux kernel CFS documentation and Microsoft Scheduling Priorities/Priority Boosts. They clarify source ambiguities and do not replace the source lecture with current product specifications.

## Verification

All three final JSON files passed required field checks, exact10 MCQ count, at least10 cards,5–10 separate review answers, unique section IDs, complete page sequence and page-to-section consistency, and balanced HTML parsing. Independent arithmetic checks passed for disk timing, AMAT/CPI/multilevel cache,8255 bit words, IBM channel count, priority turnaround/waiting, RR5/15-second variants and I/O overlap means. Source-specific missing detail is disclosed above rather than fabricated.
