# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `dcf806b709a36ca29fd31282ddbb37f7594cf7a7`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-29T21:38:03Z

## Quality gate failure context

```text

--- tail ---
✔ ticket purchase URLs fail closed to the official SeatGeek Titans page (0.29957ms)
✔ Ticket Center explains comparison scope instead of inventing individual seat listings (11.594749ms)
✔ Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage (3.257159ms)
✔ Home has a prominent Ticket Finder entry without changing the five-action mobile dock (2.227492ms)
✔ transaction calendar dates preserve the supplied date instead of browser-local rollover (16.705064ms)
✔ transaction feed refresh timestamp is explicitly Nashville time (0.218539ms)
✔ transaction calendar formatter keeps invalid and missing dates safe (0.241983ms)
✔ fan, player, team-room, source-activity and responsive assets are loaded (3.908682ms)
✔ service worker keeps API responses out of cache and versions current shell (0.374149ms)
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.507569ms)
✔ shared feed time helpers never expose NaN labels (0.26175ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.444943ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.600613ms)
✔ rich player pages use the server player endpoint (0.668199ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.256339ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.759465ms)
✔ v0.6 database adapter uses current live schema columns (0.47071ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.264665ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (1.725346ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (1.209071ms)
✔ active visual catalog never uses quarantined legacy aliases (0.552924ms)
✔ representative and composite art cannot masquerade as exact official logos (5.164577ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.331731ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.323244ms)
✔ current Shield receives exact current-brand treatment (0.203731ms)
✔ external workflow actions are pinned to immutable commit SHAs (2.435944ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.413233ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.434272ms)
✔ read-only workflow checkouts do not persist repository credentials (0.317103ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.269734ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.384158ms)
ℹ tests 667
ℹ suites 0
ℹ pass 667
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3708.105488

> titans-command-center@1.0.0 audit:content
> node scripts/content-audit.mjs

✓ current team identity metadata
✓ franchise milestone dates preserve 1959 vs 1960 distinction
✓ 2026 schedule contains Week 9 bye
✓ Week 18 stays genuinely TBD at current Reliant Stadium name
✓ preseason results and Bears broadcast are current through Aug. 27
✓ fallback roster reflects the Aug. 27 official roster snapshot
✓ cross-source roster conflicts are explicit and freshness-aware
✓ fallback player metadata avoids unsupported editorial tags
✓ Peter Skoronski fallback position matches official roster
✓ fallback feed carries the current Aug. 25 transaction and Seattle result
✓ fallback feed contains sourceable links instead of placeholder social claims
✓ fallback source labels distinguish primary authorities from active persistence
✓ injury and staff semantics are current
✓ visual labels are source-audited and active art avoids legacy aliases
✓ base app no longer requests retired duplicate legacy assets
✓ responsive system has deliberate phone, tablet and desktop modes
✓ ingest runtime identifies the current production release

Content audit passed: 21 schedule rows, 95 audited fallback players, 11 sourced fallback feed items, 6 audited visual assets.

> titans-command-center@1.0.0 secret-scan
> node scripts/check-secrets.mjs

Secret scan passed: no embedded deployment credentials detected.

> titans-command-center@1.0.0 syntax-check
> node scripts/check-syntax.mjs

Syntax check failed: scripts/configure-d1.mjs
/home/runner/work/titans-command-center/titans-command-center/scripts/configure-d1.mjs:24
    .replace(/"run_worker_first": \[\n\s*"\\/api\\/\\*"\n\s*\]/,'"run_worker_first": ["/api/*"]');
             ^

SyntaxError: Invalid regular expression flags
    at checkSyntax (node:internal/main/check_syntax:72:5)

Node.js v24.19.0
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
