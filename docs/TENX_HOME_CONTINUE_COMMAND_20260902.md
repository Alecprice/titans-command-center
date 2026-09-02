# TENX Home Continue Command Review — 2026-09-02

## Scope

This pass tightens the existing device-local Continue Command feature on Home. It does not add another preference system or another Home panel. The goal is to make returning-fan resume behavior trustworthy, compact, and subordinate to the established Fan Launchpad / My Command Deck hierarchy.

## 1. Technical Program Manager

### Finding
Continue Command was isolated from active Tickets, Fantasy, Game Day, Legacy, and mobile-test PR ownership, but it still owned an independent MutationObserver plus 60 ms timer and inserted a large card immediately after the Home hero.

### Boundary
Change only `continue-command-v35.js`, its existing regression test, one focused TENX regression file, and this review. Do not edit Tickets, Fantasy, Game Day, Legacy, runtime, service worker, account sync, D1, auth, or provider owners.

## 2. Product Manager

### User outcome
Continue should behave like a short-lived resume utility, not permanent browsing history. A returning fan should be able to resume a meaningful Titans surface—including Player Intelligence—without Continue outranking the current-game action or personalized Home command deck.

### Acceptance criteria
- remember only known in-app hash routes;
- Player Intelligence remains a valid resume destination;
- revalidate persisted href on read, not only at write time;
- expire resume state after 14 days;
- visible title/detail comes from the current canonical route map, not stored DOM copy;
- custom deck and Fan Launchpad stay ahead of Resume;
- Clear remains explicit and device-local.

## 3. UX Researcher

### Finding
The former full-width card competed visually with Home's primary next-action and launch destinations. Continue is useful secondary context, especially for returning fans, but it should not look more important than the current Titans game or the fan's chosen deck.

### Decision
Convert the card to a compact Resume strip. When the custom command deck exists, place Resume after it. Otherwise place it after Fan Launchpad, with the hero as a fail-soft fallback only.

## 4. UI Designer

### Decision
Reduce padding, shadow, and visual weight while keeping Titans navy/blue styling. Keep one canonical route label, one short static resume description, Continue, and Clear. Preserve 44 px action targets, 48 px phone actions, focus-visible treatment, and a one-column phone layout.

## 5. Software Architect

### Architecture
Continue remains local-only under the existing `titans:v35ContinueCommand` key. It now reuses `TitansRuntime.onRoute` and `TitansRuntime.onAppRender` when available rather than independently observing app mutations.

Persist only:
- bounded same-app `href`;
- ISO `savedAt`.

Do not persist page heading, player name, section title, or other DOM-derived display copy. The route allowlist is the authority for both resume eligibility and visible labels.

## 6. Senior Engineer

### Implementation
- Added one `safeHref()` path used both before write and after read.
- Kept the existing route allowlist and explicit Player Intelligence route.
- Removed persisted `label` and `section` fields from new writes; old extra fields are ignored during migration.
- Added a 14-day maximum age and five-minute future-clock tolerance.
- Re-derived label/detail from static canonical route metadata.
- Added deterministic placement: custom deck -> Fan Launchpad -> hero fallback.
- Removed the private MutationObserver, 60 ms timer, and timer coalescing.
- Kept zero network work.

## 7. QA Engineer

### Regression coverage
Strengthened `tests/continue-command-v35.test.mjs` for canonical route validation, hierarchy placement, runtime lifecycle, mobile geometry, and offline packaging.

Added `tests/tenx-home-continue-command-v129.test.mjs` covering:
- read-time persisted-href validation;
- Player Intelligence resume support;
- 14-day expiry and future-clock bound;
- Launchpad/deck placement hierarchy;
- canonical copy instead of persisted DOM text;
- no observer/timer/network owner;
- device-local-only persistence and clear behavior.

## 8. Security Engineer

### Review
- Local persisted href is treated as input and revalidated every time it is read.
- Unknown routes, Home, CR/LF-containing values, overlong values, expired rows, and implausibly future-dated rows fail closed.
- Persisted arbitrary labels/section strings are no longer rendered.
- Dynamic href is escaped before HTML insertion.
- No external URL, credential, account, provider, or permission boundary is introduced.

## 9. DevOps / SRE

### Operational impact
No Worker, D1, auth, dependency, provider, workflow, runtime-loader, or service-worker changes. Continue adds no API call, fetch, polling interval, timeout loop, or MutationObserver. Runtime route/render events own reconciliation.

Merge readiness requires the full Titans Quality Gate on a branch synchronized to current `main`. If parallel work advances `main`, overlay only these four feature blobs and rerun the gate.

## 10. VP Engineering

### Merge decision
Approve only when:
- diff remains exactly Continue Command + two test files + this review;
- branch is zero commits behind current `main`;
- original and focused Continue regressions pass;
- existing Home hierarchy, Favorite/Watch/Impact personalization, Game Day, Fantasy, Legacy, Tickets, mobile, content, security, syntax, and Cloudflare checks remain green;
- GitHub reports a clean merge state.

This pass makes Continue a lightweight, bounded return path instead of a competing Home command surface: current context first, personalized deck second, resume history third.
