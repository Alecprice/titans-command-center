# Repository Development Workflow

TENX is the standard development workflow for this project.

## Workflow
1. Review repository state, recent pull requests, CI results, production checks, and `.tenx/PROJECT.md`.
2. Verify current external platform/API/security details from primary documentation when they affect the change.
3. Prioritize production failures first, then reliability/usability, feature work, and polish/refactoring.
4. Use a dedicated branch and keep each pull request focused on one coherent outcome.
5. Run the project's existing `npm run check` gate before review for code changes unless the change is docs-only.
6. Use production regression/smoke scripts when runtime behavior is affected.
7. Pull requests should state the problem, implementation, verification, risks, and rollback path.
8. Update `.tenx/PROJECT.md` when priorities, critical flows, or release assumptions materially change.

## Engineering rules
- Preserve working production behavior unless a task intentionally changes it.
- Prefer root-cause fixes with regression coverage.
- Keep credentials, tokens, local secrets, and production data out of source control.
- Reuse existing Cloudflare/release checks rather than replacing them with weaker gates.

## Completion standard
Work is complete when the intended outcome is implemented, the relevant checks pass or any failure is understood and documented, and runtime behavior is verified where practical.