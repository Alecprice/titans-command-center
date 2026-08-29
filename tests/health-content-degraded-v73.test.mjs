import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const script=fs.readFileSync(new URL('../scripts/health-content-audit-production-regression.mjs',import.meta.url),'utf8');

test('health content audit preserves strict live Neon truth',()=>{
  assert.match(script,/status==='healthy'\|\|status==='degraded'/);
  assert.match(script,/Healthy status requires a successful Neon health check/);
  assert.match(script,/Health content audit drifted from Neon/);
  assert.match(script,/Health content audit regressed to/);
});

test('health content audit proves dated fallback truth instead of skipping degraded mode',()=>{
  assert.match(script,/Degraded status must preserve the failed Neon health check/);
  assert.match(script,/\/api\/data\?health-truth=/);
  assert.match(script,/data\?\.mode==='audited-fallback'/);
  assert.match(script,/data\?\.databaseAvailable===false/);
  assert.match(script,/data\?\.fallback\?\.active===true/);
  assert.match(script,/Audited fallback is missing a dated verification marker/);
  assert.match(script,/2026-08-27T00:00:00Z/);
  assert.match(script,/Degraded health must not present stale database audit metadata as current/);
  assert.match(script,/mode:'audited-fallback'/);
  assert.doesNotMatch(script,/if\(status==='degraded'\)return/);
  assert.doesNotMatch(script,/Health is not healthy/);
});
