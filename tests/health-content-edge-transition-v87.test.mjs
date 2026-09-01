import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const script=fs.readFileSync(new URL('../scripts/health-content-audit-production-regression.mjs',import.meta.url),'utf8');

test('healthy D1 may temporarily coexist with a proven cached audited bootstrap fallback',()=>{
  assert.match(script,/X-Titans-Edge-Cache/);
  assert.match(script,/edgeCacheStatus==='HIT'/);
  assert.match(script,/data\?\.storage==='bundled-audited-data'/);
  assert.match(script,/data\?\.mode==='audited-fallback'/);
  assert.match(script,/data\?\.databaseAvailable===false/);
  assert.match(script,/data\?\.fallback\?\.active===true/);
  assert.match(script,/liveD1\|\|cachedAuditedFallback/);
  assert.match(script,/d1-primary-cached-fallback/);
});

test('healthy D1 still fails closed for an unproven fallback response',()=>{
  assert.match(script,/const liveD1=data\?\.storage==='cloudflare-d1'/);
  assert.match(script,/Healthy D1 mode served unexpected storage/);
  assert.doesNotMatch(script,/edgeCacheStatus!=='MISS'/);
  assert.doesNotMatch(script,/cachedAuditedFallback=.*MISS/);
});
