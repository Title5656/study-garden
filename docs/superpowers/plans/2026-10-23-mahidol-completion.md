# Complete the Mahidol teaching revision

User instruction (2026-10-23): complete remaining work; retain Thermodynamics in its existing version and exclude its content from this revision. This supersedes the original four-course editorial scope and the bounded first batch.

## Execution

1. Complete ITDS241 chapters 06–08: sequential novice explanations across all teaching sections, runnable examples, terminology, practice, activity reset/static paths, assessment alignment.
2. Complete ITDS261 chapters 01–12: build on existing source audits and substantive lessons; prerequisites/glossary, reasoning and worked practice, summaries and explanations for distractors.
3. Complete ITDS294 chapters 01–10: chapter-specific explanations/practice, source checks, activity interpretation, summaries and assessment alignment.
4. Integrate: preserve original anchors/topics; update reading times and relevant asset hashes; do not rewrite Thermodynamics files. Verify all three courses in Chrome, static checks, examples, and numerical widgets. Check retained Thermodynamics for regression only.
5. Review all changes, fix findings, record per-chapter/source evidence and exact limitations, commit on existing `codex/teaching-redesign`. Prepare updated PR description. Prior GitHub integration returned 403 for PR creation; do not claim a PR exists.

## Rulings and evidence

- The brief is already approved; no new design approval is required.
- Use existing checkout/branch with the prior revision. Thermodynamics removal was reversed completely before this work; starting worktree was clean.
- Reuse source maps and selected-page inspections, add targeted figure checks. Do not claim every source page or exam topic is certified.
- ITDS261 and ITDS294 implementers have separate file ownership; root owns ITDS241, shared tooling, verification and report.
- Source examples and newly authored practice must be distinguished; source scans remain outside published artifacts.

## Completion record

- Tasks 1–3 applied to all 25 chapters; per-course reports identify changes and source limits.
- Task 4: original anchors preserved; 250 answer identities preserved; 588 learning topic checks, 942 ITDS261 layout checks, all required suites and retained Thermodynamics regression passed.
- Task 5: independent review issues fixed, scoped re-review and final whole-revision review passed without P1/P2 findings; report and updated PR description prepared.
- Two implementation agents stopped at usage limits after saving chapter/assessment edits. Root completed unfinished activity/reset/source-evidence/report work; this did not reduce the 25-chapter scope.
- Ruling: proceed with the already authorized branch commits/push, without a new integration-options question. Do not merge. The prior PR-creation permission error is documented rather than misreported as success.
