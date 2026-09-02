# TENX — Audited Player preseason resilience

Date: 2026-09-02
Branch: `tenx/audited-player-preseason-resilience-v141`

## Fan problem

Audited-name Player Intelligence correctly uses `/api/data` as its verified roster identity source and `/api/preseason-stats` only as optional official preseason enrichment. Before this pass, however, the optional preseason response was always parsed as JSON. A temporary non-JSON upstream/error body could therefore throw before the already-verified roster profile rendered, turning an optional detail outage into a full `Player profile unavailable` state.

The UUID Player Intelligence path already fails soft when optional preseason detail is unavailable. The audited-name path should obey the same trust boundary.

## TENX 10-role review

1. **Technical Program Manager** — keep this repair isolated to audited Player Intelligence and avoid active Tickets, Fantasy, Legacy, Game Day, and mobile lanes.
2. **Product Manager** — a verified current-roster player should remain usable when optional preseason detail is temporarily unavailable.
3. **UX Researcher** — preserve the player identity and existing explicit source-coverage/zero-claim empty states instead of escalating to a generic whole-profile failure.
4. **UI Designer** — reuse the existing audited profile, tabs, and empty-state presentation; add no new panel or competing status surface.
5. **Software Architect** — keep `/api/data` required and authoritative for audited identity; keep `/api/preseason-stats` optional enrichment only.
6. **Senior Engineer** — parse preseason JSON only for an OK response and convert malformed optional JSON to `null`; leave required roster parsing and validation strict.
7. **QA Engineer** — lock non-OK and malformed preseason behavior, required roster fail-closed behavior, UUID parity, existing no-fake-zero copy, and ownership counts.
8. **Security Engineer** — preserve the same same-origin endpoints, output escaping, Favorite persistence boundary, and route ownership; no new untrusted rendering path.
9. **DevOps/SRE** — prevent an optional dependency failure from amplifying into a full audited Player outage while retaining explicit failure for the required identity source.
10. **VP Engineering** — approve only the smallest parity repair: one production-line change plus focused regression coverage, with no architecture expansion.

## Implementation

`player-polish.js` now keeps the two existing requests concurrent, then:

- parses `/api/data` exactly as before and continues to fail closed when that required payload is unavailable or not OK;
- skips JSON parsing for a non-OK `/api/preseason-stats` response;
- catches malformed JSON from an otherwise-OK optional preseason response and treats it as missing enrichment;
- passes the existing empty preseason object into audited profile rendering unless the optional payload is both parsed and `ok`.

No fan-visible stat is fabricated. The existing audited Player states remain authoritative, including `Verified production is awaiting source coverage`, `No zeroes are invented`, and `No verified player-game rows loaded`.

## Trust and ownership boundary

Unchanged:

- current audited roster data remains the player identity authority;
- UUID routes still upgrade only from a real UUID supplied by current loaded data;
- Favorite state remains `titans:v15MyTitans` and its existing account-sync hook;
- `/api/preseason-stats` remains optional official-detail enrichment;
- no provider, API route, persistence key, observer, poller, timer, event bus, or lifecycle owner is added.

## Focused regression

`tests/tenx-audited-player-preseason-resilience-v141.test.mjs` verifies seven contracts:

1. required `/api/data` roster identity remains strict;
2. non-OK preseason responses are not parsed;
3. malformed optional preseason JSON fails soft and still reaches audited rendering with empty enrichment;
4. existing source-coverage and no-fake-zero states remain intact;
5. UUID Player Intelligence retains the matching optional-preseason fail-soft boundary;
6. required roster failure still blocks profile construction;
7. provider, persistence, timer, poller, observer, lifecycle, Favorite, and five-tab ownership remain unchanged.

## Merge-readiness rule

This change is not merge-ready until the full Titans Quality Gate succeeds on the current synthetic PR merge, the branch is zero commits behind current `main`, only the three intended files differ, and GitHub reports the PR mergeable, rebaseable, and clean. If `main` advances after a green run, the exact reviewed feature blobs must be resynced and the full gate rerun.
