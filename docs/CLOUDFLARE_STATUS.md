# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `d7855d3ee7c1fd84b2e4c3ceb7bfe68ccad8eb55`
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
- Recorded: 2026-11-19T19:38:23Z

## Quality gate failure context

```text

--- tail ---
✔ all configured free ticket providers run in parallel instead of fallback order (2.088898ms)
✔ ticket price groups always progress cheapest to most expensive (3.227014ms)
✔ SeatGeek event summaries normalize and sort by lowest price first (1.104292ms)
✔ ticket purchase URLs fail closed to the official SeatGeek Titans page (0.293601ms)
✔ Ticket Center explains comparison scope instead of inventing individual seat listings (12.641174ms)
✔ Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage (3.879578ms)
✔ Home has a prominent Ticket Finder entry without changing the five-action mobile dock (2.440068ms)
✔ transaction chronology is newest-first without trusting provider order (2.310514ms)
✔ equal transaction dates keep source order stable (0.30897ms)
✔ latest transaction requires a real date instead of promoting an undated row (0.397656ms)
✔ shared runtime publishes the canonical transaction chronology helpers (0.353192ms)
✔ base Home and Transactions normalize transaction truth through core ownership (0.291327ms)
✔ Transactions enhancement sorts rows before rendering while preserving fail-soft behavior (0.27183ms)
✔ Fantasy latest move uses shared chronology and only dated fallback rows (0.33068ms)
✔ transaction chronology repair adds no provider persistence or lifecycle owner (0.707798ms)
✔ transaction calendar dates preserve the supplied date instead of browser-local rollover (24.825563ms)
✔ transaction feed refresh timestamp is explicitly Nashville time (0.350508ms)
✔ transaction calendar formatter keeps invalid and missing dates safe (0.222288ms)
✔ fan, player, team-room, source-activity and responsive assets are loaded (2.384663ms)
✔ service worker keeps API responses out of cache and versions current shell (0.302177ms)
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.344998ms)
✔ shared feed time helpers never expose NaN labels (0.339246ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.280046ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.397856ms)
✔ rich player pages use the server player endpoint (0.332223ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.301486ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.502573ms)
✔ production data runtime no longer carries the retired warehouse adapter (1.569925ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.347993ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (0.214463ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (1.281053ms)
✔ active visual catalog never uses quarantined legacy aliases (4.046471ms)
✔ representative and composite art cannot masquerade as exact official logos (0.773251ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.379252ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.382919ms)
✔ current Shield receives exact current-brand treatment (0.22887ms)
✔ Week 1 opponent intel records a Sep 6 source audit without inventing new football facts (1.390318ms)
✔ Sep 6 audit preserves the qualified kicker and availability truth boundaries (0.428725ms)
✔ Sep 6 audit preserves exact Week 1 game identity and official-source bounds (1.848708ms)
✔ Week 1 opponent intelligence matches the scheduled Jets opener (1.49295ms)
✔ opponent roster spine uses post-cutdown active-roster evidence (1.26336ms)
✔ source truth qualifies stale unofficial depth-chart claims (0.453191ms)
✔ pre-game-week availability cannot masquerade as an injury designation (0.458891ms)
✔ consumer clones cannot mutate the frozen source snapshot (0.460695ms)
✔ external workflow actions are pinned to immutable commit SHAs (3.633967ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.501643ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.61295ms)
✔ read-only workflow checkouts do not persist repository credentials (0.403387ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.264285ms)
✔ cancelled Cloudflare releases never publish generated deployment status (0.418956ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.921429ms)
ℹ tests 1935
ℹ suites 0
ℹ pass 1934
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 11243.349925

✖ failing tests:

test at tests/player-headshots.test.mjs:9:1
✖ nflreadpy headshot manifest has useful current Titans coverage (10.70066ms)
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
