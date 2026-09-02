# TENX Home Fan Pulse Review — 2026-09-02

## Scope

This pass reduces the existing Home Social Pulse from a second feed page into a compact Fan Pulse digest. It keeps the existing free-source API, caching, safety, and source links intact. It does not change Tickets, Fantasy, Game Day, Legacy, mobile navigation, account sync, D1, auth, providers, runtime, or the service worker.

## 1. Technical Program Manager

### Finding
The current Home pulse is isolated from the active parallel PR ownership zones, but it appends a large module containing up to eight feed cards, four source-status pills, five shortcuts, a long explainer, and refresh controls.

### Boundary
Change only the Social Pulse client presentation, its stylesheet, its regression test, one focused TENX test, and this review. Do not change `src/x-social-api.mjs` or the Cloudflare route contract.

## 2. Product Manager

### User outcome
Home should answer “what is happening around Titans Nation?” in a glance, then get out of the fan’s way. It should not reproduce an entire social/news reader underneath the fan command and personalized surfaces.

### Acceptance criteria
- cap Home to three source-backed items;
- put an official Titans item first whenever one is available;
- represent current public fan conversation when available;
- keep official news and source shortcuts one tap away;
- keep manual refresh;
- make source availability and data age explicit;
- do not imply that public feeds are live, trending, representative, or exhaustive.

## 3. UX Researcher

### Finding
Eight full cards create excessive vertical depth after Home already provides next-game actions, personalization, Premium context, Season Lens, and Resume. Fan conversation is valuable secondary context, but scan speed matters more than feed completeness on Home.

### Decision
Use a three-item digest. Desktop gets three compact columns. Phones get a horizontally swipeable digest so Fan Pulse does not add three more stacked screens of content.

## 4. UI Designer

### Decision
- rename the Home presentation to “Around Titans Nation” under the existing free-source truth boundary;
- reduce padding, shadows, heading scale, card copy, and empty/loading height;
- collapse four source pills into one “N of 4 free sources responding” status line;
- keep fetched-age copy visible;
- keep source shortcuts as a compact horizontal rail;
- preserve 44 px controls, focus-visible treatment, high-contrast text, and reduced-motion behavior.

## 5. Software Architect

### Architecture
The existing `/api/social-pulse` response remains authoritative. Home selects presentation candidates only after client URL validation.

Selection contract:
1. normalize the already-loaded items by timestamp;
2. partition current safe items into official and public sources;
3. when official content exists, place the newest official item first;
4. fill remaining slots from current public conversation before additional official items;
5. cap the result at three.

No new route, API, storage namespace, provider, auth boundary, account preference, or lifecycle owner is introduced.

## 6. Senior Engineer

### Implementation
- added `HOME_ITEM_LIMIT=3` and `pulseItems()`;
- removed the former eight-item Home render path;
- kept `safeUrl()` as the host/protocol gate before digest selection and HTML insertion;
- compacted source health into availability + detail + fetched-age copy;
- retained all five existing free-source shortcuts and the official news action;
- retained the existing ten-minute `TitansRuntime.apiJson` cache and explicit forced refresh;
- retained existing route/render subscriptions without adding observers or timers.

## 7. QA Engineer

### Regression coverage
Strengthened `tests/social-pulse-v49.test.mjs` to lock:
- three-item cap;
- official-first/public-conversation composition;
- compact source truth;
- three-column desktop layout;
- horizontal mobile digest;
- PWA packaging and touch floors.

Added `tests/tenx-home-fan-pulse-v130.test.mjs` covering:
- feed-wall removal;
- official-first truth boundary;
- non-live availability language;
- unchanged free cached provider contract;
- host/protocol and escaping safety;
- mobile horizontal density;
- no new route, storage, polling, or account owner.

## 8. Security Engineer

### Review
- external URLs remain HTTPS-only and constrained to the established host allowlist;
- feed titles, text, authors, labels, dates, and URLs remain escaped before HTML insertion;
- external links retain `noopener noreferrer`;
- the client still has no direct provider `fetch`;
- no credential, X/Twitter token, auth, account, or storage boundary changes.

## 9. DevOps / SRE

### Operational impact
No backend or deployment-surface change. The same `/api/social-pulse` route and ten-minute shared runtime cache are reused. There is no new polling interval, MutationObserver, provider request, D1 read/write, dependency, workflow, runtime-loader, or service-worker edit.

Merge readiness requires the full Titans Quality Gate on a branch synchronized to current `main`. If generated deployment-status commits advance `main`, overlay only these five feature blobs and rerun the gate.

## 10. VP Engineering

### Merge decision
Approve only when:
- diff remains exactly Social Pulse JS/CSS + existing regression + focused TENX regression + this review;
- branch is zero commits behind current `main`;
- Social Pulse source/API contracts remain green;
- existing Home hierarchy, Favorite/Watch/Impact/Resume, Tickets, Fantasy, Game Day, Legacy, mobile, content, security, syntax, and Cloudflare checks remain green;
- GitHub reports a clean merge state.

This pass deliberately makes Home less like a dashboard wall and more like a Titans fan command center: current action and personalization first, a concise pulse of Titans Nation later.
