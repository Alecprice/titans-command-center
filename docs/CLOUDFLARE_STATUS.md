# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `c719cae5702b130000fef5da6578a85927fd56da`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-20T21:47:33Z

## Quality gate failure context

```text
not ok 1 - one serverless gateway owns the API directory
  ---
  duration_ms: 6.08382
  location: '/home/runner/work/titans-command-center/titans-command-center/tests/api-gateway.test.mjs:22:1'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly deep-equal:
    + actual - expected
    
      [
    +   'advanced-analytics.js',
        'index.js'
      ]
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
    0: 'index.js'
  actual:
    0: 'advanced-analytics.js'
    1: 'index.js'
  operator: 'deepStrictEqual'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/api-gateway.test.mjs:24:10)
    Test.runInAsyncScope (node:async_hooks:206:9)
    Test.run (node:internal/test_runner/test:796:25)
    Test.processPendingSubtests (node:internal/test_runner/test:526:18)
    node:internal/test_runner/harness:255:12
    node:internal/process/task_queues:140:7
    AsyncResource.runInAsyncScope (node:async_hooks:206:9)
    AsyncResource.runMicrotask (node:internal/process/task_queues:137:8)
  ...
# Subtest: gateway rejects unknown routes cleanly
ok 2 - gateway rejects unknown routes cleanly
  ---
  duration_ms: 0.692415
  ...
# Subtest: public odds route rejects cache-busting query params before provider calls
ok 3 - public odds route rejects cache-busting query params before provider calls
  ---
  duration_ms: 0.778176
  ...
# Subtest: sync remains POST-only before auth is evaluated
ok 4 - sync remains POST-only before auth is evaluated
  ---
  duration_ms: 0.366486
  ...
# Subtest: provider diagnostics remain GET-only
ok 5 - provider diagnostics remain GET-only
  ---
  duration_ms: 0.320019
  ...
# Subtest: Vercel rewrites preserve the public API contract
ok 6 - Vercel rewrites preserve the public API contract
  ---
  duration_ms: 0.583843
  ...
# Subtest: health endpoint treats optional warehouse loss as degraded, not app-down
ok 7 - health endpoint treats optional warehouse loss as degraded, not app-down
  ---
  duration_ms: 0.799686
  ...
# Subtest: Cloudflare Worker serves static assets and runs only API paths through compute
ok 8 - Cloudflare Worker serves static assets and runs only API paths through compute
  ---
  duration_ms: 1.955658
  ...
# Subtest: Cloudflare adapter uses native Worker env for core API routes and trusted scheduler
ok 9 - Cloudflare adapter uses native Worker env for core API routes and trusted scheduler
  ---
  duration_ms: 0.305612

--- tail ---
  ...
# Subtest: fan-facing base pages prefer live/backup language over storage implementation jargon
ok 62 - fan-facing base pages prefer live/backup language over storage implementation jargon
  ---
  duration_ms: 0.392243
  ...
# Subtest: roster team-room switcher has plain button semantics, keyboard cycling and safe source links
ok 63 - roster team-room switcher has plain button semantics, keyboard cycling and safe source links
  ---
  duration_ms: 0.570567
  ...
# Subtest: rich player pages use the server player endpoint
ok 64 - rich player pages use the server player endpoint
  ---
  duration_ms: 0.498773
  ...
# Subtest: fan status UI uses reader-friendly coverage language instead of implementation jargon
ok 65 - fan status UI uses reader-friendly coverage language instead of implementation jargon
  ---
  duration_ms: 0.3689
  ...
# Subtest: source activity distinguishes checked rows from new rows in fan-readable language
ok 66 - source activity distinguishes checked rows from new rows in fan-readable language
  ---
  duration_ms: 0.436947
  ...
# Subtest: v0.6 database adapter uses current live schema columns
ok 67 - v0.6 database adapter uses current live schema columns
  ---
  duration_ms: 0.525052
  ...
# Subtest: visual archive uses audited metadata instead of ambiguous legacy aliases
ok 68 - visual archive uses audited metadata instead of ambiguous legacy aliases
  ---
  duration_ms: 0.397684
  ...
# Subtest: responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
ok 69 - responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
  ---
  duration_ms: 0.383116
  ...
# Subtest: visual source registry includes official, specialist and Wikipedia cross-checks
ok 70 - visual source registry includes official, specialist and Wikipedia cross-checks
  ---
  duration_ms: 1.944497
  ...
# Subtest: active visual catalog never uses quarantined legacy aliases
ok 71 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.509693
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 72 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 1.017584
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 73 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 1.747048
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 74 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.393295
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 75 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.214041
  ...
1..75
# tests 75
# suites 0
# pass 74
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 358.64202
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
