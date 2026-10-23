# ITDS241 complete editorial pass — 2026-10-23

This pass finishes the three Mahidol chapters beyond the earlier selected-example batch. It preserves the original topic sections and source references. It does not certify that every slide line or possible exam question has been reproduced.

| Chapter | Teaching changes | Practice / activity purpose |
|---|---|---|
| 06 | Questions and everyday reasoning before web roles, objects, operators, loops and game state; callback explained before array methods; trace of map/filter/reduce and branch ordering; standalone loop initializes its limit; connected summary retained | Price tracer retained; grade 72/70/69 identifies branch boundaries; 1–3 loop produces 6; static loop trace and Tic-tac-toe click sequence explain termination and win-before-draw |
| 07 | Callback invocation vs passing, environment lifetime, separate closure instances, class initialization/inheritance, DOM tree terminology, event registration; glossary moves prototype/interface/hoisting before use; complete runnable HTML for DOM, events and summation | Exact copied HTML tested in Chrome; keyboard click and blank/zero input checks; DOM reset restores actual initial nodes, input and counter; static closure sequence 1,2,1 |
| 08 | Problem-led feature selection, rest/spread tracing, iterable/iterator, own/enumerable property terms, lazy/encoding/precision definitions, nullish decision reasoning; JSON/stringify explained before example; connected summary retained | Rest/spread output verified; nullish 0 vs fallback verified; reset returns to 0; Promise states retain existing control/static interpretation; copy-vs-mutation self-check |

## Source topic coverage

Page numbers below mean physical PDF pages. Source heading/text inventory inspected across all three PDFs; visual verification is limited to the explicitly listed pages. Existing teaching diagrams are reused and interpreted; newly authored examples are labelled in the chapter introduction and are not instructor answers.

| Source | Topics → destination | Visual pages checked across both passes |
|---|---|---|
| Lecture06 (78 pages) | 3–15 Tic-tac-toe → `#game`; 17–24 web roles/scripts → `#big-picture`; 25–39 declarations/types → `#variables`; 40–48 objects/arrays → `#objects`; 49–65 operators/decisions → `#operators`; 66–77 repetition → `#loops` | 13, 24–30, 47, 63, 70 |
| Lecture07 (69 pages) | 3–9 functions/parameters → `#functions`; 14–22 first-class/callback → `#callbacks`; 23–30 scope/closure → `#scope`; 10–13 and 31–42 constructors/class/inheritance → `#oop`; 43–61 DOM tree/selection/mutation → `#dom`; 62–67 events/input → `#events` | 3, 5, 7, 14, 21, 30, 40, 47, 48, 59 |
| ECMAScript updated 2026Aug06 (124 pages) | 4–9 versions → `#standard`; 10–20,44–45 promises/async → `#async`; 21–33 templates/default/rest/spread/collections → `#es2015`; 34–59,63–81 yearly features → `#timeline`; 60–62,68–71 default/optional access → `#nullish`; 82–123 newer APIs/proposals → `#recent` | 10–12,19,25,26,44–45,60,81,105 |

The remaining pages were not all visually certified. Sources stay in their existing locations; contact sheets are local work notes, not new public slide copies. Chapter 08 uses the ECMAScript PDF mapped in the manifest, not an invented missing Lecture08 source.

TC39 finished-proposals was rechecked on 2026-10-23: [official list](https://github.com/tc39/proposals/blob/main/finished-proposals.md). The existing Temporal note (finished, expected 2027 publication) remains supported. Standardization and browser support are explicitly separated.

## Verification and review

- `test-teaching-examples.mjs`: nine exact authored JavaScript examples, with isolated execution and expected output; 30 quiz contracts.
- `test-teaching-redesign.mjs`: exact complete HTML examples, keyboard operation, blank/zero input, DOM and nullish reset, plus existing reading/history/theme/no-JS checks.
- Independent review found incomplete DOM fixtures and late term definitions; both were fixed and scoped re-review passed.
- Existing 30 quiz explanations and reordered answer identities from the prior batch retained; added practice reinforces those same tested concepts.
- Reading-time estimate recalculated by `update-reading-time.mjs` after editing; estimate includes static teaching and activity allowance, not quiz completion time.
