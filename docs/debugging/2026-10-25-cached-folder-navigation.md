# Cached folder navigation acknowledgement

## Report and revised behavior

After opening a course, going Back, and selecting the same course, loading feedback appeared to stop. The user wants an acknowledgement on every activation, including previously visited courses. This supersedes the original 120ms spinner delay and expectation that fast navigation has no spinner.

## Investigation ledger

| Experiment | Observation | Conclusion |
| --- | --- | --- |
| Debugger plus eight native navigations through two courses | The delegated handler starts on every click; actual BFCache restores clear disabled/busy state. Cold documents take roughly 300–400ms, cached revisits 12–16ms. | Neither a lost listener nor stale BFCache state explains the symptom. |
| Capture animation frames before pagehide | Cold navigation paints the ring. Cached navigation has zero to two frames and no visible ring, before its 120ms delay and 200ms fade. | Navigation leaves before acknowledgement becomes visible. |
| Add repeat-navigation regression before implementation | Every cached revisit fails the rendered-feedback assertion. | Reproduces the reported bug independently of state flags. |
| Immediate feedback and one render opportunity before leaving | All eight mouse/arrow/caption/keyboard activations paint the correct card, ring, text, and muted siblings, including cached revisits. | The fix covers the visible result rather than merely setting classes again. |
| Reviewer checks the newly deferred navigation | A non-persisted initial pageshow between click and render callback cancels a valid activation; added test fails. | Reset only restored pages on pageshow; initial state is already clean. Test passes after the fix. |
| Lifecycle reset before the queued callback | Persisted reset cancels the old destination; a subsequent different card navigates correctly. | No stale queued redirect survives reset. |
| Already-hidden and newly-hidden document with paused frame callbacks | Both navigations finish. | Background rendering cannot strand a pending activation. |

## Implementation

- The shared eligibility checks still exclude modified/middle clicks, other browsing targets, downloads, external origins, and same-document hashes.
- Selected card, spinner, text, and muted siblings appear immediately. Progress begins at 40% and still caps at 90%; the reduced-motion ring stays slower.
- Eligible clicks wait for two nested requestAnimationFrame callbacks, allowing a rendering opportunity between activation and location.assign. There is no fixed-duration timer, simulated network wait, or minimum loading duration.
- Pending callbacks and destinations are canceled during reset. pagehide cleans the outgoing page; persisted pageshow resets BFCache restores. Initial pageshow leaves a valid early activation intact.
- Hidden documents finish navigation immediately because their rendering callbacks can pause.

## Verification

- `node tools/test-folder-navigation-repeat.mjs`: actual cached revisits and BFCache, eight mouse/arrow/caption/keyboard activations with visible frame samples; queued reset, initial pageshow, and background completion pass.
- `node tools/test-folder-navigation.mjs`: feedback visuals, repeated-click blocking, progress cap, exclusions/new tabs, touch/reduced motion, actual fast navigation and DevTools Slow3G pass.
- Course availability, university groups, course progress, and exam navigation regression suites pass. University groups now explicitly awaits the destination URL before counting destination cards.
- All 36 idle/hover visual checks against the previous commit pass across home/exam/lesson folders, light/dark themes, and 1440/390/320px. All 745 asset references use their current content hashes.
- Existing unrelated README/screenshots are excluded from the fix.
