import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fan-experience-v09.js',import.meta.url),'utf8');

test('Fan Experience consumes the shared bounded schedule focus contract',()=>{
  assert.match(js,/import \{scheduleFocus\} from '\.\/src\/core\.mjs';/);
  assert.match(js,/function gameFocus\(d\)\{return scheduleFocus\(d\?\.games\|\|\[\]\)\}/);
  assert.doesNotMatch(js,/function nextGame\(d\)/);
  assert.doesNotMatch(js,/const now=Date\.now\(\);return \(d\?\.games/);
});

test('Titans Today preserves the kickoff matchup and labels it as current',()=>{
  assert.match(js,/const focus=gameFocus\(d\),g=focus\.game,current=focus\.state==='game-window'/);
  assert.match(js,/current\?'Current matchup':'Next kickoff'/);
  assert.match(js,/if\(!Number\.isFinite\(ms\)\|\|ms<=0\)return'Game window open'/);
  assert.doesNotMatch(js,/LIVE GAME|LIVE NOW|Game is live/);
});

test('Game Day Pulse follows current-or-next focus instead of jumping ahead at kickoff',()=>{
  assert.match(js,/const g=gameFocus\(d\)\.game\|\|\[\.\.\.\(d\.games\|\|\[\]\)\]\.reverse\(\)\.find\(x=>x\.status==='final'\)/);
});

test('literal Add next game calendar action remains future-only',()=>{
  assert.match(js,/function upcomingGame\(d\)\{return gameFocus\(d\)\.next\|\|null\}/);
  assert.match(js,/if\(b\.dataset\.cal!==undefined\)return calendar\(upcomingGame\(d\)\)/);
});
