import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const core=fs.readFileSync(new URL('../src/core.mjs',import.meta.url),'utf8');

test('base Home and Game Day use the shared schedule focus contract',()=>{
  assert.match(app,/import \{[^}]*scheduleFocus[^}]*\} from '\.\/src\/core\.mjs'/);
  assert.match(app,/function nextGame\(\)\{return scheduleFocus\(games\)\.game\|\|null\}/);
  assert.doesNotMatch(app,/function nextGame\(\)[^\n]*games\.at\(-1\)/);
  assert.match(app,/function home\(\)\{const ng=nextGame\(\)/);
  assert.match(app,/matchup\(nextGame\(\)\)/);
});

test('base app does not duplicate future-only kickoff selection',()=>{
  assert.doesNotMatch(app,/function nextGame\(\)\{const now=new Date\(\)/);
  assert.doesNotMatch(app,/d>now&&g\.status!=='final'&&g\.status!=='bye'/);
  assert.doesNotMatch(app,/5\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
});

test('shared focus remains bounded and never calls schedule time live',()=>{
  assert.match(core,/GAME_FOCUS_WINDOW_MS\s*=\s*5\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
  assert.match(core,/state:\s*current\s*\?\s*'game-window'\s*:\s*next\s*\?\s*'upcoming'\s*:\s*'none'/);
  assert.doesNotMatch(core,/state:\s*'live'/);
});
