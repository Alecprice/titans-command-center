import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const watch=read('my-player-watch-v36.js');
const impact=read('my-player-impact-v38.js');

test('TENX Home watchlist becomes a compact horizontal rail without changing its eight-player bound',()=>{
  assert.match(watch,/MAX_WATCHED=8/);
  assert.match(watch,/root\.dataset\.homeLayout='rail'/);
  assert.match(watch,/PLAYER WATCH · QUICK ACCESS/);
  assert.match(watch,/grid-auto-flow:column/);
  assert.match(watch,/overflow-x:auto/);
  assert.match(watch,/scroll-snap-type:x proximity/);
  assert.match(watch,/grid-auto-columns:minmax\(220px,82vw\)/);
});

test('TENX Home watch rail preserves current-roster route verification and recovery behavior',()=>{
  assert.match(watch,/function watchMatch\(item\)/);
  assert.match(watch,/if\(!player\)return '#roster'/);
  assert.match(watch,/if\(id\)return `#player\?id=/);
  assert.match(watch,/canonical\?`#player\?name=/);
  assert.match(watch,/Checking current roster…/);
  assert.match(watch,/Review roster →/);
});

test('TENX Home Player Impact expands only followed-player exceptions',()=>{
  assert.match(impact,/const hasSignal=Boolean\(injury\|\|transaction\|\|depth\|\|rosterStatus\.toLowerCase\(\)!=='active'\)/);
  assert.match(impact,/const flagged=routeState==='review'\|\|hasSignal/);
  assert.match(impact,/const visibleImpacts=home\?impacts\.filter\(impact=>impact\.flagged\):impacts/);
  assert.match(impact,/Home expands only followed players with a flagged change or roster-review need/);
});

test('TENX Home Player Impact keeps quiet followers truthful when some evidence feeds are unavailable',()=>{
  assert.match(impact,/const evidenceAvailable=loadedFeeds\.length>0/);
  assert.match(impact,/function homeSummary\(impacts\)/);
  assert.match(impact,/no flagged change in the loaded player-specific feeds/);
  assert.match(impact,/player-specific change feeds unavailable/);
  assert.match(impact,/Unavailable feeds are not treated as proof that nothing changed/);
  assert.doesNotMatch(impact,/nothing changed for/i);
});

test('TENX Game Day keeps the richer complete Player Impact view',()=>{
  assert.match(impact,/const home=current==='home'/);
  assert.match(impact,/const visibleImpacts=home\?impacts\.filter\(impact=>impact\.flagged\):impacts/);
  assert.match(impact,/if\(current==='live'\)return app\?\.querySelector\('\.v37-my-gameday'\)\|\|app\?\.querySelector\('\.v16-gameday'\)/);
  assert.match(impact,/Current loaded roster, injury-report, transaction, and depth context/);
});

test('TENX personalization density pass adds no new provider persistence polling or DOM observer owner',()=>{
  for(const source of [watch,impact]){
    assert.doesNotMatch(source,/\bfetch\s*\(/);
    assert.doesNotMatch(source,/XMLHttpRequest|WebSocket|EventSource/);
    assert.doesNotMatch(source,/new MutationObserver/);
    assert.doesNotMatch(source,/setInterval\(/);
  }
  assert.match(watch,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(impact,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.doesNotMatch(impact,/localStorage\.setItem/);
});

test('TENX compact personalization stays touch keyboard and reduced-motion safe',()=>{
  assert.match(watch,/\.v36-watch-remove\{[^}]*width:44px[^}]*min-height:44px[^}]*height:44px/);
  assert.match(watch,/\.v36-watch-card a\{[^}]*min-height:44px/);
  assert.match(watch,/\.v36-watchbar :focus-visible,\.v36-watch-home :focus-visible/);
  assert.match(watch,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(impact,/min-height:44px/);
  assert.match(impact,/\.v38-impact :focus-visible/);
  assert.match(impact,/@media\(max-width:620px\)/);
});
