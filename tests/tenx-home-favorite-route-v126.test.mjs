import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const home=read('my-titans-home-v35.js');
const player=read('player-polish.js');

test('TENX Home favorite route uses a canonical loaded roster identity',()=>{
  assert.match(home,/const normalizeName=value=>String\(value\|\|''\)\.trim\(\)\.toLowerCase\(\)/);
  assert.match(home,/const player=favoritePlayer\(name\)/);
  assert.match(home,/const canonical=String\(player\.name\|\|player\.fullName\|\|''\)\.trim\(\)/);
  assert.match(home,/canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
  assert.doesNotMatch(home,/return `#player\?name=\$\{encodeURIComponent\(name\)\}`/);
});

test('TENX Home preserves UUID-first routing and stale favorite fail-closed behavior',()=>{
  assert.match(home,/const id=String\(player\.id\|\|''\)\.trim\(\)/);
  assert.match(home,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(home,/if\(!player\)return '#roster'/);
  assert.match(home,/Saved favorite is not on the loaded roster\. Review Team Room before opening a player page\./);
  assert.match(home,/Review roster →/);
});

test('TENX Home makes favorite route state explicit without creating persistence',()=>{
  assert.match(home,/data-my-titans-favorite-state="\$\{favoriteVerified\?'verified':favorite\?'review':'unset'\}"/);
  assert.match(home,/favoriteHref\.startsWith\('#player\?'\)/);
  assert.match(home,/Checking your favorite against the current roster…/);
  assert.doesNotMatch(home,/localStorage\.setItem/);
  assert.doesNotMatch(home,/sessionStorage\.setItem/);
});

test('TENX Home reuses the established audited-name Player Intelligence route',()=>{
  assert.match(player,/const playerName=\(\)=>playerParams\(\)\.get\('name'\)\|\|''/);
  assert.match(player,/#player\?name=\$\{encodeURIComponent\(name\)\}/);
  assert.match(player,/playerNorm\(row\?\.name\)===playerNorm\(name\)/);
  assert.match(player,/layer\.dataset\.mode='audited-fallback'/);
});

test('TENX Home favorite routing adds no new network or lifecycle owner',()=>{
  assert.match(home,/runtime\?\.apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(home,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(home,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(home,/new MutationObserver/);
  assert.doesNotMatch(home,/setInterval/);
  assert.doesNotMatch(home,/fetch\(/);
});

test('TENX Home keeps favorite actions accessible while allowing compact mobile density',()=>{
  assert.match(home,/my-titans-home-v35 :focus-visible/);
  assert.match(home,/@media\(max-width:760px\)/);
  assert.match(home,/my-titans-home-v35-primary,.my-titans-home-v35-quick\{display:flex;min-width:0;min-height:72px/);
  assert.match(home,/my-titans-home-v35-primary\{flex:0 0 82vw;max-width:430px;min-height:88px/);
  assert.match(home,/my-titans-home-v35-quick\{flex:0 0 52vw;min-width:176px;max-width:235px;min-height:88px/);
  assert.match(home,/scroll-snap-type:x proximity/);
  assert.match(home,/aria-label','My Titans profile summary/);
  assert.doesNotMatch(home,/min-height:112px/);
});
