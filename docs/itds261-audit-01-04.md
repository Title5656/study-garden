# ITDS261 source audit: chapters 01-04

> บันทึกนี้เป็นผลตรวจฐานก่อนแก้ สถานะหลังรวมงานและรายการแก้ล่าสุดอยู่ใน [Audit หลัก](itds261-audit.md#implementation-record--22-october-2026) และ [Coverage](itds261-coverage.md) ข้อความ missing/partial ด้านล่างไม่ใช่การยืนยันว่าแก้แล้วทุกข้อ


Audit date: 2026-10-22. Read-only audit of production content; this document is the only production-repository file authored by this audit worker. No commit or push. Root's concurrent removal of badges and relocation of recall boxes to `#key-takeaways` is intentionally not treated as a defect.

## Method, evidence and limits

Compared actual files in `sources/itds261/`, rather than trusting extracted notes: L0 (13 PDF pages), L1 (76), L2 (32), L3 (67), L4 (24), Ex2 (2), and the Ex2 `(1).docx` Word XML. Read chapter 01-04 HTML teaching content and all 40 cards / 40 questions and explanations in `assets/software-content.js`. Page references below are one-based PDF pages, not an inferred lecture numbering scheme. There is no L5 source and no recommendation to invent one.

Text extraction was performed directly with PyMuPDF. Image-heavy pages were rendered from the actual PDFs and visually inspected using `view_image`; contact sheets are in `../work-notes/audit-01-04/`. A page being rendered is not alone evidence of inspection: the following are the pages actually viewed:

- L0: 10, 11.
- L1: 11, 15, 17, 19-35, 38, 43, 50, 51, 54, 55, 58, 70-74.
- L2: 4, 8, 13, 16, 17, 19, 23, 25, 30.
- L3: 6, 9, 10, 14, 15, 18, 25, 39, 41, 44, 47, 49-51, 54-56, 62, 66.
- L4: 4, 14, 16-20, 24.
- Ex2 PDF: both pages, alongside full extracted text. Small Thai body text was checked in extraction rather than relying on contact-sheet readability.

All other PDF pages were inspected as extracted text only, not visually verified. Title/decorative pages are not lesson omissions. DOCX body text was read from `word/document.xml`; its pagination, layout, headers and footers were not rendered or verified. The two Ex2 versions have the same substantive instructions and both scenarios on manual comparison; this is not a byte-for-byte assertion (Thai PDF glyph decomposition and Word runs differ). No external video or linked article was opened, so no claims are made about their full contents. No browser interaction or runtime regression testing was performed by this audit worker; widget preservation recommendations concern the HTML and educational purpose, not a new runtime pass.

Status terms: **Covered** = the principal source concept is explained; **Partial** = named/compressed or missing a worked step; **Missing** = no substantive treatment within chapters 01-04; **Context** = title, agenda, reference or supplementary context, not core conceptual instruction. A link elsewhere should be explicit before calling a topic covered outside this scope.

## Findings that should drive edits

### P1: major beginner-learning gaps

1. **Chapter 03 omits substantial visual-source content.** At `#requirement-types`, L3 p14's NFR taxonomy and p15's measures are absent except for a performance example. At `#specification`, no filled structured requirement, no SRS contents guide (p55-56), no worked story with acceptance criteria (p43-44), and no explanation of low/high fidelity prototypes (p48-49). Definitions alone do not let a beginner produce these deliverables. Add small complete Thai examples, maintaining English source terms.
2. **Ex2 asks for detailed diagrams for both systems, but chapter 04 contains only a POS relationship fragment.** `#practice-dental`, `#practice-pos` and `#use-case-visual` have sound prose and narratives; the POS fragment explicitly says it is not a complete diagram. The missing artifacts are the actor/system-boundary/use-case diagrams covering the complete scenarios. Add complete readable diagrams (or clearly partitioned views with a coverage matrix), map every scenario FR to a use case, and retain the relationship fragment and `#w-usecase` as separate teaching aids. Do not silently add actors, permissions, numerical NFRs or official-answer status.
3. **Chapter 01's WBS-to-schedule teaching stops before the source's actual exercise.** `#wbs-tools` / `#wbs-tree` give a one-branch decomposition, but L1 p70 is a branching hierarchy; p71 is a dependency network and p72 shows people/time bars. A beginner cannot infer scheduling or parallelism from a linear four-box tree. Preserve the current figure, add a branching WBS and walk through a small dependency schedule. Explain that decomposition edges and precedence arrows mean different things.
4. **Chapter 01 omits entire project/foundation groups while citing broad ranges.** L1 p39-41 implementation/testing/support, p54-57 management framework/ten knowledge areas/stakeholders, and p44 process-versus-product distinction are not substantively taught. Add concise subsections or explicit links to later lessons, plus sufficient beginner introductions here.

### P2: accuracy, consistency and depth corrections

5. **Chapter 02's Scrum limitation is too broad for the actual graphic.** `#agile` correctly avoids inventing a complete Scrum specification, but L2 p23 visibly includes Product Backlog, Sprint Backlog, Daily Scrum, a 2-4 week sprint label and Potentially Shippable Product Increment. Explain that illustrated flow and label the duration as what this slide illustrates, not a universal mandatory duration. It is inaccurate to behave as if the source contains no process details beyond six bullets.
6. **Chapter 02's source comparison and incidents are compressed away.** L2 p4-5 CrowdStrike/Knight Capital are absent; p25's seven-row Agile/traditional table and p26-30 case comparison get only general prose. Add the source's causal lessons as source-attributed case studies, not independent current historical research. p30 is a blank exercise table, so any filled comparison must say it is an authored answer. Explain p25's low/high complexity and overhead as the slide's simplified comparison, not a theorem that Agile systems are always simpler.
7. **Chapter 04 simplified dental narrative changes the order/inputs.** The detailed narrative in `#practice-dental` starts with choosing a dentist, then available date/time and reason, matching Ex2. The figure says choose a desired date/time, then show availability, then choose a slot, and omits dentist/reason. Make the simplified figure's inputs and order match the detailed narrative, or explicitly label it an intentionally partial illustration. Preserve both forms after alignment.
8. **Ex2 clinic capacity needs its exact qualifier.** The current admin row says maximum per day; the source says maximum appointments per day **for each dentist**. Repeat this qualifier in the table and validation step so readers do not infer a single clinic-wide cap. Doctor statuses are named only generically in the table; include the source examples pending/completed/cancelled and keep no-show recording as an unresolved elicitation question.
9. **Several correct additions need provenance precision.** Generalization of payment use cases, idempotent retry handling, concurrency scenarios, numerical NFR examples and AC-versus-DoD clarification are useful authored explanations, not direct statements of Ex2/L4. Existing assumption labels largely handle this well; retain them. L3 p40 uses AC or DoD loosely; the website's distinction should explicitly be an explanatory clarification rather than attributing the distinction to the slide.
10. **Slide placement interrupts the current topic.** Chapter 01 embeds POMA p58 inside `#business-software`; chapter 02 embeds Spiral p19 inside `#traditional`. Move the original figures to `#poma` / `#spiral` while keeping them available, or add an explicit cross-reference explaining placement. This is a lesson coherence issue, not a source-image accuracy failure.

## Page/range coverage ledger

### Chapter 01: L0 and L1

| Source pages | Actual source content | Current destination | Status / concrete work |
|---|---|---|---|
| L0 1-3 | Cover, course pairing, instructor | `#course-map` | Context; personal contact biography need not become examinable lesson content. |
| L0 4-7 | Objectives, separate course CLOs, theory versus practical lab | `#course-map` | Covered in compressed prose. A beginner-facing objective checklist would make expected artifacts explicit. |
| L0 8-9 | Before-midterm/final schedule for lecture and lab | `#course-map` | Partial: conceptual sequence and warning about later topics present; no full lecture/lab schedule. Add optional source-attributed schedule, do not derive exam scope from it alone. |
| L0 10 | ITDS261 40/40/20; lab 40+25+20+20 but total printed 100 | `#course-map` details | Covered accurately. Visual inspection confirms 105 versus printed 100; preserve discrepancy, do not silently repair. |
| L0 11-12 | Pressman/Maxim; Dennis/Wixom/Roth; Agentic Software Engineering references | `#sources` / `#course-map` | Context missing. Add optional reading list if comprehensive inventory desired; do not pretend unseen books are supplied lectures. |
| L0 13 | Consultation via email/Teams, 80% attendance, MyCourses materials/submission | `#course-map` details | Partial: attendance and submission covered; consultation route absent, low priority. |
| L1 1-4 | Titles/topic outline | `#course-map` | Context. |
| L1 5-8 | Need -> process -> software, business process actors/tasks/rules/input/output, restaurant example | `#business-software` | Partial: example good; explicitly enumerate process components and explain a business rule and input/output. BPMN is only named by source; no need to invent full BPMN lesson. |
| L1 9-12 | Software components, user/application/OS/hardware hierarchy, characteristics | `#business-software` | Partial: components and characteristics good; p11 hierarchy absent. Add four-layer example showing each layer's role. |
| L1 13-14 | Obsolescence examples and five application categories | `#business-software` | Missing examples/categories. If including OS dates, say “slide examples”; avoid treating all forms of support as one universal end date. |
| L1 15-17 | Software 1.0 code / 2.0 weights / 3.0 prompts image, industry quote, seven development trends image | `#business-software` | Missing contextual sidebar. Visually verified p15/p17. Teach only the pictured framing; do not claim linked video/article review. Trends are source context, not required new chapters. |
| L1 18-21 | SE definition and five aspects | `#business-software`, `#people-quality` | Definition covered; five aspects dispersed rather than explicit. Add mapping of technical/business process, methods, product metrics, teamwork, coordination. |
| L1 22-25 | Why SE; tree-swing communication mismatch; project needs; success/failure factors and percentages | `#people-quality`, `#wbs-tools` | Partial. Tree-swing lesson absent; explain mismatch between requested, interpreted, built, documented and needed. Existing success factors good. Percentages need not be memorized; if repeated, preserve slide attribution and avoid generalizing sample-free numbers. |
| L1 26-27 | Effort estimation, FR/NFR and implementation constraints | `#poma`, `#people-quality`; chapter 03 link proposed | Partial: planning names estimation but no effort vs duration explanation; design constraints (language/platform) absent locally. Add one example and link chapter 03. |
| L1 28-30 | Customer/user and PM/BA/SA/developer/UX/QA roles | `#people-quality` | Partial but accurate. Add role -> output -> collaboration table; current compressed sentence omits many responsibilities, e.g. developer unit tests/integration and QA bug-fix verification. |
| L1 31-34 | Technical process/tool choices vs nontechnical estimation/communication | `#people-quality` | Partial. Add explicit distinction and example tradeoff; don't make database/tool selection equivalent to project management. |
| L1 35 | 2/4/6 people: 1/6/15 possible communication paths | `#people-quality`, `#w-channels` | Covered well; retain formula assumptions and widget. |
| L1 36-38 | Program vs system, breadth/depth, simple sequence vs branching/looping flowcharts | `#people-quality` | Partial: breadth/depth defined but no worked interpretation of p38. Explain why branching/loops add cases, interfaces and coordination. |
| L1 39-41 | Coding conventions, reviews, acceptance/unit and black-/white-box testing, pre/post-release support | `#people-quality` or new nested subsections | Missing substantive coverage. Introduce each, distinguish test level from technique, then link later chapters. Include training, support and enhancement after release. |
| L1 42-44 | Quality measures/stakeholder perspectives; software/engineering/process/product definitions | `#people-quality`, `#common-confusions` | Quality mostly covered. Add PM perspective and explicit process/product distinction with one deliverable example. |
| L1 45-49 | Management umbrella, 4P, project vs operations, project attributes | `#poma` | Covered; expand 4P beyond names into questions/outputs (scope, alternatives, constraints; tasks/milestones/QA). |
| L1 50-53 | Scope-cost-time balance, management definition, why management is needed | `#poma` | Covered in prose; one numerical/scope tradeoff exercise would improve beginner application without claiming a formula. |
| L1 54-57 | Framework, ten knowledge areas, PM role, stakeholder list | `#poma` | Missing framework/ten-area guide. Explain integration connecting scope, schedule, cost, quality, resource, communication, risk, procurement, stakeholder management. Source includes sponsors, banks, support, suppliers, not only users/developers. |
| L1 58-63 | POMA detailed steps and iterative character; not development lifecycle | `#poma` and misplaced p58 image at `#business-software` | Covered strongly. Move figure; preserve table. Include risk tracking/mitigation and measurable goals explicitly. |
| L1 64-65 | Charter, scope statement, WBS, Gantt/network/critical path, cost estimate/earned value; tool picture | `#wbs-tools` | Partial. WBS/Gantt/PERT named; charter/scope/critical path/earned value missing. Give purpose-level definitions, do not invent advanced EVM calculation syllabus. p65 picture was not visually inspected. |
| L1 66 | Success criteria and funding/expertise/engagement | `#wbs-tools` | Covered. |
| L1 67-70 | Scope/deliverable decomposition; sequence, estimates, assignment, timeline; branching WBS | `#wbs-tools`, `#wbs-tree` | Partial. Existing single path is labelled composition correctly, but needs sibling branches and work-package example. |
| L1 71-73 | PERT network, assignment/schedule bars, Gantt | `#wbs-tools` | Major gap. Source network branches after tasks 1(12), 2(2); branch durations 8+20+5, 6+2+1, 3+2+1. Under simple precedence-only assumptions longest path = 47 units. p72 assigns people differently and bars suggest resource effects; do not claim its schedule is identical to unlimited-resource PERT without analysis. Add separate dependency vs resource explanation. |
| L1 74 | Working exercise image of instant noodles, no written task prompt | `#wbs-tools` | Context. Visually verified: do not invent detailed original exercise instructions. A noodle WBS could be an authored practice prompt only. |
| L1 75-76 | Management advantages and goals | `#wbs-tools` | Partial: success discussed; resource coordination, morale, reliability and strategic goals can be summarized as benefits, not guaranteed effects. |

### Chapter 02: L2

| Pages | Source | Current destination | Status / concrete work |
|---|---|---|---|
| 1-3 | Cover/agenda | Hero / `#framework` | Context. |
| 4-5 | CrowdStrike content-validator/deployment incident; Knight Capital faulty deployment/controls | `#framework` | Missing. Add “why process matters” case notes with source attribution and discussion of test, deployment, operational safeguards. p4 image text matters. |
| 6-7 | Six development activities, quality/process/methods/tools layers | `#framework` | Covered, but map one activity to artifact and quality check for beginners. |
| 8-10 | Framework activities -> task sets -> tasks/products/milestones/QA; development framework; eight umbrella activities | `#framework` | Partial. Hierarchy and p9 meaning absent; umbrella list omits work-product preparation and reusability management. Explain structure and don't conflate software library framework with process model. |
| 11-13 | Models coordinate tasks/people/artifacts; inputs/outputs/pre/postconditions; Code and Fix | `#framework` | Covered. Add a miniature task contract to concretize pre/postconditions. |
| 14-15 | Waterfall diagram and pros/cons | `#traditional` | Covered; preserve fixed/clear requirements qualification. |
| 16-18 | Incremental integration bucket vs multiple releases; pros/cons | `#traditional` | Covered particularly well; keep distinction between internal increment and external release. Add one dependency/integration failure example if expanding. |
| 19-20 | Spiral quadrants, risk/prototype/review, pros/cons | `#spiral` (image currently `#traditional`) | Covered conceptually. Source numbers place Plan Next Phase at 1, Objectives at 2, Risks at 3, Develop/Verify at 4. Website's explanatory starting point is sensible, but if tracing the actual numbered figure, explain it is a cycle rather than renumber source. |
| 21-22 | Four Agile values and process traits | `#agile` | Covered; retain explanation that “over” does not mean no documentation or planning. |
| 23 | Scrum bullets and visible backlog/sprint/daily/increment graphic | `#agile` | Partial; add diagram walk-through with source-specific duration label, without importing an entire Scrum guide as original content. |
| 24-25 | Agile advantages/risks and seven-row traditional comparison | `#agile` | Partial. Add cost/time unpredictability and documentation risk, plus comparison with caveats about simplified source categories. |
| 26-30 | Spotify squads/tribes, delivery/A-B feedback; HealthCare.gov coordination/integration/late feedback; blank comparison exercise | `#agile`, `#selection` | Partial. Explain squads vs tribes and four comparison factors; clearly label completed table as authored interpretation. |
| 31 | Process maturity assessment ISO/SEI spectrum | `#selection` | Covered; no unsupported certification guarantee. |
| 32 | Optional online video resources | `#sources` | Context; links not reviewed, so do not summarize video contents. |

### Chapter 03: L3 (recommended first content pilot)

| Pages | Source | Current destination | Status / concrete work |
|---|---|---|---|
| 1-4 | Cover/agenda/section divider | Hero | Context. |
| 5-6 | Definition; sources centered on BA with sponsor, PM, business user, developer, tester, other stakeholders | `#requirement-types`, `#elicitation` | Definition covered, source map missing. Explain what each source contributes and why a request is not automatically validated. |
| 7-10 | User/system types; Mentcare monthly-drug-cost requirement refined into five precise clauses; readers | `#requirement-types` | Two-axis explanation is good. Missing worked refinement: last working day, report after 17:30, clinic/drug/count/cost fields, dose-unit separation, authorized-user access. Teach one broad need becoming multiple system clauses rather than copying unexplained text. |
| 11-13 | Mentcare stakeholders; FR/NFR; three FR examples | `#requirement-types` | Partial: original stakeholder range and daily patient-list/staff-ID examples omitted. Add one role conflict and two concrete FR examples. |
| 14 | NFR classification tree | `#requirement-types` | Missing. Explain product (usability/efficiency/dependability/security), organizational (environmental/operational/development), external (regulatory/ethical/legislative), and key branches such as efficiency -> performance/space. Do not imply all security statements are NFRs. |
| 15 | Measures for speed, size, ease of use, reliability, robustness, portability | `#requirement-types`, existing NFR card | Major partial. Current response-time example is excellent but narrow. Add table with source examples: transactions/sec, memory, training time, availability/MTTF, restart time/data corruption, target platforms. Explain measure vs agreed threshold. |
| 16 | Classify six sample requirements | `#requirement-types` | Missing exercise. Preserve source values as sample statements; “10,000 concurrent without significant degradation” remains underspecified. Include reasoning, not only FR/NFR labels. |
| 17-20 | RE and early feasibility; three questions; iterative four processes and requirements document | `#elicitation` | Covered. Add expected output and a yes/no/uncertain feasibility mini-case. |
| 21-24 | Elicitation aim/challenges and facilitator prompt | `#elicitation` | Partial: unknown wants, jargon, conflicts present. Add unrealistic demands and BA facilitator connection; p24 is a question, not a written official answer. |
| 25 | Discovery -> classification -> prioritization/negotiation -> documentation loop | `#elicitation` source figure | Image/caption present but no worked negotiation. Walk through two conflicting requests and document the agreed priority. |
| 26-32 | Six dimensions, interview types/limitations/tips, ethnography, other techniques | `#elicitation` | Mostly covered; missing organizational power limitation and concrete explanation of JRP, sampling, questionnaire suitability. Add short technique-choice table and non-leading open/closed questions. |
| 33-36 | Specification, natural language conventions, examples | `#specification` | Mostly covered. Add avoid-jargon/highlight-key-parts guidance and one weak -> clear rewrite. |
| 37-39 | Ten structured fields and blank record template | `#specification` | Field groups covered, completed record missing. Fill all ten fields for one authored requirement and retain separate blank practice template. p39 is blank in source, not an official completed answer. |
| 40-42 | User-story format; user need -> epics -> stories -> tasks/AC; AC structure | `#specification` | Partial. Template defined but no complete story, epic decomposition or example criteria. Clarify source p40's loose AC/DoD wording as a supplement. |
| 43-44 | Zoo online-ticket story and four criteria: live price, payment, email/QR, entrance scan | `#specification` | Missing locally. Add original-context worked chain and cross-link relevant zoo lesson; do not conflate it with dental Ex2. |
| 45-47 | Diagram plus narrative, actor/ellipse/association, Mentcare roles and interactions | `#specification` -> chapter 04 | Partial / can cross-link. Add brief purpose comparison and explicit link; p47 has receptionist/nurse/doctor/manager, not the dental actors. |
| 48-49 | UI looks/flow; low/high fidelity; sketched screen navigation | `#specification` | Missing explanatory content. State what each prototype validates, limitations, and how feedback revises requirements. A prototype is not proof that backend requirements are satisfied. |
| 50-51 | DFD order/packaging data movement; ERD author/book cardinality and modality | `#specification` | Missing. Add two-sentence model-purpose comparison and cross-links; explain number of related instances vs required/optional participation without deriving a full ERD syllabus. |
| 52-54 | SRS formal purpose, documentation benefits, five reader groups and uses | `#specification` | Partial. Purpose good, reader-specific uses absent: customer checks needs, manager plans, engineer builds, tester designs validation, maintainer understands relationships. |
| 55-56 | Ten-part SRS structure | `#specification` | Missing. Add source-attributed contents guide: preface, introduction, glossary, user requirements, architecture, system requirements, models, evolution, appendices, index. Explain each briefly; this is a source example structure, not a universal mandatory template. |
| 57-60 | Validation importance and seven checks | `#validation-change` | Partial. Names all seven; worked distinctions strongest for consistency/completeness/verifiability/traceability. Add validity, realism and clarity examples and how a reviewer records an issue. |
| 61-63 | Wicked/incomplete problem understanding; requirements evolve and need links | `#validation-change` | Mostly covered. Explain “wicked” in ordinary Thai rather than assuming familiarity if term is introduced. |
| 64-66 | Management planning vs change control; four planning considerations; three-step change flow | `#validation-change` | Covered in compressed prose. Separate policy setup from handling a change after approval; add one requirement-change impact record tracing diagram/test updates. |
| 67 | Online shop: five FR + five NFR exercise | `#validation-change` or end practice | Missing full exercise. Add prompt, structured attempt space, and authored answer with measurable NFR assumptions explicitly identified. Do not present invented numbers as original requirements. |

### Chapter 04: L4 and both Ex2 formats

| Source pages | Source | Current destination | Status / concrete work |
|---|---|---|---|
| L4 1-3 | Cover/agenda | Hero | Context. |
| L4 4-6 | Analysis bridge, characteristics/interfaces/constraints, design and validation objectives | `#use-case-basics` | Covered compactly; add requirement -> analysis -> design example to distinguish outputs. |
| L4 7-9 | Five modeling approaches; scenario modeling; analysis/decomposition/refinement/validation steps | `#use-case-basics` | Partial. Only scenario and flow compared. Add class/behavior/data model purpose table and stakeholder confirmation step. Do not invent a missing L5. |
| L4 10-12 | Outside actors / inside responsibilities; what to gather; use case vs diagram vs narrative | `#use-case-basics` | Covered. Explicit three-artifact definition table useful for beginners. |
| L4 13-17 | Symbols/boundary and associations | `#use-case-basics`, `#relationships` | Covered verbally, but needs simple complete boundary example before detailed Ex2 diagrams. |
| L4 18 | Actor inheritance before/after prompt | `#relationships` | Partial: rule correct, no worked inheritance picture. Source's “After” area is blank in inspected PDF. Any completed example must be labelled authored, not copied answer. |
| L4 19 | Checkout includes scan/total/payment; deposit and withdrawal share authentication | `#relationships` | Covered direction and shared behavior. Add a second base sharing the included case to make reuse visible; preserve source image. |
| L4 20 | Registration extended by optional Get Help On Registration | `#relationships`, `#w-usecase` | Covered principle; source example useful beside authored discount case. Keep base independently meaningful and conditional extension explicit. |
| L4 21-22 | Boundary, actors, goals, relations, diagram, review/refine | `#use-case-basics` | Covered, but learners need to see these steps enacted across Ex2. |
| L4 23-24 | Narrative purpose and eight fields | `#narrative`, practice narratives | Covered well. Use table/numbered steps and link exception branches to exact main-flow step. |
| Ex2 PDF 1 instructions + matching DOCX paragraphs | Identify FR/NFR, actors/use cases, detailed diagram, narrative; PDF naming/submission | `#practice-dental`, `#practice-pos`, `#sources` | Deliverable checklist absent. Add five-item checklist; submission instructions optional as source logistics, not a current course announcement. |
| Ex2 PDF 1 dental first paragraphs | Patient account/login, dentist/date/slot/reason, ID/push; dentist daily schedule/details/status/notes/change; staff records/availability/change/cancel/statistics | `#practice-dental` | Substantively covered in prose/table. Enumerate ID-labelled FRs and separate actor-triggered goals from automatic sub-behavior. Full diagram missing. Include pending/completed/cancelled examples. |
| Ex2 PDF 2 dental continuation | Patient upcoming/change/cancel/history; push AND SMS reminders; admin accounts/schedule/max per dentist/day/holidays | `#practice-dental` | Covered with qualifier loss: maximum must retain “per dentist”. Use “push และ SMS” for reminder requirement, not ambiguous alternative slash if explaining channels. Exact reminder lead time is unspecified. |
| Ex2 PDF 2 POS first paragraph | December seasonal shop, products, primary cashier and manager roles | `#practice-pos` | Covered; correct refusal to invent system shutdown outside December. |
| Ex2 PDF 2 cashier paragraph | Browse inventory, add/remove sale items, store discounts, total incl tax, three payment alternatives, receipt, stock update, stock-out prevention | `#practice-pos` | Covered well; full diagram/FR matrix missing. Numerical tax, rounding and payment-provider boundary remain assumptions/questions. |
| Ex2 PDF 2 manager/report paragraphs | Product CRUD, product/time discount rules, stock/dashboard, automatic daily totals/transactions/category counts/best-sellers | `#practice-pos` | Covered compactly. Make product/time-scoped discount configuration explicit. Do not give cashier manager privileges via unjustified generalization. Automatic daily reporting needs a defined trigger in narrative; do not invent a human “time actor” without explaining modeling choice. |
| Both Ex2 formats, NFR evidence | Dental explicitly says easy-to-use mobile application; no quantitative thresholds; POS contains business functions rather than explicit performance limits | Both practice sections | Existing assumption labelling is good. Improve by distinguishing stated usability, inferred concerns to ask about, and proposed measurable thresholds. Do not transform SMS/report automation into NFRs. |

## Cards, quizzes and widget preservation

The 40 cards and 40 answer keys were read. No clear wrong keyed answer was found in chapters 01-04. Most questions check recognition and use conspicuously irrelevant distractors (compiler/color/SQL/no testing), so passing them does not establish ability to build an artifact. Keep existing questions and explanations; add source-grounded practice rather than replacing or deleting material.

- Chapter 01: add interpreting a WBS branch, effort vs duration, PERT dependency/parallelism, and choosing a quality measure for a stakeholder. Existing POMA/communication/BA answers are correct. Question 10 is source-inventory awareness, not conceptual mastery; it may stay, but should not occupy the only opportunity for an omitted source topic.
- Chapter 02: add comparing increment vs release on a diagram, identifying a missing QA checkpoint, interpreting Scrum backlog flow, and filling the case-study comparison. Existing increment/release distinction is especially worth preserving.
- Chapter 03: add an actual structured record completion, classifying product/organizational/external NFRs, matching measures, refining a broad user requirement, and diagnosing all seven validation checks. Existing Q3's “ความรุนแรง 1-10” is an unexplained imported scenario; either explain it as an arbitrary range example or replace only that distractor with one anchored in this chapter. It does not make the keyed answer wrong.
- Chapter 04: add tracing an Ex2 sentence to actor/use-case/FR/narrative, identifying an unjustified relationship, correcting a reversed generalization arrow, and checking a complete diagram. Existing include/extend answers and NFR automation distinction are accurate.
- All four quizzes currently repeat answer indices `0,3,2,1,0,3,2,1,0,3`; this predictable pattern weakens assessment. Any future reorder must update indices and be checked programmatically. This is optional assessment improvement, not a source factual error.

Preserve chapter 01 `#w-channels` and `#wbs-tree`; chapter 02 `#w-model` and comparative process figure; chapter 03 NFR before/after card and traceability graphic; chapter 04 `#w-usecase`, relation illustration and narrative teaching figure. Add explanation around these and correct only identified inconsistencies. Preserve existing source-image zooms, flashcards, quiz controls, progress storage and no-JS content. Runtime verification belongs to implementation after edits.

## Proposed chapter 03 pilot acceptance criteria

1. Existing paragraphs/examples/figures remain available; new teaching is additive or a clearly justified correction.
2. User -> system refinement, NFR taxonomy/measurement, elicitation loop, structured record, story/criteria, prototypes/model purposes, SRS structure/readers, seven validation checks and change workflow each have a readable Thai explanation with a source page/range.
3. At least one end-to-end authored example connects need -> requirement ID -> structured record -> acceptance criterion -> validation issue/change impact, with assumptions labelled.
4. Source exercises p16, p39 and p67 remain recognizable as prompts; authored solutions are distinguished from source/official answers.
5. All image-derived additions cite their real page and describe what the original diagram/table shows. Do not claim the remaining text-only pages were visually verified.
6. Review source-note ranges after expansion; a broad citation range alone must not stand in for taught coverage.

Ready for additive implementation. Highest-value first step is chapter 03's missing visual/table content; next complete both Ex2 diagrams; then chapter 01 foundations/project schedule and chapter 02 source-case/diagram explanations.
