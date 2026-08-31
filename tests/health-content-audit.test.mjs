import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');

test('health reports D1 snapshot content audit metadata instead of a warehouse literal',()=>{
  assert.match(worker,/function contentAuditFromSnapshot/);
  assert.match(worker,/contentAudit:contentAuditFromSnapshot\(snapshot\)/);
  assert.match(worker,/provider:'cloudflare-d1'/);
  assert.doesNotMatch(worker,/databaseHealth|getBootstrapData|contentAudit:db\.|contentAudit:'2026-08-19'/);
});
