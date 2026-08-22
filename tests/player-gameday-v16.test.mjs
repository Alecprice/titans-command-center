import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('v1.6 player and Game Day assets are loaded and precached',()=>{
  const html=read('index.html'),sw=read('sw.js');
  for(const asset of ['player-intelligence-v16.css','gameday-v16.css','player-intelligence-v16.js','gameday-v16.js']){
    assert.match(html,new RegExp(asset.replaceAll('.','\\.')));
    assert.match(sw,new RegExp(asset.replaceAll('.','\\.')));
  }
  assert.match(sw,/titans-cc-brand-2026-v44/);
});

test('player command center is quick-answer first with five deeper sections',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/PLAYER COMMAND CENTER/);
  assert.match(js,/Quick answer first/);
  for(const label of ['Overview','Game Log','Trends','Career + Contract','Timeline'])assert.match(js,new RegExp(label.replace(/[+]/g,'\\+')));
  assert.match(js,/WHAT CHANGED\?/);
  assert.match(js,/SEASON SNAPSHOT/);
  assert.match(js,/ROLE \+ AVAILABILITY/);
});

test('player intelligence uses loaded API data and refuses fake zero or film claims',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/fetch\(`\/api\/player\?id=/);
  assert.match(js,/fetch\('\/api\/fan-intel'/);
  assert.match(js,/This is an ingest gap, not a zero-stat claim/);
  assert.match(js,/They do not infer film grades/);
  assert.match(js,/No salary\/cap values are inferred/);
  assert.match(js,/Cap savings\/dead-money outcomes are not estimated/);
});

test('player intelligence integrates My Titans favorite state',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/titans:v15MyTitans/);
  assert.match(js,/data-v16-favorite/);
  assert.match(js,/Make favorite/);
});

test('player trends are generated from numeric warehouse fields only',()=>{
  const js=read('player-intelligence-v16.js');
  assert.match(js,/function flattenStats/);
  assert.match(js,/Number\.isFinite\(Number\(v\)\)/);
  assert.match(js,/function spark/);
  assert.match(js,/player-game warehouse/);
});

test('Game Day 3.0 has pregame live and postgame state models',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/\['live'/);
  assert.match(js,/\['pregame'/);
  assert.match(js,/\['postgame'/);
  assert.match(js,/PREGAME COMMAND/);
  assert.match(js,/WHAT JUST HAPPENED/);
  assert.match(js,/CURRENT DRIVE/);
  assert.match(js,/POSTGAME COMMAND/);
  assert.match(js,/TURNING POINTS/);
  assert.match(js,/WHAT CHANGED\?/);
});

test('Game Day live state is sourced and model labels are transparent',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/fetch\('\/api\/espn-scoreboard'/);
  assert.match(js,/fetch\('\/api\/fan-intel'/);
  assert.match(js,/fetch\('\/api\/data'/);
  assert.match(js,/EPA\/WPA are model-derived football metrics/);
  assert.match(js,/No live leader is guessed/);
  assert.match(js,/No trustworthy turning-point rows are loaded yet/);
  assert.doesNotMatch(js,/fetch\(['"]https:\/\/site\.api\.espn\.com/);
});

test('Game Day keeps Listen Watch integrated across states',()=>{
  const js=read('gameday-v16.js');
  assert.match(js,/TUNE IN/);
  assert.match(js,/href="#media"/);
  assert.match(js,/Plan how to watch/);
});

test('v1.6 remains mobile first and reduced-motion friendly',()=>{
  for(const path of ['player-intelligence-v16.css','gameday-v16.css']){
    const css=read(path);
    assert.match(css,/@media\(max-width:759px\)/);
    assert.match(css,/@media\(max-width:390px\)/);
    assert.match(css,/min-height:48px/);
    assert.match(css,/prefers-reduced-motion:reduce/);
  }
});
