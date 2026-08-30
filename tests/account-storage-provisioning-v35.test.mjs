import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root=new URL('../',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root),'utf8');
const exists=path=>fs.existsSync(new URL(path,root));

test('account preference storage is provisioned by the Cloudflare D1 migration',()=>{
  const migration=read('db/d1/migrations/0001_core.sql');
  const account=read('src/account-api.mjs');
  assert.match(migration,/CREATE TABLE IF NOT EXISTS fan_user_preferences/i);
  assert.match(migration,/user_id TEXT PRIMARY KEY/i);
  assert.match(migration,/preferences TEXT NOT NULL DEFAULT '\{\}'/i);
  assert.match(migration,/schema_version INTEGER NOT NULL DEFAULT 1/i);
  assert.match(migration,/fan_user_preferences_updated_idx/i);
  assert.match(account,/hasD1\(env\)/);
  assert.match(account,/getD1Preferences/);
  assert.match(account,/putD1Preferences/);
});

test('retired Neon account preference provisioning cannot return to active automation',()=>{
  assert.equal(exists('.github/workflows/account-storage.yml'),false);
  assert.equal(exists('scripts/ensure-account-preferences.mjs'),false);
  const deploy=read('.github/workflows/cloudflare-deploy.yml');
  const wrangler=read('wrangler.jsonc');
  assert.doesNotMatch(deploy,/DATABASE_URL/);
  assert.doesNotMatch(wrangler,/DATABASE_URL/);
});

test('nflreadpy warehouse maintenance remains isolated until its dedicated D1 migration',()=>{
  const analyticsWorkflow=read('.github/workflows/nflreadpy-ingest.yml');
  assert.match(analyticsWorkflow,/DATABASE_URL: \$\{\{ secrets\.DATABASE_URL \}\}/);
  assert.match(analyticsWorkflow,/python scripts\/ingest_nflreadpy\.py/);
  assert.doesNotMatch(analyticsWorkflow,/fan_user_preferences/);
});
