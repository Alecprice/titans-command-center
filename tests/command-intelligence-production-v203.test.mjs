import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Command Intelligence has an exact-release production workflow',()=>{
  const workflow=read('.github/workflows/command-intelligence-production.yml');
  assert.match(workflow,/name: Titans Command Intelligence Production Gate/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/branches: \[main\]/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow,/build-meta\.json\?command-intelligence-audit=/);
  assert.match(workflow,/observed===expected/);
  assert.match(workflow,/github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(workflow,/https:\/\/titans\.alecjprice\.com/);
});

test('Command Intelligence production workflow runs the deterministic browser smoke and retains evidence',()=>{
  const workflow=read('.github/workflows/command-intelligence-production.yml');
  const smoke=read('scripts/command-intelligence-browser-smoke.py');
  assert.match(workflow,/python scripts\/command-intelligence-browser-smoke\.py/);
  assert.match(workflow,/\/tmp\/command-intelligence-browser-smoke\.json/);
  assert.match(workflow,/retention-days: 14/);
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/set_mobile_viewport\(driver, 390, 844\)/);
  assert.match(smoke,/document\.querySelectorAll\('\[data-v15-tab\]'\)\.length === 7/);
  assert.match(smoke,/ONE-MINUTE TITANS/);
  assert.match(smoke,/media-tune-guide/);
  assert.match(smoke,/mobile\['viewport'\] != 390/);
  assert.match(smoke,/any\(x\['h'\] < 44 for x in mobile\['tabTargets'\]\)/);
  assert.match(smoke,/Horizontal overflow/);
});
