import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('Home derives current-matchup copy from the shared bounded game window',()=>{
  assert.match(app,/function isCurrentGameWindow\(\)\{return scheduleFocus\(games\)\.state==='game-window'\}/);
  assert.match(app,/function home\(\)\{const ng=nextGame\(\),current=isCurrentGameWindow\(\),r=record\(\)/);
  assert.match(app,/\$\{current\?'Current matchup':ng\?'Next up':'Schedule status'\} ·/);
  assert.match(app,/<small>\$\{current\?'Current matchup':ng\?'Next opponent':'Upcoming opponent'\}<\/small>/);
  assert.match(app,/panel\(current\?'Current matchup':ng\?'Next game':'Schedule status',matchup\(ng\)/);
});

test('kickoff-window copy never promotes schedule time to LIVE state',()=>{
  const helper=app.slice(app.indexOf('function isCurrentGameWindow()'),app.indexOf('function badge()'));
  assert.doesNotMatch(helper,/live/i);
  assert.doesNotMatch(app,/current\?'LIVE/);
  assert.doesNotMatch(app,/current\?'Live/);
});

test('base app still owns no duplicate kickoff-window duration',()=>{
  assert.doesNotMatch(app,/5\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
});
