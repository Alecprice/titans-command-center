import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fan-platform-v10.js',import.meta.url),'utf8');

test('Fan Platform consumes the shared schedule focus contract',()=>{
  assert.match(js,/import \{scheduleFocus\} from '\.\/src\/core\.mjs'/);
  assert.match(js,/function gameFocus\(d\)\{return scheduleFocus\(d\?\.games\|\|\[\]\)\}/);
  assert.match(js,/function upcomingGame\(d\)\{return gameFocus\(d\)\.next\|\|null\}/);
  assert.doesNotMatch(js,/function nextGame\(d\)\{const now=Date\.now\(\)/);
  assert.doesNotMatch(js,/5\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
});

test('command deck and wide rail preserve the kickoff matchup',()=>{
  assert.match(js,/const focus=gameFocus\(d\),g=focus\.game,current=focus\.state==='game-window'/);
  assert.match(js,/current\?'CURRENT MATCHUP':'NEXT GAME'/);
  assert.match(js,/current\?'Current':'Next'/);
  assert.match(js,/game:'Game focus'/);
});

test('Fan Platform never infers LIVE from kickoff time alone',()=>{
  const start=js.indexOf('function gamePhase(g)');
  const end=js.indexOf('async function preseasonSummary()',start);
  const phase=js.slice(start,end);
  assert.match(phase,/live\|progress\|quarter\|halftime/);
  assert.match(phase,/final/);
  assert.doesNotMatch(phase,/Date\.parse|Date\.now|21600000|ms<=0/);
  assert.match(phase,/return'upcoming'/);
});

test('kickoff-window Game Day stays scheduled until an explicit live status arrives',()=>{
  assert.match(js,/const focus=gameFocus\(d\),g=liveGame\(d\)\|\|focus\.game\|\|latestFinal\(d\),phase=gamePhase\(g\),currentWindow=phase==='upcoming'&&focus\.state==='game-window'&&g===focus\.game/);
  assert.match(js,/currentWindow\?'SCHEDULED':'UPCOMING'/);
  assert.match(js,/currentWindow\?'CURRENT MATCHUP':'GAME WEEK COMMAND'/);
  assert.match(js,/function setLiveNav\(phase\).*phase==='live'/s);
});

test('kickoff reminders remain future-only and next-home search stays literal',()=>{
  assert.match(js,/next:upcomingGame\(d\)\?\.id\|\|''/);
  assert.match(js,/const g=upcomingGame\(d\),minutes=/);
  assert.match(js,/q==='next home game'[\s\S]*Date\.parse\(x\.date\)>Date\.now\(\)/);
});
