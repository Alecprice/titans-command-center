# TENX My Player Impact Trust Review — 2026-09-02

## Scope

This pass tightens the existing My Player Impact surface on Home and Game Day. The feature already reuses the account-synced My Titans favorite/watchlist profile and loaded roster, injury, transaction, and depth data. However, when current roster verification failed it could fall back to the stored watchlist ID/name for routing and then use that preference name to search player-specific evidence feeds.

The fix keeps followed preferences as fan intent only. Current loaded roster identity now gates Player Intelligence routing and player-specific impact evidence. The work is intentionally isolated from active Fantasy and Game Day branches.

## 1. Technical Program Manager

### Finding
Favorite Player and My Player Watch now require loaded roster truth before direct player routing, while My Player Impact still retained an older preference fallback. The three personalization surfaces therefore had inconsistent trust and navigation contracts.

### Boundary
Change only `my-player-impact-v38.js`, its existing regression contract, one focused TENX test file, and this review. Do not edit Game Day, Fantasy, account sync, D1, Player Intelligence, runtime-loader, or service-worker owners.

## 2. Product Manager

### User outcome
A fan following a current Titan should be able to open Player Intelligence directly regardless of whether the loaded roster supplies a UUID or only a canonical audited name. A saved player that cannot be verified should remain visible but should ask the fan to review the current roster instead of disappearing or pretending current-player evidence exists.

### Acceptance criteria
- current roster match + UUID -> `#player?id=`;
- current roster match + no UUID -> audited `#player?name=` using the canonical loaded roster name;
- no current roster match -> `#roster` with Review roster copy;
- stored preference ID/name never becomes route authority by itself;
- injury, transaction, and depth matching occurs only after current roster identity is verified;
- Home and Game Day mounting remain unchanged.

## 3. UX Researcher

### Finding
A followed player is high-intent personalization. Generic fallback is acceptable only when it tells the fan why. Silently routing a stale follow to Team Room under an Open label, or attaching unrelated evidence to a stale saved name, erodes trust.

### Decision
Preserve unresolved follows as visible review cards. This gives the fan a recovery path without deleting or silently rewriting their saved preference.

## 4. UI Designer

### Decision
Keep the existing My Player Impact card system. Add only a deterministic `data-v38-state` and a subtle review treatment:
- `verified` cards keep direct Open behavior;
- `review` cards use Review roster and a warm warning treatment;
- review cards explicitly say player-specific signals are withheld until roster identity is verified.

No new panel, modal, rail, or Home card wall is introduced. Existing 44px actions, focus-visible behavior, and single-column phone layout remain.

## 5. Software Architect

### Architecture
The feature continues to own no player identity database. It reuses:
- `titans:v15MyTitans` as read-only followed-player preference input;
- `TitansRuntime.apiJson('/api/data', { ttl: 30000 })` for current roster/transaction truth;
- `TitansRuntime.apiJson('/api/fan-intel', { ttl: 30000 })` for injury/depth context;
- existing UUID Player Intelligence routing;
- existing audited-name Player Intelligence routing.

Preference identity may select a loaded roster candidate, but only the matched loaded roster row supplies canonical route identity and the name used for evidence matching.

## 6. Senior Engineer

### Implementation
`impactFor(item)` now:
1. normalizes the stored preference ID/name only for matching;
2. resolves a current loaded roster row by exact stored ID or normalized name;
3. requires a roster row with a canonical loaded name before setting `verified`;
4. derives injury, transaction, and depth rows only for verified canonical roster identity;
5. routes verified rows UUID-first, then through the canonical audited-name route;
6. sends unresolved rows only to Team Room;
7. distinguishes a player missing from a loaded roster from roster verification being unavailable;
8. distinguishes no flagged change in loaded feeds from feeds that were not loaded.

The render signature now includes route/evidence state so truth-state changes repaint deterministically.

## 7. QA Engineer

### Regression coverage
Strengthened `tests/player-impact-v38.test.mjs` to require current-roster verification, canonical UUID/name routing, review fallback, and no stored-ID fallback.

Added `tests/tenx-player-impact-trust-v128.test.mjs` covering:
- preference identity is input, not authority;
- UUID-first + canonical audited-name route parity;
- player-specific evidence withheld until verification;
- stale/unavailable roster states stay visible and truthful;
- unavailable evidence feeds are not described as checked;
- established Player Intelligence audited-name support is reused;
- existing API cache, lifecycle, persistence, and mobile boundaries remain unchanged.

## 8. Security Engineer

### Review
- Account-synced/imported favorite/watchlist values are treated as untrusted preference data for routing and evidence lookup.
- Stored `item.id` is never used as the final route after roster verification fails.
- Stored `item.name` is never inserted into `#player?name=`.
- Dynamic route values come only from the matched loaded roster row and are encoded with `encodeURIComponent`.
- Dynamic labels and evidence remain escaped before HTML insertion.
- No new external URL, credential, storage namespace, permission, or provider boundary is introduced.

## 9. DevOps / SRE

### Operational impact
No Worker, D1, auth, provider, dependency, workflow, runtime-loader, or service-worker changes. The module keeps its existing shared cached `/api/data` and `/api/fan-intel` calls and existing runtime route/render/refresh lifecycle. It adds no direct fetch, polling interval, or MutationObserver.

Merge readiness requires the full Titans Quality Gate on a branch synchronized to current `main`. If parallel branches advance `main`, only the four feature blobs should be overlaid onto the new main tree and the gate rerun.

## 10. VP Engineering

### Merge decision
Approve only when:
- the diff remains isolated to My Player Impact + tests + this review;
- current `main` is the merge base;
- existing and new Player Impact tests pass;
- Favorite Player, Watchlist, audited-name Player Intelligence, Home duplication, Game Day, content, security, syntax, and Cloudflare gates remain green;
- GitHub reports a clean merge state.

This completes a coherent personalization trust contract across Favorite Player, My Player Watch, and My Player Impact: saved preferences express fan intent, while current loaded roster truth authorizes player routes and player-specific evidence.
