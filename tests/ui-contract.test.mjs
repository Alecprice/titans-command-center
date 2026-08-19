import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('fan polish assets are loaded by the app shell',()=>{
  const index=read('index.html');
  assert.match(index,/fan-polish\.css/);
  assert.match(index,/fan-polish\.js/);
  assert.match(index,/player-polish\.css/);
  assert.match(index,/player-polish\.js/);
});

test('service worker keeps API responses out of cache and includes current shell',()=>{
  const sw=read('sw.js');
  assert.match(sw,/startsWith\('\/api\/'\)/);
  assert.match(sw,/fan-polish\.js/);
  assert.match(sw,/player-polish\.js/);
  assert.match(sw,/titans-cc-brand-2026-v9/);
});

test('rich player pages use the server player endpoint',()=>{
  const player=read('player-polish.js');
  assert.match(player,/\/api\/player\?id=/);
  assert.match(player,/does not mean the player has zero production/i);
  assert.match(player,/not a medical clearance/i);
});

test('warehouse UI distinguishes missing ingest from real zero values',()=>{
  const fan=read('fan-polish.js');
  assert.match(fan,/awaiting ingest/i);
  assert.match(fan,/No stored market snapshot/i);
  assert.match(fan,/No injury-report rows loaded/i);
});

test('v0.6 database adapter uses current live schema columns',()=>{
  const db=read('src/db.mjs');
  assert.match(db,/rs\.captured_at/);
  assert.match(db,/roster_status/);
  assert.match(db,/transaction_date/);
  assert.doesNotMatch(db,/transacted_at/);
});
