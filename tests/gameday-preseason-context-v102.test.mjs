import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fan-platform-v10.js',import.meta.url),'utf8');

test('Fan Platform exposes preseason production only as an explicit pregame baseline',()=>{
  assert.match(js,/showPreseasonBaseline=phase==='upcoming'&&!currentWindow/);
  assert.match(js,/stats=showPreseasonBaseline\?await preseasonSummary\(\):null/);
  assert.match(js,/PRESEASON BASELINE/);
  assert.match(js,/Final preseason production/);
  assert.match(js,/Preseason leaders are not available yet/);
});

test('kickoff-window live and final Game Day never render preseason stats as current production',()=>{
  assert.match(js,/productionPanel=showPreseasonBaseline\?/);
  assert.match(js,/\$\{productionPanel\}/);
  assert.doesNotMatch(js,/CURRENT LEADERS/);
  assert.doesNotMatch(js,/GAME RECAP/);
  assert.doesNotMatch(js,/Latest verified production/);
});

test('Game Day still earns LIVE only from explicit game status',()=>{
  assert.match(js,/function gamePhase\(g\)\{if\(!g\)return'upcoming';if\(\/live\|progress\|quarter\|halftime\/i\.test\(String\(g\.status\|\|''\)\)\)return'live'/);
  assert.doesNotMatch(js,/Date\.parse\(g\.date\)-Date\.now\(\).*return'live'/s);
  assert.match(js,/currentWindow=phase==='upcoming'&&focus\.state==='game-window'/);
});
