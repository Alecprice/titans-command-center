import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Market Pulse has an exact-release production workflow',()=>{
  const workflow=read('.github/workflows/market-production.yml');
  assert.match(workflow,/name: Titans Market Pulse Production Gate/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/branches: \[main\]/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow,/build-meta\.json\?market-pulse-audit=/);
  assert.match(workflow,/observed===expected/);
  assert.match(workflow,/github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(workflow,/https:\/\/titans\.alecjprice\.com/);
});

test('Market Pulse production workflow promotes the hardened browser smoke and keeps evidence',()=>{
  const workflow=read('.github/workflows/market-production.yml');
  const smoke=read('scripts/market-browser-smoke.py');
  assert.match(workflow,/python scripts\/market-browser-smoke\.py/);
  assert.match(workflow,/\/tmp\/market-browser-smoke\.json/);
  assert.match(workflow,/retention-days: 14/);
  assert.match(smoke,/REPORT=Path\('\/tmp\/market-browser-smoke\.json'\)/);
  assert.match(smoke,/driver\.set_window_size\(390,844\)/);
  assert.match(smoke,/control\['height'\]<44/);
  assert.match(smoke,/Mobile market row escapes viewport/);
  assert.match(smoke,/Market browser console errors/);
  assert.match(smoke,/desktopLoadAttempts/);
});
