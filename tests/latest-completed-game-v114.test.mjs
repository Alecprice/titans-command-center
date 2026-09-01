import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {latestCompletedGame} from '../src/core.mjs';

test('latestCompletedGame chooses the newest final by kickoff date, not array order',()=>{
  const games=[
    {week:2,status:'final',date:'2026-09-20T17:00:00Z',opponent:'Ravens'},
    {week:3,status:'scheduled',date:'2026-09-27T17:00:00Z',opponent:'Texans'},
    {week:1,status:'final',date:'2026-09-13T17:00:00Z',opponent:'Jets'}
  ];
  assert.equal(latestCompletedGame(games)?.week,2);
});

test('latestCompletedGame ignores non-finals and falls back deterministically when dates are unavailable',()=>{
  const games=[
    {week:'P1',status:'final',date:null},
    {week:1,status:'bye',date:null},
    {week:'P2',status:'final',date:'not-a-date'}
  ];
  assert.equal(latestCompletedGame(games)?.week,'P2');
  assert.equal(latestCompletedGame([{status:'scheduled',date:'2026-09-13T17:00:00Z'}]),null);
});

test('365 Mode consumes shared latest completed game truth',()=>{
  const mode=fs.readFileSync(new URL('../mode-365-v19.js',import.meta.url),'utf8');
  assert.match(mode,/const latestFinal=\(\)=>runtime\.latestCompletedGame\(games\(\)\)/);
  assert.doesNotMatch(mode,/\[\.\.\.games\(\)\]\.reverse\(\)\.find/);
});
