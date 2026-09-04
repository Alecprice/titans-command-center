import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const home=readFileSync(new URL('../home-command-v123.js',import.meta.url),'utf8');

test('home derives regular-season opener context from schedule state instead of hardcoding an opponent or date',()=>{
  assert.match(home,/function isRegularSeasonOpener\(game\)/);
  assert.match(home,/String\(game\.week\)===['"]1['"]/);
  assert.match(home,/game\.status!==['"]final['"]/);
  assert.match(home,/SEASON OPENER/);
  assert.match(home,/Regular-season opener/);
  assert.doesNotMatch(home,/Jets|September 13|09\/13/);
});

test('home exposes official Titans schedule truth without creating a new data owner',()=>{
  assert.match(home,/https:\/\/www\.tennesseetitans\.com\/schedule\//);
  assert.match(home,/Official schedule/);
  assert.match(home,/target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(home,/fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|setInterval\s*\(/);
});

test('home signature includes opener state so the card rerenders when schedule status changes',()=>{
  assert.match(home,/isRegularSeasonOpener\(game\),Boolean\(data\),Boolean\(compact\)/);
});

test('home keeps existing fan actions while adding official-source verification',()=>{
  assert.match(home,/Find tickets/);
  assert.match(home,/Game Day plan/);
  assert.match(home,/Watch \/ Listen/);
  assert.match(home,/Open schedule/);
});
