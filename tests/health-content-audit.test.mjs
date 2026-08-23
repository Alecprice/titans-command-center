import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');

test('health reports the database-backed content audit date instead of a stale literal',()=>{
  assert.match(worker,/contentAudit:db\.content_audit_at\|\|null/);
  assert.doesNotMatch(worker,/contentAudit:'2026-08-19'/);
});
