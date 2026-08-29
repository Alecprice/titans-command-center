import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getD1Preferences,getD1Snapshot,hasD1,putD1Preferences,putD1Snapshot} from '../src/d1-store.mjs';

class FakeD1{
  constructor(){this.preferences=new Map();this.snapshots=new Map();}
  prepare(sql){
    const db=this,query=String(sql).replace(/\s+/g,' ').trim().toLowerCase();
    return {
      bind(...args){
        return {
          async first(){
            if(query==='select 1 as ok')return {ok:1};
            if(query.includes('from fan_user_preferences'))return db.preferences.get(String(args[0]))||null;
            if(query.includes('from api_snapshots'))return db.snapshots.get(String(args[0]))||null;
            return null;
          },
          async run(){
            if(query.includes('insert into fan_user_preferences')){
              const [userId,preferences,schemaVersion]=args;
              db.preferences.set(String(userId),{preferences,schema_version:schemaVersion,updated_at:new Date().toISOString()});
            }
            if(query.includes('insert into api_snapshots')){
              const [key,payload,source,fetchedAt,expiresAt]=args;
              db.snapshots.set(String(key),{cache_key:key,payload,source,fetched_at:fetchedAt,expires_at:expiresAt,updated_at:new Date().toISOString()});
            }
            if(query.startsWith('delete from api_snapshots'))db.snapshots.delete(String(args[0]));
            return {success:true};
          }
        };
      },
      async first(){if(query==='select 1 as ok')return {ok:1};return null;}
    };
  }
}

test('D1 storage is optional and detected from the Worker binding',()=>{
  assert.equal(hasD1({}),false);
  assert.equal(hasD1({TITANS_DB:new FakeD1()}),true);
});

test('D1 preference records round-trip JSON without leaking storage encoding',async()=>{
  const env={TITANS_DB:new FakeD1()};
  const input={'titans:v10Prefs':{theme:'dark'}};
  await putD1Preferences(env,'fan-1',input,1);
  const row=await getD1Preferences(env,'fan-1');
  assert.deepEqual(row.preferences,input);
  assert.equal(row.schema_version,1);
});

test('D1 API snapshots round-trip normalized payloads',async()=>{
  const env={TITANS_DB:new FakeD1()};
  await putD1Snapshot(env,'bootstrap',{ok:true,roster:[1,2,3]},{ttlSeconds:900});
  const row=await getD1Snapshot(env,'bootstrap');
  assert.equal(row.cache_key,'bootstrap');
  assert.deepEqual(row.payload,{ok:true,roster:[1,2,3]});
});

test('D1 snapshot expiry uses SQLite datetime normalization for ISO timestamps',()=>{
  const source=fs.readFileSync(new URL('../src/d1-store.mjs',import.meta.url),'utf8');
  assert.match(source,/datetime\(expires_at\)>CURRENT_TIMESTAMP/);
});

test('account preferences prefer D1 when the binding exists',()=>{
  const source=fs.readFileSync(new URL('../src/account-api.mjs',import.meta.url),'utf8');
  assert.match(source,/import \{getD1Preferences,hasD1,putD1Preferences\} from '\.\/d1-store\.mjs'/);
  assert.match(source,/const useD1=hasD1\(env\)/);
  assert.match(source,/storage:useD1\?'cloudflare-d1':'neon'/);
});

test('bootstrap API uses D1 before Neon and retains an expired snapshot for outage fallback',()=>{
  const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');
  const dataBlock=worker.match(/async function nativeData\([\s\S]*?\n\}/)?.[0]||'';
  assert.match(dataBlock,/const snapshot=await readD1Bootstrap\(env\)/);
  assert.match(dataBlock,/data=await getBootstrapData\(env\)/);
  assert.ok(dataBlock.indexOf('readD1Bootstrap(env)')<dataBlock.indexOf('getBootstrapData(env)'));
  assert.match(dataBlock,/readD1Bootstrap\(env,\{allowExpired:true/);
  assert.match(dataBlock,/writeD1Bootstrap\(env,payload,\{source:'neon-bootstrap'\}\)/);
});

test('near-live scoreboard is centrally refreshed every three minutes only after D1 is bound',()=>{
  const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');
  const config=fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8');
  assert.match(config,/"\*\/3 \* \* \* \*"/);
  assert.match(worker,/const NEAR_LIVE_CRON='\*\/3 \* \* \* \*'/);
  assert.match(worker,/async function runNearLiveScheduled\(env\)/);
  assert.match(worker,/if\(!hasD1\(env\)\)return \{ok:true,skipped:true/);
  assert.match(worker,/putD1Snapshot\(env,SCOREBOARD_SNAPSHOT_KEY/);
  assert.match(worker,/nativeScoreboard\(request,env\)/);
});

test('D1 migration creates portable preferences and durable API snapshots',()=>{
  const migration=fs.readFileSync(new URL('../db/d1/migrations/0001_core.sql',import.meta.url),'utf8');
  assert.match(migration,/CREATE TABLE IF NOT EXISTS fan_user_preferences/i);
  assert.match(migration,/CREATE TABLE IF NOT EXISTS api_snapshots/i);
  assert.match(migration,/CREATE INDEX IF NOT EXISTS api_snapshots_expiry_idx/i);
});

test('Wrangler 4 D1 migrations do not pass the removed --yes flag',()=>{
  const configure=fs.readFileSync(new URL('../scripts/configure-d1.mjs',import.meta.url),'utf8');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.doesNotMatch(configure,/d1['"],['"]migrations['"],['"]apply[\s\S]*--yes/);
  assert.doesNotMatch(pkg.scripts['d1:migrate'],/--yes/);
  assert.match(pkg.scripts['d1:migrate'],/d1 migrations apply titans-command-center --remote/);
});
