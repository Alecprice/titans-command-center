# TENX Schedule Refresh Truth — 2026-09-02

## Finding

The Schedule calendar enhancement reused the shared `TitansRuntime.apiJson('/api/data')` request and correctly avoided its own network/cache owner. A race remained when the fan refreshed while that read was still in flight: the shared runtime invalidated the request generation, but `schedule-calendar-v39.js` still treated the settling request as its current load. Because `load(true)` returned the existing `loading` promise, no fresh Schedule read was started when that invalidated request finished. The calendar/export surface could therefore remain in a false unavailable state until another route or page lifecycle happened to recover it.

## TENX role review

### 1. Technical Program Manager
Keep the repair isolated to the unowned Schedule calendar lane. Do not touch active Legacy, D1-freshness, mobile Account, Ticket, or Fantasy PR ownership. Preserve the existing shared refresh bus, route lifecycle, PWA asset, and production deployment chain.

### 2. Product Manager
A manual refresh means “show me the newest known Schedule state.” A request invalidated by that action cannot be allowed to become the visible post-refresh calendar state, including a false empty state.

### 3. UX Researcher
The failure is especially confusing because the fan explicitly asked for refresh and the UI could become less useful afterward. Recovery should be automatic and invisible; no extra retry button, spinner, toast, or loading surface is needed.

### 4. UI Designer
Keep the existing Schedule calendar card, copy, official-source link, 44px actions, mobile layout, and `.ics` export presentation unchanged. This is a lifecycle/truth repair, not a redesign.

### 5. Software Architect
`TitansRuntime` remains the sole API, cache, invalidation, and refresh authority. Schedule adds only a module-local publication revision so an obsolete promise cannot write into a newer UI generation. It does not create another API generation or cache owner.

### 6. Senior Engineer
Capture the current publication revision when a Schedule load actually starts. Success and failure may mutate `data` only when that revision is still current. If the request settles stale, clear `loading`, skip rendering, and—only while still on `#games`—immediately start one forced read through the same shared runtime. Repeated refreshes are handled by the same revision comparison: every obsolete request yields until one request matches the newest publication revision.

### 7. QA Engineer
Regression coverage locks:
- publication revision is captured before the shared API read;
- stale success cannot publish old data;
- stale failure cannot publish a false empty state;
- stale settlement restarts current-generation Schedule loading before render;
- refresh increments the publication revision before requesting refreshed data;
- one shared `apiJson('/api/data')` owner remains and no direct `fetch()` is introduced;
- existing export, provenance, touch, route, and offline contracts stay intact.

### 8. Security Engineer
No new input, HTML sink, external destination, credential, storage, auth, or cross-origin boundary is introduced. Existing HTML and ICS escaping remain unchanged.

### 9. DevOps / SRE
No new endpoint, provider request path, polling cadence, timer, observer, Worker behavior, D1 read/write, cache namespace, or service-worker asset. The repair composes with the existing runtime generation-safe invalidation contract merged in #434.

### 10. VP Engineering
Approve only if the change remains a narrow stale-publication repair and the full Titans Quality Gate passes on the current synthetic PR merge. A green gate must be revalidated if `main` advances before merge.

## Acceptance criteria

1. Refresh invalidates the Schedule publication revision before a refreshed load attempt.
2. An in-flight request started before refresh cannot publish success into the refreshed Schedule view.
3. An in-flight request started before refresh cannot publish an empty failure state into the refreshed Schedule view.
4. Stale settlement does not render; if the fan is still on Schedule it immediately re-enters the existing shared `load(true)` path.
5. Multiple refreshes while reads are in flight converge on the newest publication revision without a second cache/network owner.
6. Leaving Schedule suppresses the stale recovery request; returning later uses the existing route lifecycle to load current data.
7. Calendar export remains limited to loaded fixed kickoff times, with byes and TBD dates excluded rather than guessed.
8. The official Titans Schedule remains the visible provenance destination.
9. No direct `fetch`, new observer, persistence namespace, route owner, provider, or polling loop is added.
