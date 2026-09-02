import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('my-titans-home-v35.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('My Titans Home consumes only existing bounded personalization namespaces',()=>{
  assert.match(feature,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(feature,/FANTASY_KEY='titans-fantasy-v1'/);
  assert.match(feature,/Array\.isArray\(fantasy\.manual\)/);
  assert.match(feature,/String\(profile\.favorite\|\|''\)\.trim\(\)/);
  assert.doesNotMatch(feature,/localStorage\.setItem/);
});

test('favorite player shortcuts use loaded roster identity rather than guessing a player route',()=>{
  assert.match(feature,/runtime\?\.apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(feature,/function favoritePlayer\(name\)/);
  assert.match(feature,/rows\.find\(row=>normalizeName\(row\?\.name\|\|row\?\.fullName\)===needle\)/);
  assert.match(feature,/if\(!player\)return '#roster'/);
  assert.match(feature,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(feature,/canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
  assert.doesNotMatch(feature,/#player\?name=\$\{encodeURIComponent\(name\)\}/);
});

test('personal Home presents one primary fan identity with lighter Fantasy and account actions',()=>{
  assert.match(feature,/Your fan profile/);
  assert.match(feature,/Saved identity and setup at a glance/);
  assert.match(feature,/my-titans-home-v35-primary/);
  assert.match(feature,/my-titans-home-v35-quick/);
  assert.match(feature,/FAVORITE PLAYER/);
  assert.match(feature,/>FANTASY</);
  assert.match(feature,/data-my-titans-account/);
  assert.doesNotMatch(feature,/Your fan command shortcuts/);
  assert.doesNotMatch(feature,/my-titans-home-v35-grid/);
  assert.match(feature,/document\.querySelector\('\[data-account-open\]'\)\?\.click\(\)/);
});

test('My Titans Home is compact and phone-swipeable without shrinking touch geometry',()=>{
  assert.match(feature,/grid-template-columns:minmax\(0,1\.55fr\)/);
  assert.match(feature,/min-height:72px/);
  assert.match(feature,/@media\(max-width:760px\)/);
  assert.match(feature,/display:flex;overflow-x:auto/);
  assert.match(feature,/scroll-snap-type:x proximity/);
  assert.match(feature,/flex:0 0 82vw/);
  assert.match(feature,/min-height:88px/);
  assert.match(feature,/@media\(prefers-reduced-motion:reduce\)/);
});

test('My Titans Home uses shared render lifecycle and ships in the offline shell',()=>{
  assert.match(feature,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.doesNotMatch(feature,/setInterval\(/);
  assert.doesNotMatch(feature,/setTimeout\(/);
  assert.match(runtime,/import '\.\/my-titans-home-v35\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/'\/my-titans-home-v35\.js'/);
});
