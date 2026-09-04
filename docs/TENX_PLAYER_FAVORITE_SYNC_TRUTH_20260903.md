# TENX Player Favorite Sync Truth — 2026-09-03

## Finding
The Player Intelligence Favorite control initializes from `titans:v15MyTitans.favorite` and updates correctly after direct device writes. The existing account preference system can later replace that same profile during signed-in initial sync, backup import, reset, or a cross-tab storage update. Those preference paths already publish semantic events, but Player Intelligence did not consume them, so the saved Favorite Player could be correct while the currently visible Player control remained stale until another render.

## TENX roles
1. **Technical Program Manager** — isolated the repair to Player personalization; active Legacy, account-dialog, Game Day, Ticket, Fantasy, 365, and mobile PR lanes remain untouched.
2. **Product Manager** — saved Favorite truth should be visible immediately on the Player page after account/device preference changes.
3. **UX Researcher** — a stale star state creates a high-confidence contradiction because fans interpret `★ Favorite` as current saved intent.
4. **UI Designer** — preserve the existing button, copy, and layout; repaint only its current state.
5. **Software Architect** — keep `titans:v15MyTitans` as the sole Favorite persistence authority and reuse existing preference events.
6. **Senior Engineer** — add a small idempotent presentation reconciler scoped to the Player route and current command card.
7. **QA Engineer** — lock sync/import/reset/storage event coverage, profile-only reads, control repainting, and offline shell packaging.
8. **Security Engineer** — no auth/session changes, no new account payload, no dynamic HTML insertion, and no new storage writes.
9. **DevOps/SRE** — package the module in the existing PWA shell and bump the cache identity so offline clients receive it.
10. **VP Engineering** — reject a duplicate state owner or broad Player rerender; use persisted truth plus existing semantic lifecycle only.

## Implementation boundaries
- `titans:v15MyTitans.favorite` remains authoritative.
- `player-intelligence-v16.js` remains the direct Favorite write owner.
- `account-sync-v112.js` remains account preference sync/import/reset authority.
- The v168 reconciler is read-only and presentation-only.
- It listens only to existing `titans:preferences-synced`, `titans:preferences-imported`, `titans:preferences-reset`, and `storage` events.
- Sync/import events with explicit key lists are ignored unless `titans:v15MyTitans` changed.
- The reconciler operates only on `#player` and only when the existing `.v16-player-command [data-v16-favorite]` control is mounted.
- No API/provider request, polling, timer, MutationObserver, WebSocket, EventSource, new preference key, D1 field, or account schema is added.

## Acceptance criteria
- A remote/imported Favorite matching the current player repaints to `★ Favorite` and `aria-pressed="true"`.
- A remote/imported Favorite pointing elsewhere repaints to `☆ Make favorite` and `aria-pressed="false"`.
- Reset and cross-tab changes reconcile the same control.
- A prior transient save-failure `aria-label` is cleared when a later persisted preference event establishes current truth.
- Unrelated keyed preference-sync/import events do not touch the Player Favorite control.
- Direct Favorite persistence behavior and failure handling from PR #417 remain unchanged.
- New code remains available through the network-first PWA shell and offline dependency closure.
