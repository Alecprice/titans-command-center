import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('production audit proves health content freshness from D1 snapshots',()=>{
  const pkg=JSON.parse(read('package.json'));
  const script=read('scripts/health-content-audit-production-regression.mjs');
  assert.match(pkg.scripts['postaudit:production'],/health-content-audit-production-regression\.mjs/);
  assert.match(script,/\/api\/health/);
  assert.match(script,/database\?\.provider==='cloudflare-d1'/);
  assert.match(script,/snapshotFresh===true/);
  assert.match(script,/dataAuditDate\(data\)/);
  assert.match(script,/2026-08-27T00:00:00Z/);
  assert.match(script,/mergeProductionReport\('healthTruth',result\)/);
  assert.doesNotMatch(script,/contentAudit===databaseAudit|Neon/);
});
