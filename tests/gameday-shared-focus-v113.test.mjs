import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../gameday-v16.js',import.meta.url),'utf8');

test('stable Game Day consumes the shared schedule focus contract',()=>{
  assert.match(js,/const runtime=window\.TitansRuntime/);
  assert.match(js,/function gameFocus\(\)\{return runtime\?\.scheduleFocus\?\.\(games\(\)\)/);
  assert.match(js,/function nextGame\(\)\{return gameFocus\(\)\.next\|\|null\}/);
  assert.doesNotMatch(js,/function currentDbGame/);
  assert.doesNotMatch(js,/5\*3600000/);
});

test('kickoff-window matchup stays pregame until provider explicitly confirms LIVE',()=>{
  assert.match(js,/const eg=espnGame\(\),focus=gameFocus\(\)/);
  assert.match(js,/if\(focus\.game\)return\['pregame',focus\.game,eg\]/);
  assert.match(js,/eg&&\/in progress\|halftime\|end of\/i\.test/);
  assert.doesNotMatch(js,/focus\.state==='game-window'.*\['live'/s);
});

test('latest completed game is selected by kickoff date instead of array order',()=>{
  assert.match(js,/time:Date\.parse\(game\?\.date\)/);
  assert.match(js,/finals\.sort/);
  assert.doesNotMatch(js,/games\(\)\.slice\(\)\.reverse\(\)\.find/);
});

test('postgame next-up remains literal future schedule truth',()=>{
  assert.match(js,/m=momentum\(g\),next=nextGame\(\)/);
  assert.match(js,/<small>NEXT UP<\/small>/);
});
