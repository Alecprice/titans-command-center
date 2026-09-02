import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const watch=read('my-player-watch-v36.js');
const player=read('player-polish.js');

test('TENX Home watchlist revalidates synced entries against loaded roster truth',()=>{
  assert.match(watch,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(watch,/const rosterRows=\(\)=>Array\.isArray\(rosterData\?\.roster\)\?rosterData\.roster:\[\]/);
  assert.match(watch,/function watchMatch\(item\)/);
  assert.match(watch,/String\(row\?\.id\|\|''\)\.trim\(\)===id/);
  assert.match(watch,/normalizeName\(row\?\.name\|\|row\?\.fullName\)===name/);
});

test('TENX Home watchlist keeps UUID first and uses only canonical roster names for audited fallback',()=>{
  assert.match(watch,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(watch,/const canonical=String\(player\.name\|\|player\.fullName\|\|''\)\.trim\(\)/);
  assert.match(watch,/canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
  assert.doesNotMatch(watch,/`#player\?name=\$\{encodeURIComponent\(item\.name\)\}`/);
});

test('TENX Home watchlist fails stale or unresolved entries closed to Team Room',()=>{
  assert.match(watch,/if\(!player\)return '#roster'/);
  assert.match(watch,/Checking current roster…/);
  assert.match(watch,/Review roster →/);
  assert.match(watch,/data-v36-state="\$\{target\.state\}"/);
  assert.match(watch,/state:'checking'/);
  assert.match(watch,/state:'review'/);
});

test('TENX Home watchlist reuses established audited-name Player Intelligence truth',()=>{
  assert.match(player,/const playerName=\(\)=>playerParams\(\)\.get\('name'\)\|\|''/);
  assert.match(player,/playerNorm\(row\?\.name\)===playerNorm\(name\)/);
  assert.match(player,/layer\.dataset\.mode='audited-fallback'/);
  assert.match(player,/No live injury or depth-chart claim is made/);
});

test('TENX Home watchlist adds no provider persistence or polling owner',()=>{
  assert.match(watch,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(watch,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(watch,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(watch,/new MutationObserver/);
  assert.doesNotMatch(watch,/setInterval/);
  assert.doesNotMatch(watch,/fetch\(/);
  assert.doesNotMatch(watch,/sessionStorage/);
});

test('TENX Home watchlist preserves bounded touch-safe removable cards',()=>{
  assert.match(watch,/MAX_WATCHED=8/);
  assert.match(watch,/\.v36-watch-remove\{[^}]*width:44px[^}]*min-height:44px[^}]*height:44px/);
  assert.match(watch,/\.v36-watchbar :focus-visible,\.v36-watch-home :focus-visible/);
  assert.match(watch,/@media\(max-width:560px\)/);
  assert.match(watch,/data-v36-remove/);
  assert.match(watch,/aria-label="Remove \$\{esc\(item\.name\)\} from watchlist"/);
});
