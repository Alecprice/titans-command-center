import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('v1.6 production browser regression waits for hydrated player routes',()=>{
  const script=read('scripts/player-gameday-browser-smoke.py');
  assert.match(script,/document\.querySelectorAll\('\.player-card'\)\.length > 20/);
  assert.match(script,/\.player-card\[href\*=\\"#player\?id=\\"\]/);
  assert.match(script,/wait for \/api\/data hydration/i);
  assert.match(script,/playerRouteHydrated/);
  assert.match(script,/Could not resolve hydrated player route/);
});

test('v1.6 browser regression does not treat fallback #roster cards as player routes',()=>{
  const script=read('scripts/player-gameday-browser-smoke.py');
  assert.match(script,/if not player_href or '#player\?id=' not in player_href/);
  assert.doesNotMatch(script,/document\.querySelector\('\.player-card'\)\?\.getAttribute\('href'\)/);
});
