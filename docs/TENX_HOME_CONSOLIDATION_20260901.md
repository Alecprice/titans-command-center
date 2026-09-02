# TENX Home command consolidation — 2026-09-01

Scope: continue the merged Home-screen work by reducing duplicated command-card density while preserving the existing fan personalization system, current next-game truth, high-intent routes, and fallback behavior.

## 1. Technical Program Manager

The merged Home now contains a new Fan Launchpad plus the older customizable My Command Deck. Both solve legitimate fan jobs, but rendering both as full card walls increases vertical density and creates competing command hierarchies. P0 is to consolidate the presentation without reopening Tickets, Fantasy, Game Day, D1, or Legacy ownership.

Acceptance: Home remains usable if the older customizable deck fails to mount; no backend/API change; no new persistence namespace; no new observer; no new PWA dependency; no route ownership change.

## 2. Product Manager

The fan should see one clear answer to “what should I do next?” followed by fast destinations and then their personalized deck. The Fan Launchpad therefore keeps next-game context as the primary decision surface, while My Command Deck remains the deeper customizable layer.

## 3. UX Researcher

The strongest existing Home capabilities are already present: next-game truth, six high-intent destinations, personalization, favorite-player tooling, current intel, roster movement, market context, and freshness. The problem is not missing functionality; it is duplicated visual weight. The best follow-up is progressive compression rather than another feature panel.

## 4. UI Designer

When My Command Deck is present, the Fan Launchpad switches to an integrated compact mode:
- next-game action remains full-width and prominent;
- the six destination cards become a horizontal quick-route rail;
- the Launchpad is positioned immediately above My Command Deck;
- a compact **Customize deck** control opens the existing customization UI;
- mobile keeps a bounded horizontal rail instead of another long card stack.

When My Command Deck is absent, the original two-column Launchpad remains unchanged as a resilient standalone experience.

## 5. Software Architect

The integration is owned entirely by the existing `home-command-v123.js` module. It detects the existing `[data-v10-home]` surface and treats that surface as authoritative for customization. It does not import `fan-platform-v10.js`, duplicate its settings model, or create a second storage contract.

The shared `TitansRuntime` route/render lifecycle remains the only lifecycle dependency. No new MutationObserver is added.

## 6. Senior Engineer

Implemented:
- detection of the existing customizable deck;
- deterministic placement directly above that deck;
- standalone/integrated command modes;
- signature invalidation when integration state changes;
- compact quick-route rail with scroll snapping and bounded overscroll;
- delegation to the existing `[data-customize-home]` action, with the existing settings button as a defensive fallback.

All six destination routes remain unchanged: Tickets, Watch / Listen, Fantasy, Roster, Stats Lab, and Legacy.

## 7. QA Engineer

Added `tests/tenx-home-consolidation-v124.test.mjs` covering:
- reuse of the existing customization system;
- standalone fallback placement;
- integrated placement above My Command Deck;
- mode-sensitive rerender signature;
- compact horizontal quick-route treatment;
- 44px customization target and keyboard focus;
- no direct fetch, no local preference writes, and no new MutationObserver;
- mobile and reduced-motion behavior.

The full repository `npm run check` remains the merge gate.

## 8. Security Engineer

No credential, auth, storage-write, external-origin, or server behavior is added. The module still uses the same-origin shared `/api/data` runtime client and internal hash navigation. The new customization control only forwards to an existing trusted in-app control.

## 9. DevOps / SRE

No dependency, service worker, deployment workflow, API endpoint, D1 schema, provider, or package change. Keeping this pass inside the already-cached Home module avoids another PWA cache-generation conflict while concurrent section PRs remain open.

## 10. VP Engineering

Decision: approve only if the focused consolidation tests and the complete Titans Quality Gate pass against the current mainline merge result. This pass intentionally improves hierarchy rather than expanding feature surface, because the Home page already has sufficient capability and benefits more from coherence than another widget.
