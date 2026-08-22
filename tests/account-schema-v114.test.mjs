import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('account preference migration matches the API persistence contract',()=>{
  const migration=read('db/migrations/20260822_fan_user_preferences.sql');
  const api=read('src/account-api.mjs');
  for(const column of ['user_id','preferences','schema_version','updated_at']){
    assert.match(migration,new RegExp(`\\b${column}\\b`));
    assert.match(api,new RegExp(`\\b${column}\\b`));
  }
  assert.match(migration,/create table if not exists fan_user_preferences/);
  assert.match(migration,/preferences jsonb not null/);
  assert.match(migration,/jsonb_typeof\(preferences\) = 'object'/);
  assert.match(migration,/schema_version integer not null default 1/);
  assert.match(api,/insert into fan_user_preferences/);
  assert.match(api,/on conflict\(user_id\) do update/);
});

test('account preference migration is not automatically executed by deploy',()=>{
  const migration=read('db/migrations/20260822_fan_user_preferences.sql');
  const rollback=read('db/migrations/20260822_fan_user_preferences.rollback.sql');
  const deploy=read('.github/workflows/cloudflare-deploy.yml');
  const pkg=read('package.json');
  assert.match(migration,/deployment does not execute it automatically/i);
  assert.match(rollback,/Never run automatically/i);
  assert.doesNotMatch(deploy,/20260822_fan_user_preferences\.sql/);
  assert.doesNotMatch(pkg,/20260822_fan_user_preferences\.sql/);
});

test('rollback is explicit and destructive rather than hidden in app runtime',()=>{
  const rollback=read('db/migrations/20260822_fan_user_preferences.rollback.sql');
  const worker=read('cloudflare/worker.mjs');
  assert.match(rollback,/drop table if exists fan_user_preferences/);
  assert.doesNotMatch(worker,/drop table/i);
  assert.doesNotMatch(worker,/alter table/i);
});
