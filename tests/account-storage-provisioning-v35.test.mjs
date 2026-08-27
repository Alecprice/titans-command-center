import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const script=read('scripts/ensure-account-preferences.mjs');
const workflow=read('.github/workflows/account-storage.yml');

test('account preference provisioning stays idempotent and verifies the production table',()=>{
  assert.match(script,/create table if not exists fan_user_preferences/);
  assert.match(script,/create index if not exists fan_user_preferences_updated_at_idx/);
  assert.match(script,/to_regclass\('public\.fan_user_preferences'\)/);
  assert.match(script,/Account preference storage ready/);
});

test('account storage workflow uses the existing database secret without exposing credentials',()=>{
  assert.match(workflow,/DATABASE_URL: \$\{\{ secrets\.DATABASE_URL \}\}/);
  assert.match(workflow,/node scripts\/ensure-account-preferences\.mjs/);
  assert.match(workflow,/permissions:\n  contents: read/);
  assert.doesNotMatch(workflow,/Password1|titans77fna/i);
});
