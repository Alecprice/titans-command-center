import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../gameday-today-v22.js',import.meta.url),'utf8');

test('Game Day fast pass distinguishes home and road game-day copy',()=>{
  assert.match(js,/const gameDayLabel=game\.homeAway==='home'\?'GAME DAY IN NASHVILLE':'TITANS GAME DAY'/);
  assert.match(js,/gameDay\?gameDayLabel:'NEXT GAME FAST PASS'/);
  assert.doesNotMatch(js,/gameDay\?'GAME DAY IN NASHVILLE':'NEXT GAME FAST PASS'/);
});

test('Nashville-specific stadium guide remains home-only',()=>{
  assert.match(js,/game\.homeAway==='home'\?`<a href="\$\{HOME_GAMEDAY\}"/);
});
