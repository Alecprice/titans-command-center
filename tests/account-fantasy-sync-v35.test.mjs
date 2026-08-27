import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const client=read('account-sync-v112.js');
const api=read('src/account-api.mjs');

test('Fantasy Command personal state participates in account sync without syncing the player cache',()=>{
  assert.match(client,/FANTASY_PREF_KEY='titans-fantasy-v1'/);
  assert.match(client,/KEYS=\[[^\]]*FANTASY_PREF_KEY/);
  assert.doesNotMatch(client,/titans-fantasy-sleeper-player-index-v1/);
  assert.match(client,/refreshFantasy/);
});

test('server preference allowlist accepts Fantasy Command state within existing size limits',()=>{
  assert.match(api,/PREF_KEYS=new Set\(\[[^\]]*'titans-fantasy-v1'/);
  assert.match(api,/encoded\.length>12000/);
  assert.match(api,/encoded\.length>24000/);
});
