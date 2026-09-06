import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Change Intelligence has an exact-release production workflow',()=>{
  const workflow=read('.github/workflows/change-intelligence-production.yml');
  assert.match(workflow,/name: Titans Change Intelligence Production Gate/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/branches: \[main\]/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/permissions:\n  contents: read/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow,/ref: \$\{\{ env\.EXPECTED_SHA \}\}/);
  assert.match(workflow,/persist-credentials: false/);
});

test('Change Intelligence production gate verifies the canonical exact revision before browser work',()=>{
  const workflow=read('.github/workflows/change-intelligence-production.yml');
  assert.match(workflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/build-meta\.json\?change-intelligence-audit=\$\{attempt\}/);
  assert.match(workflow,/observed===expected/);
  assert.match(workflow,/steps\.deployed\.outcome == 'success'/);
  assert.match(workflow,/Record superseded deployment/);
  assert.match(workflow,/browser gate skipped because this workflow revision is not the revision currently served/);
});

test('Change Intelligence production gate runs the existing deterministic smoke and retains evidence',()=>{
  const workflow=read('.github/workflows/change-intelligence-production.yml');
  const smoke=read('scripts/change-intelligence-browser-smoke.py');
  assert.match(workflow,/python scripts\/change-intelligence-browser-smoke\.py/);
  assert.match(workflow,/path: \/tmp\/change-intelligence-browser-smoke\.json/);
  assert.match(workflow,/retention-days: 14/);
  assert.match(workflow,/actions\/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a/);
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/set_mobile_viewport\(driver,390,844\)/);
  assert.match(smoke,/Horizontal overflow on/);
  assert.match(smoke,/any\(x\['h'\]<44 for x in mobile\['filters'\]\)/);
});
