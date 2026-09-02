# TENX Home · My Titans Summary · 2026-09-02

## Goal
Reduce duplicate Home command density after the Watch and Player Impact compaction work without changing personalization truth, routing authority, persistence, account sync, APIs, or runtime lifecycle ownership.

## 1. Technical Program Manager
- Started from merged PR #393 baseline.
- Avoided active ownership in Fan Events, Fantasy, Legacy, Game Day, Tickets, and mobile release-gate branches.
- Limited implementation to the existing `my-titans-home-v35.js`, its established regression suite, one focused TENX regression file, and this review note.

## 2. Product Manager
- Reframed My Titans from another three-card command launcher into a compact fan-profile summary.
- Favorite Player is the primary identity because it is the most personalized Home shortcut.
- Fantasy and Account remain available but become secondary quick actions because both are already discoverable elsewhere in the app.
- No saved setting or account capability is removed.

## 3. UX Researcher
- The previous phone contract explicitly stacked all three My Titans cards vertically.
- Combined with Launchpad, Continue, Watch, Impact, Fan Pulse, and Season Lens, this amplified Home scroll depth.
- The new hierarchy keeps the personalized identity visible while reducing duplicate navigation weight.

## 4. UI Designer
- Replaced the three equal cards with one primary favorite-player summary plus two lighter quick actions.
- Desktop uses one compact three-part row.
- Phones use a horizontal snap rail so the profile does not become three stacked panels.
- Existing Titans navy / Tennessee-blue visual language, focus treatment, and readable contrast are preserved.

## 5. Software Architect
- Existing `titans:v15MyTitans` and `titans-fantasy-v1` stores remain the only personalization inputs.
- Current loaded roster remains the authority for direct Player Intelligence routes.
- Existing shared `/api/data` cache remains the only data read.
- Existing runtime route/render subscriptions remain the lifecycle owner.
- No service worker, runtime loader, account server, D1, provider, or API contract changes.

## 6. Senior Engineer
- Preserved UUID-first Player Intelligence routing with audited canonical-name fallback.
- Preserved stale favorite fallback to Team Room.
- Preserved Account opening through the existing `[data-account-open]` control.
- Preserved Fantasy destination `#fantasy`.
- Reworked only Home presentation and copy hierarchy.

## 7. QA Engineer
- Strengthened the existing My Titans suite for the new hierarchy and phone layout.
- Added seven focused TENX regressions covering primary identity, secondary action demotion, route trust, pending/stale truth, horizontal phone density, owner isolation, and accessibility/motion safeguards.
- Full repository Quality Gate is required before merge readiness.

## 8. Security Engineer
- No new persistence writes.
- No stored favorite name is promoted directly into Player Intelligence.
- No new network endpoint, provider URL, external navigation, or credential surface.
- Existing HTML escaping remains in place for all dynamic copy.

## 9. DevOps / SRE
- No dependencies, workflow, Worker, D1 migration, service worker, runtime-loader, or deployment configuration changed.
- Feature remains on the already packaged `my-titans-home-v35.js` asset path.
- Branch must be synchronized to current `main` and gated after any deployment-status or parallel merge movement.

## 10. VP Engineering
Approve only when:
- exactly the intended four files differ from current `main`;
- branch is zero commits behind;
- current full Titans Quality Gate passes;
- existing Home, favorite-player trust, Watch, Player Impact, Game Day, account, mobile, security, D1, and Cloudflare contracts stay green;
- GitHub reports a clean merge candidate.
