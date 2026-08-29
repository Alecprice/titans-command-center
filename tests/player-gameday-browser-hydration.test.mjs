import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('v1.6 production browser regression waits for a routable UUID or audited-name player card',()=>{
  const script=read('scripts/player-gameday-browser-smoke.py');
  assert.match(script,/document\.querySelectorAll\('\.player-card'\)\.length > 20/);
  assert.match(script,/#player\?id=/);
  assert.match(script,/#player\?name=/);
  assert.match(script,/wait for the roster route layer/i);
  assert.match(script,/playerRouteHydrated/);
  assert.match(script,/playerRouteMode/);
  assert.match(script,/Could not resolve routable player route/);
});

test('v1.6 browser regression never treats plain fallback #roster cards as player routes',()=>{
  const script=read('scripts/player-gameday-browser-smoke.py');
  assert.match(script,/valid_player_route/);
  assert.match(script,/return '#player\?id=' in href or '#player\?name=' in href/);
  assert.doesNotMatch(script,/document\.querySelector\('\.player-card'\)\?\.getAttribute\('href'\)/);
});