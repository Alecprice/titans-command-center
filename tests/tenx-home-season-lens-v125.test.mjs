import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('TENX Home lets Premium own right-now actions and detects Season Lens integration',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/const desiredMode=\(\)=>document\.querySelector\('\.v14-now'\)\?'season-lens':'full'/);
  assert.match(js,/section\.className=`v19-365\$\{integrated\?' integrated':''\}`/);
  assert.match(js,/section\.dataset\.v19Mode=integrated\?'season-lens':'full'/);
  assert.match(js,/SEASON LENS/);
  assert.match(js,/panel above handles what matters right now/);
});

test('TENX Home regular-season Season Lens removes duplicate immediate cards',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/regular:\['game','injury','standings','changes'\]/);
  assert.match(js,/regular:\['standings','changes'\]/);
  assert.match(js,/return \(integrated\?seasonLens:order\)\.map/);
});

test('TENX Home preserves the complete 365 fallback when Premium is absent',()=>{
  const js=read('mode-365-v19.js');
  for(const order of [
    "postseason:['last','changes','roster','players']",
    "'free-agency':['roster','changes','players','draft']",
    "draft:['draft','roster','changes','players']",
    "spring:['roster','players','changes','injury']",
    "camp:['changes','injury','players','roster']",
    "preseason:['game','changes','roster','injury']",
    "regular:['game','injury','standings','changes']",
    "offseason:['roster','players','changes','draft']"
  ]) assert.ok(js.includes(order),`missing full fallback order ${order}`);
  assert.match(js,/desiredMode\(\)==='season-lens'/);
});

test('TENX Home Season Lens stays distinct across the football calendar',()=>{
  const js=read('mode-365-v19.js');
  for(const lens of [
    "postseason:['last','changes']",
    "'free-agency':['roster','changes']",
    "draft:['draft','roster']",
    "spring:['players','changes']",
    "camp:['changes','players']",
    "preseason:['changes','roster']",
    "regular:['standings','changes']",
    "offseason:['roster','players']"
  ]) assert.ok(js.includes(lens),`missing season lens ${lens}`);
});

test('TENX Home rerenders 365 when Premium integration state changes without new lifecycle ownership',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/const expectedMode=desiredMode\(\)/);
  assert.match(js,/existing\?\.dataset\.v19Mode===expectedMode/);
  assert.match(js,/existing\?\.remove\(\)/);
  assert.match(js,/runtime\.onAppRender\(\(\)=>queueMicrotask\(render\)\)/);
  assert.match(js,/runtime\.onRoute/);
  assert.doesNotMatch(js,/new MutationObserver/);
  assert.doesNotMatch(js,/setInterval/);
});

test('TENX Home Season Lens reuses the current data and persistence boundaries',()=>{
  const js=read('mode-365-v19.js');
  assert.match(js,/runtime\.apiJson\('\/api\/data'/);
  assert.match(js,/runtime\.apiJson\('\/api\/fan-intel'/);
  assert.match(js,/runtime\.scheduleFocus\(games\(\)\)/);
  assert.doesNotMatch(js,/\blocalStorage\b/);
  assert.doesNotMatch(js,/\bsessionStorage\b/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
});

test('TENX Home Season Lens is compact, touch-safe, keyboard-visible, and motion-safe on phones',()=>{
  const css=read('mode-365-v19.css');
  assert.match(css,/\.v19-365\.integrated \.v19-365-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/\.v19-365\.integrated \.v19-365-grid\{display:flex/);
  assert.match(css,/scroll-snap-type:x proximity/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/:focus-visible\{outline:3px solid #fff/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
