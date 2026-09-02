# TENX home screen review — 2026-09-01

Scope: make Home feel like a Tennessee Titans fan's command center instead of a generic section index, while preserving the existing hero, data model, routing, and mobile shell.

## 1. Technical Program Manager
P0 is reducing time from landing to the fan's next useful action. Acceptance: the existing Home remains the fallback, no route ownership changes, no new backend endpoint, no direct third-party fetch, and the work stays isolated from the parallel Tickets, Fantasy, Legacy, and Watch / Listen passes.

## 2. Product Manager
The landing page should answer two questions immediately: “What is happening next with the Titans?” and “Where do I want to go?” The highest-intent destinations are Tickets, Watch / Listen, Fantasy, Roster, Stats Lab, and Legacy, with Game Day promoted contextually when a kickoff is near.

## 3. UX Researcher
The existing hero establishes identity well, but its first action cluster only exposes Game Day and Legacy while other high-use fan jobs are distributed across the longer page and navigation. Home benefits from a compact post-hero decision layer rather than adding another long dashboard lower on the page.

## 4. UI Designer
Added a Titans-colored Fan Launchpad directly after the existing hero. Desktop uses a large next-action card beside a two-column destination grid. Mobile stacks the game context first and keeps the launchpad two columns wide so the screen remains scannable without becoming a long list. Primary actions keep a 44px minimum target and visible keyboard focus.

## 5. Software Architect
The feature is an additive, route-scoped module. It consumes `TitansRuntime.apiJson('/api/data')`, `scheduleFocus`, and `formatTeamKickoff`, so it shares the application's cache and canonical schedule/time truth. The runtime loads the module fail-soft after `window.TitansRuntime` is initialized; the base Home remains functional if the enhancement cannot load.

## 6. Senior Engineer
Implemented dynamic fan context: game window → Game Day + Watch / Listen; upcoming home game → Tickets + Game Day plan; upcoming road game → Watch / Listen + Game Day plan; no upcoming loaded game → Schedule + Intel Feed. Added six one-tap launch destinations for Tickets, Watch / Listen, Fantasy, Roster, Stats Lab, and Legacy. Dynamic API-backed text is escaped before HTML insertion.

## 7. QA Engineer
Added `tests/tenx-home-screen-v123.test.mjs` covering fail-soft loading, route scope, canonical data/runtime use, launch destinations, contextual game actions, mobile target sizing, reduced-motion support, keyboard focus, and dynamic-string escaping. Full repository `npm run check` remains the merge gate.

## 8. Security Engineer
No auth, storage, credential, external-origin, or write behavior was added. The module uses the same-origin runtime API client, only internal hash routes for fan actions, and escapes dynamic strings before rendering.

## 9. DevOps / SRE
No dependency, service, endpoint, database, or build-system change. The enhancement reuses the existing `/api/data` runtime cache and is isolated in one small browser module, minimizing deploy and cache risk.

## 10. VP Engineering
Decision: approve for merge only after the focused regression test, repository quality suite, and pull-request checks pass. Keep this Home pass independent from concurrent section-specific TENX branches; reconcile through normal PR merge order rather than broad cross-branch edits.
