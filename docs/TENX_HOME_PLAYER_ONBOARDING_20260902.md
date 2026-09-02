# TENX Home Player Onboarding Review — 2026-09-02

## Scope

Post-#405 Home personalization pass. The target is the relationship between the existing My Titans Favorite Player setup, Player Watch quick-access rail, and Home Player Impact. Parallel Fan Event Radar, Game Day, Legacy walkthrough, Tickets, Fantasy sync, and mobile-navigation PR ownership is intentionally excluded.

## 1. Technical Program Manager

Finding: #405 made My Titans the truthful Favorite Player entry point, but the empty Watchlist still rendered immediately below it for a brand-new fan. That recreated two adjacent player-setup prompts.

Decision: stage the existing surfaces instead of adding another onboarding component. My Titans owns first-player identity; Watchlist appears after favorite/watch intent exists; Player Impact retains its existing follow-intent guard.

## 2. Product Manager

Finding: a first-time fan should answer one question first: which Titan do I care about? Asking them to choose a favorite and build a watchlist simultaneously increases decision load.

Decision: make Favorite Player the first setup step. Once that identity exists, Watchlist becomes a clear secondary action for tracking additional players.

## 3. UX Researcher

Finding: the current sequence can show `Choose player →` followed immediately by `Open any player ... Watch player`, even though both routes begin with player discovery.

Decision: hide the empty Watchlist only when both favorite and watchlist are empty. Favorite-only fans still see Watchlist onboarding, now framed as adding players beyond the favorite.

## 4. UI Designer

Finding: no new visual treatment is needed. Removing the premature empty Watchlist reduces vertical density while preserving the established My Titans hierarchy and the compact horizontal rail once watch items exist.

Decision: retain all current Watchlist geometry, focus treatment, mobile rail behavior, and reduced-motion behavior. Update only empty-state metadata/copy.

## 5. Software Architect

Finding: all required state already exists in `titans:v15MyTitans`. A second onboarding flag or completion state would create unnecessary persistence and sync complexity.

Decision: derive visibility only from existing `profile.favorite` and bounded `profile.watchlist`. No new storage namespace, account field, API, route, or provider.

## 6. Senior Engineer

Implementation:

- `mountHome()` reads the profile once, then derives favorite + watched list.
- if both are empty, an existing stale Watchlist root is removed and mounting exits.
- favorite-only state renders a secondary `0/8 tracked · add players` Watchlist onboarding message.
- watched state keeps current-roster verification, UUID-first routing, canonical-name fallback, removal controls, and horizontal rail behavior.
- empty favorite-only state does not hydrate roster data because there is no watched identity to verify.

## 7. QA Engineer

Added `tests/tenx-home-player-onboarding-v135.test.mjs` covering:

- one player-setup owner for a brand-new Home
- favorite-only secondary Watchlist onboarding
- no Watchlist roster hydration before a player is watched
- unchanged watched-player roster verification and compact rail
- stale Watchlist root removal when all player intent clears
- unchanged Player Impact intent guard
- zero new provider/state/lifecycle ownership and preserved accessibility/mobile contracts

Updated the v133 onboarding contract so it reflects the current post-#405 hierarchy rather than the older pre-Favorite-picker ownership model.

## 8. Security Engineer

No new user-controlled route construction, external URL, HTML source, credential, account field, or API surface. Watched-player routes remain gated by currently loaded roster identity before direct Player Intelligence navigation.

## 9. DevOps / SRE

No service-worker change, dependency, Worker route, D1 operation, polling cadence, timer, MutationObserver, deployment workflow, or new network request. Favorite-only Home now avoids an unnecessary Watchlist roster hydration request path.

## 10. VP Engineering

Ship criterion: focused regressions plus the complete Titans Quality Gate must pass against current synchronized `main`. Merge readiness also requires exact intended-file scope, `behind_by = 0`, and GitHub `mergeable_state = clean`.

## Fan outcome

A brand-new fan gets one clear player setup task instead of two adjacent prompts. After choosing a favorite, Watchlist naturally becomes the next layer for tracking more Titans, while all existing data, trust, persistence, and Player Intelligence boundaries remain unchanged.
