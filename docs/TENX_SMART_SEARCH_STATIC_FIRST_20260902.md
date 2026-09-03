# TENX Smart Search Static-First Pass — 2026-09-02

## Finding

`smart-search-v111.js` waited for the shared `/api/data` request before opening either its focus palette or typed search results. That made fully local navigation results such as Home, Schedule, Tickets, Roster, Stats, Legacy, and Sources depend on roster-data latency even though those routes require no network data.

The existing shared runtime already owns `/api/data`, its cache, refresh invalidation, and failure behavior. Smart Search therefore did not need a new provider or fallback store; it only needed to stop blocking local results on optional player enrichment.

## TENX role review

### 1. Technical Program Manager
Keep the pass isolated to Smart Search. Avoid open Ticket, Fantasy, mobile-account, stale-D1, and Legacy ownership lanes. Preserve the existing production browser gate and PWA packaging.

### 2. Product Manager
The fan should get useful navigation immediately after focusing or typing into global search. Player matches may enrich the same palette when roster data becomes available, but local navigation must remain usable without waiting for that enrichment.

### 3. UX Researcher
A search field that visually accepts focus but delays all results behind a cold request can feel broken. Immediate local matches provide clear response to the fan's action and keep degraded-network use productive.

### 4. UI Designer
Reuse the existing search panel, result rows, keyboard model, mobile palette, and copy. Do not add spinners, cards, banners, or another loading surface.

### 5. Software Architect
`TitansRuntime.apiJson('/api/data')` remains the only API/cache authority. Static section and quick-answer rows are rendered from existing in-module definitions. Player results continue to come only from the shared roster payload.

### 6. Senior Engineer
Open/render synchronously on focus and input, then call the existing loader. Repaint after hydration only when the same query is still active, the input still owns focus, the palette is still open, and the fan has not established a keyboard selection.

### 7. QA Engineer
Add focused contracts proving:
- focus renders before hydration;
- typed local matches render before hydration;
- stale/closed/changed queries cannot be repainted by late data;
- late enrichment cannot move an existing keyboard highlight;
- refresh remains static-first;
- no new lifecycle, storage, or network owner appears.

Existing Smart Search browser smoke remains the end-to-end production-path regression for player search, route hydration, desktop hit areas, and mobile touch/overflow behavior.

### 8. Security Engineer
No user input is introduced into a new HTML sink. Existing escaping remains unchanged. No cross-origin request, credential, storage, auth, or navigation boundary changes.

### 9. DevOps / SRE
No new endpoint, polling cadence, timer, observer, provider request, Worker behavior, D1 read/write, or cache namespace. The shared runtime retains request coalescing and refresh invalidation.

### 10. VP Engineering
Approve only as a narrow responsiveness/resilience repair. The architectural win is that optional network enrichment no longer gates deterministic local navigation while all existing authorities stay singular.

## Acceptance criteria

1. Focusing Smart Search opens Quick Jump immediately without awaiting `/api/data`.
2. Typing renders matching static sections/quick answers immediately.
3. Player results enrich the same active query after the existing shared roster request resolves.
4. Late enrichment cannot reopen a closed palette or repaint a changed query.
5. Late enrichment cannot shift a keyboard-highlighted result to a different item.
6. Refresh clears roster enrichment but immediately repaints local results for an active search before rehydrating players.
7. Exactly one `runtime.apiJson('/api/data')` owner remains in Smart Search.
8. No fetch, timer, MutationObserver, local/session storage, WebSocket, EventSource, route, or persistence owner is added.
9. Existing Player Intelligence UUID/name routing, keyboard controls, mobile touch floors, and PWA shell behavior remain unchanged.
