# Garden Footer Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan in this session. The initial request authorized implementation; the subsequent user request explicitly authorized commit, push, and deployment through the existing GitHub Pages main-branch source.

**Goal:** Apply the requested Garden footer throughout both subjects and correct the home page's cropped arm artwork.

**Architecture:** Keep the existing static HTML, GitHub heading/button, navigation, theme colors, and reader.js curtain. Replace subject artwork with the published Ink Garden media and mount the supplied halftone particle effect only on the lower Garden wordmark. Scope home artwork sizing separately.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Canvas 2D; Chromium browser checks.

**Spec:** `C:/Users/wpras/Desktop/footer update/read first.txt`, then `CODEX_HANDOFF.md` and the supplied V3 ZIP where consistent.

## Global Constraints

- read first.txt overrides the handoff: all 15 subject and chapter HTML pages receive the new footer.
- Keep the original GitHub heading, Title5656 pill, and three course navigation pills as in picture 2. Do not add picture 1's upper link columns.
- Remove the subject ribbon and Creation of Adam artwork. Use Ink Garden with translucent colors matching the current theme.
- The lower wordmark is exactly `Garden`, with raised baseline and pointer interaction from the supplied V3 canvas.
- Keep the original root footer, including its ribbon and Study Garden wordmark; change only arm-art sizing/masking.
- Preserve lessons, flashcards, quizzes, keyboard navigation, reduced motion, and print behavior.
- No React, build step, or runtime CDN dependency for the footer.

## Review Focus

- Canvas and video stop while hidden, covered, paused, or under reduced motion.
- Curtain inert state permits keyboard access as links become exposed.
- Short phone and landscape viewports keep links and Garden separated.
- JavaScript or Canvas failure leaves readable fallback text and working links.
- Hash-versioned local assets remain valid on nested pages.

### Task 1: Subject Garden footer

**Files:** All HTML in subjects/itds241 and subjects/itds294; assets/study-halftone-footer.js, assets/study-halftone-footer.css; assets/ascii/ink-garden.jpg and .mp4; assets/reader.js; tools/test-footer.mjs; tools asset version/check scripts.

- [x] Add browser checks using real subject/chapter pages: exact Garden label, original GitHub URL, no ribbon/old art/upper columns, valid local flower media, visible Canvas ink, unclipped navigation, curtain inert/focus behavior, pointer displacement, pause and reduced motion.
- [x] Run checks on the original site and confirm the new-footer assertions fail.
- [x] Adapt the supplied V3 renderer to enhance the existing footer's lower wordmark; blend the published flower media into light/dark themes. Integrate motion lifecycle with reader.js and retain a text fallback.
- [x] Load the renderer before reader.js on all 15 nested pages, without replacing their content or original GitHub markup.
- [x] Run the browser checks at desktop, 390px and 320px phone, and short landscape sizes. Save and inspect representative screenshots in both themes.

### Task 2: Home artwork framing and final verification

**Files:** assets/reader.css; index.html (asset hashes only); assets/ascii/README.md; tools/test-footer.mjs.

- [x] Capture the original home footer and confirm its too-small image frame/cropping.
- [x] Enlarge and reposition only body[data-all-courses] .footer-art, fading its image edges before the lower wordmark.
- [x] Verify root markup/links/wordmark remain original, the artwork is larger, no horizontal overflow occurs, and the artwork ends above the wordmark.
- [x] Run node tools/version-assets.mjs, node tools/check-assets.mjs, JS syntax checks, and the full browser suite.
- [x] Review the final diff and runtime behavior, resolve material findings, and deliver screenshots plus the local changes.

## Verification results

- Final real-Chromium suite: 39 passed, 0 failed. Covers all 15 nested pages, five viewport sizes in both themes, pointer effects, pause/covered curtain, reduced motion, and static fallbacks.
- Independent read-only review: no actionable findings; 20 additional phone/short-height boundary combinations passed.
- Asset checker: 281 references passed; changed JavaScript syntax and git diff whitespace checks passed.
- Compared HTML against HEAD: root body/footer markup and all subject/lesson content before the footer remain identical.
- Initial delivery left the work uncommitted on codex/garden-footer. The user subsequently authorized push and deployment; GitHub Pages is configured to publish from main at the repository root.
