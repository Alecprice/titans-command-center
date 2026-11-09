# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `e0123f275d19f8b006aa513409385a738b511190`
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
- Recorded: 2026-11-09T21:38:15Z

## Quality gate failure context

```text

--- tail ---
✔ all configured free ticket providers run in parallel instead of fallback order (0.798794ms)
✔ ticket price groups always progress cheapest to most expensive (2.083538ms)
✔ SeatGeek event summaries normalize and sort by lowest price first (0.671231ms)
✔ ticket purchase URLs fail closed to the official SeatGeek Titans page (0.256126ms)
✔ Ticket Center explains comparison scope instead of inventing individual seat listings (8.252ms)
✔ Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage (2.445474ms)
✔ Home has a prominent Ticket Finder entry without changing the five-action mobile dock (1.864638ms)
✔ transaction chronology is newest-first without trusting provider order (1.48698ms)
✔ equal transaction dates keep source order stable (0.199501ms)
✔ latest transaction requires a real date instead of promoting an undated row (0.18586ms)
✔ shared runtime publishes the canonical transaction chronology helpers (0.24582ms)
✔ base Home and Transactions normalize transaction truth through core ownership (0.186932ms)
✔ Transactions enhancement sorts rows before rendering while preserving fail-soft behavior (0.116996ms)
✔ Fantasy latest move uses shared chronology and only dated fallback rows (0.140141ms)
✔ transaction chronology repair adds no provider persistence or lifecycle owner (0.304709ms)
✔ transaction calendar dates preserve the supplied date instead of browser-local rollover (15.014166ms)
✔ transaction feed refresh timestamp is explicitly Nashville time (0.211299ms)
✔ transaction calendar formatter keeps invalid and missing dates safe (0.113281ms)
✔ fan, player, team-room, source-activity and responsive assets are loaded (1.652639ms)
✔ service worker keeps API responses out of cache and versions current shell (0.238699ms)
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.231639ms)
✔ shared feed time helpers never expose NaN labels (0.172681ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.174803ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.253692ms)
✔ rich player pages use the server player endpoint (0.187092ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.140742ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.249085ms)
✔ production data runtime no longer carries the retired warehouse adapter (1.007237ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.238049ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (0.122325ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (0.619573ms)
✔ active visual catalog never uses quarantined legacy aliases (1.066145ms)
✔ representative and composite art cannot masquerade as exact official logos (0.442756ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.168253ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.143917ms)
✔ current Shield receives exact current-brand treatment (0.085309ms)
✔ Week 1 opponent intel records a Sep 6 source audit without inventing new football facts (0.687586ms)
✔ Sep 6 audit preserves the qualified kicker and availability truth boundaries (0.293472ms)
✔ Sep 6 audit preserves exact Week 1 game identity and official-source bounds (1.543214ms)
✔ Week 1 opponent intelligence matches the scheduled Jets opener (0.69735ms)
✔ opponent roster spine uses post-cutdown active-roster evidence (0.691091ms)
✔ source truth qualifies stale unofficial depth-chart claims (0.293813ms)
✔ pre-game-week availability cannot masquerade as an injury designation (0.311039ms)
✔ consumer clones cannot mutate the frozen source snapshot (0.808447ms)
✔ external workflow actions are pinned to immutable commit SHAs (2.149999ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.283648ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.255195ms)
✔ read-only workflow checkouts do not persist repository credentials (0.254924ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.158969ms)
✔ cancelled Cloudflare releases never publish generated deployment status (0.671702ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.441074ms)
ℹ tests 1935
ℹ suites 0
ℹ pass 1934
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 7391.20433

✖ failing tests:

test at tests/player-headshots.test.mjs:9:1
✖ nflreadpy headshot manifest has useful current Titans coverage (5.783001ms)
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
