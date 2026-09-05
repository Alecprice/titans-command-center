import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const freshness=readFileSync(new URL('../freshness-truth-v20.js',import.meta.url),'utf8');

test('roster source verification preserves the real Sept 2 capture date',()=>{
  assert.match(freshness,/const ROSTER_SNAPSHOT_DATE='2026-09-02'/);
  assert.match(freshness,/const ROSTER_VERIFIED_THROUGH='2026-09-05'/);
  assert.match(freshness,/captured===ROSTER_SNAPSHOT_DATE\?ROSTER_VERIFIED_THROUGH:null/);
  assert.match(freshness,/rosterState\(fresh\.roster\)/);
  assert.doesNotMatch(freshness,/rosterState\([^)]*ROSTER_VERIFIED_THROUGH/);
});

test('verified-through context never clears the existing stale warning',()=>{
  assert.match(freshness,/Roster snapshot needs review/);
  assert.match(freshness,/The loaded roster snapshot is more than 48 hours old/);
  assert.match(freshness,/Sources checked \$\{shortDate\(verification\)\}/);
  assert.match(freshness,/snapshot capture date remains \$\{shortDate\(ROSTER_SNAPSHOT_DATE\)\}/);
  assert.match(freshness,/Official Titans roster and transactions were rechecked through/);
});

test('verification metadata is limited to the exact audited roster snapshot',()=>{
  assert.match(freshness,/const captured=rosterDate\.toISOString\(\)\.slice\(0,10\)/);
  assert.match(freshness,/return captured===ROSTER_SNAPSHOT_DATE\?ROSTER_VERIFIED_THROUGH:null/);
  assert.match(freshness,/const verification=fallback\?null:rosterVerification\(fresh\.roster\)/);
});
