import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const history=read('fantasy-prop-history-v136.js');
const movers=read('fantasy-prop-movers-v135.js');
const trends=read('fantasy-prop-trends-v133.js');

test('observed history loads additively from the merged mover chain',()=>{
  assert.match(movers,/import\('\.\/fantasy-prop-history-v136\.js'\)\.catch/);
  assert.match(trends,/import\('\.\/fantasy-prop-movers-v135\.js'\)\.catch/);
});

test('history reuses the bounded browser observation store without provider traffic',()=>{
  assert.match(history,/STORE='titans-fantasy-prop-observations-v1'/);
  assert.match(history,/MAX_POINTS=8/);
  assert.match(history,/slice\(-MAX_POINTS\)/);
  assert.match(history,/observationKey=\(player,market,book\)=>/);
  assert.match(history,/Number\.isFinite\(Number\(point\?\.at\)\)/);
  assert.doesNotMatch(history,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
});

test('history derives timeline deltas only from saved line points',()=>{
  assert.match(history,/point\.line-points\[index-1\]\.line/);
  assert.match(history,/First saved/);
  assert.match(history,/No change/);
  assert.match(history,/is-up/);
  assert.match(history,/is-down/);
  assert.match(history,/latest:index===points\.length-1/);
});

test('each prop row gets an explicit accessible observed-history action',()=>{
  assert.match(history,/button\.className='fph-history-button'/);
  assert.match(history,/button\.textContent='Observed history'/);
  assert.match(history,/Open browser-observed history for/);
  assert.match(history,/button\.type='button'/);
  assert.doesNotMatch(history,/row\.onclick|row\.addEventListener\('click'/);
});

test('native dialog sheet preserves truth boundaries and focus return',()=>{
  assert.match(history,/document\.createElement\('dialog'\)/);
  assert.match(history,/showModal/);
  assert.match(history,/aria-labelledby','fph-history-title'/);
  assert.match(history,/Saved on this browser only/);
  assert.match(history,/Up to 8 observations are retained per sportsbook/);
  assert.match(history,/this is not complete sportsbook market history/);
  assert.match(history,/opener\.focus\(\{preventScroll:true\}\)/);
  assert.match(history,/aria-label="Close observed history"/);
});

test('history keeps reporting gaps explicit instead of inventing observations',()=>{
  assert.match(history,/No saved observations for this sportsbook yet/);
  assert.match(history,/Gaps mean this browser did not observe intermediate line changes/);
  assert.match(history,/\.fprop-quote > strong/);
  assert.doesNotMatch(history,/projection|estimated line|implied history/i);
  assert.doesNotMatch(history,/\bbest bet\b|\block\b|\bedge score\b|\brecommend(?:ation|ed)?\b/i);
});

test('history observer is guarded and rerenders an open sheet after prop DOM updates',()=>{
  assert.match(history,/observer\?\.disconnect\(\)/);
  assert.match(history,/finally\{resumeObserver\(\)\}/);
  assert.match(history,/observer=new MutationObserver\(queue\)/);
  assert.match(history,/state\.selection&&document\.querySelector\('\.fph-history-sheet'\)\?\.open\)renderDialog\(\)/);
  assert.match(history,/addEventListener\('hashchange',queue\)/);
});

test('history sheet stays touch-safe and phone-friendly',()=>{
  assert.match(history,/min-height:44px/);
  assert.match(history,/min-height:48px/);
  assert.match(history,/@media\(max-width:700px\)/);
  assert.match(history,/max-height:88dvh/);
  assert.match(history,/@media\(forced-colors:active\)/);
  assert.match(history,/focus-visible/);
});
