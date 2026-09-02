import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const home=read('my-titans-home-v35.js');
const player=read('player-intelligence-v16.js');

test('TENX unset Home favorite routes to the real player discovery flow',()=>{
  assert.match(home,/function favoriteTarget\(name\)\{/);
  assert.match(home,/if\(!name\)return '#roster'/);
  assert.doesNotMatch(home,/if\(!name\)return '#command'/);
  assert.match(home,/Choose a favorite player/);
  assert.match(home,/Open a roster player and tap Make favorite/);
  assert.match(home,/Choose player →/);
});

test('TENX favorite setup reuses the existing Player Intelligence setter',()=>{
  assert.match(player,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(player,/data-v16-favorite aria-pressed=/);
  assert.match(player,/☆ Make favorite/);
  assert.match(player,/next\.favorite=isFavorite\?'':player\.name/);
  assert.match(player,/setJson\(PROFILE_KEY,next\)/);
});

test('TENX saved favorite routing remains current-roster verified and UUID first',()=>{
  assert.match(home,/const player=favoritePlayer\(name\)/);
  assert.match(home,/if\(!player\)return '#roster'/);
  assert.match(home,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(home,/canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
});

test('TENX stale favorite still fails closed to Team Room',()=>{
  assert.match(home,/Saved favorite is not on the loaded roster\. Review Team Room before opening a player page\./);
  assert.match(home,/favoriteVerified\?'Open player →':'Review roster →'/);
  assert.match(home,/data-my-titans-favorite-state="\$\{favoriteVerified\?'verified':favorite\?'review':'unset'\}"/);
});

test('TENX Home remains read-only for favorite persistence',()=>{
  assert.doesNotMatch(home,/localStorage\.setItem/);
  assert.doesNotMatch(home,/sessionStorage\.setItem/);
  assert.doesNotMatch(home,/setJSON\(/);
  assert.doesNotMatch(home,/data-v16-favorite/);
});

test('TENX favorite setup adds no provider or lifecycle owner',()=>{
  assert.match(home,/runtime\?\.apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(home,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(home,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(home,/fetch\(/);
  assert.doesNotMatch(home,/new MutationObserver/);
  assert.doesNotMatch(home,/setInterval\(/);
  assert.doesNotMatch(home,/setTimeout\(/);
});

test('TENX favorite setup keeps the existing compact accessible Home control',()=>{
  assert.match(home,/class="my-titans-home-v35-primary" href="\$\{esc\(favoriteHref\)\}"/);
  assert.match(home,/my-titans-home-v35 :focus-visible/);
  assert.match(home,/min-height:72px/);
  assert.match(home,/min-height:88px/);
  assert.match(home,/@media\(prefers-reduced-motion:reduce\)/);
});
