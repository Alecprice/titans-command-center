import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const home=fs.readFileSync(new URL('../home-command-v123.js',import.meta.url),'utf8');
const fanPlatform=fs.readFileSync(new URL('../fan-platform-v10.js',import.meta.url),'utf8');

test('TENX Home detects the existing customizable command deck instead of creating a second preference system',()=>{
  assert.match(home,/const customDeck=\(\)=>app\.querySelector\('\[data-v10-home\]'\)/);
  assert.match(fanPlatform,/data\.v10Home='1'/);
  assert.match(fanPlatform,/data-customize-home/);
  assert.match(fanPlatform,/homeOrder/);
  assert.match(fanPlatform,/homeHidden/);
  assert.doesNotMatch(home,/localStorage\.(?:setItem|removeItem)/);
});

test('TENX Home keeps the rich standalone fallback but moves directly above My Command Deck when available',()=>{
  assert.match(home,/deck\.insertAdjacentElement\('beforebegin',root\)/);
  assert.match(home,/hero\.insertAdjacentElement\('afterend',root\)/);
  assert.match(home,/root\.classList\.toggle\('compact',compact\)/);
  assert.match(home,/root\.dataset\.commandMode=compact\?'integrated':'standalone'/);
});

test('TENX Home rerenders when the custom deck integration state changes',()=>{
  assert.match(home,/function signature\(compact\)/);
  assert.match(home,/Boolean\(compact\)\]\)/);
  assert.match(home,/const deck=customDeck\(\)/);
  assert.match(home,/const compact=Boolean\(deck\)/);
});

test('TENX Home compact mode turns duplicate card-wall navigation into a bounded quick-route rail',()=>{
  assert.match(home,/\.home-command-v123\.compact \.home-command-v123-launch\{display:flex/);
  assert.match(home,/overflow-x:auto/);
  assert.match(home,/scroll-snap-type:x proximity/);
  assert.match(home,/scroll-snap-align:start/);
  assert.match(home,/overscroll-behavior-inline:contain/);
  assert.match(home,/flex-basis:min\(172px,72vw\)/);
});

test('TENX Home reuses the existing Customize Home action with an accessible fallback',()=>{
  assert.match(home,/data-home-command-customize/);
  assert.match(home,/\[data-v10-home\] \[data-customize-home\]/);
  assert.match(home,/deckButton instanceof HTMLElement/);
  assert.match(home,/deckButton\.click\(\)/);
  assert.match(home,/#v10-settings-button/);
  assert.match(home,/min-height:44px/);
  assert.match(home,/button:focus-visible/);
});

test('TENX Home preserves the high-intent fan routes and shared data boundary',()=>{
  for(const hash of ['#tickets','#media','#fantasy','#roster','#stats','#legacy'])assert.match(home,new RegExp(hash));
  assert.match(home,/runtime\.apiJson\('\/api\/data',\{ttl:30000,force\}\)/);
  assert.doesNotMatch(home,/\bfetch\(/);
  assert.doesNotMatch(home,/new MutationObserver/);
});

test('TENX Home compact treatment remains reduced-motion and phone aware',()=>{
  assert.match(home,/@media\(max-width:760px\)/);
  assert.match(home,/\.home-command-v123\.compact \.home-command-v123-head\{display:grid/);
  assert.match(home,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(home,/scroll-behavior:auto/);
});
