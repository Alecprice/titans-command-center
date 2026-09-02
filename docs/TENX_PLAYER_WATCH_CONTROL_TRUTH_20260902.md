# TENX Player Watch Control Truth · 2026-09-02

## Scope

Repair the existing Player Intelligence watchlist control so successful same-tab saves reconcile immediately, failed writes explain why nothing changed, and the eight-player limit never behaves like a dead button.

This is intentionally an ownership-preserving repair inside `my-player-watch-v36.js`. It does not create a new watchlist feature, persistence key, provider, route, API, poller, observer, timer, or lifecycle owner.

## 1. Technical Program Manager

Finding: the existing click path persists watch intent and schedules `mount()`, but `mountPlayer()` previously returned as soon as `.v36-watchbar` already existed. A successful same-tab Watch or Unwatch therefore had no deterministic path to repaint the already-mounted control. Storage failure and the eight-player capacity guard were also silent.

Decision: repair the existing owner in place. Keep scope to one production module, one focused regression suite, and this review record. Avoid active Fantasy, Game Day, Legacy, Ticket, and mobile PR ownership.

Acceptance: current saved watch intent must remain authoritative, the visible player control must reconcile from it on every existing runtime mount, and failure/capacity states must be explicit without inventing success.

## 2. Product Manager

Fan problem: tapping **Watch player** can succeed but still look unchanged until another app render, while a failed save or full list can look exactly the same as an ignored tap.

Product rule: a fan action should have one of three truthful outcomes:

- saved state changed and the same control reflects it;
- saved state did not change and the UI says the save failed;
- no save was attempted because the eight-player list is full and the UI says what to do next.

The existing eight-player limit and My Titans watchlist concept remain unchanged.

## 3. UX Researcher

Observed usability failure: identical visual feedback for success, storage failure, and capacity rejection forces the fan to infer state from later navigation.

Repair:

- re-read saved watch intent on every Player Intelligence mount, even when the watch bar already exists;
- keep failed state visually unchanged;
- add concise retry copy for failed Watch, Unwatch, and Home removal;
- explain the full-list state instead of silently returning;
- keep feedback adjacent to the control that caused it.

No modal, toast framework, or extra interaction step is introduced.

## 4. UI Designer

The existing watch bar and Home horizontal rail remain the visual owners.

A small status line is added inside each existing surface. It is hidden while empty and becomes visible only for actionable failure/capacity feedback. The established Tennessee-blue watch treatment, 44px controls, phone stacking, focus treatment, and reduced-motion behavior remain intact.

No new card, panel, or navigation surface is added.

## 5. Software Architect

Persistence authority remains `titans:v15MyTitans` with `watchlist` bounded to eight rows.

Key rule: the button never becomes an independent state owner. `mountPlayer()` derives `isWatched` from `watched(getProfile())` on every mount and reconciles the existing button's `aria-pressed`, label, and identity from that saved state.

The existing successful-save event remains `titans:player-watchlist`. Existing `TitansRuntime` route/app-render subscriptions remain the lifecycle authority.

No new state namespace, D1 field, account field, route, endpoint, provider, observer, timer, or poller is added.

## 6. Senior Engineer

Implementation:

- replace the existing-bar early return with idempotent reuse of `.v36-watchbar`;
- update the existing button from persisted intent on every `mountPlayer()` call;
- retain the existing `saveWatchlist()` boolean persistence boundary;
- schedule reconciliation only after `saveWatchlist()` returns true;
- add an existing-surface `watchStatus()` helper that writes status through `textContent`;
- add explicit full-list feedback before any persistence call;
- add distinct failed Watch, Unwatch, and Home removal messages;
- keep successful `titans:player-watchlist` dispatch unchanged.

Dynamic player names in failure copy are inserted through `textContent`, not HTML.

## 7. QA Engineer

Focused v139 regressions lock:

1. an already-mounted player watch bar is reconciled instead of skipped;
2. `aria-pressed` and control copy derive from persisted watch intent;
3. same-tab reconciliation is scheduled only after successful persistence;
4. failed Watch, Unwatch, and Home removal keep saved state authoritative and expose retry copy;
5. the eight-player limit explains itself before any write;
6. Player and Home failure surfaces use polite accessible status regions with safe text insertion;
7. the repair adds no provider/storage/lifecycle owner and preserves mobile/touch/reduced-motion contracts.

The full Titans Quality Gate is mandatory after the focused suite is added.

## 8. Security Engineer

No new trust boundary is introduced.

- persisted player IDs/names continue through the existing bounded watchlist normalization;
- failure messages use DOM `textContent` for dynamic names;
- existing roster verification still gates direct Player Intelligence routes on Home;
- no URL, HTML, API, credential, account, or provider handling changes;
- no additional storage key or remote sync field is introduced.

## 9. DevOps / SRE

Runtime impact is minimal:

- existing `mountPlayer()` performs a few local DOM/property writes instead of returning early;
- no network call is added;
- no polling, timers, observers, or storage scans are added;
- existing `/api/data` Home roster hydration remains unchanged;
- PWA packaging needs no new asset because the existing module path is retained.

Merge readiness requires the full current synthetic PR merge to pass tests, content audit, secret scan, syntax validation, Cloudflare build, and offline dependency verification.

## 10. VP Engineering

Approval criteria:

- successful same-tab Watch/Unwatch is visibly reconciled from saved state;
- failed persistence never claims a state change;
- capacity rejection is explicit and performs no write;
- Home removal failure is no longer silent;
- persisted watch intent and current-roster route trust are unchanged;
- no new lifecycle, data, provider, or persistence owner exists;
- focused regression is green;
- the complete Titans Quality Gate is green on the final branch synchronized to current `main`;
- final compare is `behind_by = 0` with exactly the intended files;
- raw GitHub merge state is clean before merge readiness is claimed.
