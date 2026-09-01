import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fan-enrichment-v13.js',import.meta.url),'utf8');

test('Fan Hub uses shared schedule focus for current matchup surfaces',()=>{
  assert.match(js,/import \{scheduleFocus\} from '\.\/src\/core\.mjs';/);
  assert.match(js,/function gameFocus\(\)\{return scheduleFocus\(state\.base\?\.games\|\|\[\]\)\}/);
  assert.match(js,/function upcomingGame\(\)\{return gameFocus\(\)\.next\|\|null\}/);
  assert.doesNotMatch(js,/function nextGame\(\)/);
  assert.doesNotMatch(js,/const now=Date\.now\(\);\s*return \(state\.base\?\.games/);
});

test('Fan Hub Today and market stay on the current matchup during the kickoff window',()=>{
  assert.match(js,/function currentMarket\(game=gameFocus\(\)\.game\)/);
  assert.match(js,/const focus=gameFocus\(\),ng=focus\.game,current=focus\.state==='game-window'/);
  assert.match(js,/market=currentMarket\(ng\)\[0\]/);
  assert.match(js,/card\(current\?'Current matchup':'Next game'/);
  assert.match(js,/current\?'Current-game market':'Next-game market'/);
});

test('literal next-game answers and predictions remain future-only',()=>{
  assert.match(js,/ng=upcomingGame\(\),standings=/);
  assert.match(js,/function predictionCard\(\)\{\s*const ng=upcomingGame\(\)/);
  assert.match(js,/Tennessee's next loaded game is/);
  assert.match(js,/No upcoming home game loaded/);
});

test('shared focus does not manufacture LIVE state or new lifecycle ownership',()=>{
  assert.doesNotMatch(js,/focus\.state==='game-window'.{0,160}LIVE/s);
  assert.doesNotMatch(js,/scheduleFocus\([^)]*Date\.now/);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
  assert.doesNotMatch(js,/setInterval\(/);
});
