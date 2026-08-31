# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `28e3556338ef6dbed960d65bfd9879b88dbc1f69`
- Quality gate: cancelled
- Cloudflare credentials available: true
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: skipped
- Canonical front door: skipped
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
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-31T23:09:21Z

## Quality gate failure context

```text

--- tail ---
✔ Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage (2.363135ms)
✔ Home has a prominent Ticket Finder entry without changing the five-action mobile dock (1.316323ms)
✔ transaction calendar dates preserve the supplied date instead of browser-local rollover (21.83015ms)
✔ transaction feed refresh timestamp is explicitly Nashville time (0.272374ms)
✔ transaction calendar formatter keeps invalid and missing dates safe (0.213346ms)
✔ fan, player, team-room, source-activity and responsive assets are loaded (2.264569ms)
✔ service worker keeps API responses out of cache and versions current shell (0.312484ms)
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.386533ms)
✔ shared feed time helpers never expose NaN labels (0.200578ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.350169ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.382076ms)
✔ rich player pages use the server player endpoint (0.29699ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.253145ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.376509ms)
✔ production data runtime no longer carries the retired warehouse adapter (0.530066ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.338522ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (1.177487ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (1.259418ms)
✔ active visual catalog never uses quarantined legacy aliases (0.533281ms)
✔ representative and composite art cannot masquerade as exact official logos (1.536108ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.369689ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.320576ms)
✔ current Shield receives exact current-brand treatment (0.218585ms)
✔ external workflow actions are pinned to immutable commit SHAs (4.485093ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.533501ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.624356ms)
✔ read-only workflow checkouts do not persist repository credentials (0.443418ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.444859ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.801509ms)
ℹ tests 723
ℹ suites 0
ℹ pass 723
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3840.283502

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

Syntax check passed: 268 JavaScript modules, 23 Python scripts.

> titans-command-center@1.0.0 build:cloudflare
> node scripts/build-cloudflare.mjs

Cloudflare static build: 138 files, 1127.0 KiB

> titans-command-center@1.0.0 verify:cloudflare
> node scripts/check-cloudflare-build.mjs

Cloudflare static build verification passed (91 HTML shell refs, 130 PWA shell paths, 77 browser modules verified, offline dependency closure checked, commit 28e3556338ef6dbed960d65bfd9879b88dbc1f69).
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
