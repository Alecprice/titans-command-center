import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Advanced Analytics has an exact-release production workflow',()=>{
  const workflow=read('.github/workflows/analytics-production.yml');
  assert.match(workflow,/name: Titans Advanced Analytics Production Gate/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/branches: \[main\]/);
  assert.match(workflow,/contents: read/);
  assert.match(workflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow,/ref: \$\{\{ env\.EXPECTED_SHA \}\}/);
  assert.match(workflow,/persist-credentials: false/);
  assert.match(workflow,/build-meta\.json\?advanced-analytics-audit=\$\{attempt\}/);
  assert.match(workflow,/observed===expected/);
  assert.match(workflow,/Record superseded deployment/);
});

test('Advanced Analytics production workflow promotes the resilient desktop and deterministic mobile smoke and retains both reports',()=>{
  const workflow=read('.github/workflows/analytics-production.yml');
  assert.match(workflow,/python scripts\/analytics-browser-smoke-resilient\.py/);
  assert.match(workflow,/selenium>=4\.25,<5/);
  assert.match(workflow,/\/tmp\/analytics-browser-smoke\.json/);
  assert.match(workflow,/\/tmp\/analytics-mobile-browser-smoke-v202\.json/);
  assert.match(workflow,/retention-days: 14/);

  const wrapper=read('scripts/analytics-browser-smoke-resilient.py');
  assert.match(wrapper,/MOBILE_SMOKE = Path\(__file__\)\.with_name\('analytics-mobile-browser-smoke-v202\.py'\)/);
  assert.match(wrapper,/strict_report\['deterministicMobile'\] = mobile_report/);
  assert.match(wrapper,/if mobile\.returncode != 0:/);
});

test('Advanced Analytics exact-release gate stays read-only, bounded, and fail-closed on the tested revision',()=>{
  const workflow=read('.github/workflows/analytics-production.yml');
  assert.match(workflow,/timeout-minutes: 12/);
  assert.match(workflow,/for\(let attempt=1;attempt<=15;attempt\+\+\)/);
  assert.match(workflow,/if\(attempt<15\)await sleep\(2000\)/);
  assert.match(workflow,/if: github\.event_name == 'workflow_dispatch' \|\| github\.event\.workflow_run\.conclusion == 'success'/);
  assert.doesNotMatch(workflow,/contents: write/);
  assert.doesNotMatch(workflow,/pull-requests: write/);
  assert.doesNotMatch(workflow,/schedule:/);
});
