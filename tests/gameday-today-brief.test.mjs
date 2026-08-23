import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const brief=read('gameday-today-v22.js');
const html=read('index.html');
const sw=read('sw.js');

test('same-day Game Day brief is official, matchup-scoped and self-expiring',()=>{
  assert.match(brief,/pre2:\{/);
  assert.match(brief,/teamDate:'2026-08-23'/);
  assert.match(brief,/opponentAbbr:'SEA'/);
  assert.match(brief,/Kickoff is 7:00 PM CT on FOX/);
  assert.match(brief,/WGFX 104\.5 FM The Zone/);
  assert.match(brief,/Parking lots open at 3 PM CT/);
  assert.match(brief,/gates open at 5 PM CT/);
  assert.match(brief,/20–25 plays/);
  assert.match(brief,/tennesseetitans\.com\/stadium\/gameday/);
  assert.match(brief,/tennesseetitans\.com\/news\/six-things-to-watch/);
  assert.match(brief,/Date\.now\(\)>=kickoff/);
  assert.match(brief,/today\(\)!==brief\.teamDate/);
});

test('same-day brief uses shared runtime instead of another DOM observer',()=>{
  assert.match(brief,/window\.TitansRuntime/);
  assert.match(brief,/runtime\.apiJson\('\/api\/data'/);
  assert.match(brief,/runtime\.onAppRender/);
  assert.match(brief,/runtime\.onRoute/);
  assert.doesNotMatch(brief,/new MutationObserver/);
});

test('same-day brief stays mobile-first and accessible',()=>{
  assert.match(brief,/aria-label="Official same-day game brief"/);
  assert.match(brief,/@media\(max-width:759px\)/);
  assert.match(brief,/min-height:48px/);
  assert.match(brief,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(brief,/rel="noopener noreferrer"/);
});

test('same-day brief loads after stable Game Day and is precached',()=>{
  const gameIndex=html.indexOf('/gameday-v16.js?v=1');
  const briefIndex=html.indexOf('/gameday-today-v22.js?v=1');
  assert.ok(gameIndex>=0&&briefIndex>gameIndex);
  assert.match(sw,/titans-cc-brand-2026-v60/);
  assert.match(sw,/\/gameday-today-v22\.js/);
});
