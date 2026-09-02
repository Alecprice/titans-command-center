# TENX Home · Player Impact Onboarding · 2026-09-02

## Goal
Remove duplicate player-follow onboarding from Home while preserving My Player Impact truth, Player Intelligence routing, Game Day behavior, account-synced preferences, and the existing runtime/data architecture.

## 1. Technical Program Manager
- Started from post-merge main after PR #395 and its deployment-status commit.
- Avoided active ownership in Legacy, Fantasy, Game Day, Tickets, and mobile release-gate branches.
- Kept the change inside the existing Player Impact presentation, one focused regression suite, and this review note.

## 2. Product Manager
- Home should have one obvious place to begin following Titans players.
- `my-player-watch-v36.js` already owns that onboarding with the watchlist empty state and roster action.
- `my-player-impact-v38.js` should summarize followed-player impact only after favorite/watch intent exists.
- Game Day retains the complete Player Impact experience, including its zero-follow guidance.

## 3. UX Researcher
- With no followed players, Home previously stacked two empty states for the same workflow: Watchlist onboarding followed by Player Impact onboarding.
- The duplicate explanation increased vertical depth without adding a new decision or capability.
- Removing the second empty panel makes the personalized Home stack quieter while preserving discoverability through Watchlist.

## 4. UI Designer
- No new card, control, or visual owner is added.
- Home simply withholds Player Impact until there is meaningful followed-player state to summarize.
- When a follow exists, the current compact exception-first Impact presentation remains unchanged.
- Existing phone, focus-visible, contrast, and 44px interaction contracts remain intact.

## 5. Software Architect
- Watchlist remains the Home onboarding owner for creating/removing watched players.
- Player Impact remains the evidence/trust owner after saved follow intent exists.
- `titans:v15MyTitans` remains the only relevant personalization namespace.
- Current loaded roster remains direct Player Intelligence route authority.
- Existing `/api/data` and `/api/fan-intel` reads remain unchanged and are skipped by Player Impact when Home has zero follows.
- Existing TitansRuntime route/render/refresh lifecycle remains the only lifecycle owner.

## 6. Senior Engineer
- `mount()` now resolves the followed list and current Home root before data hydration.
- On Home with zero follows, any stale Player Impact root is removed and the function returns.
- Existing `titans:player-watchlist`, preference sync/import, storage, route, render, and refresh events remount the feature when follow state changes.
- The guard is Home-only, so Game Day keeps the existing empty and followed states.

## 7. QA Engineer
Focused regressions prove:
- Watchlist is the sole Home zero-follow onboarding owner.
- stale Home Impact is removed when the final follow disappears.
- zero-follow Home exits before Player Impact hydrates `/api/data` or `/api/fan-intel`.
- followed Home still uses the existing verified Impact/evidence path.
- Game Day retains complete Player Impact behavior.
- UUID-first, canonical-name fallback, stale-review, and evidence-withholding trust contracts remain unchanged.
- no provider, persistence, polling, timer, or MutationObserver owner is introduced.

## 8. Security Engineer
- No stored favorite/watch identity becomes route authority.
- Player-specific evidence remains withheld until current roster identity is verified.
- No new persistence write, external URL, network provider, credential, auth, or D1 surface is introduced.
- Existing dynamic content escaping remains unchanged.

## 9. DevOps / SRE
- No dependency, workflow, Worker, D1 migration, runtime loader, service worker, or deployment configuration changes.
- `my-player-impact-v38.js` is already loaded and offline-packaged.
- Full Titans Quality Gate is required on a branch synchronized to current main.

## 10. VP Engineering
Approve only when:
- the diff is limited to the intended Player Impact production file, focused regression file, and this TENX review note;
- branch is zero commits behind current main;
- full Titans Quality Gate passes on the current synthetic PR merge;
- existing Home personalization, favorite/watch routing, Game Day, account, mobile, security, D1, and Cloudflare contracts stay green;
- GitHub reports the pull request mergeable, rebaseable, and clean.
