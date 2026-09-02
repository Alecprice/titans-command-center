# TENX Home Favorite Player Route Review — 2026-09-02

## Scope

This pass fixes the existing My Titans Home favorite-player shortcut. A saved favorite was already verified against the loaded roster, but a confirmed player without a database UUID still fell back to the generic roster even though the application has an established audited-name Player Intelligence route. The change is Home-only and avoids Tickets, Legacy, Game Day, data providers, D1, authentication, runtime loading, and service-worker ownership.

## 1. Technical Program Manager

### Finding
The Home favorite card advertised “Jump straight back into Player Intelligence,” but `favoriteTarget()` returned `#roster` whenever the matched loaded roster row lacked an `id`.

### Boundary
Keep the existing My Titans preference namespace and shared `/api/data` load. Do not create a new player identity registry or widen the project into Player Intelligence internals.

## 2. Product Manager

### User outcome
A fan who saves a current Titans player should get back to that player’s intelligence page when the application can verify the player from its loaded roster, regardless of whether the current data path supplies a UUID.

### Acceptance criteria
- loaded roster match + id -> existing `#player?id=` route;
- loaded roster match + no id -> existing `#player?name=` audited route;
- no loaded roster match -> fail closed to `#roster`;
- stale/unresolved favorites must not be described as guaranteed Player Intelligence links.

## 3. UX Researcher

### Finding
A generic roster fallback adds an avoidable search step for users who already told the app which player they care about. More importantly, the old CTA and destination could disagree.

### Decision
Use direct Player Intelligence only after roster identity is confirmed. During unresolved identity, say the app is checking. If the saved favorite is no longer on the loaded roster, explicitly offer “Review roster.”

## 4. UI Designer

### Decision
Keep the existing My Titans card visual system. Change only the favorite card’s stateful copy/action and expose a small `data-my-titans-favorite-state` hook (`verified`, `review`, `unset`) for deterministic behavior/testing.

No new panel, modal, icon system, or mobile layout is introduced.

## 5. Software Architect

### Architecture
`my-titans-home-v35.js` remains the sole owner of this shortcut. It reuses:
- `titans:v15MyTitans` for the saved favorite;
- `TitansRuntime.apiJson('/api/data', { ttl: 30000 })` for current roster identity;
- the existing `#player?id=` route;
- the existing `#player?name=` audited fallback route in Player Intelligence.

The raw saved preference is never used directly to manufacture a name route. The route name comes from the canonical matched roster row.

## 6. Senior Engineer

### Implementation
Added a normalized roster lookup and changed `favoriteTarget()` to:
1. return `#command` when no favorite exists;
2. find an exact normalized loaded-roster match;
3. return `#roster` if no match exists;
4. prefer the matched row’s id when present;
5. otherwise encode the matched row’s canonical name into `#player?name=`.

The card now derives its detail and CTA from the resolved destination so stale data cannot claim a direct player page.

## 7. QA Engineer

### Regression coverage
Updated `tests/my-titans-home-v35.test.mjs` so its original “loaded roster identity rather than guessing” contract explicitly accepts the established audited-name route only after a loaded match.

Added `tests/tenx-home-favorite-route-v126.test.mjs` covering:
- canonical loaded roster name routing;
- UUID-first behavior;
- stale favorite fail-closed behavior;
- truthful unresolved/stale copy;
- reuse of Player Intelligence audited-name support;
- no new persistence/network/lifecycle ownership;
- existing mobile/focus contracts.

## 8. Security Engineer

### Review
- Dynamic route values use `encodeURIComponent`.
- A stored favorite string alone cannot create a `#player?name=` route.
- Canonical route identity must come from a loaded roster row.
- Existing HTML escaping remains in place.
- No new external URL, credential, storage write, or data exposure is introduced.

## 9. DevOps / SRE

### Operational impact
No Worker, D1, provider, workflow, dependency, runtime loader, or service-worker file changes are required. The existing My Titans asset is already loaded and packaged offline. This is a network-neutral routing correction using the existing shared 30-second API cache.

## 10. VP Engineering

### Merge decision
Approve only if the full Titans Quality Gate passes on a branch synchronized with current `main`, the diff stays limited to the My Titans feature/tests/review documentation, and GitHub reports a clean merge state. Any parallel `main` movement requires a resync and fresh gate before merge readiness is claimed.
