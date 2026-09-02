import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('my-player-impact-v38.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('My Player Impact reuses the synced favorite and watchlist profile without a new preference silo',()=>{
  assert.match(feature,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(feature,/Array\.isArray\(profile\.watchlist\)|arr\(profile\.watchlist\)/);
  assert.match(feature,/slice\(0,8\)/);
  assert.match(feature,/MAX_FOLLOWED=9/);
  assert.doesNotMatch(feature,/localStorage\.setItem/);
});

test('My Player Impact derives signals only after current roster identity is verified',()=>{
  assert.match(feature,/apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(feature,/apiJson\?\.\('\/api\/fan-intel',\{ttl:30000\}\)/);
  assert.match(feature,/const verified=Boolean\(rosterRow&&canonicalName\)/);
  assert.match(feature,/const injuryRows=verified&&Array\.isArray\(fan\?\.injuries\)\?fan\.injuries:\[\]/);
  assert.match(feature,/const transactionRows=verified&&Array\.isArray\(data\?\.transactions\)\?data\.transactions:\[\]/);
  assert.match(feature,/const depthRows=verified&&Array\.isArray\(fan\?\.depthChart\?\.changes\)\?fan\.depthChart\.changes:\[\]/);
  assert.match(feature,/Player-specific signals are withheld until current roster identity is verified/);
  assert.match(feature,/Unavailable feeds are excluded/);
});

test('My Player Impact uses canonical loaded roster identity for Player Intelligence and renders on Home plus Game Day',()=>{
  assert.match(feature,/const id=verified\?String\(rosterRow\?\.id\|\|''\)\.trim\(\):''/);
  assert.match(feature,/#player\?id=\$\{encodeURIComponent\(id\)\}/);
  assert.match(feature,/#player\?name=\$\{encodeURIComponent\(canonicalName\)\}/);
  assert.doesNotMatch(feature,/rosterRow\?\.id\|\|item\.id/);
  assert.match(feature,/routeState=verified\?'verified':'review'/);
  assert.match(feature,/Review roster →/);
  assert.match(feature,/current==='home'/);
  assert.match(feature,/current==='live'/);
  assert.match(feature,/\.v36-watch-home/);
  assert.match(feature,/\.v37-my-gameday/);
  assert.match(feature,/MY PLAYER IMPACT/);
  assert.match(feature,/What changed for the Titans you follow/);
});

test('My Player Impact is observer-light touch-safe refreshable and offline packaged',()=>{
  assert.match(feature,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onRefresh/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.match(feature,/min-height:44px/);
  assert.match(feature,/@media\(max-width:620px\)/);
  assert.match(runtime,/import '\.\/my-player-impact-v38\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/'\/my-player-impact-v38\.js'/);
});
