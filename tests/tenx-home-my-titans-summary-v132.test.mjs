import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('my-titans-home-v35.js');

test('TENX My Titans makes favorite player the single primary fan identity',()=>{
  assert.match(feature,/Your fan profile/);
  assert.match(feature,/class=\"my-titans-home-v35-primary\"/);
  assert.equal((feature.match(/class=\"my-titans-home-v35-primary\"/g)||[]).length,1);
  assert.match(feature,/FAVORITE PLAYER/);
  assert.doesNotMatch(feature,/Your fan command shortcuts/);
});

test('TENX My Titans demotes duplicate Fantasy and Account launchers to quick actions',()=>{
  assert.match(feature,/class=\"my-titans-home-v35-quick\" href=\"#fantasy\"/);
  assert.match(feature,/class=\"my-titans-home-v35-quick\" type=\"button\" data-my-titans-account/);
  assert.equal((feature.match(/my-titans-home-v35-quick/g)||[]).length>=2,true);
  assert.doesNotMatch(feature,/my-titans-home-v35-card/);
  assert.doesNotMatch(feature,/my-titans-home-v35-grid/);
});

test('TENX My Titans preserves current-roster verification before player routing',()=>{
  assert.match(feature,/const player=favoritePlayer\(name\)/);
  assert.match(feature,/if\(!player\)return '#roster'/);
  assert.match(feature,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(feature,/canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
  assert.match(feature,/data-my-titans-favorite-state=\"\$\{favoriteVerified\?'verified':favorite\?'review':'unset'\}\"/);
});

test('TENX My Titans stays truthful while favorite roster verification is pending or stale',()=>{
  assert.match(feature,/Checking your favorite against the current roster…/);
  assert.match(feature,/Saved favorite is not on the loaded roster\. Review Team Room before opening a player page\./);
  assert.match(feature,/favoriteVerified\?'Open player →':'Review roster →'/);
  assert.doesNotMatch(feature,/favorite\?`#player\?name=/);
});

test('TENX My Titans becomes a horizontal phone summary instead of a three-card stack',()=>{
  assert.match(feature,/@media\(max-width:760px\)/);
  assert.match(feature,/\.my-titans-home-v35-summary\{display:flex;overflow-x:auto/);
  assert.match(feature,/scroll-snap-type:x proximity/);
  assert.match(feature,/\.my-titans-home-v35-primary\{flex:0 0 82vw/);
  assert.match(feature,/\.my-titans-home-v35-quick\{flex:0 0 52vw/);
  assert.doesNotMatch(feature,/\.my-titans-home-v35-summary\{grid-template-columns:1fr\}/);
});

test('TENX My Titans keeps existing state and lifecycle owners only',()=>{
  assert.match(feature,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(feature,/FANTASY_KEY='titans-fantasy-v1'/);
  assert.match(feature,/runtime\?\.apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(feature,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(feature,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(feature,/localStorage\.setItem/);
  assert.doesNotMatch(feature,/fetch\(/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.doesNotMatch(feature,/setInterval\(/);
  assert.doesNotMatch(feature,/setTimeout\(/);
});

test('TENX My Titans retains keyboard, phone, and reduced-motion safeguards',()=>{
  assert.match(feature,/:focus-visible\{outline:3px solid #fff/);
  assert.match(feature,/min-height:72px/);
  assert.match(feature,/min-height:88px/);
  assert.match(feature,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(feature,/overscroll-behavior-inline:contain/);
});
