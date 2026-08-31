import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

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

test('legacy Neon account preference migration is not automatically executed by deploy',()=>{
  const migration=read('db/migrations/20260822_fan_user_preferences.sql');
  const rollback=read('db/migrations/20260822_fan_user_preferences.rollback.sql');
  const deploy=read('.github/workflows/cloudflare-deploy.yml');
  const pkg=read('package.json');
  assert.match(migration,/deployment does not execute it automatically/i);
  assert.match(rollback,/Never run automatically/i);
  assert.doesNotMatch(deploy,/20260822_fan_user_preferences\.sql/);
  assert.doesNotMatch(pkg,/20260822_fan_user_preferences\.sql/);
});

test('legacy rollback is explicit and destructive rather than hidden in app runtime',()=>{
  const rollback=read('db/migrations/20260822_fan_user_preferences.rollback.sql');
  const worker=read('cloudflare/worker.mjs');
  assert.match(rollback,/drop table if exists fan_user_preferences/);
  assert.doesNotMatch(worker,/drop table/i);
  assert.doesNotMatch(worker,/alter table/i);
});
