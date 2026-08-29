import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getD1Snapshot,putD1Snapshot} from '../src/d1-store.mjs';
import {d1SyncAuditKey,reconcileD1FinalTitansScores} from '../src/d1-ingest-store.mjs';
import {recordSyncRun} from '../src/ingest.mjs';

class FakeD1{
  constructor(){this.snapshots=new Map();}
  prepare(sql){
    const db=this,query=String(sql).replace(/\s+/g,' ').trim().toLowerCase();
    return {
      bind(...args){
        return {
          async first(){
            if(!query.includes('from api_snapshots'))return null;
            return db.snapshots.get(String(args[0]))||null;
          },
          async run(){
            if(query.includes('insert into api_snapshots')){
              const [key,payload,source,fetchedAt,expiresAt]=args;
              db.snapshots.set(String(key),{cache_key:key,payload,source,fetched_at:fetchedAt,expires_at:expiresAt,updated_at:new Date().toISOString()});
            }
            return {success:true};
          }
        };
      }
    };
  }
}

test('D1 sync audit keys are deterministic enough to separate jobs and runs',()=>{
  const at='2026-08-29T22:00:00.000Z';
  assert.equal(d1SyncAuditKey('official-audit',at),'sync-run:v1:2026-08-29T22:00:00.000Z:official-audit');
  assert.notEqual(d1SyncAuditKey('espn',at),d1SyncAuditKey('nws-weather',at));
});

test('scheduled sync audit writes use D1 with no DATABASE_URL',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const startedAt=new Date('2026-08-29T22:00:00.000Z');
  const stored=await recordSyncRun(env,'espn',{ok:true,source:'espn',recordsSeen:4,recordsWritten:1,finalsSeen:1},startedAt);
  assert.equal(stored.stored,true);
  assert.equal(stored.storage,'cloudflare-d1');
  assert.equal(stored.source,'espn');
  const row=await getD1Snapshot(env,stored.key,{allowExpired:true});
  assert.equal(row.payload.job,'espn');
  assert.equal(row.payload.status,'success');
  assert.equal(row.payload.recordsSeen,4);
  assert.equal(row.payload.recordsWritten,1);
});

test('D1 final-score reconciliation patches one unambiguous pending Titans game',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const fetchedAt='2026-08-29T21:00:00.000Z';
  await putD1Snapshot(env,'bootstrap:v1',{
    ok:true,
    games:[{id:'game-1',date:'2026-09-13T17:00:00.000Z',opponentAbbr:'DAL',homeAway:'home',status:'scheduled',score:null,opponentScore:null}],
    fetchedAt
  },{source:'neon-bootstrap',fetchedAt,ttlSeconds:900});

  const result=await reconcileD1FinalTitansScores(env,[{eventId:'401',kickoff:'2026-09-13T17:00:00.000Z',homeAbbr:'TEN',awayAbbr:'DAL',homeScore:24,awayScore:17}]);
  assert.equal(result.handled,true);
  assert.equal(result.recordsWritten,1);
  assert.equal(result.diagnostics[0].status,'reconciled');

  const row=await getD1Snapshot(env,'bootstrap:v1',{allowExpired:true});
  const game=row.payload.games[0];
  assert.equal(game.status,'final');
  assert.equal(game.score,24);
  assert.equal(game.opponentScore,17);
  assert.equal(game.scoreSource,'ESPN scoreboard (secondary)');
  assert.equal(game.officialAuditRequired,true);
  assert.equal(row.fetched_at,fetchedAt);
});

test('D1 final-score reconciliation fails closed on a conflicting final',async()=>{
  const env={TITANS_DB:new FakeD1()};
  await putD1Snapshot(env,'bootstrap:v1',{
    ok:true,
    games:[{id:'game-1',date:'2026-09-13T17:00:00.000Z',opponentAbbr:'DAL',homeAway:'home',status:'final',score:21,opponentScore:20}]
  },{ttlSeconds:900});

  const result=await reconcileD1FinalTitansScores(env,[{eventId:'401',kickoff:'2026-09-13T17:00:00.000Z',homeAbbr:'TEN',awayAbbr:'DAL',homeScore:24,awayScore:17}]);
  assert.equal(result.recordsWritten,0);
  assert.equal(result.diagnostics[0].status,'final-conflict');
  const row=await getD1Snapshot(env,'bootstrap:v1',{allowExpired:true});
  assert.equal(row.payload.games[0].score,21);
  assert.equal(row.payload.games[0].opponentScore,20);
});

test('production scheduled write path is D1-first and retains Neon only as no-binding fallback',()=>{
  const source=fs.readFileSync(new URL('../src/ingest.mjs',import.meta.url),'utf8');
  const record=source.match(/export async function recordSyncRun\([\s\S]*?\n\}/)?.[0]||'';
  const reconcile=source.match(/async function reconcileFinalTitansScores\([\s\S]*?\n\}/)?.[0]||'';
  assert.match(record,/if\(hasD1\(env\)\)return await recordD1SyncRun/);
  assert.ok(record.indexOf('hasD1(env)')<record.indexOf('getSql(env)'));
  assert.match(reconcile,/if\(hasD1\(env\)\)/);
  assert.ok(reconcile.indexOf('hasD1(env)')<reconcile.indexOf('getSql(env)'));
});
