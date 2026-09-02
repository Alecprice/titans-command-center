# TENX Home Favorite / Watchlist Deduplication — 2026-09-02

## 1. Technical Program Manager

### Finding
The merged Home personalization stack now has truthful ownership, but the same fan identity can still occupy multiple adjacent Home surfaces when the Favorite Player is also in the watchlist.

### Decision
Keep storage and feature ownership unchanged. Deduplicate only the Home Watchlist presentation against the already-primary Favorite Player surface.

### Scope
- `my-player-watch-v36.js`
- focused regression coverage
- update the v135 hydration contract for the stronger presentation-list rule
- no Ticket, Fantasy, Legacy, Game Day, API, Worker, D1, auth, service-worker, or route changes

## 2. Product Manager

### Fan problem
A fan who makes a player their favorite and also taps Watch can see the same player immediately in My Titans and again in the Watchlist rail. That repetition consumes Home space without adding a new decision.

### Product rule
My Titans owns Favorite Player identity. Home Watchlist should represent additional tracked players beyond that primary identity.

The saved watch state is still meaningful outside Home and must not be rewritten.

## 3. UX Researcher

### Friction
Repeated identity cards make the personalization stack feel busier and make Watchlist appear to offer less incremental value.

### Improved flow
- Favorite Player remains visible in My Titans.
- If the favorite is also watched, the Home Watchlist does not repeat that card.
- Additional watched players remain directly accessible.
- If the favorite is the only watched player, Watchlist explains that the favorite is already pinned and invites the fan to track another player.

## 4. UI Designer

### Hierarchy
No new component is introduced.

The existing Watchlist card rail remains visually and behaviorally unchanged for secondary players. Existing 44px actions, phone rail sizing, focus treatment, and reduced-motion behavior remain intact.

Metadata becomes more informative when a favorite is also watched, for example:
- `Favorite already pinned · 1/8 tracked`
- `2 beyond favorite · 3/8 tracked`

## 5. Software Architect

### Ownership
- `titans:v15MyTitans` remains the only profile namespace.
- Favorite Player ownership remains in the established My Titans / Player Intelligence flow.
- Watchlist writes remain owned by Player Watch.
- Player Impact continues to deduplicate favorite + watch intent independently.

### Presentation boundary
A derived `visibleList` is computed only inside Home mounting. It never replaces or writes the persisted watchlist.

### Data loading
Roster hydration is required only for watched players that actually render in the Home rail. A favorite-only duplicate therefore does not trigger `/api/data` from Player Watch.

## 6. Senior Engineer

### Implementation
- add normalized exact-name equality helper
- derive whether Favorite Player is already watched
- derive a Home-only secondary `visibleList`
- render and route only `visibleList` entries on Home
- retain full saved `list` for player-page Watch pressed state, persistence, counts, events, and other consumers
- avoid roster hydration until at least one secondary watch entry is visible

No fuzzy identity matching is added.

## 7. QA Engineer

### Regression contracts
The v136 suite verifies:
1. Favorite Player duplicate is removed from Home presentation only.
2. Saved watch intent is not rewritten.
3. Player-page Watch toggle still reads full saved state.
4. Favorite-only duplicate does not trigger roster hydration.
5. Home copy truthfully explains the pinned favorite and secondary count.
6. Player Impact keeps its independent favorite/watch dedupe.
7. No new state, network, or lifecycle owner is introduced.

The v135 onboarding test is strengthened so roster hydration depends on the visible secondary list rather than raw saved-watch count.

## 8. Security Engineer

No security boundary changes.

- no new input surface
- no new provider or external request
- no new URL construction path
- no new storage namespace
- existing HTML escaping remains in place
- existing current-roster verification still gates direct watched-player Player Intelligence routes

## 9. DevOps / SRE

### Reliability / cost
This is neutral-to-positive operationally:
- fewer redundant Home cards
- one avoidable shared `/api/data` request is skipped when the only watch entry duplicates Favorite Player
- no cache generation or service-worker change
- no timer, observer, polling, or background task

Full Titans Quality Gate remains required on the synthetic PR merge.

## 10. VP Engineering

### Approval criteria
Approve only if:
- Favorite Player remains the primary Home identity
- watch storage is untouched by deduplication
- secondary watched-player routing remains current-roster verified
- Player Impact behavior remains intact
- no new architecture owner appears
- current full Titans Quality Gate is green
- PR is synchronized with current `main`
- GitHub raw merge state is clean

This is a density and hierarchy improvement, not a new personalization system.
