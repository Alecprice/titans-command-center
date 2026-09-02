# TENX Home Watchlist Route Review — 2026-09-02

## Scope

This pass fixes the existing My Player Watch Home shortcuts. Watchlist entries are account-synced through the existing My Titans namespace, but Home previously routed entries without a database UUID to the generic roster even when the player had been opened through the audited-name Player Intelligence path. Because synced/imported preferences can also outlive a roster snapshot, the fix revalidates every watched player against the currently loaded roster before creating a player route.

The change is intentionally isolated from open Fantasy, Legacy, Ticket, Game Day, and mobile-test branches.

## 1. Technical Program Manager

### Finding
The Home watchlist still contained the same UUID-only shortcut behavior removed from the Favorite Player card in the previous TENX pass.

### Boundary
Change only the existing watchlist module, its existing regression contract, focused TENX coverage, and this review document. Do not touch the open Fantasy account-sync work or any other feature owner.

## 2. Product Manager

### User outcome
A fan should be able to tap a watched current Titan and return directly to Player Intelligence whether the current roster path supplies a UUID or only an audited canonical player name.

### Acceptance criteria
- current loaded roster match + UUID -> `#player?id=`;
- current loaded roster match + no UUID -> `#player?name=` using the canonical loaded name;
- unmatched/stale watch entry -> `#roster` with Review roster copy;
- unresolved roster load -> explicit checking state;
- remove/watch behavior remains unchanged.

## 3. UX Researcher

### Finding
Watched players represent stronger intent than generic roster browsing. Sending audited-name players back to Team Room forces users to repeat a search they have already completed.

### Decision
Keep direct return behavior for verified current players while making stale entries visibly actionable instead of silently misrouting them.

## 4. UI Designer

### Decision
Retain the existing watchlist card system. Add only deterministic state treatment:
- `checking` while current roster identity is resolving;
- `verified` for direct Player Intelligence;
- `review` for stale/unresolved saved identities.

Review state receives a subtle warning-border/copy treatment without adding another Home panel or control row.

## 5. Software Architect

### Architecture
The watchlist continues to own no player identity database. It reuses:
- `titans:v15MyTitans` for bounded watchlist persistence;
- `TitansRuntime.apiJson('/api/data', { ttl: 30000 })` for current roster truth;
- existing UUID Player Intelligence routing;
- existing audited-name Player Intelligence routing.

A synced/imported watchlist name can never create a name route by itself. The route uses the canonical name from a matched loaded roster row.

## 6. Senior Engineer

### Implementation
Added a single cached roster resolution inside `my-player-watch-v36.js`:
1. load `/api/data` through shared runtime caching only when Home has watched players;
2. match by stored UUID first, normalized stored name second;
3. route with the canonical matched UUID or canonical matched roster name;
4. fail closed to Team Room when no current loaded match exists;
5. include roster-resolution state in the Home render signature so the initial checking state repaints once identity truth settles.

Existing watch/unwatch persistence and account-sync hooks are unchanged.

## 7. QA Engineer

### Regression coverage
Updated `tests/player-watchlist-v36.test.mjs` to require loaded-roster identity before direct Home routing.

Added `tests/tenx-home-watchlist-route-v127.test.mjs` covering:
- current roster revalidation;
- UUID-first routing;
- canonical audited-name fallback;
- stale/unresolved fail-closed behavior;
- reuse of audited Player Intelligence truth;
- no new provider/polling/lifecycle ownership;
- bounded mobile/touch/remove behavior.

## 8. Security Engineer

### Review
- Synced/imported names are treated as untrusted preference data for routing.
- `#player?name=` is emitted only from canonical loaded roster data.
- UUID and name route values are encoded with `encodeURIComponent`.
- Dynamic card/remove labels remain HTML escaped.
- No new external URL, credential, provider request, storage namespace, or privilege boundary is introduced.

## 9. DevOps / SRE

### Operational impact
The change adds no Worker, D1, auth, provider, dependency, workflow, runtime-loader, or service-worker work. It uses the existing shared `/api/data` 30-second runtime cache and only requests roster truth when watched players exist on Home.

Merge readiness requires the full Titans Quality Gate on a branch synchronized with current `main`. If parallel branches move `main`, the four-file feature diff must be overlaid onto the newest main tree and re-gated.

## 10. VP Engineering

### Merge decision
Approve only when:
- the diff remains isolated to the watchlist feature/tests/review document;
- current `main` is the merge base;
- all original watchlist and new TENX routing tests pass;
- the full content/security/syntax/Cloudflare checks pass;
- GitHub reports a clean merge state.

This pass is valuable because it improves a high-intent fan workflow while making account-synced preference routing more conservative, not less.
