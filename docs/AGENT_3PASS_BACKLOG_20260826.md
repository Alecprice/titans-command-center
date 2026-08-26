# Three-pass five-agent audit — 2026-08-26

This backlog consolidates three independent passes using the project’s five-role review sequence: Product Growth / Competitive Intelligence, Manager, Principal Engineer, Senior UX/UI, and Resolution / Polish, followed by security/release synthesis. Repeated findings are promoted rather than duplicated.

## P0 — release blockers

- [x] **Fix stale post-click browser-state sampling in Player Intelligence / Game Day production smoke.** The Cutdown panel was visible and connected while the smoke kept returning the pre-click `aria-pressed` value. Re-query controls and panes after activation before evaluating settled state. Apply the same fix to Player tabs because they used the same pattern.
- [x] **Gate preseason stat completeness explicitly.** Production must distinguish completed schedule games from detailed player-stat gamebooks, reconcile coverage totals, expose `statsAvailable`, and require a diagnostic for missing completed-game player detail.
- [ ] **Run the full production browser chain after the smoke fix.** Do not treat the issue as resolved until later gates execute instead of being skipped.

## P1 — data completeness and fan trust

- [ ] **Backfill Seattle P2 detailed player stats from an auditable source if available.** Do not fabricate data and do not turn missing rows into zeroes. Prefer an official Titans/NFL gamebook; use a secondary source only with explicit provenance.
- [ ] **Bridge Player Intelligence to verified preseason box-score data when warehouse player rows are absent.** Label the source and season context clearly; never present preseason numbers as regular-season totals.
- [ ] **Audit current roster/headshot alignment after automated headshot refreshes.** Report approved-host coverage gaps by current official player identity, not by stale roster snapshots.

## P1 — runtime stability

- [ ] **Stress Team Room URL/view ownership under repeated roster hydration.** One canonical view state should own `aria-pressed`, panel visibility, and `#roster?view=` after asynchronous rerenders.
- [ ] **Audit all click-and-immediately-read browser helpers for the same stale-state pattern.** Replace pre-click snapshots with post-action re-query or explicit waits.
- [ ] **Verify Home enrichment mounts stay single-instance after refresh and route churn.** Open PR #133 may be superseded; compare it to current main before deciding whether anything remains.

## P2 — repository and release hygiene

- [ ] **Triage stale open PRs #136, #133, #132, and #123.** Compare each against current main; close only when clearly superseded, otherwise salvage still-useful isolated changes onto a current branch.
- [ ] **Make release reporting emphasize the first failed gate plus all skipped downstream gates.** This should make masking failures obvious in one glance.
- [ ] **Keep production roster assertions dynamic.** Validate plausible roster bounds and cross-API agreement rather than freezing an exact camp count.

## P2 — usability / information architecture

- [ ] **Continue readability audit on dense secondary surfaces.** The global readability floor is improved; verify Command Intelligence, Fantasy, Sources, and Team Room at 390px and desktop with real data.
- [ ] **Reduce feature-density before adding more breadth.** Growth/UX passes consistently favored clearer current-game, roster, transaction, and stats truth over additional dashboard modules.
- [ ] **Expose data freshness and coverage near the decision point.** Fans should see whether a stat is current, prior-season baseline, missing upstream, or not applicable without opening diagnostics.

## Release rule

A task is not complete because unit tests pass. For browser/runtime findings, require the relevant production smoke to pass on the exact deployed commit, then confirm downstream gates execute successfully.
