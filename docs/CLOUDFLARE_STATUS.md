# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `45480d342ed6841ce0a9d12eb7f3d58df14fe536`
- Quality gate: failure
- Cloudflare credentials available: true
- Source still current main: unknown
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers staged in GitHub: SeatGeek=false, Ticketmaster=false, StubHub=false
- Fan Event secrets staged in GitHub: Eventbrite=false, Eventbrite org IDs=false, Skiddle=false
- Fan Event runtime readiness: see the production regression evidence below; direct Worker secrets may be configured even when GitHub staging is false
- Deploy outcome: skipped
- Canonical front door: skipped
- Production regression: skipped
- Fan Events production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
- Ticket Center browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: existing deployment remains unchanged
- Recorded: 2026-11-27T20:19:22Z

## Quality gate failure context

```text

--- tail ---
✔ all configured free ticket providers run in parallel instead of fallback order (0.859276ms)
✔ ticket price groups always progress cheapest to most expensive (2.046427ms)
✔ SeatGeek event summaries normalize and sort by lowest price first (0.563636ms)
✔ ticket purchase URLs fail closed to the official SeatGeek Titans page (0.197524ms)
✔ Ticket Center explains comparison scope instead of inventing individual seat listings (7.972043ms)
✔ Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage (2.392772ms)
✔ Home has a prominent Ticket Finder entry without changing the five-action mobile dock (1.727173ms)
✔ transaction chronology is newest-first without trusting provider order (2.233094ms)
✔ equal transaction dates keep source order stable (0.336319ms)
✔ latest transaction requires a real date instead of promoting an undated row (0.258764ms)
✔ shared runtime publishes the canonical transaction chronology helpers (0.290391ms)
✔ base Home and Transactions normalize transaction truth through core ownership (0.207619ms)
✔ Transactions enhancement sorts rows before rendering while preserving fail-soft behavior (0.149462ms)
✔ Fantasy latest move uses shared chronology and only dated fallback rows (0.203703ms)
✔ transaction chronology repair adds no provider persistence or lifecycle owner (0.368136ms)
✔ transaction calendar dates preserve the supplied date instead of browser-local rollover (17.343224ms)
✔ transaction feed refresh timestamp is explicitly Nashville time (0.242179ms)
✔ transaction calendar formatter keeps invalid and missing dates safe (0.150784ms)
✔ fan, player, team-room, source-activity and responsive assets are loaded (2.921646ms)
✔ service worker keeps API responses out of cache and versions current shell (0.291333ms)
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.35029ms)
✔ shared feed time helpers never expose NaN labels (0.198966ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.259916ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.346074ms)
✔ rich player pages use the server player endpoint (0.400214ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.231794ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.245915ms)
✔ production data runtime no longer carries the retired warehouse adapter (0.578909ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.304452ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (0.172105ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (1.020184ms)
✔ active visual catalog never uses quarantined legacy aliases (1.1318ms)
✔ representative and composite art cannot masquerade as exact official logos (0.513152ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.275219ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.266716ms)
✔ current Shield receives exact current-brand treatment (0.164334ms)
✔ Week 1 opponent intel records a Sep 6 source audit without inventing new football facts (0.894357ms)
✔ Sep 6 audit preserves the qualified kicker and availability truth boundaries (0.277011ms)
✔ Sep 6 audit preserves exact Week 1 game identity and official-source bounds (1.015989ms)
✔ Week 1 opponent intelligence matches the scheduled Jets opener (0.728341ms)
✔ opponent roster spine uses post-cutdown active-roster evidence (0.614612ms)
✔ source truth qualifies stale unofficial depth-chart claims (0.277532ms)
✔ pre-game-week availability cannot masquerade as an injury designation (0.251414ms)
✔ consumer clones cannot mutate the frozen source snapshot (0.252054ms)
✔ external workflow actions are pinned to immutable commit SHAs (5.791577ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.349158ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.43128ms)
✔ read-only workflow checkouts do not persist repository credentials (0.381336ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.247467ms)
✔ cancelled Cloudflare releases never publish generated deployment status (0.982699ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.557918ms)
ℹ tests 1935
ℹ suites 0
ℹ pass 1934
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 8684.736117

✖ failing tests:

test at tests/player-headshots.test.mjs:9:1
✖ nflreadpy headshot manifest has useful current Titans coverage (6.35245ms)
  AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
  
    assert.ok(names.has('amanihooker'))
  
      at TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/player-headshots.test.mjs:30:10)
      at Test.runInAsyncScope (node:async_hooks:227:14)
      at Test.run (node:internal/test_runner/test:1402:25)
      at Test.start (node:internal/test_runner/test:1262:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:387:17) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
