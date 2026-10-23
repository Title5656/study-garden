# Node.js Part I — implementation and verification

User-approved scope: implement the supplied Part I only; short topic pages with Previous/Next; retain Study Garden's typography, colors, folders and theme; avoid decorative panels. Part II is deferred by the user's explicit reply.

Source: `subjects/itds241/part1-nodejs-intro/content.md` (copy of supplied content, with documented technical corrections in the generated lesson). No slide images.

Tasks:
1. Add chapter 09 and short-page reading as an opt-in extension to the existing reader. Preserve all original section anchors and behavior elsewhere. HTML remains readable without JavaScript and in print.
2. Implement all 10 supplied activity blocks, original chapter quizzes, flashcards, and a scored 10-question final quiz using existing progress conventions. Validate parsers, simulations and navigation with behavioral tests.
3. Connect course/home navigation and asset versions; verify local links, existing regressions, desktop/mobile, light/dark, history, keyboard, printing, storage, and no-JavaScript fallback; fresh reviewer checks the complete diff.

Shared interfaces: chapter 09 reads the existing reader, app, and StudyContent schema. Opt-in pagination must not alter older continuous lessons. Scored final quiz remains out of 10 for the course dashboard.

Implementation decisions: use vanilla HTML/CSS/JS as the existing site; preserve the supplied Markdown alongside the generated page; split at subsections, activities and quizzes, then subdivide unusually long examples; self-assessed open questions are labeled separately from automatically graded multiple-choice scores.
