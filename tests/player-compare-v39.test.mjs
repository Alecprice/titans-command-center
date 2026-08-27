import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('my-player-compare-v39.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('Player Compare reuses the bounded synced watchlist without creating another preference namespace',()=>{
  assert.match(feature,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(feature,/MAX_WATCHED=8/);
  assert.match(feature,/profile\(\)\.watchlist/);
  assert.match(feature,/slice\(0,MAX_WATCHED\)/);
  assert.doesNotMatch(feature,/localStorage\.setItem/);
  assert.doesNotMatch(feature,/titans:v39/i);
});

test('Player Compare uses loaded roster depth and transaction facts instead of player grades',()=>{
  assert.match(feature,/runtime\?\.apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(feature,/data\?\.teamContext\?\.depthChart\?\.rows/);
  assert.match(feature,/arr\(data\?\.transactions\)\.find/);
  assert.match(feature,/Roster status/);
  assert.match(feature,/Depth context/);
  assert.match(feature,/Latest matching move/);
  assert.match(feature,/does not grade players, predict roles, or declare a winner/);
});

test('Player Compare resolves direct Player Intelligence links from verified loaded roster ids',()=>{
  assert.match(feature,/const verifiedId=String\(roster\?\.id\|\|''\)/);
  assert.match(feature,/verifiedId\?`#player\?id=\$\{encodeURIComponent\(verifiedId\)\}`:'#roster'/);
  assert.match(feature,/aria-label="Open \$\{esc\(ctx\.resolved\)\} in Player Intelligence"/);
  assert.match(feature,/FAVORITE/);
});

test('Player Compare keeps two distinct selections and supports an accessible swap',()=>{
  assert.match(feature,/if\(!keys\.includes\(selectedB\)\|\|selectedB===selectedA\)selectedB=keys\.find\(key=>key!==selectedA\)\|\|''/);
  assert.match(feature,/data-v39-compare="a"/);
  assert.match(feature,/data-v39-compare="b"/);
  assert.match(feature,/data-v39-swap aria-label="Swap compared players"/);
  assert.match(feature,/\[selectedA,selectedB\]=\[selectedB,selectedA\]/);
});

test('Player Compare is Home-only observer-light mobile-safe and packaged offline',()=>{
  assert.match(feature,/route\(\)!=='home'/);
  assert.match(feature,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.match(feature,/min-height:44px/);
  assert.match(feature,/@media\(max-width:430px\)/);
  assert.match(runtime,/import '\.\/my-player-compare-v39\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v67/);
  assert.match(sw,/'\/my-player-compare-v39\.js'/);
});
