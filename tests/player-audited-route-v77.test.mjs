import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const player=read('player-polish.js');
const smoke=read('scripts/player-gameday-browser-smoke.py');

test('fallback roster and search results get explicit name-based Player Intelligence routes',()=>{
  assert.match(player,/const playerName=\(\)=>playerParams\(\)\.get\('name'\)\|\|''/);
  assert.match(player,/\.player-card\[href="#roster"\]/);
  assert.match(player,/#player\?name=\$\{encodeURIComponent\(name\)\}/);
  assert.match(player,/a\.tag\[href="#player\?id="\]/);
  assert.doesNotMatch(player,/name.*randomUUID/i);
});

test('audited player route resolves from current fallback data and official preseason rows',()=>{
  assert.match(player,/fetch\('\/api\/data'/);
  assert.match(player,/fetch\('\/api\/preseason-stats'/);
  assert.match(player,/playerNorm\(row\?\.name\)===playerNorm\(name\)/);
  assert.match(player,/Tennessee Titans roster · audited fallback/);
  assert.match(player,/official preseason production/i);
  assert.match(player,/layer\.dataset\.mode='audited-fallback'/);
  assert.match(player,/No salary\/cap values are inferred/);
  assert.match(player,/No live injury or depth-chart claim is made/);
});

test('named fallback only canonicalizes to UUID when live data supplies a real UUID',()=>{
  assert.match(player,/matched\?\.id&&\/\^\[0-9a-f-\]\{36\}\$\/i\.test\(String\(matched\.id\)\)&&site\?\.databaseAvailable!==false/);
  assert.match(player,/location\.replace\(`#player\?id=\$\{encodeURIComponent\(matched\.id\)\}`\)/);
  assert.doesNotMatch(player,/crypto\.randomUUID/);
  assert.doesNotMatch(player,/00000000-0000-0000/);
});

test('audited Player Intelligence preserves all five interactive sections',()=>{
  for(const tab of ['overview','games','trends','career','timeline'])assert.match(player,new RegExp(`data-v16-player-tab="${tab}"`));
  assert.match(player,/data-v16-favorite/);
  assert.match(player,/titans:v15MyTitans/);
  assert.match(player,/Missing categories remain missing/);
  assert.match(player,/No trend is inferred from missing rows/);
});

test('production Player Game Day gate accepts UUID or audited-name routes without weakening the rest of the gate',()=>{
  assert.match(smoke,/#player\?id=/);
  assert.match(smoke,/#player\?name=/);
  assert.match(smoke,/for tab in \['overview','games','trends','career','timeline'\]:/);
  assert.match(smoke,/Favorite did not toggle/);
  assert.match(smoke,/Game Day source\/tune contract failed/);
  assert.match(smoke,/v1\.6 browser console has severe errors/);
});
