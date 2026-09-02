# TENX Home Favorite Picker Review — 2026-09-02

## Scope

Post-#396 Home personalization pass. The target is the unset Favorite Player handoff in `my-titans-home-v35.js` only. Parallel Legacy, Fantasy, Game Day, Tickets, and mobile-navigation PR ownership is intentionally excluded.

## 1. Technical Program Manager

Finding: the existing unset Favorite Player action linked to `#command`, but the actual one-tap favorite setter is attached to Player Intelligence after a fan opens a roster player. The change can remain isolated to the existing Home module plus regression coverage.

Decision: route unset favorite discovery to `#roster`; do not add a new deep-link router, storage key, provider, or Command Intelligence coupling.

## 2. Product Manager

Finding: `Set favorite →` implied that the destination would immediately let the fan set a favorite. `#command` can reopen any remembered Command Intelligence tab, so the promise was unreliable.

Decision: make the CTA accurately describe the next fan action: `Choose player →`, with supporting copy explaining that the favorite control is on the player page.

## 3. UX Researcher

Finding: the shortest existing task path is Home → Roster → Player Intelligence → `☆ Make favorite`. Sending the fan through Command Intelligence creates an unrelated intermediate workspace and depends on remembered tab state.

Decision: use the roster as the discovery step and preserve the existing Player Intelligence setter as the only write owner.

## 4. UI Designer

Finding: no new panel is required. The current Favorite Player primary surface already has sufficient prominence, focus treatment, and mobile geometry.

Decision: change destination and microcopy only. Preserve the current compact desktop row and horizontal phone summary.

## 5. Software Architect

Finding: Home currently reads `titans:v15MyTitans` but does not write it. That boundary is valuable because Player Intelligence already owns favorite mutations.

Decision: keep Home read-only. Do not write `titans:v15CommandTab`, do not introduce URL-tab orchestration, and do not create another personalization controller.

## 6. Senior Engineer

Implementation:

- unset favorite target: `#roster`
- unset helper copy: `Open a roster player and tap Make favorite`
- unset CTA: `Choose player →`
- saved verified favorites remain UUID-first with audited canonical-name fallback
- stale saved favorites remain fail-closed to Team Room

## 7. QA Engineer

Added `tests/tenx-home-favorite-picker-v134.test.mjs` to lock:

- direct unset-favorite routing to Team Room / Roster
- reuse of the existing Player Intelligence favorite setter
- unchanged current-roster verification and UUID-first routing
- stale-favorite fail-closed behavior
- Home read-only persistence boundary
- zero new provider/lifecycle ownership
- existing compact accessibility geometry

Existing My Titans and favorite-route regressions remain authoritative for the broader surface.

## 8. Security Engineer

No new URL protocols, external destinations, HTML insertion sources, persistence writes, account data, auth boundaries, API endpoints, or secrets. Dynamic favorite identity remains escaped and current-roster verified before direct Player Intelligence routing.

## 9. DevOps / SRE

No new runtime request, polling cadence, observer, timer, service-worker asset, dependency, Worker route, D1 operation, or deployment workflow. The change reuses an already-shipped route and already-shipped Player Intelligence control.

## 10. VP Engineering

Ship criterion: the focused regression and the complete Titans Quality Gate must pass on a branch synchronized to current `main`. Merge readiness also requires an exact intended-file diff, `behind_by = 0`, and GitHub `mergeable_state = clean`.

## Fan outcome

A fan with no favorite selected now gets the shortest truthful setup path instead of being sent into an unrelated Command Intelligence tab. The existing data, trust, persistence, and Player Intelligence ownership model remains unchanged.
