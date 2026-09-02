# TENX · Audited Player Favorite Truth

Date: 2026-09-02

## Finding

Player Intelligence has two supported identity paths: database UUID routes and audited canonical-name fallback routes. The UUID Favorite control already treated `titans:v15MyTitans.favorite` as persisted fan intent: it captured the storage-write result and changed `aria-pressed` only after a successful write.

The audited-name fallback in `player-polish.js` still used the older optimistic pattern. It caught a failed `localStorage.setItem()` and then changed the Favorite button anyway. A storage-restricted browser could therefore show `★ Favorite` even though no favorite had been saved.

This pass closes that parity gap without changing player identity, routing, account sync, providers, or lifecycle ownership.

## TENX 10-role review

### 1. Technical Program Manager

- Verified the prior Player Watch PR was merged before selecting work.
- Rechecked parallel ownership and avoided active Game Day, Fantasy, Legacy, Tickets, and old mobile-test lanes.
- Kept scope to the existing audited Player Intelligence fallback owner plus one regression and this record.

### 2. Product Manager

- Product rule: **Favorite means successfully persisted fan intent** on every supported Player Intelligence route.
- A fallback route must not provide weaker preference truth than a UUID route.
- Failure remains retryable rather than being mistaken for success.

### 3. UX Researcher

- The previous failure mode looked like a broken trust contract: the button visibly changed even though the preference was not durable.
- Failed add/remove now tells the fan what is still true and invites retry.
- Successful saves retain the established concise Favorite copy.

### 4. UI Designer

- No new panel, card, navigation item, modal, or layout was introduced.
- The existing Favorite button carries the feedback and uses `aria-live="polite"` so the compact fallback surface does not grow another status block.
- Existing touch geometry and Player Intelligence visual treatment remain unchanged.

### 5. Software Architect

- `titans:v15MyTitans` remains the sole profile namespace.
- `PLAYER_PROFILE_KEY` remains the audited fallback key and the existing `data-v16-favorite` selector remains the account-sync hook.
- The fallback route still upgrades to UUID when current loaded data supplies a valid UUID.
- No new store, event bus, provider, endpoint, router, observer, timer, or poller was added.

### 6. Senior Engineer

- Added one boolean persistence helper around the existing fallback `localStorage.setItem()`.
- The click path now exits on failed persistence before changing `aria-pressed`.
- Failure copy mirrors the already-proven UUID Favorite contract.
- On success, stale failure `aria-label` is cleared before canonical pressed state and label are applied.
- A pre-CI source review caught and removed an unrelated HTML-escape transcription regression before tests were added.

### 7. QA Engineer

Focused v140 coverage locks:

1. the existing My Titans profile as the only audited Favorite persistence authority;
2. persistence-before-pressed-state ordering;
3. retryable failed add/remove truth without an invented preference state;
4. canonical copy restoration only after success;
5. failure-language parity with UUID Player Intelligence;
6. the existing account-sync hook and audited-name-to-UUID route ownership;
7. no new provider, timer, poller, preference namespace, or lifecycle owner.

The complete Titans Quality Gate is required on the final current synthetic PR merge before merge readiness.

### 8. Security Engineer

- No auth, account API, URL trust, external-link, provider, or server boundary changed.
- No user-controlled content is inserted through new HTML paths.
- Failure copy is static and only existing roster-verified player identity is persisted.

### 9. DevOps / SRE

- No request volume, polling cadence, timer, observer count, build dependency, workflow, or deployment configuration changed.
- The repair is synchronous and device-local at the already-existing preference write boundary.
- Full secret, syntax, Cloudflare build, and offline closure checks remain mandatory.

### 10. VP Engineering

Merge readiness requires all of the following on the final branch state:

- current `main` is the tested PR base;
- compare reports `behind_by = 0`;
- only the intended three files differ;
- the complete Titans Quality Gate succeeds on the current synthetic PR merge;
- focused v140 and related Player Favorite / audited-route regressions pass;
- raw GitHub reports `mergeable=true`, `rebaseable=true`, and `mergeable_state="clean"`.

If `main` advances, the exact feature blobs must be resynchronized onto the new base and the complete gate rerun. A green gate on a stale base is historical evidence only.
