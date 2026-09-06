import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Ask Titans has an exact-release production workflow',()=>{
  const workflow=read('.github/workflows/ask-titans-production.yml');
  assert.match(workflow,/name: Titans Ask Titans Production Gate/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/branches: \[main\]/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow,/build-meta\.json\?ask-titans-audit=/);
  assert.match(workflow,/observed===expected/);
  assert.match(workflow,/github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(workflow,/https:\/\/titans\.alecjprice\.com/);
});

test('Ask Titans production workflow runs the deterministic browser smoke and retains evidence',()=>{
  const workflow=read('.github/workflows/ask-titans-production.yml');
  const smoke=read('scripts/ask-titans-browser-smoke.py');
  assert.match(workflow,/python scripts\/ask-titans-browser-smoke\.py/);
  assert.match(workflow,/\/tmp\/ask-titans-browser-smoke\.json/);
  assert.match(workflow,/retention-days: 14/);
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/set_mobile_viewport\(driver,390,844\)/);
  assert.match(smoke,/Who is next\?/);
  assert.match(smoke,/What is EPA\?/);
  assert.match(smoke,/No projection generated/);
  assert.match(smoke,/location\.hash===['"]#fantasy['"]/);
  assert.match(smoke,/secret play call for Sunday/);
  assert.match(smoke,/mobile\['viewport'\]!=390/);
  assert.match(smoke,/any\(x\['h'\]<44 for x in mobile\['quick'\]\)/);
  assert.match(smoke,/Horizontal overflow/);
});
