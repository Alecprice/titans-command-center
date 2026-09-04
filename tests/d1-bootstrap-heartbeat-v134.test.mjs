import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare/worker.mjs';
import {getD1Snapshot,putD1Snapshot} from '../src/d1-store.mjs';

class FakeD1{
  constructor(){this.snapshots=new Map();}
  prepare(sql){
    const db=this,query=String(sql).replace(/\s+/g,' ').trim().toLowerCase();
    return {
      bind(...args){
        return {
          async first(){
            if(query.includes('select 1 as ok'))return {ok:1};
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
              return {success:true,meta:{changes:1}};
            }
            return {success:true,meta:{changes:0}};
          }
        };
      }
    };
  }
  expire(key){const row=this.snapshots.get(String(key));if(row)row.__expired=true;}
}

function scheduledContext(){
  let pending=Promise.resolve();
  return {ctx:{waitUntil(promise){pending=Promise.resolve(promise);}},done:()=>pending};
}

function scoreboardResponse(){
  return new Response(JSON.stringify({events:[]}),{status:200,headers:{'Content-Type':'application/json'}});
}

test('near-live scheduler rematerializes an expired bootstrap snapshot without DATABASE_URL',async()=>{
  const database=new FakeD1();
  const env={TITANS_DB:database};
  await putD1Snapshot(env,'bootstrap:v1',{ok:true,mode:'audited-fallback',databaseAvailable:false,fallback:{active:true,auditedAt:'2026-08-31'},games:[]},{source:'audited-fallback',ttlSeconds:900});
  database.expire('bootstrap:v1');

  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>scoreboardResponse();
  try{
    const scheduled=scheduledContext();
    await worker.scheduled({cron:'*/3 * * * *'},env,scheduled.ctx);
    await scheduled.done();
  }finally{
    globalThis.fetch=originalFetch;
  }

  const refreshed=await getD1Snapshot(env,'bootstrap:v1');
  assert.ok(refreshed,'scheduler should restore a fresh bootstrap materialization');
  assert.equal(refreshed.source,'audited-fallback');
  assert.equal(refreshed.payload.ok,true);
  assert.equal(refreshed.payload.mode,'audited-fallback');
  assert.equal(refreshed.payload.databaseAvailable,false);
  assert.equal(refreshed.payload.fallback.active,true);
  assert.equal(refreshed.payload.storage,'bundled-audited-data');
  assert.equal('DATABASE_URL' in env,false);
});

test('near-live scheduler preserves an already-fresh bootstrap snapshot',async()=>{
  const database=new FakeD1();
  const env={TITANS_DB:database};
  const fetchedAt='2026-09-01T20:00:00.000Z';
  await putD1Snapshot(env,'bootstrap:v1',{ok:true,mode:'live-database',databaseAvailable:true,dataQuality:{contentAuditAt:'2026-09-02'},games:[{id:'keep-me'}]},{source:'verified-live-materialization',fetchedAt,ttlSeconds:86400});
  const before=await getD1Snapshot(env,'bootstrap:v1',{allowExpired:true});

  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>scoreboardResponse();
  try{
    const scheduled=scheduledContext();
    await worker.scheduled({cron:'*/3 * * * *'},env,scheduled.ctx);
    await scheduled.done();
  }finally{
    globalThis.fetch=originalFetch;
  }

  const after=await getD1Snapshot(env,'bootstrap:v1',{allowExpired:true});
  assert.equal(after.source,before.source);
  assert.equal(after.fetched_at,before.fetched_at);
  assert.deepEqual(after.payload,before.payload);
});