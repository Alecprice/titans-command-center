# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `4c7e4554d4ded556e856c40558ff81b970c1a4c2`
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
- Recorded: 2026-08-26T17:20:19Z

## Quality gate failure context

```text

--- tail ---
    '          MOBILE_OUTCOME: ${{ steps.mobile_nav.outcome }}\n' +
    '          FANTASY_OUTCOME: ${{ steps.fantasy_command.outcome }}\n' +
    '          FANTASY_DECISION_OUTCOME: ${{ steps.fantasy_decision.outcome }}\n' +
    '          ACCOUNT_OUTCOME: ${{ steps.account_guest.outcome }}\n' +
    '          MARKET_OUTCOME: ${{ steps.live_markets.outcome }}\n' +
    '        with:\n' +
    '          script: |\n' +
    '            const checks = {\n' +
    '              runtime: process.env.RUNTIME_OUTCOME,\n' +
    '              search: process.env.SEARCH_OUTCOME,\n' +
    '              mobile: process.env.MOBILE_OUTCOME,\n' +
    '              fantasy: process.env.FANTASY_OUTCOME,\n' +
    '              decisions: process.env.FANTASY_DECISION_OUTCOME,\n' +
    '              account: process.env.ACCOUNT_OUTCOME,\n' +
    '              markets: process.env.MARKET_OUTCOME,\n' +
    '            };\n' +
    "            const failed = Object.entries(checks).filter(([, value]) => value !== 'success');\n" +
    "            const state = failed.length ? 'failure' : 'success';\n" +
    '            const description = failed.length\n' +
    "              ? `Failed: ${failed.map(([name]) => name).join(', ')}`.slice(0, 140)\n" +
    "              : 'Runtime, search, mobile, fantasy, decisions, account and markets passed';\n" +
    "            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');\n" +
    '            await github.rest.repos.createCommitStatus({\n' +
    '              owner,\n' +
    '              repo,\n' +
    '              sha: context.payload.workflow_run.head_sha,\n' +
    '              state,\n' +
    "              context: 'Titans Current Experience',\n" +
    '              description,\n' +
    '              target_url: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${context.runId}`,\n' +
    '            });\n' +
    '\n' +
    '      - name: Fail audit when any evaluated current-experience check failed\n' +
    "        if: steps.deployed_sha.outcome == 'success'\n" +
    '        env:\n' +
    '          RUNTIME_OUTCOME: ${{ steps.runtime_365.outcome }}\n' +
    '          SEARCH_OUTCOME: ${{ steps.smart_search.outcome }}\n' +
    '          MOBILE_OUTCOME: ${{ steps.mobile_nav.outcome }}\n' +
    '          FANTASY_OUTCOME: ${{ steps.fantasy_command.outcome }}\n' +
    '          FANTASY_DECISION_OUTCOME: ${{ steps.fantasy_decision.outcome }}\n' +
    '          ACCOUNT_OUTCOME: ${{ steps.account_guest.outcome }}\n' +
    '          MARKET_OUTCOME: ${{ steps.live_markets.outcome }}\n' +
    '        run: |\n' +
    '          for outcome in "$RUNTIME_OUTCOME" "$SEARCH_OUTCOME" "$MOBILE_OUTCOME" "$FANTASY_OUTCOME" "$FANTASY_DECISION_OUTCOME" "$ACCOUNT_OUTCOME" "$MARKET_OUTCOME"; do\n' +
    '            [[ "$outcome" == "success" ]] || exit 1\n' +
    '          done\n'
  
      at TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/current-browser-gates.test.mjs:144:10)
      at Test.runInAsyncScope (node:async_hooks:227:14)
      at Test.run (node:internal/test_runner/test:1382:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:960:18)
      at Test.postRun (node:internal/test_runner/test:1522:19)
      at Test.run (node:internal/test_runner/test:1447:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:960:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 'name: Titans Current Experience Audit\n\non:\n  workflow_run:\n    workflows: [\'Titans Cloudflare Deploy\']\n    types: [completed]\n    branches: [main]\n\npermissions:\n  contents: read\n  statuses: write\n\nconcurrency:\n  group: titans-current-experience-${{ github.event.workflow_run.head_sha }}\n  cancel-in-progress: true\n\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    timeout-minutes: 15\n    env:\n      WORKER_URL: https://titans-command-center.alecjordanprice.workers.dev\n      EXPECTED_SHA: ${{ github.event.workflow_run.head_sha }}\n    steps:\n      - name: Checkout deployed source\n        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1\n        with:\n          ref: ${{ github.event.workflow_run.head_sha }}\n          persist-credentials: false\n\n      - name: Use Node 24\n        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0\n        with:\n          node-version: \'24\'\n          package-manager-cache: false\n\n      - name: Confirm deployed SHA\n        id: deployed_sha\n        continue-on-error: true\n        shell: bash\n        run: |\n          node - <<\'NODE\'\n          const base = process.env.WORKER_URL.replace(/\\/$/, \'\');\n          const expected = process.env.EXPECTED_SHA;\n          let last = null;\n          const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));\n          for (let attempt = 1; attempt <= 15; attempt++) {\n            try {\n              const response = await fetch(`${base}/build-meta.json?audit=${attempt}`, {\n                cache: \'no-store\',\n                headers: {\n                  accept: \'application/json\',\n                  \'user-agent\': \'Titans-Current-Experience-Audit/1.0\',\n                },\n              });\n              const text = await response.text();\n              if (!response.ok) {\n                last = `HTTP ${response.status}: ${text.slice(0, 160)}`;\n              } else {\n                const data = JSON.parse(text);\n                last = data?.commit || null;\n                if (last === expected) {\n                  console.log(JSON.stringify({ok: true, commit: last, attempt}));\n                  process.exit(0);\n                }\n              }\n            } catch (error) {\n              last = `${error?.name || \'Error\'}: ${error?.message || String(error)}`;\n            }\n            await sleep(2000);\n          }\n          console.error(`Expected deployed SHA ${expected}; last observed ${last}`);\n          process.exit(1);\n          NODE\n\n      - name: Record non-deployed revision skip\n        if: steps.deployed_sha.outcome != \'success\'\n        shell: bash\n        run: |\n          {\n            echo \'## Titans Current Experience Audit\'\n            echo\n            echo \'Browser audit skipped because this workflow source revision is not the revision currently served by production.\'\n            echo \'This is not a Current Experience regression; deployment status remains owned by the Cloudflare deploy workflow.\'\n          } >> "$GITHUB_STEP_SUMMARY"\n\n      - name: Install Selenium\n        if: steps.deployed_sha.outcome == \'success\'\n        run: python -m pip install --disable-pip-version-check \'selenium>=4.25,<5\'\n\n      - name: Diagnose Runtime and 365 mobile flow\n        id: runtime_365\n        if: steps.deployed_sha.outcome == \'success\'\n        continue-on-error: true\n        run: python scripts/runtime-365-diagnostic.py\n\n      - name: Audit Smart Search\n        id: smart_search\n        if: steps.deployed_sha.outcome == \'success\'\n        continue-on-error: true\n        run: python scripts/smart-search-browser-smoke.py\n\n      - name: Audit mobile navigation\n        id: mobile_nav\n        if: steps.deployed_sha.outcome == \'success\'\n        continue-on-error: true\n        run: python scripts/mobile-navigation-browser-smoke.py\n\n      - name: Audit Fantasy Command\n        id: fantasy_command\n        if: steps.deployed_sha.outcome == \'success\'\n        continue-on-error: true\n        run: python scripts/fantasy-browser-smoke.py\n\n      - name: Audit Fantasy Decision Center\n        id: fantasy_decision\n        if: steps.deployed_sha.outcome == \'success\'\n        continue-on-error: true\n        run: python scripts/fantasy-decision-browser-smoke.py\n\n      - name: Audit Account and Guest flow\n        id: account_guest\n        if: steps.deployed_sha.outcome == \'success\'\n        continue-on-error: true\n        run: python scripts/account-browser-smoke.py\n\n      - name: Audit live markets\n        id: live_markets\n        if: steps.deployed_sha.outcome == \'success\'\n        continue-on-error: true\n        run: python scripts/market-browser-smoke.py\n\n      - name: Upload audit reports\n        if: steps.deployed_sha.outcome == \'success\'\n        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1\n        with:\n          name: current-experience-${{ github.event.workflow_run.head_sha }}\n          path: |\n            /tmp/runtime-365-diagnostic.json\n            /tmp/smart-search-browser-smoke.json\n            /tmp/mobile-navigation-browser-smoke.json\n            /tmp/fantasy-browser-smoke.json\n            /tmp/fantasy-decision-browser-smoke.json\n            /tmp/account-browser-smoke.json\n            /tmp/market-browser-smoke.json\n          if-no-files-found: ignore\n          retention-days: 14\n\n      - name: Publish Current Experience commit status\n        if: steps.deployed_sha.outcome == \'success\'\n        uses: actions/github-script@3a2844b7e9c422d3c10d287c895573f7108da1b3 # v9.0.0\n        env:\n          RUNTIME_OUTCOME: ${{ steps.runtime_365.outcome }}\n          SEARCH_OUTCOME: ${{ steps.smart_search.outcome }}\n          MOBILE_OUTCOME: ${{ steps.mobile_nav.outcome }}\n          FANTASY_OUTCOME: ${{ steps.fantasy_command.outcome }}\n          FANTASY_DECISION_OUTCOME: ${{ steps.fantasy_decision.outcome }}\n          ACCOUNT_OUTCOME: ${{ steps.account_guest.outcome }}\n          MARKET_OUTCOME: ${{ steps.live_markets.outcome }}\n        with:\n          script: |\n            const checks = {\n              runtime: process.env.RUNTIME_OUTCOME,\n              search: process.env.SEARCH_OUTCOME,\n              mobile: process.env.MOBILE_OUTCOME,\n              fantasy: process.env.FANTASY_OUTCOME,\n              decisions: process.env.FANTASY_DECISION_OUTCOME,\n              account: process.env.ACCOUNT_OUTCOME,\n              markets: process.env.MARKET_OUTCOME,\n            };\n            const failed = Object.entries(checks).filter(([, value]) => value !== \'success\');\n            const state = failed.length ? \'failure\' : \'success\';\n            const description = failed.length\n              ? `Failed: ${failed.map(([name]) => name).join(\', \')}`.slice(0, 140)\n              : \'Runtime, search, mobile, fantasy, decisions, account and markets passed\';\n            const [owner, repo] = process.env.GITHUB_REPOSITORY.split(\'/\');\n            await github.rest.repos.createCommitStatus({\n              owner,\n              repo,\n              sha: context.payload.workflow_run.head_sha,\n              state,\n              context: \'Titans Current Experience\',\n              description,\n              target_url: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${context.runId}`,\n            });\n\n      - name: Fail audit when any evaluated current-experience check failed\n        if: steps.deployed_sha.outcome == \'success\'\n        env:\n          RUNTIME_OUTCOME: ${{ steps.runtime_365.outcome }}\n          SEARCH_OUTCOME: ${{ steps.smart_search.outcome }}\n          MOBILE_OUTCOME: ${{ steps.mobile_nav.outcome }}\n          FANTASY_OUTCOME: ${{ steps.fantasy_command.outcome }}\n          FANTASY_DECISION_OUTCOME: ${{ steps.fantasy_decision.outcome }}\n          ACCOUNT_OUTCOME: ${{ steps.account_guest.outcome }}\n          MARKET_OUTCOME: ${{ steps.live_markets.outcome }}\n        run: |\n          for outcome in "$RUNTIME_OUTCOME" "$SEARCH_OUTCOME" "$MOBILE_OUTCOME" "$FANTASY_OUTCOME" "$FANTASY_DECISION_OUTCOME" "$ACCOUNT_OUTCOME" "$MARKET_OUTCOME"; do\n            [[ "$outcome" == "success" ]] || exit 1\n          done\n',
    expected: /Fail audit when any current-experience check failed/,
    operator: 'match',
    diff: 'simple'
  }

test at tests/postdeploy-browser-diagnostics.test.mjs:24:1
✖ post-deploy diagnostics exercise every major browser surface independently (2.341605ms)
  AssertionError [ERR_ASSERTION]: each diagnostic must continue so later surfaces still run
  
  14 !== 13
  
      at TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/postdeploy-browser-diagnostics.test.mjs:29:10)
      at Test.runInAsyncScope (node:async_hooks:227:14)
      at Test.run (node:internal/test_runner/test:1382:25)
      at Test.start (node:internal/test_runner/test:1242:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:387:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 14,
    expected: 13,
    operator: 'strictEqual',
    diff: 'simple'
  }
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
