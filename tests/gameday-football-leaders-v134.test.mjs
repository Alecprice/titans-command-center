import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Game Day top performers are selected from football categories instead of raw numeric magnitude',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/const LEADER_GROUPS=/);
  for(const label of ['Passing','Rushing','Receiving','Defense','Kicking'])assert.match(js,new RegExp(`label:'${label}'`));
  for(const metric of ['passing_yards','rushing_yards','receiving_yards','sacks','field_goals_made'])assert.match(js,new RegExp(metric));
  assert.match(js,/function normalizedStats/);
  assert.match(js,/function groupLeader/);
  assert.doesNotMatch(js,/holder\.values\.push/);
  assert.doesNotMatch(js,/values\.sort\(\(a,b\)=>Math\.abs/);
});

test('Game Day leader cards expose the category and only verified category metrics',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/x\.label/);
  assert.match(js,/metricLabel\(k\)/);
  assert.match(js,/Game leaders by category/);
  assert.match(js,/Available category stats only/);
  assert.match(js,/\$\{top\.length\} categories/);
  assert.match(js,/No live leader is guessed/);
  assert.match(js,/Postgame player stats are not available yet/);
});

test('Game Day category leader selection does not add another provider or refresh owner',()=>{
  const js=read('gameday-v16.js');
  assert.equal((js.match(/setInterval\(/g)||[]).length,1);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(js,/fetch\(['"]https?:\/\//);
  assert.match(js,/sharedJson\('\/api\/fan-intel'/);
  assert.match(js,/sharedJson\('\/api\/espn-scoreboard'/);
});
