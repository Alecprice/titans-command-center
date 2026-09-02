# TENX Home Personalization Density Review — 2026-09-02

## Scope

This pass reduces the vertical cost of the already-merged Home personalization stack without changing its data, identity, persistence, routing, or lifecycle ownership. The existing **My Titans**, **Player Watch**, and **My Player Impact** modules stay authoritative for their current responsibilities. Game Day retains the complete Player Impact experience.

The implementation is intentionally isolated from active parallel Legacy, Fantasy, Tickets, Game Day, and mobile-gate pull requests.

## 1. Technical Program Manager

### Finding

The merged Home hierarchy is much cleaner after Launchpad, Resume, Season Lens, and Fan Pulse consolidation, but the lower personalized stack can still expand dramatically for an engaged fan:

- My Titans Home: three shortcut cards;
- Player Watch: up to eight watched-player cards;
- My Player Impact: favorite plus watched players, up to nine impact cards.

On phones, the previous Watch and Impact layouts collapsed to one card per row. A fully personalized fan could therefore receive a long card wall before reaching later Home content.

### Boundary

Change only the existing Watch and Impact presentation modules, their original regression tests, one focused TENX regression file, and this review. Do not touch account sync, Player Intelligence, Fan Intel, Worker routes, service-worker ownership, Game Day modules, or parallel feature files.

## 2. Product Manager

### User outcome

Personalization should help a returning Titans fan scan faster, not make Home longer simply because they use more features.

Acceptance criteria:

- watched players remain immediately accessible and removable;
- all eight existing watch slots remain available;
- current-roster verification continues to gate direct Player Intelligence routing;
- Home expands Player Impact cards only when there is something actionable or identity needs review;
- quiet followed players remain represented by truthful aggregate copy;
- unavailable player-change feeds are never summarized as “nothing changed”;
- Game Day keeps the complete followed-player context;
- no new preference or data owner is introduced.

## 3. UX Researcher

### Finding

Player Watch and My Player Impact answer different questions:

- **Watch:** “Which players do I care about?”
- **Impact:** “Did anything relevant change for them?”

Rendering every watched player as a full vertical card and then rendering the same player again as a full impact card creates repetition rather than useful depth.

### Decision

Use Player Watch as a compact quick-access rail. Treat Home Player Impact as an exception surface: expand changed/review-needed players and summarize quiet followed players. Preserve the richer complete list on Game Day, where player context has higher situational value.

## 4. UI Designer

### Player Watch

- reduce section padding, margin, shadow, and card height;
- use a horizontal grid rail with snap points;
- keep names, current route state, and remove action visible;
- use `82vw` phone cards so the next item peeks into view and communicates horizontal scroll;
- retain 44px player-link and remove-control floors;
- add “swipe or scroll” as explicit discoverability copy.

### Player Impact

- keep existing visual language and review-state treatment;
- compact only the Home surface;
- show full cards only for flagged changes or roster-review needs;
- represent quiet followed players in one low-weight summary block;
- preserve the full grid on Game Day.

## 5. Software Architect

### Existing owners retained

- personalization namespace: `titans:v15MyTitans`;
- Watch list cap: eight players;
- Player Impact followed cap: nine identities including favorite;
- current roster authority: shared `/api/data` cache;
- player-specific impact evidence: existing `/api/data` + `/api/fan-intel` caches;
- route truth: current roster UUID first, audited canonical-name fallback, Team Room recovery for unresolved identities;
- lifecycle: existing `TitansRuntime.onRoute`, `onAppRender`, and Impact `onRefresh` hooks.

### Presentation contract

For Home only:

1. Watch renders every saved player in the same bounded order as a horizontal rail.
2. Player Impact computes all followed-player truth exactly as before.
3. `flagged` remains review-needed OR a loaded injury, transaction, depth change, or non-active roster status.
4. Home renders only flagged impact cards.
5. Quiet verified followers are summarized by evidence availability:
   - loaded player-specific feeds with no flagged change;
   - player-specific change feeds unavailable.
6. Game Day renders the complete `impacts` array unchanged.

No new route, fetch, provider, persistence namespace, timer, observer, or backend contract is introduced.

## 6. Senior Engineer

### Implementation

`my-player-watch-v36.js`

- replaces Home’s 4/2/1-column Watch grid with a horizontal grid rail;
- sets `data-home-layout="rail"` for deterministic presentation state;
- preserves all route verification, removal, account-sync marker, and eight-player cap behavior;
- adds reduced-motion-safe scroll behavior.

`my-player-impact-v38.js`

- separates `hasSignal` from aggregate `flagged` state;
- records whether at least one player-specific evidence feed is available;
- adds `homeSummary()` for quiet followed players;
- Home filters `impacts` to `impact.flagged` before card rendering;
- Game Day continues to use the complete impact list;
- compact Home styling is scoped by `data-surface="home"`.

## 7. QA Engineer

### Existing regressions strengthened

`tests/player-watchlist-v36.test.mjs`

- keeps namespace, cap, route, recovery, remove-control, runtime, and PWA assertions;
- adds the horizontal rail contract and rejects the old one-column phone card wall.

`tests/player-impact-v38.test.mjs`

- keeps identity verification, evidence gating, UUID/name routing, lifecycle, and PWA assertions;
- adds Home exception filtering, Game Day completeness, and loaded-vs-unavailable quiet-summary truth.

### Focused TENX regression

`tests/tenx-home-personalization-density-v131.test.mjs` locks:

- eight-player horizontal Watch rail;
- current-roster route trust;
- exception-first Home impact behavior;
- quiet evidence truth;
- complete Game Day impact behavior;
- no new network/persistence/polling/observer owner;
- touch, keyboard, and reduced-motion boundaries.

Full Titans Quality Gate is required before merge readiness.

## 8. Security Engineer

### Review

- stored watch/favorite values remain inputs, not final player identity authority;
- direct Player Intelligence links remain derived only from current loaded roster identity;
- unresolved identities still fail closed to Team Room;
- dynamic names and signal text continue through the existing HTML escaping helpers;
- no new external destination, provider, token, auth, or account-sync behavior;
- no new persistence of player evidence.

## 9. DevOps / SRE

### Operational impact

None outside browser presentation. This pass adds:

- no API request;
- no direct `fetch`;
- no provider request;
- no D1 read/write path;
- no timer or polling loop;
- no `MutationObserver`;
- no dependency;
- no workflow change;
- no service-worker asset change.

The same versioned modules are already packaged by the existing PWA shell. Merge readiness requires the branch to be synchronized to current `main` and the complete quality gate to pass on the resulting PR merge commit.

## 10. VP Engineering

### Merge decision

Approve only when:

- the diff remains exactly the two existing presentation modules, two strengthened original regressions, one focused TENX regression, and this review;
- the branch is zero commits behind current `main`;
- Favorite Player, Watch route trust, Player Impact trust, Home hierarchy, Resume, Fan Pulse, and Game Day contracts remain green;
- current parallel Tickets, Fantasy, Legacy, mobile, data, security, syntax, and Cloudflare contracts remain green;
- GitHub reports a clean merge state.

This iteration advances the Home design principle established by the previous TENX passes: **more personalization should increase relevance, not vertical clutter.**
