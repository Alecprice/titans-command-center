import test from 'node:test';
import assert from 'node:assert/strict';
import {getD1Snapshot,snapshotMeetsBundledAudit} from '../src/d1-store.mjs';

const payloadRow=audit=>({payload:{ok:true,dataQuality:{contentAuditAt:audit}}});

function fakeEnv(payload,{key='bootstrap:v1'}={}){
  return {
    TITANS_DB:{
      prepare(){
        return {
          bind(cacheKey,allowExpired){
            assert.equal(cacheKey,key);
            assert.equal(allowExpired,0);
            return {
              async first(){
                return {
                  cache_key:key,
                  payload:JSON.stringify(payload),
                  source:'runtime',
                  fetched_at:'2026-09-03T12:00:00Z',
                  expires_at:'2026-09-03T12:15:00Z',
                  updated_at:'2026-09-03T12:00:00Z'
                };
              }
            };
          }
        };
      }
    }
  };
}

test('bootstrap snapshots older than bundled Sept 2 audit are rejected even while cache-fresh',()=>{
  assert.equal(snapshotMeetsBundledAudit(payloadRow('2026-08-31'),'bootstrap:v1'),false);
  assert.equal(snapshotMeetsBundledAudit(payloadRow('2026-08-26T23:59:59Z'),'bootstrap:v1'),false);
});

test('bootstrap snapshots at or newer than bundled audit remain eligible',()=>{
  assert.equal(snapshotMeetsBundledAudit(payloadRow('2026-09-02'),'bootstrap:v1'),true);
  assert.equal(snapshotMeetsBundledAudit(payloadRow('2026-09-03T00:01:00Z'),'bootstrap:v1'),true);
});

test('missing or malformed bootstrap audit metadata cannot override bundled facts',()=>{
  assert.equal(snapshotMeetsBundledAudit({payload:{ok:true}},'bootstrap:v1'),false);
  assert.equal(snapshotMeetsBundledAudit(payloadRow('not-a-date'),'bootstrap:v1'),false);
  assert.equal(snapshotMeetsBundledAudit(payloadRow('2026-99-99'),'bootstrap:v1'),false);
  assert.equal(snapshotMeetsBundledAudit(null,'bootstrap:v1'),false);
});

test('supported bootstrap audit metadata aliases retain compatibility',()=>{
  assert.equal(snapshotMeetsBundledAudit({payload:{meta:{content_audit_at:'2026-09-02'}}},'bootstrap:v1'),true);
  assert.equal(snapshotMeetsBundledAudit({payload:{meta:{contentAuditAt:'2026-09-03'}}},'bootstrap:v1'),true);
  assert.equal(snapshotMeetsBundledAudit({payload:{contentAudit:'2026-09-04'}},'bootstrap:v1'),true);
});

test('non-bootstrap snapshots remain outside bundled content-authority policy',()=>{
  assert.equal(snapshotMeetsBundledAudit(payloadRow('2026-01-01'),'scoreboard:v1'),true);
  assert.equal(snapshotMeetsBundledAudit({payload:{ok:true}},'scoreboard:v1'),true);
});

test('getD1Snapshot rejects a fresh-but-content-stale bootstrap row after JSON normalization',async()=>{
  const snapshot=await getD1Snapshot(fakeEnv({ok:true,dataQuality:{contentAuditAt:'2026-08-31'}}),'bootstrap:v1');
  assert.equal(snapshot,null);
});

test('getD1Snapshot returns an eligible bootstrap row and preserves generic scoreboard reads',async()=>{
  const bootstrap=await getD1Snapshot(fakeEnv({ok:true,dataQuality:{contentAuditAt:'2026-09-02'}}),'bootstrap:v1');
  assert.equal(bootstrap?.payload?.dataQuality?.contentAuditAt,'2026-09-02');

  const scoreboardPayload={ok:true,provider:'ESPN',fetchedAt:'2026-01-01T00:00:00Z'};
  const scoreboard=await getD1Snapshot(fakeEnv(scoreboardPayload,{key:'scoreboard:v1'}),'scoreboard:v1');
  assert.deepEqual(scoreboard?.payload,scoreboardPayload);
});
