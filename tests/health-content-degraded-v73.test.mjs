import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const script=fs.readFileSync(new URL('../scripts/health-content-audit-production-regression.mjs',import.meta.url),'utf8');

test('health content audit preserves strict D1 snapshot truth',()=>{
  assert.match(script,/status==='healthy'\|\|status==='degraded'/);
  assert.match(script,/database\?\.provider==='cloudflare-d1'/);
  assert.match(script,/Healthy status requires a successful D1 health check/);
  assert.match(script,/Healthy status requires a fresh bootstrap snapshot/);
  assert.match(script,/Healthy D1 mode is missing content audit metadata/);
  assert.match(script,/Health content audit regressed to/);
  assert.doesNotMatch(script,/Neon health|drifted from Neon|databaseContentAudit/);
});

test('health content audit proves dated fallback truth instead of skipping degraded mode',()=>{
  assert.match(script,/Degraded status must preserve the failed D1 primary signal/);
  assert.match(script,/Degraded status cannot claim a fresh bootstrap snapshot/);
  assert.match(script,/\/api\/data\?health-truth=/);
  assert.match(script,/data\?\.mode==='audited-fallback'/);
  assert.match(script,/data\?\.databaseAvailable===false/);
  assert.match(script,/data\?\.fallback\?\.active===true/);
  assert.match(script,/Data API is missing a dated snapshot or audited verification marker/);
  assert.match(script,/2026-08-27T00:00:00Z/);
  assert.match(script,/mode:'audited-fallback'/);
  assert.doesNotMatch(script,/if\(status==='degraded'\)return/);
  assert.doesNotMatch(script,/Health is not healthy/);
});
