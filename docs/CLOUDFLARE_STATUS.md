# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `7805147407c26252773afb25f9b4ad4d57e8fa9b`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
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
- Recorded: 2026-08-23T02:27:01Z

## Quality gate failure context

```text

--- tail ---
ok 300 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.214078
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 301 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 0.417943
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 302 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 0.799253
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 303 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.249875
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 304 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.095935
  ...
1..304
# tests 304
# suites 0
# pass 304
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 974.325031

> titans-command-center@1.0.0 audit:content
> node scripts/content-audit.mjs

✓ current team identity metadata
✓ franchise milestone dates preserve 1959 vs 1960 distinction
✓ 2026 schedule contains Week 9 bye
✓ Week 18 stays genuinely TBD at current Reliant Stadium name
✓ fallback roster is the full dated cross-source audited snapshot
✓ cross-source roster conflicts are explicit and fact-specific
✓ fallback player metadata avoids unsupported editorial tags
✓ Peter Skoronski fallback position matches official roster
✓ fallback feed carries the current Aug. 19 transaction
✓ fallback feed contains sourceable links instead of placeholder social claims
✓ fallback source labels distinguish primary authorities from active persistence
✓ visual labels are source-audited and active art avoids legacy aliases
✓ base app no longer requests retired duplicate legacy assets
✓ ingest runtime identifies the current production release

Content audit passed: 21 schedule rows, 95 audited fallback players, 7 sourced fallback feed items, 6 audited visual assets.

> titans-command-center@1.0.0 secret-scan
> node scripts/check-secrets.mjs

Secret scan passed: no embedded deployment credentials detected.

> titans-command-center@1.0.0 syntax-check
> node scripts/check-syntax.mjs

Syntax check passed: 128 JavaScript modules.

> titans-command-center@1.0.0 build:cloudflare
> node scripts/build-cloudflare.mjs

Cloudflare static build: 105 files, 850.5 KiB

> titans-command-center@1.0.0 verify:cloudflare
> node scripts/check-cloudflare-build.mjs

file:///home/runner/work/titans-command-center/titans-command-center/scripts/check-cloudflare-build.mjs:66
    if(shellPathSet.has(importerPublic)&&!shellPathSet.has(importedPublic))throw new Error(`Offline PWA dependency is not precached: ${importerPublic} -> ${importedPublic}`);
                                                                                 ^

Error: Offline PWA dependency is not precached: /usability-runtime.js -> /freshness-truth-v20.js
    at file:///home/runner/work/titans-command-center/titans-command-center/scripts/check-cloudflare-build.mjs:66:82

Node.js v20.20.2
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
