import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/home-browser-smoke-v181.py',import.meta.url),'utf8');
const workflow=readFileSync(new URL('../.github/workflows/home-production.yml',import.meta.url),'utf8');

test('Home production smoke uses a deterministic phone viewport and fails closed on overflow',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width':390,'height':844/);
  assert.match(smoke,/matchMedia\('\(max-width:760px\)'\)\.matches/);
  assert.match(smoke,/Home overflows 390px viewport/);
});

test('Home production smoke verifies the official schedule action and interaction floor',()=>{
  assert.match(smoke,/https:\/\/www\.tennesseetitans\.com\/schedule\//);
  assert.match(smoke,/officialTarget/);
  assert.match(smoke,/noopener/);
  assert.match(smoke,/item\['height'\]<44/);
});

test('Home opener assertion derives from the same runtime schedule focus as production UI',()=>{
  assert.match(smoke,/TitansRuntime\.apiJson\('\/api\/data'/);
  assert.match(smoke,/TitansRuntime\.scheduleFocus/);
  assert.match(smoke,/schedule\['week'\]=='1' and schedule\['status'\]!='final'/);
  assert.match(smoke,/state\['kicker'\]!='SEASON OPENER'/);
  assert.match(smoke,/Regular-season opener/);
});

test('Home production workflow binds the browser gate to the exact canonical deployed SHA',()=>{
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow,/build-meta\.json\?home-audit=/);
  assert.match(workflow,/observed===expected/);
  assert.match(workflow,/python scripts\/home-browser-smoke-v181\.py/);
  assert.match(workflow,/home-production-\$\{\{ env\.EXPECTED_SHA \}\}/);
});
