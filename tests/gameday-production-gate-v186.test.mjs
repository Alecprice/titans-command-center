import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync('scripts/gameday-browser-smoke-v186.py','utf8');
const workflow=fs.readFileSync('.github/workflows/gameday-production.yml','utf8');

test('Game Day production smoke pins a deterministic phone viewport and canonical route',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width':390,'height':844/);
  assert.match(smoke,/\/#live/);
  assert.match(smoke,/max-width:759px/);
});

test('Game Day production smoke verifies entry readiness without inventing home-game state',()=>{
  assert.match(smoke,/\.v22-home-guide/);
  assert.match(smoke,/\.v185-entry-ready/);
  assert.match(smoke,/two hours before kickoff/);
  assert.match(smoke,/screenshots and pdf printouts are not accepted/);
  assert.match(smoke,/\/tickets\/mobile-tickets\//);
  assert.match(smoke,/\/fans\/mobile-app\//);
  assert.match(smoke,/\/stadium\/policies/);
  assert.match(smoke,/Entry readiness rendered without the home-game guide/);
  assert.match(smoke,/item\['height'\]<48/);
});

test('Game Day production workflow waits for Cloudflare and verifies the exact release SHA',()=>{
  assert.match(workflow,/workflow_run:/);
  assert.match(workflow,/Titans Cloudflare Deploy/);
  assert.match(workflow,/EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow,/build-meta\.json\?gameday-audit=/);
  assert.match(workflow,/observed===expected/);
  assert.match(workflow,/python scripts\/gameday-browser-smoke-v186\.py/);
});

test('Game Day production gate skips superseded releases and preserves diagnostics',()=>{
  assert.match(workflow,/continue-on-error: true/);
  assert.match(workflow,/steps\.deployed\.outcome != 'success'/);
  assert.match(workflow,/steps\.deployed\.outcome == 'success'/);
  assert.match(workflow,/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a/);
  assert.match(workflow,/retention-days: 14/);
});
