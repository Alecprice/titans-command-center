# TENX Restart and Multi-Agent Recovery

This project must remain recoverable from GitHub even if a chat, browser session, or agent stops unexpectedly.

## Durable checkpoint rule

Do not keep meaningful work only in conversation state.

For every TENX pass:
1. Re-read current `main` and open pull requests before choosing a lane.
2. Create a dedicated branch from the current `main` SHA.
3. Make the first coherent change as a Git commit early in the pass.
4. Open a draft or normal pull request once there is a meaningful checkpoint. The open PR is the durable work claim.
5. Continue in small coherent commits. CI and PR state, not chat history, are the recovery source of truth.
6. Before handing off or merging, re-check current `main`, exact changed-file overlap, mergeability, and the exact-head quality result.

## Collision rules

- Exact changed-file overlap with another open PR is blocking. Consolidate, rebase, or close one lane before merge.
- Same product area with different files is advisory. Inspect both PRs for shared ownership, event contracts, selectors, storage keys, API boundaries, and release assumptions.
- Generated `docs/CLOUDFLARE_STATUS.md` is not treated as an agent claim.
- An open PR with no update for more than 24 hours has an expired area claim. It remains relevant for exact-file overlap and must not be silently overwritten.
- Never use a long-lived local checkout or remembered chat SHA as proof that a branch is current.

## Restart procedure after a hung chat

A new chat or agent should not try to reconstruct private reasoning from the dead session. Instead:
1. Fetch current `main`.
2. List open PRs and identify the prior branch/PR by title, scope, or changed files.
3. Read the prior PR body, commits, CI status, and changed-file list.
4. Compare that branch with current `main`.
5. If the prior PR is still valid and collision-free, continue on it; otherwise start a fresh branch from current `main` and carry forward only verified changes.
6. Re-run the normal Titans Quality Gate and production regression checks appropriate to the change.

## Scope discipline

Prefer short TENX iterations that end in a mergeable PR over multi-day chat sessions. Production failures and P0/P1 regressions take precedence, but each PR should still own one coherent outcome.

The `TENX Coordination Guard` workflow enforces exact-file collision detection and reports active same-area and stale work on every PR.
