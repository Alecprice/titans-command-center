import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshotMeetsBundledAudit} from '../src/d1-store.mjs';

const row=audit=>({payload:{ok:true,dataQuality:{contentAuditAt:audit}}});

test('bootstrap snapshots older than bundled Sept 2 audit are rejected even if cache-fresh',()=>{
  assert.equal(snapshotMeetsBundledAudit(row('2026-08-31'),'bootstrap:v1'),false);
  assert.equal(snapshotMeetsBundledAudit(row('2026-08-26'),'bootstrap:v1'),false);
});

test('bootstrap snapshots at or newer than bundled audit remain eligible',()=>{
  assert.equal(snapshotMeetsBundledAudit(row('2026-09-02'),'bootstrap:v1'),true);
  assert.equal(snapshotMeetsBundledAudit(row('2026-09-03'),'bootstrap:v1'),true);
});

test('missing bootstrap audit metadata cannot silently override audited bundled facts',()=>{
  assert.equal(snapshotMeetsBundledAudit({payload:{ok:true}},'bootstrap:v1'),false);
  assert.equal(snapshotMeetsBundledAudit(null,'bootstrap:v1'),false);
});

test('non-bootstrap snapshots are unaffected by roster/content authority',()=>{
  assert.equal(snapshotMeetsBundledAudit(row('2026-01-01'),'scoreboard:v1'),true);
});
