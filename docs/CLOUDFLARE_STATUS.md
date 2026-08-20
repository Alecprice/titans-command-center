# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `9e2412feca847f8881e956c4d1de3463ac672684`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-20T21:48:25Z

## Quality gate failure context

```text
not ok 1 - one serverless gateway owns the API directory
  ---
  duration_ms: 5.865499
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
  duration_ms: 2.81655
  ...
# Subtest: public odds route rejects cache-busting query params before provider calls
ok 3 - public odds route rejects cache-busting query params before provider calls
  ---
  duration_ms: 0.732383
  ...
# Subtest: sync remains POST-only before auth is evaluated
ok 4 - sync remains POST-only before auth is evaluated
  ---
  duration_ms: 0.523803
  ...
# Subtest: provider diagnostics remain GET-only
ok 5 - provider diagnostics remain GET-only
  ---
  duration_ms: 0.31304
  ...
# Subtest: Vercel rewrites preserve the public API contract
ok 6 - Vercel rewrites preserve the public API contract
  ---
  duration_ms: 0.629786
  ...
# Subtest: health endpoint treats optional warehouse loss as degraded, not app-down
ok 7 - health endpoint treats optional warehouse loss as degraded, not app-down
  ---
  duration_ms: 0.957291
  ...
# Subtest: Cloudflare Worker serves static assets and runs only API paths through compute
ok 8 - Cloudflare Worker serves static assets and runs only API paths through compute
  ---
  duration_ms: 2.231667
  ...
# Subtest: Cloudflare adapter uses native Worker env for core API routes and trusted scheduler
ok 9 - Cloudflare adapter uses native Worker env for core API routes and trusted scheduler
  ---
  duration_ms: 0.344642

--- tail ---
  ...
# Subtest: fan-facing base pages prefer live/backup language over storage implementation jargon
ok 62 - fan-facing base pages prefer live/backup language over storage implementation jargon
  ---
  duration_ms: 0.391378
  ...
# Subtest: roster team-room switcher has plain button semantics, keyboard cycling and safe source links
ok 63 - roster team-room switcher has plain button semantics, keyboard cycling and safe source links
  ---
  duration_ms: 0.644821
  ...
# Subtest: rich player pages use the server player endpoint
ok 64 - rich player pages use the server player endpoint
  ---
  duration_ms: 0.446839
  ...
# Subtest: fan status UI uses reader-friendly coverage language instead of implementation jargon
ok 65 - fan status UI uses reader-friendly coverage language instead of implementation jargon
  ---
  duration_ms: 3.457084
  ...
# Subtest: source activity distinguishes checked rows from new rows in fan-readable language
ok 66 - source activity distinguishes checked rows from new rows in fan-readable language
  ---
  duration_ms: 0.495677
  ...
# Subtest: v0.6 database adapter uses current live schema columns
ok 67 - v0.6 database adapter uses current live schema columns
  ---
  duration_ms: 0.556216
  ...
# Subtest: visual archive uses audited metadata instead of ambiguous legacy aliases
ok 68 - visual archive uses audited metadata instead of ambiguous legacy aliases
  ---
  duration_ms: 0.462314
  ...
# Subtest: responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
ok 69 - responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
  ---
  duration_ms: 0.365956
  ...
# Subtest: visual source registry includes official, specialist and Wikipedia cross-checks
ok 70 - visual source registry includes official, specialist and Wikipedia cross-checks
  ---
  duration_ms: 2.022697
  ...
# Subtest: active visual catalog never uses quarantined legacy aliases
ok 71 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.469125
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 72 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 0.999408
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 73 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 1.38013
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 74 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.347136
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 75 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.226319
  ...
1..75
# tests 75
# suites 0
# pass 74
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 353.684019
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
