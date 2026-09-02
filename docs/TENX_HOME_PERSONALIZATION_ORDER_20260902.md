# TENX Home Personalization Order · 2026-09-02

## Outcome

Home personalization now converges to one deterministic fan-first sibling order regardless of which shared-runtime listener mounts first:

1. **My Titans** — primary fan identity and setup
2. **Your Titans watchlist** — secondary player quick access
3. **My Player Impact** — exception-first followed-player changes
4. **Fan Pulse** — broader official/social digest

The change is placement-only. It does not alter favorite/watch persistence, roster trust, Player Intelligence routing, Player Impact evidence, Fan Pulse data, or account sync.

## Why this pass exists

The three personalization modules already use the shared `TitansRuntime` route/render lifecycle, but each previously established its Home position only when its root was first created. If Watchlist mounted before My Titans, it could fall back to inserting after Fan Pulse. Later shared-render events refreshed content but did not move that existing root back into the intended personalization stack. Player Impact similarly anchored to whichever sibling existed at its first mount.

The fan-facing result could therefore depend on asynchronous listener timing rather than product hierarchy.

## TENX review

### 1. Technical Program Manager

Checked open PR ownership before editing. Ticket, Legacy, Game Day, Fantasy, and mobile navigation all had active parallel branches, so this pass stayed isolated to Home personalization. The production scope was reduced during review from three modules to one existing owner plus focused tests/docs.

### 2. Product Manager

The Home screen should communicate a stable priority model. A fan's identity belongs first, watched players second, player-specific exceptions third, and the broader team/social digest afterward. Runtime timing should never change that hierarchy.

### 3. UX Researcher

The existing surfaces already imply the intended mental model: My Titans is the primary identity, Watchlist extends that identity, Player Impact explains meaningful changes to followed players, and Fan Pulse broadens back out to the team conversation. Preserving that order reduces repeated scanning and makes returning behavior predictable.

### 4. UI Designer

No new panel, card, banner, navigation element, spacing system, animation, or breakpoint was added. Existing mobile swipe behavior, touch geometry, focus treatment, typography, and reduced-motion rules remain unchanged. The pass only repairs sibling position.

### 5. Software Architect

`my-titans-home-v35.js` is the sole placement reconciler because My Titans is the always-present primary personalization surface on Home and already participates in the shared route/render lifecycle. Watchlist and Player Impact keep their own state/content ownership and their existing creation anchors.

A new `reconcilePersonalizationStack(root,pulse)` helper checks the existing DOM order before writing. If already correct, it exits without churn. If drift exists, it restores:

`My Titans → Watchlist → Player Impact → Fan Pulse`

This avoids introducing a separate Home layout controller or duplicating sibling-placement logic across three modules.

### 6. Senior Engineer

The reconciliation call runs after My Titans root creation but before the content-signature early return. That detail is intentional: unchanged content must still be able to repair a stale sibling position after async mount/replacement timing.

The helper uses direct sibling checks and existing roots only. It does not synthesize clicks, clone nodes, create extra roots, or mutate any fan preference.

### 7. QA Engineer

Focused v137 regression coverage locks:

- a single deterministic personalization stack owner
- My Titans → Watchlist → Player Impact → Fan Pulse ordering
- idempotent no-op behavior when already ordered
- reconciliation before content-signature early return
- unchanged Watchlist and Player Impact creation ownership
- zero new network/persistence/timer/observer ownership
- unchanged favorite route truth and responsive/accessibility safeguards

Full Titans Quality Gate is required after the focused contract is added.

### 8. Security Engineer

No auth, account, URL parsing, external destination, CSP, credential, provider, D1, preference allowlist, storage key, or persistence behavior changes. Favorite routing still requires loaded-roster identity before Player Intelligence and still fails closed to Team Room when unresolved.

### 9. DevOps / SRE

No new API request, poller, timer, MutationObserver, dependency, workflow, cache generation, service-worker asset, or deployment surface. The existing shared runtime remains the lifecycle owner. The idempotent sibling check avoids DOM writes when the stack is already correct.

### 10. VP Engineering

Merge readiness requires all of the following on the final synchronized branch state:

- current `main` as the merge base
- `behind_by = 0`
- only the intended production/test/doc files changed
- full Titans Quality Gate green on the current synthetic PR merge
- content audit, secret scan, syntax, Cloudflare build, and offline verification green
- raw GitHub `mergeable=true`, `rebaseable=true`, and `mergeable_state=clean`

If `main` advances during validation, the exact intended blobs must be resynchronized onto the new `main` and the complete gate rerun rather than reusing stale green evidence.
