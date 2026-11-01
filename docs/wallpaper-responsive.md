# Responsive wallpaper

The shared stylesheet uses five aspect-ratio families, in both themes:

| Viewport ratio (width / height) | Artwork |
| --- | --- |
| Below 0.65 | mobile, 900 × 1950 |
| 0.65 to below 1 | tablet portrait, 1200 × 1600 |
| 1 to 1.5 inclusive | tablet landscape, 1600 × 1200 |
| Above 1.5 to below 2 | original landscape, 1672 × 941 |
| 2 and above | ultrawide, 2100 × 900 |

At the 0.65 boundary the later tablet rule wins. Square viewports use
tablet landscape. Families follow the viewport, including split-screen and
rotation, rather than user-agent or device-name detection.

Images live in `assets/background-{light,dark}-{mobile,tablet,tablet-landscape,ultrawide}.webp`.
Original landscape images are preserved. New images were edited with the built-in
imagegen tool using the matching original theme as the edit target, then exported
as WebP quality 85. Generation prompts requested the target aspect ratio,
preservation of the original palette, paper textures, layered clouds, stars and
shadows; recomposition rather than stretching; the sun at upper left or moon at
upper right clear of navigation; an empty central 65% for reading; and no text,
UI or border. Landscape additions place the sun/moon at x20%/80%, y23%.

The wallpaper is a non-interactive fixed body pseudo-element in an isolated
stacking context. Height uses 100lvh (100vh fallback) so browser toolbar movement
does not continuously resize the artwork. Existing tint variables still apply.
Print hides the layer. Footer artwork and layout remain separate.

## Verification

Run `node tools/version-assets.mjs`, `node tools/check-assets.mjs`, then
`node tools/test-wallpaper.mjs` with `STUDY_GARDEN_PLAYWRIGHT` set if Playwright
is not locally installed. The browser test covers both themes across catalog,
course and lesson pages; portrait, landscape, split-screen, 16:9, 16:10, 21:9,
32:9; scrolling, rotation, theme-toggle hit testing and print.

Before/after screenshots are written outside the repository to
`../work-notes/wallpaper-qa/`. Real iOS Safari toolbar behavior still requires
an iPhone/iPad hardware check; desktop Chrome emulation does not prove it.
