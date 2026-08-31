import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const exists=p=>fs.existsSync(new URL(p,root));

test('D1 account preference migration matches the API persistence contract',()=>{
  const migration=read('db/d1/migrations/0001_core.sql');
  const api=read('src/account-api.mjs');
  const store=read('src/d1-store.mjs');
  for(const column of ['user_id','preferences','schema_version','updated_at'])assert.match(migration,new RegExp(`\\b${column}\\b`));
  assert.match(migration,/CREATE TABLE IF NOT EXISTS fan_user_preferences/i);
  assert.match(migration,/preferences TEXT NOT NULL DEFAULT '\{\}'/i);
  assert.match(migration,/schema_version INTEGER NOT NULL DEFAULT 1/i);
  assert.match(api,/getD1Preferences/);
  assert.match(api,/putD1Preferences/);
  assert.match(api,/storage:'cloudflare-d1'/);
  assert.doesNotMatch(api,/insert into fan_user_preferences|::jsonb|DATABASE_URL|getSql\(/);
  assert.match(store,/insert into fan_user_preferences/i);
  assert.match(store,/on conflict\(user_id\) do update/i);
});

test('retired Neon account preference SQL is absent from the active schema tree',()=>{
  for(const path of [
    'db/migrations/20260822_fan_user_preferences.sql',
    'db/migrations/20260822_fan_user_preferences.rollback.sql',
    'db/schema.sql',
    'db/seed.sql'
  ])assert.equal(exists(path),false,`${path} must stay retired`);
  const deploy=read('.github/workflows/cloudflare-deploy.yml');
  const pkg=read('package.json');
  assert.doesNotMatch(deploy,/db\/migrations|20260822_fan_user_preferences\.sql|DATABASE_URL/);
  assert.doesNotMatch(pkg,/db\/migrations|20260822_fan_user_preferences\.sql|DATABASE_URL/);
});

test('application runtime never owns destructive legacy schema rollback',()=>{
  const worker=read('cloudflare/worker.mjs');
  const api=read('src/account-api.mjs');
  for(const source of [worker,api]){
    assert.doesNotMatch(source,/drop table/i);
    assert.doesNotMatch(source,/alter table/i);
  }
});
