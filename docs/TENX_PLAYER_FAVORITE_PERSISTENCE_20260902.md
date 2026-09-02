# TENX · Player Favorite Persistence Truth · 2026-09-02

## 1. Technical Program Manager

The merged Home work now gives Favorite Player a clear first-class role, but the actual Player Intelligence setter could still claim success when browser persistence failed. The fix must stay isolated from active Fantasy, Legacy, Game Day, Tickets, and mobile work.

Scope is deliberately narrow: repair the existing setter, add focused regression coverage, and leave the persistence namespace and account-sync architecture unchanged.

## 2. Product Manager

A favorite control is a promise that the fan's choice was saved. When storage is unavailable, changing the button from `☆ Make favorite` to `★ Favorite` is false confirmation.

Product requirement: never display the new saved state unless the current write succeeds. A failed add or remove must clearly explain the state that still exists and allow retry.

## 3. UX Researcher

The current failure mode is especially confusing on restricted/private storage environments because the interaction appears successful until a later page load reveals that nothing changed.

The least disruptive recovery is in-place feedback on the same control. The fan should not be sent to another page, modal, or account workflow for a device-local storage failure.

## 4. UI Designer

Keep the existing Player Command Center control and visual hierarchy. Use state-specific button copy on failure:

- failed add: `☆ Favorite not saved · retry`
- failed remove: `★ Favorite still saved · retry`

The button keeps its prior `aria-pressed` state. `aria-live="polite"` makes the changed failure copy announceable without a new status panel or layout block.

## 5. Software Architect

`titans:v15MyTitans` remains the only Favorite Player persistence namespace. `setJson()` already exposes the correct boolean boundary; the bug is that the caller ignores it.

Do not add a new storage key, API, account field, provider, route, observer, timer, global event bus, or duplicate favorite owner. Fix the existing owner at the point where it already writes.

## 6. Senior Engineer

Implementation contract:

1. capture `const saved=setJson(PROFILE_KEY,next)`
2. if `saved` is false, keep the prior `aria-pressed` value
3. show state-specific retry copy and an explicit accessible label
4. return before any success-state mutation
5. on success, clear the temporary failure label
6. restore the existing canonical favorite/unfavorite text and pressed state

The existing favorite data shape and successful behavior remain unchanged.

## 7. QA Engineer

Focused regression `tests/tenx-player-favorite-persistence-v138.test.mjs` locks:

- the existing boolean storage helper remains authority
- write result is checked before UI state mutation
- failed persistence cannot change `aria-pressed`
- failed add/remove copy is truthful and retryable
- successful writes restore canonical control copy
- no new preference namespace or provider endpoint ownership

The full Titans Quality Gate is still required after the focused contract is added.

## 8. Security Engineer

This change does not introduce credentials, remote writes, new URL handling, HTML from untrusted sources, or account authorization paths. It reduces misleading local state when storage APIs reject access.

No preference value is exposed in error copy; the message only states whether the requested local persistence action succeeded.

## 9. DevOps / SRE

No Cloudflare Worker, D1, workflow, service worker, dependency, provider quota, polling cadence, or network request changes are required.

Operational success is therefore measured by source-level regression plus the existing repository-wide test, audit, secret-scan, syntax, Cloudflare build, and offline-shell verification chain.

## 10. VP Engineering

Merge readiness requires all of the following on the current base:

- focused favorite persistence regression green
- full Titans Quality Gate green
- current `main` race check after the gate
- `behind_by = 0`
- exact intended changed files only
- raw GitHub `mergeable=true`, `rebaseable=true`, `mergeable_state="clean"`

A green gate on a stale base is not sufficient; resync and rerun if `main` moves.
