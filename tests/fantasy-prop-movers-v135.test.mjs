import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const movers=read('fantasy-prop-movers-v135.js');
const trends=read('fantasy-prop-trends-v133.js');

test('observed mover lens loads additively from the existing prop trend chain',()=>{
  assert.match(trends,/import\('\.\/fantasy-prop-movers-v135\.js'\)\.catch/);
  assert.match(trends,/import\('\.\/fantasy-roster-props-v134\.js'\)\.catch/);
});

test('mover lens derives only from browser-observed trend badges and current Sleeper roster badges',()=>{
  assert.match(movers,/\.fprop-trend-badge\.is-up,\.fprop-trend-badge\.is-down/);
  assert.match(movers,/\.frp-roster-badge\.is-starter/);
  assert.match(movers,/TitansFantasyRosterContext\?\.matched/);
  assert.match(movers,/Movement is ranked only by absolute line change previously observed in this browser/);
  assert.doesNotMatch(movers,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
});

test('mover filters compose with the existing roster filter instead of taking hidden ownership',()=>{
  assert.match(movers,/classList\.toggle\('is-filtered-by-movers',hide\)/);
  assert.match(movers,/state\.mode==='moved'/);
  assert.match(movers,/state\.mode==='roster'/);
  assert.doesNotMatch(movers,/row\.hidden\s*=/);
  assert.match(movers,/\.fprop-row\.is-filtered-by-movers\{display:none!important\}/);
});

test('mover lens exposes truthful all moved and roster-mover controls',()=>{
  assert.match(movers,/All props/);
  assert.match(movers,/Moved only/);
  assert.match(movers,/My roster movers/);
  assert.match(movers,/aria-pressed/);
  assert.match(movers,/Connect Sleeper to filter roster movers/);
  assert.match(movers,/Largest observed change/);
  assert.match(movers,/found\.sort\(\(a,b\)=>b\.delta-a\.delta/);
  assert.doesNotMatch(movers,/\bbest bet\b|\block\b|\bedge score\b|\brecommend(?:ation|ed)?\b/i);
});

test('Sleeper disconnect downgrades roster mode before filtering and labels roster truth explicitly',()=>{
  assert.match(movers,/if\(state\.mode==='roster'&&!rosterReady\(\)\)state\.mode='moved';\n      const quotes=moverQuotes\(rows\);\n      applyFilter\(rows\)/);
  assert.match(movers,/Sleeper roster not connected/);
  assert.match(movers,/const rosterTag=canRoster&&leader\?\.starter/);
});

test('mover decorator guards its own MutationObserver writes and reacts to roster context',()=>{
  assert.match(movers,/observer\?\.disconnect\(\)/);
  assert.match(movers,/finally\{resumeObserver\(\)\}/);
  assert.match(movers,/observer=new MutationObserver\(queue\)/);
  assert.match(movers,/addEventListener\('titans:fantasy-roster-context',queue\)/);
  assert.match(movers,/dataset\.signature/);
});

test('mover lens stays thumb-safe and high-contrast friendly on phones',()=>{
  assert.match(movers,/min-height:44px/);
  assert.match(movers,/min-height:48px/);
  assert.match(movers,/@media\(max-width:760px\)/);
  assert.match(movers,/@media\(max-width:430px\)/);
  assert.match(movers,/@media\(forced-colors:active\)/);
  assert.match(movers,/focus-visible/);
});
