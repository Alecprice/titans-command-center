# TENX Home Season Lens Review — 2026-09-02

## Scope

This pass reduces duplicated Home information after the Fan Launchpad / My Command Deck consolidation. It is intentionally limited to the existing 365 Mode Home layer and does not modify Tickets, Fantasy, Legacy, Game Day, D1, authentication, providers, the service worker, or the global runtime.

## 1. Technical Program Manager

**Finding:** Multiple parallel TENX branches are active, so this pass needs a narrow ownership boundary and a small merge surface.

**Decision:** Limit implementation to `mode-365-v19.js`, `mode-365-v19.css`, focused regression coverage, and this review. Reuse the existing Premium and 365 contracts rather than adding a new Home module.

## 2. Product Manager

**Finding:** Premium already answers “what matters right now,” while full 365 Mode repeats next-game and availability actions immediately beneath it.

**Decision:** Establish a clear temporal product hierarchy: **Premium owns right now; 365 Mode owns the season lens.** Preserve the full 365 dashboard only when Premium is unavailable.

## 3. UX Researcher

**Finding:** Repeated large action cards increase scrolling and make Home feel like stacked dashboards rather than a fan-first command center.

**Decision:** When Premium is present, show two longer-horizon priorities selected by football phase. For the regular season, keep AFC South context and What Changed while removing repeated game and availability cards.

## 4. UI Designer

**Finding:** Four additional tall cards are visually too heavy beneath the Premium panel, especially on phones.

**Decision:** Add an explicit Season Lens cue, use a two-card integrated desktop grid, and convert the integrated phone view into a bounded horizontal snap rail. Preserve the established Titans navy / Tennessee blue visual language, focus treatment, and minimum touch targets.

## 5. Software Architect

**Finding:** Premium can hydrate after 365 Mode, so a one-time DOM check would leave the wrong mode mounted.

**Decision:** Make 365 rendering mode-aware through the existing `TitansRuntime.onAppRender` lifecycle. Compare the mounted `data-v19-mode` to the desired mode and rerender only when that integration state changes. Add no MutationObserver, interval, storage namespace, route, API, or dependency.

## 6. Senior Engineer

**Implementation:**
- retain every existing four-card phase order for standalone fallback;
- add a two-card Season Lens order for each football phase;
- regular season integrated order is `standings` + `changes`;
- mark integrated output with `.integrated` and `data-v19-mode="season-lens"`;
- preserve canonical `scheduleFocus`, `latestCompletedGame`, shared API cache, and missing-data honesty;
- reacquire Premium presence after async data hydration before final render.

## 7. QA Engineer

Focused regressions cover:
- Premium integration detection;
- regular-season duplicate removal;
- all full fallback phase orders;
- all Season Lens phase orders;
- mode-sensitive rerendering;
- absence of new observer / polling ownership;
- unchanged shared data and persistence boundaries;
- mobile, touch, focus, snap, and reduced-motion contracts.

Existing 365 Mode regressions remain in place and must continue passing unchanged.

## 8. Security Engineer

**Finding:** This is presentation and selection logic only.

**Decision:** No new user input, external URL construction, authentication state, local/session storage, provider request, database write, or trust boundary is introduced. Existing HTML escaping remains authoritative for dynamic strings.

## 9. DevOps / SRE

**Finding:** A Home consolidation should not increase network traffic, edge workload, offline-shell size materially, or shared PWA conflict risk.

**Decision:** Reuse the two existing cached API reads and existing 365 JS/CSS assets. Do not touch `sw.js`, runtime loading, Cloudflare routes, provider configuration, or D1 migrations. Full repository quality and Cloudflare build gates remain required before merge.

## 10. VP Engineering

**Decision:** Approve the direction because it removes product duplication instead of adding another feature layer, has a small reversible diff, preserves standalone fallback behavior, and clarifies ownership between existing Home systems. The change should ship only after the full Titans quality gate passes on a branch synchronized with current `main`.

## Result

Home now has a clearer time hierarchy:

1. Fan Launchpad / My Command Deck — what the fan wants to do.
2. Premium — what matters right now.
3. 365 Season Lens — what matters across this part of the football year.

The design removes redundant immediate-action cards while preserving truthful season context, standalone resilience, and existing runtime ownership.
