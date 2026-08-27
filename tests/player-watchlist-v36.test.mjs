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

test('Home renders watched players as direct Player Intelligence shortcuts with explicit remove controls',()=>{
  assert.match(feature,/class=\\"v36-watch-grid\\"/);
  assert.match(feature,/#player\?id=/);
  assert.match(feature,/data-v36-remove/);
  assert.match(feature,/aria-label=\\"Remove \$\{esc\(item\.name\)\} from watchlist\\"/);
});

test('watchlist feature loads from stable runtime and remains available offline',()=>{
  assert.match(runtime,/import '\.\/my-player-watch-v36\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v64/);
  assert.match(sw,/'\/my-player-watch-v36\.js'/);
});
