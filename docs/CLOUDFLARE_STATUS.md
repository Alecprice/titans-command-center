# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `5043a97500ee90f9be40d6e9ce6b0fc64a8fe991`
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
- Recorded: 2026-11-11T18:53:09Z

## Quality gate failure context

```text

--- tail ---
✔ all configured free ticket providers run in parallel instead of fallback order (1.388065ms)
✔ ticket price groups always progress cheapest to most expensive (2.419952ms)
✔ SeatGeek event summaries normalize and sort by lowest price first (0.751312ms)
✔ ticket purchase URLs fail closed to the official SeatGeek Titans page (0.201816ms)
✔ Ticket Center explains comparison scope instead of inventing individual seat listings (7.600688ms)
✔ Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage (2.257799ms)
✔ Home has a prominent Ticket Finder entry without changing the five-action mobile dock (1.125029ms)
✔ transaction chronology is newest-first without trusting provider order (2.384794ms)
✔ equal transaction dates keep source order stable (0.405377ms)
✔ latest transaction requires a real date instead of promoting an undated row (0.359684ms)
✔ shared runtime publishes the canonical transaction chronology helpers (0.393266ms)
✔ base Home and Transactions normalize transaction truth through core ownership (0.303539ms)
✔ Transactions enhancement sorts rows before rendering while preserving fail-soft behavior (0.237125ms)
✔ Fantasy latest move uses shared chronology and only dated fallback rows (0.329743ms)
✔ transaction chronology repair adds no provider persistence or lifecycle owner (0.493926ms)
✔ transaction calendar dates preserve the supplied date instead of browser-local rollover (15.86858ms)
✔ transaction feed refresh timestamp is explicitly Nashville time (0.243652ms)
✔ transaction calendar formatter keeps invalid and missing dates safe (0.144269ms)
✔ fan, player, team-room, source-activity and responsive assets are loaded (2.794626ms)
✔ service worker keeps API responses out of cache and versions current shell (0.538093ms)
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.452382ms)
✔ shared feed time helpers never expose NaN labels (0.340716ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.356157ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.443099ms)
✔ rich player pages use the server player endpoint (0.36505ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.284981ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.300772ms)
✔ production data runtime no longer carries the retired warehouse adapter (1.72114ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.444306ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (0.219267ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (1.076532ms)
✔ active visual catalog never uses quarantined legacy aliases (1.443695ms)
✔ representative and composite art cannot masquerade as exact official logos (0.754571ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.294834ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.310941ms)
✔ current Shield receives exact current-brand treatment (0.179072ms)
✔ Week 1 opponent intel records a Sep 6 source audit without inventing new football facts (0.791441ms)
✔ Sep 6 audit preserves the qualified kicker and availability truth boundaries (0.287462ms)
✔ Sep 6 audit preserves exact Week 1 game identity and official-source bounds (1.094958ms)
✔ Week 1 opponent intelligence matches the scheduled Jets opener (1.168893ms)
✔ opponent roster spine uses post-cutdown active-roster evidence (1.117788ms)
✔ source truth qualifies stale unofficial depth-chart claims (0.417381ms)
✔ pre-game-week availability cannot masquerade as an injury designation (0.385724ms)
✔ consumer clones cannot mutate the frozen source snapshot (0.92246ms)
✔ external workflow actions are pinned to immutable commit SHAs (4.241376ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.569877ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.58507ms)
✔ read-only workflow checkouts do not persist repository credentials (0.458484ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.330227ms)
✔ cancelled Cloudflare releases never publish generated deployment status (1.322145ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.697343ms)
ℹ tests 1935
ℹ suites 0
ℹ pass 1934
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 10224.979306

✖ failing tests:

test at tests/player-headshots.test.mjs:9:1
✖ nflreadpy headshot manifest has useful current Titans coverage (17.282271ms)
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
