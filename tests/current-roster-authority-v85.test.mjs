import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare/worker.mjs';
import {preseasonStatsRoute} from '../src/preseason-api.mjs';

class FakeD1{
  constructor(snapshot=null){this.snapshot=snapshot;}
  prepare(sql){
    const db=this,query=String(sql).replace(/\s+/g,' ').trim().toLowerCase();
    return {
      bind(...args){
        return {
          async first(){
            if(!query.includes('from api_snapshots'))return null;
            const row=db.snapshot;
            if(!row)return null;
            const allowExpired=Number(args[1]||0)===1;
            if(row.__expired&&!allowExpired)return null;
            return row;
          },
          async run(){
            if(query.includes('insert into api_snapshots')){
              const [key,payload,source,fetchedAt,expiresAt]=args;
              db.snapshot={cache_key:key,payload,source,fetched_at:fetchedAt,expires_at:expiresAt,updated_at:new Date().toISOString(),__expired:false};
            }
            return {success:true};
          }
        };
      },
      async first(){return query==='select 1 as ok'?{ok:1}:null;}
    };
  }
}

function responseHarness(){
  let statusCode=200,payload=null;
  const headers=new Map();
  const res={
    setHeader(name,value){headers.set(String(name).toLowerCase(),String(value));return res;},
    status(code){statusCode=Number(code);return res;},
    json(value){payload=value;return {statusCode,payload,headers};}
  };
  return {res,result:()=>({statusCode,payload,headers})};
}

test('expired 95-player bootstrap cannot override the newer Aug 31 audited current roster',async()=>{
  const oldRoster=Array.from({length:95},(_,index)=>({id:`old-${index}`,name:index===0?'Xavier Restrepo':`Camp Player ${index}`,number:String(index),position:'WR',status:'Active',capturedAt:'2026-08-27T00:00:00.000Z'}));
  const stale={
    cache_key:'bootstrap:v1',
    payload:{ok:true,mode:'live-database',databaseAvailable:true,roster:oldRoster,dataQuality:{rosterPlayers:95,rosterSnapshotAt:'2026-08-27T00:00:00.000Z'}},
    source:'old-camp-snapshot',
    fetched_at:'2026-08-27T00:00:00.000Z',
    expires_at:'2026-08-27T00:15:00.000Z',
    __expired:true
  };
  const env={TITANS_DB:new FakeD1(stale)};
  const response=await worker.fetch(new Request('https://example.test/api/data?authority=1'),env,{});
  const body=await response.json();
  assert.equal(response.status,200);
  assert.equal(body.mode,'audited-fallback');
  assert.equal(body.storage,'bundled-audited-data');
  assert.equal(body.fallback.active,true);
  assert.equal(body.fallback.auditedAt,'2026-08-31');
  assert.equal(body.roster.length,61);
  assert.equal(body.roster.filter(player=>player.status==='Active').length,53);
  assert.equal(body.roster.some(player=>player.name==='Owen Pappoe'),true);
  assert.equal(body.roster.some(player=>player.name==='Xavier Restrepo'),false);
  const persisted=typeof env.TITANS_DB.snapshot.payload==='string'?JSON.parse(env.TITANS_DB.snapshot.payload):env.TITANS_DB.snapshot.payload;
  assert.equal(env.TITANS_DB.snapshot.source,'audited-fallback');
  assert.equal(persisted.roster.length,61);
  assert.equal(persisted.fallback.auditedAt,'2026-08-31');
});

test('Stats Lab uses the current Aug 31 roster while preserving cut players as preseason history',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>({ok:false,status:503,json:async()=>({})});
  try{
    const harness=responseHarness();
    await preseasonStatsRoute({method:'GET',query:{}},harness.res,{});
    const result=harness.result();
    assert.equal(result.statusCode,200);
    assert.equal(result.payload.rosterMode,'audited-fallback');
    assert.match(result.payload.rosterSource,/audited 2026-08-31/);
    assert.equal(result.payload.rosterCount,61);
    assert.equal(result.payload.players.filter(player=>player.status==='Active').length,53);
    assert.equal(result.payload.players.some(player=>player.name==='Owen Pappoe'),true);
    assert.equal(result.payload.players.some(player=>player.name==='Xavier Restrepo'),false);
    assert.ok(result.payload.otherParticipants.length>0,'preseason-only historical participants should remain available');
    assert.ok(result.payload.otherParticipants.every(player=>player.status==='Not matched to current roster'));
    assert.equal(result.payload.coverage.rosterPlayers,61);
  }finally{
    globalThis.fetch=originalFetch;
  }
});
