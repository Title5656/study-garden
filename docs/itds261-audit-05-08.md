# ITDS261 source audit: chapters 05–08

> บันทึกนี้เป็นผลตรวจฐานก่อนแก้ สถานะหลังรวมงานและรายการแก้ล่าสุดอยู่ใน [Audit หลัก](itds261-audit.md#implementation-record--22-october-2026) และ [Coverage](itds261-coverage.md) ข้อความ missing/partial ด้านล่างไม่ใช่การยืนยันว่าแก้แล้วทุกข้อ


Audit date: 2026-10-22. Scope: read-only audit of current chapter HTML, `assets/software-content.js` entries 05–08, DFD and triangle logic in `assets/widgets/itds261-widgets.js`, and Level-2 stepping in `assets/widgets/itds261-visuals.js`. No production edits or commits made.

## Evidence and limits

Read actual source PDFs with PyMuPDF, not just the prior extracted notes: L6 (43 pages), L7 (25), L8 (25), L9 (65), Ex3 Zoo (1). Page numbers below are 1-based PDF pages. Read every substantive text topic; titles/agenda/recaps were inventoried. Visual inspection used rendered contact sheets (800-pixel-wide page panels) for L6 pp6,9,10,15,21–23,26,28,34–42; L7 pp11,15,16,18–21,24; L8 pp10,13,22–25; L9 pp4,5,7–9,15,17–19,21,25,28–36,38–41,46,50–53,55,58,63. All three original PNG screenshots were opened and inspected individually. Temporary renders are in `../work-notes/audit-05-08/`.

Other pages were text-inspected, not individually visually inspected. Fine code and small labels in L9 pp5,8,38–40,63 and L8 p25 were only inspected at contact-sheet scale: do not claim a character-perfect transcription of them. No browser/runtime, mobile, print, or accessibility execution performed in this audit. Widget conclusions below are source-code review, not runtime verification. The source set contains no L5; do not invent one or renumber Lecture references to fill that gap.

Status: content is materially better than a thin summary, especially Zoo. It is not yet a comprehensive beginner lesson for all source pages. Most remaining issues concern omitted explanations and worked source examples, not wholesale factual invalidity. Preserve the existing prose, figures, assumptions, cards, quizzes, and widget hooks; add explanations in place.

## Priority findings

### P1: L9 mapping is named but not taught through the actual source sequence

Target `chapter-08.html#mapping`. L9 pp25–36 spend twelve pages distinguishing transform/transaction flow, locating boundaries, factoring and refining a robot-command example. Current three paragraphs and a bill-printing structure chart describe the destination but do not demonstrate how to derive it. A beginner cannot infer why `Determine type` becomes a dispatch/control module or where the fixture/report branches go.

Add a guided source-based walkthrough: p32 Level-1 responsibilities; p33 validation/error plus fixture/report/control paths; p34 highlighted boundaries; p35 first architecture; p36 expand fixture and report controllers. Explicitly map `Read fixture status → Determine setting → Format setting`, and `Read record → Calculate output values → Format report`. Explain that the dashed control-value path is control, not ordinary data. Add the smaller pp28–31 transform example to show boundary-outward mapping, first-level controllers, and second-level workers. Keep the simpler bill example as preparation. Label all proposed explanations as teaching commentary, not official answer keys. Current `#sources` omits pp28–29 while discussing factoring: repair the range after adding them.

### P1: L7 Structured English omits most of the source table

Target `chapter-06.html#triangle`. Source pp15–16 explicitly show sequence, simple IF/ELSE, complex CASE, decision tables for condition combinations, one-to-many `REPEAT ... UNTIL`, and zero-to-many `DO WHILE`/`DO UNTIL`. Current text names sequence/IF/repetition, but only supplies an IF chain. Add small Thai examples and traces for CASE, pre-test vs post-test loops (zero runs versus at least one), and choosing a decision table instead of nested conditions. Keep the existing corrected triangle code/widget. Do not silently reproduce ambiguous pseudocode from p13: the lesson correctly notes zero must be rejected and triangle inequality is strict.

### P1: L6 model-consistency coverage is incomplete and the supplied slides are themselves inconsistent

Target `chapter-05.html#hierarchy-balance` and `#dfd-elements`. Add the actual checklist from pp29–32: detailed DFD has at least one and no more than seven processes in this lecture convention; store-flow composition is a subset of store composition; a store interfaces between processes; every non-context diagram has a parent; a leaf process has a matching primitive PSPEC; flows/stores need record/element/file definitions. Present the slide's 3–7 levels statement (p24) as a course guideline, not a universal mandatory depth.

The existing text correctly records p30's external-entities-only-in-context convention, but pp23,26,34,36,37 visibly draw entities in child diagrams. Explicitly acknowledge this inconsistency in the supplied slides rather than implying the exception exists only in other textbooks. Keep the site's boundary-connector convention consistent. p26 permits child error lines/transaction files; reconcile internal refinement with pp31–32 balancing instead of the oversimplified claim that no child detail can add an error path.

### P2: DFD widget declares more correctness than it verifies

Target `chapter-05.html#w-dfd`, `assets/widgets/itds261-widgets.js` `checkFlow`/`initDfd`. Code checks node kinds and rejects self-edges; it cannot validate flow names, meaning, complete process input/output, or balancing. Yet its SVG arrow is unnamed and output says `ถูกต้อง`. Refine wording to `ผ่านกฎชนิดปลายทาง` and add that this checks only endpoints, or supply an actual data label and state the remaining checks. Preserve current selectors/events and the six selectable nodes. The existing reminder about black holes is useful but does not fully resolve the unqualified result.

### P2: Zoo alternative decomposition needs explicit correspondence to the supplied screenshots

Targets `#practice-zoo-context`, `#practice-zoo-level1`, `#supplied-guidelines`. The source tree places schedule/price under 2.4/2.5, while the website deliberately moves master-data responsibility to process 3. This is defensible and stated indirectly, but add a small source→teaching-model mapping: screenshot process 2.4/2.5 → proposed process 3; source D1 tickets/prices → proposed D2 price/round/policy; source D2 Booking → proposed D1 booking/ticket. Warn that store numbers are local identifiers and cannot be compared across these models as though identical.

The context paragraph says credit-card and QR providers are separate, while the table/figures group `ผู้ให้บริการบัตร/QR`. Explain this as compressed notation for two separate interfaces and show the differing QR request/QR payload/status versus card request/status data. Source screenshot 170842 contains `Payment booking QR code` outward to buyer/staff and provider-to-system, absent as a named interface from the teaching dictionary. Either include this in the payment packet and trace it at all levels or explicitly explain the abstraction. Distinguish payment QR from issued-ticket QR. Existing success-only ticket issue logic is correct and must remain.

Source Ex3 says visitor cancellation is before the visit date. Current chapter summarizes cancellation as policy-driven without explicitly teaching this stated timing condition. Add it, while preserving that refund amount/deadline policy is otherwise unspecified. Clarify that staff edit is authorized in Ex3; don't imply visitors directly edit tickets. Existing shared process labels are shorthand and should be explained by actor-specific permissions.

### P2: UI source coverage is broader than its explanations

Target `chapter-07.html#ui-context`: eight UI types are listed with essentially only CLI explained. Add one-sentence Thai definitions and a concrete use/constraint each for text menu, GUI, touch, voice, gesture, AR, VR. AR overlays real surroundings; VR creates an immersive virtual setting. Include all five p9 basic qualities (attractive, simple, fast response, clear, consistent), explaining how they differ from Mandel's three rules.

Target `#golden-rules`: currently sound but condensed. Add source subrules for advanced-user customization, hiding technical interfaces, direct manipulation, intuitive shortcuts, real-world metaphors, and context indicators. Explain concrete UI objects/actions in `#ui-process` (p14) instead of leaving those as untranslated terms. Keep the good clinic before/after and refund testing examples.

### P2: Source exercises need reasoned walkthroughs

L6 pp38–42: add source-based error-reading practice under `#dfd-elements` or a new anchored subsection. The actual pictures include no-input premium calculation, no-output pay calculation, store→store, entity→entity, and entity→store edges. p42 includes E1→E1 DF1, E1→store DF5, a process with inputs but no output, and meaningless/duplicated names. Explain local edge validity versus whole-process validity: a legal process→store edge alone does not prove its process is valid. Avoid calling every missing surrounding edge in an isolated exercise a proven whole-system error.

L9 pp12–13: `#design-levels` covers the four p12 cases but omits p13 thread-safe graphics utilities, Car/Clock registration/notification, and ClockUser interface. Add proposed reasoning and scope-dependent classification; the slides pose questions, not an official classification key.

L9 pp56–60: `#modularity` covers general definitions, p57 with appropriately cautious argument-shape discussion, and part of p59. Add all six p56 mini-cases, p58 explicit parameters versus shared global variable, p59 FileReader/DataProcessor contrast, and p60 Utility/EmployeeDatabase contrast. Keep the caveat that domain-related operations are not automatically one perfect responsibility at every scale.

### P3: Correct image placement and small language defects

The L7 p18 decision-table image is inside `#triangle` rather than `#decision-table`. The L9 p55 cohesion/coupling slide appears in `#architecture-styles` rather than `#modularity`. The L8 p17 golden-rules slide is under `#ui-process`; move to `#golden-rules` or add an explicit transition. Preserve assets and captions. Entry 05 quiz 9 explanation includes Chinese `内部`; replace with Thai `รายละเอียดภายใน`. Entry 06 quiz 6 `เกิดณจุดเวลา` needs spacing. These do not warrant replacing the question banks.

## Source-page coverage ledger

Legend: covered = concept correctly addressed; partial = topic named/summarized but substantive source explanation/example missing; absent = no meaningful treatment; intro = title/agenda/recap, no need to reproduce as a lesson. Every range maps to actual page content.

| Source PDF pages | Content and evidence | Current destination | Assessment / addition |
|---|---|---|---|
| L6 1–4 | Cover, course title, recap, agenda | chapter-05 introduction | Intro; no L5 inference |
| L6 5–6 | Structured versus object-oriented analysis; scenario/class/behavior/flow model wheel | #dfd-elements | Partial: explain four complementary views and data/process separation |
| L6 7–9 | Flow-oriented view, input→system→output | #dfd-elements | Covered concept; add one concrete transform |
| L6 10–16 | Four symbols, two notations, process operations, packet and persistent stores | #dfd-elements | Partial: notation names lack side-by-side teaching; add packet example and read/write direction |
| L6 17–20 | Decomposition, naming, scenario parsing, context construction | #hierarchy-balance | Partial: hierarchy covered; stepwise noun/data/verb extraction missing |
| L6 21–23 | Video context and hierarchy examples | #hierarchy-balance | Generic coverage; walkthrough absent; p23 contradicts p30 convention |
| L6 24–26 | Refinement depth, balancing, added internal files/error lines | #hierarchy-balance | Partial; add refinement stopping/child-detail explanation |
| L6 27–28 | Named logical flows, valid endpoints, no branch into different data, process I/O | #dfd-elements, #w-dfd | Mostly covered; clarify same-level splitting vs parent/child packet decomposition |
| L6 29–32 | Internal/hierarchical consistency rules | #hierarchy-balance, #practice-zoo-level2 | Partial; missing checklist items above |
| L6 33–34 | Numbering through Level 3 and hierarchy | #hierarchy-balance | Covered Level 0–2; add 1.1.1 as source example |
| L6 35–37 | Library context, two Level-1 processes, two search sub-processes | #hierarchy-balance | Only p35 embedded; p36–37 trace absent. Show book-name vs author search and member-status branch |
| L6 38–42 | Correct/incorrect pictures and combined-error DFD | #dfd-elements, #quiz | General rules only; original exercises absent |
| L6 43 | Visitor-only context Zoo prompt | #practice-zoo-context | Blended with expanded Ex3; explicitly separate narrower L6 prompt from full Ex3 |
| Ex3 1 | Individual exercise: Level1 all processes, Level2 one; file naming; three actors and full requirements | #practice-zoo-context, #practice-zoo-level1, #practice-zoo-level2 | Strong substantive coverage; add before-visit cancellation and optional submission checklist `Ex3-SecX-idXXXXXXX.pdf`/MyCourses |
| L7 1–3 | Cover/title/topics | chapter-06 introduction | Intro |
| L7 4–9 | DFD notation/context/hierarchy/naming/rules recap | chapter-05; chapter-06 #pspec | Covered elsewhere; explicit cross-link useful |
| L7 10–11 | PSPEC forms and purpose | #pspec | Covered |
| L7 12–14 | Triangle narrative/PDL, Structured English | #triangle, #w-triangle | Covered with justified correction; explain IF/OR/max/sum vocabulary for beginners |
| L7 15–16 | Control-construct tables | #triangle | Partial; CASE and loop variants absent |
| L7 17–18 | Policy, decision table, original check-cashing example | #decision-table; image in #triangle | New refund table is good; source personal/payroll check example not explained; explain conditions/actions/rules/don't-care using one original rule |
| L7 19–20 | DFD→design, PSPEC→one or more components | #pspec; chapter-08 #mapping | Covered concept across chapters; link and clarify not 1:1 mandatory |
| L7 21–24 | Control events, Boolean detection sources, dotted arrows, CSPEC forms | #control-state | Partial: event detection via sensors/interrupts/switches/data conditions absent; sequential/combinational distinction not taught |
| L7 25 | Zoo Level1/Level2 exercise | chapter-05 practice sections | Covered; add backlink |
| L8 1–3 | Cover/title/agenda | chapter-07 introduction | Intro |
| L8 4–8 | Flow/look-feel and eight interface types | #ui-context | Flow covered; type definitions partial |
| L8 9 | Five basic UI qualities | #ui-context, #golden-rules | Scattered partial coverage; add explicit list distinct from golden rules |
| L8 10–16 | Iterative four-phase process, environment questions/photos, objects/actions, validation | #ui-process | Mostly covered; add spiral iteration explanation and concrete objects/actions |
| L8 17–20 | Three golden rules and detailed subrules | #golden-rules | Main rules covered; missing subrules listed above |
| L8 21–25 | Low/high fidelity; paper, click-through, detailed annotated UI pictures | #practice-ui | Sound concept/examples; tie source pictures to what fidelity does/does not show |
| L9 1–3 | Cover/title/agenda | chapter-08 introduction | Intro |
| L9 4–5 | Bridge types and three HelloWorld structures | #design-levels | Absent; optional beginner opening showing same function can have different structure |
| L9 6–11 | Requirements→architecture/details, analysis→design, definitions | #design-levels | Mostly covered; p8 four design layers/data/class/interface links not explained |
| L9 12–13 | Seven architecture/detail questions | #design-levels, #quiz | Partial; latter three absent |
| L9 14–22 | Six styles, diagrams, pros/cons | #architecture-styles | All styles present; source pros condensed. Add reuse/independent filters, central backup, replaceable layer interfaces, client/server extensibility |
| L9 23–24 | Structured design, DFD/PSPEC/STD, structure chart | #mapping | Covered definition |
| L9 25–31 | Transform/transaction, boundary mapping, factoring | #mapping | Partial; actual worked derivation absent |
| L9 32–36 | Robot-control DFD to refined structure | #mapping | Absent as worked source example; P1 |
| L9 37–39 | Logical/physical modules, authentication, postal charts | #mapping | Definitions covered; source example trace absent. Show shared Login and physical helper reuse |
| L9 40–43 | Candidate designs/evaluation, basic/constructive principle taxonomy | #design-levels, #design-principles | Covered but dense; give one candidate comparison and distinguish feasibility vs adequacy |
| L9 44–48 | Modularity scope, benefits, units, small/hiding/privilege | #modularity | Partial: benefits, modules→objects→components→services missing as explicit explanation |
| L9 49–55 | Cohesion/coupling, example Staff, levels, data coupling | #modularity | Strong main coverage; explain all-used structured argument condition; Staff example absent |
| L9 56–60 | Six cases and four design comparisons | #modularity, #quiz | Partial; add exercises above |
| L9 61–64 | Implementability/aesthetics/code beauty/principle interactions | #design-principles | Concepts covered; p63 code and specific conflict pairs not worked |
| L9 65 | Summary | all chapter-08 sections | Covered |

## Three supplied PNGs: actual visual findings

- `170842`: context process 0; visitor, ticket clerk, administrator, separate credit-card provider and QR provider. Many named input/output data flows, including card fields and payment QR. Warning explicitly says guideline only and learner must verify completeness. Website correctly preserves the warning/uncertainty. Refund provider interfaces are not explicitly complete in this image; do not call it an official finished answer.
- `170946`: hierarchy/function tree, not a DFD. Process 1 has 1.1 input, 1.2 display price, 1.3 pay, 1.4 issue. Process 2 has status/edit/cancel/rounds/prices; 3 accounts/rights; 4 two report types. No data-flow arrows or stores. Website correctly distinguishes it from DFD, but needs responsibility/identifier mapping when reorganizing it.
- `171010`: Level1 drawing has connected ticket purchase and management with D1 ticket/pricing and D2 Booking, but processes 3 and 4 are isolated. Warning explicitly states unfinished exercise diagram. Website's proposed completion addresses missing account/report flows and adds meaningful stores. Do not replace the original screenshot; use annotated comparison.

## Cards, quizzes and interactive preservation

All four entries have 10 cards and 10 quiz questions. Answers and explanations were read against actual source concepts. No clearly reversed correct-answer index found. Existing questions accurately teach hierarchy numbering, valid endpoints, payment success, triangle degeneracy/zero, UI golden rules and fidelity limits, cohesion/coupling, and careful record-vs-fields tradeoff. Keep their IDs/order stable if progress relies on position.

Coverage gaps in assessment mirror the prose: no CASE/loop or original decision-table reading; no first/second factoring trace; sparse architecture-style identification; no full DFD error set. Add supplementary practice rather than silently deleting existing useful questions. Current quiz answer positions repeat 0,3,2,1 throughout all four chapters; this predictable pattern weakens self-testing. Optional future shuffle must preserve answer/explanation pairing and accessibility.

Triangle source logic rejects nonfinite, nonpositive and degenerate sides, normalizes to avoid overflow and tolerates four ULPs near the strict boundary; this is a sensible implementation detail beyond L7. Very thin mathematical triangles close to the boundary are conservatively rejected, so do not describe the widget as arbitrary-precision mathematics. Existing 3,3,3 / 3,3,5 / 3,4,5 / 1,2,3 / 0,4,4 presets cover teaching cases. Preserve highlights, presets, inputs and SVG.

Level2 stepper highlights 1.1–1.4 and displays static descriptions. It is a guided trace, not a payment simulator or validation engine. Preserve `[data-dfd-select]`, `[data-dfd-step]`, `#zoo-l2`, and `#dfd-step-status`. Existing static source figures and print duplicates must remain reachable when adding material.

## Ready for later edits

Ready to expand within existing section IDs and add source-specific subsections. Recommended order: (1) L7 control-construct and L9 mapping walkthroughs; (2) L6 full consistency/error practice and Zoo source-to-proposal correspondence; (3) UI subrule/type explanations and L9 exercises; (4) image placement, quiz language and coverage additions. This audit does not authorize claims that the rendered site or widgets have passed runtime tests; run the project's appropriate existing checks and browser/print inspection after edits.
