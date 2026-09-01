import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('base Home never substitutes the last final game as the next game',()=>{
  assert.match(app,/function nextGame\(\)\{return scheduleFocus\(games\)\.game\|\|null\}/);
  assert.doesNotMatch(app,/function nextGame\(\)[^\n]*games\.at\(-1\)/);
});

test('no-upcoming state uses truthful schedule language',()=>{
  assert.match(app,/No upcoming Titans game is loaded\./);
  assert.match(app,/No upcoming game loaded/);
  assert.match(app,/None scheduled/);
  assert.match(app,/ng\?'Next game':'Schedule status'/);
});

test('kickoff-window current matchup language remains intact',()=>{
  assert.match(app,/function isCurrentGameWindow\(\)\{return scheduleFocus\(games\)\.state==='game-window'\}/);
  assert.match(app,/current\?'Current matchup'/);
});
