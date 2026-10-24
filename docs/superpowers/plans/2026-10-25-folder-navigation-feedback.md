# Folder navigation feedback implementation plan

> **Follow-up:** The user's cached-navigation bug report supersedes the original delayed-spinner/fast-navigation behavior below. Current behavior acknowledges every activation immediately and allows one rendered frame before navigation. See `../../debugging/2026-10-25-cached-folder-navigation.md` for the reproduction and verification record.

> **For agentic workers:** Use executing-plans to implement this plan in the current session. Steps use checkbox syntax for tracking.

**Goal:** Immediately acknowledge folder navigation while preserving native links, existing artwork, and browser history.

**Architecture:** Extend the shared `assets/app.js` and `assets/library.css`. Delegate link activation from `.folder-card`, keeping the browser's default navigation; CSS owns visual feedback and its delayed spinner. Reset transient state on `pagehide` and `pageshow`, including BFCache restores.

**Tech stack:** Existing vanilla JavaScript/CSS and Playwright browser tests. No new dependencies.

**Spec:** User's Thai UX specification in this chat, 2026-10-25.

## Global constraints

- Keep idle layout, colors, sizes, and hover effects unchanged.
- Selected card: scale .98, slight darkening, freeze current folder/sheet transforms.
- Other folder cards: opacity .38 and slight desaturation, transitions .25s.
- Keep the arrow circle's responsive dimensions; fade its arrow and show a thin white ring after 120ms, rotating every .7s.
- Temporarily replace `.folder-meta` with `กำลังเปิดบทเรียน…`, with a gentle pulse.
- Fixed 2px progress gradient uses existing folder palette colors, quickly reaches 40%, settles at 90%, never completes itself.
- Reduced motion: slower spinner, no pulse/progress animation.
- Exclude modified/non-primary clicks, downloads, other browsing targets, cross-origin URLs, and same-document hash navigation.
- Prevent repeat activation across all folder cards while pending. Preserve keyboard and touch navigation.
- No artificial navigation delay, fetch, unload listener, library, or duplicated page handlers.

## Review focus

- Caption and nested arrow clicks must resolve the same owner card.
- Expanding a `<details>` folder is local interaction, not navigation; its child links do navigate.
- BFCache restore must restore text, frozen transforms, accessibility attributes, and animations.
- CSS spinner delay must avoid a flash during fast navigation.
- All pages must reference current shared asset hashes.

## Task 1: Shared feedback and regression coverage

**Files:** Modify `assets/app.js`, `assets/library.css`; create `tools/test-folder-navigation.mjs`; refresh existing HTML asset hashes with `tools/version-assets.mjs`.

**Interfaces:** Existing `.folder-card`, `.folder-meta`, `.folder-key`, `.folder-front`, `.folder-sheet`; transient `.is-navigating` on the selected card and `.folder-navigating` on body. No public JavaScript API.

- [x] Add browser coverage using a local HTTP server: inspect visual states with a final test-only canceled default action, and test actual native navigation separately with DevTools network throttling.
- [x] Run coverage before implementation and observe missing navigation feedback.
- [x] Implement delegated eligibility checks, duplicate blocking, accessible status, and lifecycle reset in `assets/app.js`.
- [x] Implement loading-only CSS, shared palette tokens, delayed spinner, progress, and reduced motion.
- [x] Verify mouse regions, keyboard, touch, exclusions, fast/slow navigation, progress cap, and real BFCache restoration.
- [x] Run existing course availability, university groups, exam navigation, and course progress regressions.
- [x] Refresh asset versions and run `node tools/check-assets.mjs`; inspect responsive light/dark screenshots and the final diff.

**Validation command:** `node tools/test-folder-navigation.mjs` (set `STUDY_GARDEN_PLAYWRIGHT` to an existing Playwright installation when needed).

## Verification record

- Navigation browser regression passes, including native Ctrl-click, 19–23ms fast navigation, native BFCache restores, keyboard/touch, and reduced motion.
- Slow 3G uses DevTools protocol (400ms latency, 500Kbit/s) with cache disabled. Recorded animation frames prove spinner opacity reaches at least .9 during the real pending request.
- Existing course availability, university groups, course progress, and exam navigation suites pass.
- 36 visual checks against HEAD across home/exam/lesson folders, light/dark, and 1440/390/320px pass. Hover geometry, transforms, and colors are identical; idle screenshot RMS error stays below 1/255 to allow existing 3D rasterization noise.
- All 745 asset references match content hashes. JavaScript syntax and whitespace checks pass.
- Independent read-only reviewer found no blocking issues; its optional slow-paint coverage suggestion was addressed with recorded real-navigation frames.
