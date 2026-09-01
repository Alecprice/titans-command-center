import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('365 Mode covers the football year without claiming exact league transaction windows',()=>{
  const js=read('mode-365-v19.js');
  for(const label of ['POSTSEASON WINDOW','FREE AGENCY FOCUS','DRAFT FOCUS','SPRING PROGRAM','TRAINING CAMP','PRESEASON','REGULAR SEASON','OFFSEASON'])assert.match(js,new RegExp(label));
  assert.match(js,/Command Center mode adapts to the football calendar/);
  assert.match(js,/does not claim an official league transaction window/);
});

test('365 Mode changes priorities by phase instead of showing one generic home panel',()=>{
  const js=read('mode-365-v19.js');
  for(const priority of ['NEXT GAME','WHAT CHANGED?','ROSTER','AVAILABILITY','AFC SOUTH','LAST RESULT','FAN GM','PLAYER INTEL'])assert.match(js,new RegExp(priority.replace('?','\\?')));
  assert.match(js,/preseason:\['game','changes','roster','injury'\]/);
  assert.match(js,/regular:\['game','injury','standings','changes'\]/);
  assert.match(js,/'free-agency':\['roster','changes','players','draft'\]/);
});

test('365 Mode uses shared structured APIs and preserves missing-data honesty',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/runtime\.apiJson\('\/api\/data'/);
  assert.match(js,/runtime\.apiJson\('\/api\/fan-intel'/);
  assert.match(js,/Missing report data is not treated as an all-clear/);
  assert.match(js,/Division rank will appear when a current AFC South standings snapshot is loaded/);
  assert.match(js,/Record is derived from loaded final Titans games/);
  assert.doesNotMatch(js,/fetch\(['"]https?:\/\//);
});

test('regular-season readiness does not present expected pregame data gaps as broken states',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/function availabilityState\(game,rows\)/);
  assert.match(js,/function standingsState\(row\)/);
  assert.match(js,/Week \$\{Number\(game\.week\)\}/);
  assert.match(js,/prep window/);
  assert.match(js,/availability pending/);
  assert.match(js,/Week 1 ahead/);
  assert.match(js,/rank pending/);
  assert.doesNotMatch(js,/Weekly report not loaded/);
  assert.doesNotMatch(js,/Standings not loaded/);
});

test('standings fallback derives only completed regular-season Titans results and never invents division rank',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/const regularFinals=\(\)=>games\(\)\.filter\(g=>Number\(g\?\.week\)>=1&&\/final\/i\.test/);
  assert.match(js,/Number\.isFinite\(Number\(g\?\.score\)\)/);
  assert.match(js,/Number\.isFinite\(Number\(g\?\.opponentScore\)\)/);
  assert.match(js,/const record=scheduleRecord\(\)/);
  assert.match(js,/division rank waits for a current AFC South standings snapshot/);
});

test('365 Mode is mobile first and reduced-motion friendly',()=>{
  const css=read('mode-365-v19.css');
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});

test('365 Mode loads its stylesheet and uses the shared render bus',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/mode-365-v19\.css\?v=1/);
  assert.match(js,/runtime\.onRoute/);
  assert.match(js,/runtime\.onAppRender/);
  assert.doesNotMatch(js,/new MutationObserver/);
});
