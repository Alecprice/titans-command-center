# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `3ef28059b142646c0e81233566cf008e9ab7bce9`
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
- Recorded: 2026-11-04T18:53:02Z

## Quality gate failure context

```text

--- tail ---
✔ all configured free ticket providers run in parallel instead of fallback order (1.070572ms)
✔ ticket price groups always progress cheapest to most expensive (3.425188ms)
✔ SeatGeek event summaries normalize and sort by lowest price first (1.146064ms)
✔ ticket purchase URLs fail closed to the official SeatGeek Titans page (0.393255ms)
✔ Ticket Center explains comparison scope instead of inventing individual seat listings (10.426368ms)
✔ Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage (2.787531ms)
✔ Home has a prominent Ticket Finder entry without changing the five-action mobile dock (1.537938ms)
✔ transaction chronology is newest-first without trusting provider order (2.01505ms)
✔ equal transaction dates keep source order stable (0.273643ms)
✔ latest transaction requires a real date instead of promoting an undated row (0.364241ms)
✔ shared runtime publishes the canonical transaction chronology helpers (0.40048ms)
✔ base Home and Transactions normalize transaction truth through core ownership (0.305291ms)
✔ Transactions enhancement sorts rows before rendering while preserving fail-soft behavior (0.227645ms)
✔ Fantasy latest move uses shared chronology and only dated fallback rows (0.255017ms)
✔ transaction chronology repair adds no provider persistence or lifecycle owner (0.449862ms)
✔ transaction calendar dates preserve the supplied date instead of browser-local rollover (24.902874ms)
✔ transaction feed refresh timestamp is explicitly Nashville time (0.27806ms)
✔ transaction calendar formatter keeps invalid and missing dates safe (0.243125ms)
✔ fan, player, team-room, source-activity and responsive assets are loaded (2.605114ms)
✔ service worker keeps API responses out of cache and versions current shell (0.346117ms)
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.330469ms)
✔ shared feed time helpers never expose NaN labels (0.280826ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.314909ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.391392ms)
✔ rich player pages use the server player endpoint (0.317925ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.268733ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.44909ms)
✔ production data runtime no longer carries the retired warehouse adapter (1.609281ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.338684ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (0.195115ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (1.307186ms)
✔ active visual catalog never uses quarantined legacy aliases (1.841976ms)
✔ representative and composite art cannot masquerade as exact official logos (0.764811ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.335428ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.343333ms)
✔ current Shield receives exact current-brand treatment (0.220963ms)
✔ Week 1 opponent intel records a Sep 6 source audit without inventing new football facts (0.961059ms)
✔ Sep 6 audit preserves the qualified kicker and availability truth boundaries (0.356246ms)
✔ Sep 6 audit preserves exact Week 1 game identity and official-source bounds (4.076527ms)
✔ Week 1 opponent intelligence matches the scheduled Jets opener (0.999149ms)
✔ opponent roster spine uses post-cutdown active-roster evidence (0.84453ms)
✔ source truth qualifies stale unofficial depth-chart claims (0.299059ms)
✔ pre-game-week availability cannot masquerade as an injury designation (0.366596ms)
✔ consumer clones cannot mutate the frozen source snapshot (0.703456ms)
✔ external workflow actions are pinned to immutable commit SHAs (3.502684ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.440344ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.723734ms)
✔ read-only workflow checkouts do not persist repository credentials (0.409907ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.371395ms)
✔ cancelled Cloudflare releases never publish generated deployment status (1.268104ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.815325ms)
ℹ tests 1935
ℹ suites 0
ℹ pass 1934
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 10712.068943

✖ failing tests:

test at tests/player-headshots.test.mjs:9:1
✖ nflreadpy headshot manifest has useful current Titans coverage (8.062111ms)
  AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
  
    assert.ok(names.has('jefferysimmons'))
  
      at TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/player-headshots.test.mjs:31:10)
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
