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

test('account preferences prefer D1 when the binding exists',()=>{
  const source=fs.readFileSync(new URL('../src/account-api.mjs',import.meta.url),'utf8');
  assert.match(source,/import \{getD1Preferences,hasD1,putD1Preferences\} from '\.\/d1-store\.mjs'/);
  assert.match(source,/const useD1=hasD1\(env\)/);
  assert.match(source,/storage:useD1\?'cloudflare-d1':'neon'/);
});

test('D1 migration creates portable preferences and durable API snapshots',()=>{
  const migration=fs.readFileSync(new URL('../db/d1/migrations/0001_core.sql',import.meta.url),'utf8');
  assert.match(migration,/CREATE TABLE IF NOT EXISTS fan_user_preferences/i);
  assert.match(migration,/CREATE TABLE IF NOT EXISTS api_snapshots/i);
  assert.match(migration,/CREATE INDEX IF NOT EXISTS api_snapshots_expiry_idx/i);
});
