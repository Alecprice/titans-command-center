# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `73f3983df4724c635ea7f8f648072eea6ceed62f`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
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
- Recorded: 2026-08-25T01:52:10Z

## Quality gate failure context

```text

--- tail ---
✔ core router degrades malformed dates and render failures instead of trapping navigation (0.473995ms)
✔ shared feed time helpers never expose NaN labels (0.304288ms)
✔ fan-facing base pages prefer live/backup language over storage implementation jargon (0.409795ms)
✔ roster team-room switcher has plain button semantics, keyboard cycling and safe source links (0.548824ms)
✔ rich player pages use the server player endpoint (0.370913ms)
✔ fan status UI uses reader-friendly coverage language instead of implementation jargon (0.383777ms)
✔ source activity distinguishes checked rows from new rows in fan-readable language (0.334264ms)
✔ v0.6 database adapter uses current live schema columns (0.53556ms)
✔ visual archive uses audited metadata instead of ambiguous legacy aliases (0.511044ms)
✔ responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint (0.339484ms)
✔ visual source registry includes official, specialist and Wikipedia cross-checks (1.171477ms)
✔ active visual catalog never uses quarantined legacy aliases (0.482461ms)
✔ representative and composite art cannot masquerade as exact official logos (1.587793ms)
✔ 2018 is treated as a uniform and wordmark change, not a new primary logo (0.275925ms)
✔ Tennessee Oilers transition preserves alternate-logo nuance (0.330597ms)
✔ current Shield receives exact current-brand treatment (0.161782ms)
✔ external workflow actions are pinned to immutable commit SHAs (2.15321ms)
✔ Node-powered release workflows explicitly use Node 24 without package-manager caching (0.454208ms)
✔ security-sensitive workflows retain least-privilege repository permissions (0.417589ms)
✔ read-only workflow checkouts do not persist repository credentials (0.359321ms)
✔ Cloudflare status writer syncs to current main before committing its generated report (0.23601ms)
✔ critical workflow dependencies stay on the reviewed pinned releases (0.298106ms)
ℹ tests 431
ℹ suites 0
ℹ pass 431
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2331.239891

> titans-command-center@1.0.0 audit:content
> node scripts/content-audit.mjs

✓ current team identity metadata
✓ franchise milestone dates preserve 1959 vs 1960 distinction
✓ 2026 schedule contains Week 9 bye
✓ Week 18 stays genuinely TBD at current Reliant Stadium name
✓ preseason results and Bears broadcast are current through Aug. 24
✓ fallback roster reflects the Aug. 24 official transaction precedence
✓ cross-source roster conflicts are explicit and freshness-aware
✓ fallback player metadata avoids unsupported editorial tags
✓ Peter Skoronski fallback position matches official roster
✓ fallback feed carries the current Aug. 24 transaction and Seattle result
✓ fallback feed contains sourceable links instead of placeholder social claims
✓ fallback source labels distinguish primary authorities from active persistence
✓ injury and staff semantics are current
✓ visual labels are source-audited and active art avoids legacy aliases
✓ base app no longer requests retired duplicate legacy assets
✓ responsive system has deliberate phone, tablet and desktop modes
✓ ingest runtime identifies the current production release

Content audit passed: 21 schedule rows, 96 audited fallback players, 10 sourced fallback feed items, 6 audited visual assets.

> titans-command-center@1.0.0 secret-scan
> node scripts/check-secrets.mjs

Secret scan passed: no embedded deployment credentials detected.

> titans-command-center@1.0.0 syntax-check
> node scripts/check-syntax.mjs

Syntax check passed: 170 JavaScript modules.

> titans-command-center@1.0.0 build:cloudflare
> node scripts/build-cloudflare.mjs

Cloudflare static build: 116 files, 938.8 KiB

> titans-command-center@1.0.0 verify:cloudflare
> node scripts/check-cloudflare-build.mjs

file:///home/runner/work/titans-command-center/titans-command-center/scripts/check-cloudflare-build.mjs:78
    if(shellPathSet.has(importerPublic)&&!shellPathSet.has(importedPublic))throw new Error(`Offline PWA dependency is not precached: ${importerPublic} -> ${importedPublic}`);
                                                                                 ^

Error: Offline PWA dependency is not precached: /src/data.mjs -> /src/roster-audit-20260824.mjs
    at file:///home/runner/work/titans-command-center/titans-command-center/scripts/check-cloudflare-build.mjs:78:82

Node.js v24.19.0
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
