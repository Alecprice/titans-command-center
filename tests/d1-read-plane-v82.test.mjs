import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {apiSnapshotKey,readApiSnapshot} from '../src/d1-api-snapshot.mjs';
import {putD1Snapshot} from '../src/d1-store.mjs';
import {fanIntelRoute} from '../src/fan-intel-api.mjs';
import {advancedAnalyticsRoute} from '../src/advanced-analytics-api.mjs';
import {playerProfileRoute} from '../src/player-api.mjs';

class FakeD1{
  constructor(){this.snapshots=new Map();}
  prepare(sql){
    const db=this,query=String(sql).replace(/\s+/g,' ').trim().toLowerCase();
    return {
      bind(...args){
        return {
          async first(){
            if(!query.includes('from api_snapshots'))return null;
            const row=db.snapshots.get(String(args[0]))||null;
            if(!row)return null;
            const allowExpired=Number(args[1]||0)===1;
            if(row.__expired&&!allowExpired)return null;
            return row;
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
  expire(key){const row=this.snapshots.get(key);if(row)row.__expired=true;}
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

async function seed(env,key,payload,source='test-read-plane'){
  await putD1Snapshot(env,key,payload,{source,ttlSeconds:600});
}

test('snapshot keys are deterministic and isolate query dimensions',()=>{
  assert.equal(apiSnapshotKey('advanced-analytics:v1',{team:'TEN',season:2026}),'advanced-analytics:v1:season=2026:team=TEN');
  assert.equal(apiSnapshotKey('advanced-analytics:v1',{season:2025,team:'TEN'}),'advanced-analytics:v1:season=2025:team=TEN');
  assert.notEqual(apiSnapshotKey('player-profile:v1',{id:'a'}),apiSnapshotKey('player-profile:v1',{id:'b'}));
});

test('Fan Intel serves a fresh D1 snapshot without DATABASE_URL',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const key=apiSnapshotKey('fan-intel:v1',{season:2026});
  await seed(env,key,{ok:true,season:2026,standings:[{team:'Titans'}],fetchedAt:'2026-08-29T00:00:00.000Z'});
  const harness=responseHarness();
  await fanIntelRoute({method:'GET',query:{}},harness.res,env);
  const result=harness.result();
  assert.equal(result.statusCode,200);
  assert.equal(result.payload.storage,'cloudflare-d1');
  assert.equal(result.payload.snapshot.stale,false);
  assert.equal(result.payload.standings[0].team,'Titans');
});

test('Advanced Analytics serves a dimensioned D1 snapshot without DATABASE_URL',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const key=apiSnapshotKey('advanced-analytics:v1',{season:2026,team:'TEN'});
  await seed(env,key,{ok:true,status:'available',requestedSeason:2026,dataSeason:2026,team:'TEN',summary:{offenseRank:1},fetchedAt:'2026-08-29T00:00:00.000Z'});
  const harness=responseHarness();
  await advancedAnalyticsRoute({method:'GET',query:{season:'2026',team:'TEN'}},harness.res,env);
  const result=harness.result();
  assert.equal(result.statusCode,200);
  assert.equal(result.payload.storage,'cloudflare-d1');
  assert.equal(result.payload.summary.offenseRank,1);
});

test('Advanced Analytics serves its last D1 snapshot when the fresh materialization expires',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const key=apiSnapshotKey('advanced-analytics:v1',{season:2026,team:'TEN'});
  await seed(env,key,{ok:true,status:'available',requestedSeason:2026,dataSeason:2025,team:'TEN',seasonFallback:true,summary:{offenseRank:19}});
  env.TITANS_DB.expire(key);
  const harness=responseHarness();
  await advancedAnalyticsRoute({method:'GET',query:{season:'2026',team:'TEN'}},harness.res,env);
  const result=harness.result();
  assert.equal(result.statusCode,200);
  assert.equal(result.payload.storage,'cloudflare-d1');
  assert.equal(result.payload.snapshot.stale,true);
  assert.match(result.payload.snapshot.reason,/Fresh analytics snapshot unavailable/);
  assert.equal(result.payload.dataSeason,2025);
});

test('Advanced Analytics returns an explicit no-fake-metrics state when D1 has no snapshot',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const harness=responseHarness();
  await advancedAnalyticsRoute({method:'GET',query:{season:'2026',team:'TEN'}},harness.res,env);
  const result=harness.result();
  assert.equal(result.statusCode,200);
  assert.equal(result.payload.ok,false);
  assert.equal(result.payload.available,false);
  assert.equal(result.payload.status,'database-unavailable');
  assert.equal(result.payload.configured,true);
  assert.equal(result.payload.summary,null);
  assert.deepEqual(result.payload.recentPlays,[]);
  assert.match(result.headers.get('cache-control')||'',/no-store/i);
});

test('Player Profile serves its player-specific D1 snapshot without DATABASE_URL',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const id='11111111-1111-4111-8111-111111111111';
  const key=apiSnapshotKey('player-profile:v1',{id});
  await seed(env,key,{configured:true,ok:true,player:{id,name:'Snapshot Player'},games:[],injuries:[],props:[],fetchedAt:'2026-08-29T00:00:00.000Z'});
  const harness=responseHarness();
  await playerProfileRoute({method:'GET',query:{id}},harness.res,env);
  const result=harness.result();
  assert.equal(result.statusCode,200);
  assert.equal(result.payload.storage,'cloudflare-d1');
  assert.equal(result.payload.player.name,'Snapshot Player');
});

test('expired D1 snapshots are withheld normally and available for outage fallback',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const key=apiSnapshotKey('fan-intel:v1',{season:2026});
  await seed(env,key,{ok:true,season:2026,standings:[{team:'Stale Titans'}]});
  env.TITANS_DB.expire(key);
  assert.equal(await readApiSnapshot(env,key),null);
  const stale=await readApiSnapshot(env,key,{allowExpired:true,reason:'warehouse unavailable'});
  assert.equal(stale.snapshot.stale,true);
  assert.equal(stale.snapshot.reason,'warehouse unavailable');

  const harness=responseHarness();
  await fanIntelRoute({method:'GET',query:{}},harness.res,env);
  const result=harness.result();
  assert.equal(result.statusCode,200);
  assert.equal(result.payload.snapshot.stale,true);
  assert.equal(result.payload.standings[0].team,'Stale Titans');
});

test('remaining Neon-backed read planes persist only successful payloads while Analytics is D1-only',()=>{
  const fan=fs.readFileSync(new URL('../src/fan-intel-api.mjs',import.meta.url),'utf8');
  const analytics=fs.readFileSync(new URL('../src/advanced-analytics-api.mjs',import.meta.url),'utf8');
  const player=fs.readFileSync(new URL('../src/player-api.mjs',import.meta.url),'utf8');
  assert.match(fan,/FAN_INTEL_SNAPSHOT_TTL_SECONDS=600/);
  assert.match(fan,/writeApiSnapshot\(env,FAN_INTEL_SNAPSHOT_KEY,payload/);
  assert.match(player,/PLAYER_SNAPSHOT_TTL_SECONDS=21600/);
  assert.match(player,/if\(data\.ok\)[\s\S]*writeApiSnapshot\(env,snapshotKey,data/);
  assert.match(analytics,/readApiSnapshot\(env,snapshotKey\)/);
  assert.match(analytics,/allowExpired:true/);
  assert.doesNotMatch(analytics,/getSql|writeApiSnapshot|DATABASE_URL|team_week_metrics|\bfrom plays\b|neon-advanced-analytics/i);
});
