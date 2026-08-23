# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `7eb674f3279dc5d1f1b33f9de10d50f86cbf4f24`
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
- Recorded: 2026-08-23T01:33:03Z

## Quality gate failure context

```text
not ok 103 - fallback roster is the full dated audited snapshot
  ---
  duration_ms: 2.700542
  location: '/home/runner/work/titans-command-center/titans-command-center/tests/content-integrity.test.mjs:30:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:
    + actual - expected
    
    + 'cross-source-audited-snapshot'
    - 'full-audited-snapshot'
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 'full-audited-snapshot'
  actual: 'cross-source-audited-snapshot'
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/content-integrity.test.mjs:31:10)
    Test.runInAsyncScope (node:async_hooks:206:9)
    Test.run (node:internal/test_runner/test:796:25)
    Test.processPendingSubtests (node:internal/test_runner/test:526:18)
    Test.postRun (node:internal/test_runner/test:889:19)
    Test.run (node:internal/test_runner/test:835:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:526:7)
  ...
# Subtest: fallback roster does not use unsourced opinion tags
ok 104 - fallback roster does not use unsourced opinion tags
  ---
  duration_ms: 0.313977
  ...
# Subtest: fallback feed is source-linked
ok 105 - fallback feed is source-linked
  ---
  duration_ms: 0.444652
  ...
# Subtest: live merge leaves null-date schedule rows alone
ok 106 - live merge leaves null-date schedule rows alone
  ---
  duration_ms: 0.66318
  ...
# Subtest: scripts/smart-search-browser-smoke.py isolates unrelated first-run onboarding
ok 107 - scripts/smart-search-browser-smoke.py isolates unrelated first-run onboarding
  ---
  duration_ms: 2.029777
  ...
# Subtest: scripts/mobile-navigation-browser-smoke.py isolates unrelated first-run onboarding
ok 108 - scripts/mobile-navigation-browser-smoke.py isolates unrelated first-run onboarding
  ---
  duration_ms: 0.318977
  ...
# Subtest: scripts/account-browser-smoke.py isolates unrelated first-run onboarding
ok 109 - scripts/account-browser-smoke.py isolates unrelated first-run onboarding
  ---
  duration_ms: 2.087725
  ...
# Subtest: scripts/market-browser-smoke.py isolates unrelated first-run onboarding
ok 110 - scripts/market-browser-smoke.py isolates unrelated first-run onboarding
  ---
  duration_ms: 0.411169
  ...
# Subtest: mobile and account smokes suppress test-only sheet motion and verify settled geometry
ok 111 - mobile and account smokes suppress test-only sheet motion and verify settled geometry
  ---
  duration_ms: 0.479898
  ...
# Subtest: account smoke reports explicit stage and browser state on failure
ok 112 - account smoke reports explicit stage and browser state on failure
  ---
  duration_ms: 0.339866
  ...

--- tail ---
  ...
# Subtest: fan-facing base pages prefer live/backup language over storage implementation jargon
ok 291 - fan-facing base pages prefer live/backup language over storage implementation jargon
  ---
  duration_ms: 0.435013
  ...
# Subtest: roster team-room switcher has plain button semantics, keyboard cycling and safe source links
ok 292 - roster team-room switcher has plain button semantics, keyboard cycling and safe source links
  ---
  duration_ms: 0.604721
  ...
# Subtest: rich player pages use the server player endpoint
ok 293 - rich player pages use the server player endpoint
  ---
  duration_ms: 0.439512
  ...
# Subtest: fan status UI uses reader-friendly coverage language instead of implementation jargon
ok 294 - fan status UI uses reader-friendly coverage language instead of implementation jargon
  ---
  duration_ms: 0.392985
  ...
# Subtest: source activity distinguishes checked rows from new rows in fan-readable language
ok 295 - source activity distinguishes checked rows from new rows in fan-readable language
  ---
  duration_ms: 0.403926
  ...
# Subtest: v0.6 database adapter uses current live schema columns
ok 296 - v0.6 database adapter uses current live schema columns
  ---
  duration_ms: 0.523249
  ...
# Subtest: visual archive uses audited metadata instead of ambiguous legacy aliases
ok 297 - visual archive uses audited metadata instead of ambiguous legacy aliases
  ---
  duration_ms: 0.403255
  ...
# Subtest: responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
ok 298 - responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
  ---
  duration_ms: 0.392014
  ...
# Subtest: visual source registry includes official, specialist and Wikipedia cross-checks
ok 299 - visual source registry includes official, specialist and Wikipedia cross-checks
  ---
  duration_ms: 1.772195
  ...
# Subtest: active visual catalog never uses quarantined legacy aliases
ok 300 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.373719
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 301 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 0.637733
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 302 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 0.993018
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 303 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.3263
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 304 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.161752
  ...
1..304
# tests 304
# suites 0
# pass 303
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 1537.793093
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
