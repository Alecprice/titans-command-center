import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const watch=read('fantasy-prop-watchlist-v137.js');
const movers=read('fantasy-prop-movers-v135.js');

test('watchlist loads additively from the observed mover chain',()=>{
  assert.match(movers,/import\('\.\/fantasy-prop-history-v136\.js'\)\.catch/);
  assert.match(movers,/import\('\.\/fantasy-prop-watchlist-v137\.js'\)\.catch/);
});

test('watchlist is local bounded persistence with no provider traffic',()=>{
  assert.match(watch,/STORE='titans-fantasy-prop-watchlist-v1'/);
  assert.match(watch,/MAX_ITEMS=32/);
  assert.match(watch,/localStorage\.getItem\(STORE\)/);
  assert.match(watch,/localStorage\.setItem\(STORE/);
  assert.match(watch,/slice\(0,MAX_ITEMS\)/);
  assert.doesNotMatch(watch,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
});

test('watch identity is player plus market and persisted rows are normalized and deduplicated',()=>{
  assert.match(watch,/keyFor=\(player,market\)=>/);
  assert.match(watch,/`${slug\(player\)}\|${slug\(market\)}`/);
  assert.match(watch,/const player=clean\(item\.player\),market=clean\(item\.market\)/);
  assert.match(watch,/key:keyFor\(player,market\)/);
  assert.match(watch,/findIndex\(candidate=>candidate\.key===item\.key\)===index/);
  assert.match(watch,/savedAt:Number\(item\.savedAt\)\|\|0/);
});

test('each prop row gets an explicit watch toggle with pressed state',()=>{
  assert.match(watch,/button\.className='fpw-watch-button'/);
  assert.match(watch,/button\.textContent=isWatched\?'Watching':'Watch prop'/);
  assert.match(watch,/button\.setAttribute\('aria-pressed'/);
  assert.match(watch,/Add.*to watched props/);
  assert.match(watch,/Remove.*from watched props/);
});

test('watched-only filtering composes without taking hidden ownership',()=>{
  assert.match(watch,/classList\.toggle\('is-filtered-by-watchlist'/);
  assert.match(watch,/\.fprop-row\.is-filtered-by-watchlist\{display:none!important\}/);
  assert.doesNotMatch(watch,/row\.hidden\s*=/);
  assert.match(watch,/Watched only/);
  assert.match(watch,/Show all props/);
});

test('removing the last watch disables watched-only before rows are filtered',()=>{
  const fallback=watch.indexOf("if(state.only&&!items.length)state.only=false;");
  const loop=watch.indexOf('for(const row of rows)');
  assert.ok(fallback>=0,'missing empty-watchlist fallback');
  assert.ok(loop>=0,'missing row loop');
  assert.ok(fallback<loop,'empty-watchlist fallback must run before row filtering');
});

test('watchlist surfaces only existing browser-observed movement',()=>{
  assert.match(watch,/\.fprop-trend-badge\.is-up,\.fprop-trend-badge\.is-down/);
  assert.match(watch,/currently show browser-observed movement/);
  assert.match(watch,/Watching never triggers background refreshes/);
  assert.doesNotMatch(watch,/projection|estimated line|implied history/i);
  assert.doesNotMatch(watch,/\bbest bet\b|\block\b|\bedge score\b|\brecommend(?:ation|ed)?\b/i);
});

test('watchlist observer is guarded and cross-tab storage changes rerender',()=>{
  assert.match(watch,/observer\?\.disconnect\(\)/);
  assert.match(watch,/finally\{resumeObserver\(\)\}/);
  assert.match(watch,/observer=new MutationObserver\(queue\)/);
  assert.match(watch,/addEventListener\('storage',event=>\{if\(event\.key===STORE\)queue\(\)\}\)/);
});

test('watchlist stays thumb-safe and accessible on phones',()=>{
  assert.match(watch,/min-height:44px/);
  assert.match(watch,/min-height:48px/);
  assert.match(watch,/@media\(max-width:620px\)/);
  assert.match(watch,/@media\(forced-colors:active\)/);
  assert.match(watch,/focus-visible/);
});
