import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const home=read('my-titans-home-v35.js');
const watch=read('my-player-watch-v36.js');
const impact=read('my-player-impact-v38.js');

test('TENX brand-new Home shows one player setup owner instead of two adjacent prompts',()=>{
  assert.match(home,/Choose a favorite player/);
  assert.match(home,/Open a roster player and tap Make favorite/);
  assert.match(watch,/const favorite=String\(profile\.favorite\|\|''\)\.trim\(\)/);
  assert.match(watch,/if\(!list\.length&&!favorite\)\{root\?\.remove\(\);return;\}/);
});

test('TENX favorite-only Home promotes Watchlist as the secondary track-more step',()=>{
  assert.match(watch,/if\(!list\.length&&!favorite\)/);
  assert.match(watch,/0\/\$\{MAX_WATCHED\} tracked · add players/);
  assert.match(watch,/Your favorite player is set\. Open another roster player and tap <strong>Watch player<\/strong> to build quick access beyond your favorite/);
});

test('TENX empty secondary Watchlist does not hydrate roster data until a player is actually watched',()=>{
  const guard=watch.indexOf("if(!list.length&&!favorite){root?.remove();return;}");
  const load=watch.indexOf('if(list.length)ensureRoster();');
  assert.ok(guard>=0,'new-fan Watchlist guard must exist');
  assert.ok(load>guard,'new-fan hierarchy guard must run before roster hydration');
  assert.match(watch,/if\(list\.length\)ensureRoster\(\)/);
  assert.doesNotMatch(watch,/if\(favorite\)ensureRoster\(\)/);
});

test('TENX watched players keep current-roster verification and the compact quick-access rail',()=>{
  assert.match(watch,/function watchMatch\(item\)/);
  assert.match(watch,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(watch,/canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
  assert.match(watch,/root\.dataset\.homeLayout='rail'/);
  assert.match(watch,/grid-auto-flow:column/);
  assert.match(watch,/scroll-snap-type:x proximity/);
});

test('TENX stale Watchlist root disappears if both favorite and watched-player intent are cleared',()=>{
  assert.match(watch,/let root=app\.querySelector\('\.v36-watch-home'\)/);
  assert.match(watch,/if\(!list\.length&&!favorite\)\{root\?\.remove\(\);return;\}/);
  assert.match(watch,/addEventListener\('titans:preferences-synced',\(\)=>queueMicrotask\(mount\)\)/);
  assert.match(watch,/addEventListener\('titans:preferences-imported',\(\)=>queueMicrotask\(mount\)\)/);
});

test('TENX Player Impact still stays hidden on Home until favorite or watch intent exists',()=>{
  assert.match(impact,/const list=followed\(\)/);
  assert.match(impact,/if\(home&&!list\.length\)\{root\?\.remove\(\);return;\}/);
  assert.match(impact,/if\(list\.length&&\(!data\|\|!fan\)&&!loading\)\{load\(\);return;\}/);
});

test('TENX staged player onboarding adds no new state provider or lifecycle owner',()=>{
  assert.match(watch,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(watch,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(watch,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(watch,/\bfetch\s*\(/);
  assert.doesNotMatch(watch,/new MutationObserver/);
  assert.doesNotMatch(watch,/setInterval\(|setTimeout\(/);
  assert.match(watch,/min-height:44px/);
  assert.match(watch,/@media\(max-width:560px\)/);
  assert.match(watch,/@media\(prefers-reduced-motion:reduce\)/);
});
