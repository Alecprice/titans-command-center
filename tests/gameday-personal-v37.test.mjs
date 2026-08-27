import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('gameday-personal-v37.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('My Game Day reuses account-synced fan and fantasy state without adding another preference namespace',()=>{
  assert.match(feature,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(feature,/FANTASY_KEY='titans-fantasy-v1'/);
  assert.match(feature,/Array\.isArray\(profile\.watchlist\)/);
  assert.match(feature,/slice\(0,8\)/);
  assert.match(feature,/Array\.isArray\(fantasy\.manual\)/);
  assert.doesNotMatch(feature,/localStorage\.setItem/);
});

test('My Game Day resolves favorite player identity from verified loaded roster data',()=>{
  assert.match(feature,/runtime\?\.apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(feature,/rows\.find\(row=>String\(row\?\.name\|\|row\?\.fullName\|\|''\)/);
  assert.match(feature,/player\?\.id\?`#player\?id=\$\{encodeURIComponent\(player\.id\)\}`:'#roster'/);
});

test('My Game Day surfaces favorite watchlist fantasy and useful game-day shortcuts',()=>{
  assert.match(feature,/MY GAME DAY/);
  assert.match(feature,/Your Titans focus/);
  assert.match(feature,/FAVORITE PLAYER/);
  assert.match(feature,/PLAYER WATCH/);
  assert.match(feature,/FANTASY COMMAND/);
  assert.match(feature,/href="#media"/);
  assert.match(feature,/href="#roster\?view=depth"/);
  assert.match(feature,/href="#transactions"/);
  assert.match(feature,/href="#fantasy"/);
  assert.match(feature,/aria-label','My Game Day focus/);
});

test('My Game Day stays observer-light mobile-safe and available offline',()=>{
  assert.match(feature,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.match(feature,/@media\(max-width:620px\)/);
  assert.match(feature,/min-height:44px/);
  assert.match(runtime,/import '\.\/gameday-personal-v37\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/'\/gameday-personal-v37\.js'/);
});
