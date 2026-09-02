import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('my-player-watch-v36.js');
const runtime=read('accessibility-runtime.js');
const sync=read('account-sync-v112.js');
const sw=read('sw.js');

test('My Player Watchlist stays bounded and uses the existing account-synced My Titans namespace',()=>{
  assert.match(feature,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(feature,/MAX_WATCHED=8/);
  assert.match(feature,/profile\.watchlist=list\.slice\(0,MAX_WATCHED\)/);
  assert.match(feature,/data-v15-profile-save/);
  assert.match(sync,/\[data-v15-profile-save\]/);
});

test('player pages expose an accessible watch toggle without nesting controls inside player links',()=>{
  assert.match(feature,/data-v36-watch/);
  assert.match(feature,/aria-pressed=/);
  assert.match(feature,/command\.appendChild\(bar\)/);
  assert.doesNotMatch(feature,/<a[^>]*>[^`]*data-v36-watch/s);
});

test('Home resolves watched players through loaded roster identity before direct Player Intelligence routing',()=>{
  assert.match(feature,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(feature,/function watchMatch\(item\)/);
  assert.match(feature,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(feature,/canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
  assert.match(feature,/Review roster →/);
  assert.match(feature,/data-v36-state=/);
  assert.match(feature,/data-v36-remove/);
  assert.match(feature,/aria-label="Remove \$\{esc\(item\.name\)\} from watchlist"/);
  assert.match(feature,/\.v36-watch-remove\{[^}]*width:44px[^}]*min-height:44px[^}]*height:44px/);
});

test('Home watchlist is a horizontal quick-access rail instead of a vertical card wall',()=>{
  assert.match(feature,/root\.dataset\.homeLayout='rail'/);
  assert.match(feature,/PLAYER WATCH · QUICK ACCESS/);
  assert.match(feature,/grid-auto-flow:column/);
  assert.match(feature,/grid-auto-columns:minmax\(190px,1fr\)/);
  assert.match(feature,/overflow-x:auto/);
  assert.match(feature,/scroll-snap-type:x proximity/);
  assert.match(feature,/grid-auto-columns:minmax\(220px,82vw\)/);
  assert.doesNotMatch(feature,/\.v36-watch-grid\{grid-template-columns:1fr\}/);
});

test('watchlist feature loads from stable runtime and remains available offline',()=>{
  assert.match(runtime,/import '\.\/my-player-watch-v36\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/'\/my-player-watch-v36\.js'/);
});
