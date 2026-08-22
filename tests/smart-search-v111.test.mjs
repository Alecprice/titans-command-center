import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('smart search is wired after the shared runtime and included in the PWA shell',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/smart-search-v111\.css\?v=1/);
  assert.match(html,/smart-search-v111\.js\?v=1/);
  assert.ok(html.indexOf('usability-runtime.js?v=26')<html.indexOf('smart-search-v111.js?v=1'));
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/smart-search-v111\.css/);
  assert.match(sw,/smart-search-v111\.js/);
});

test('smart search uses the shared API cache and does not create an independent observer',()=>{
  const js=read('smart-search-v111.js');
  assert.match(js,/window\.TitansRuntime/);
  assert.match(js,/runtime\.apiJson\('\/api\/data'/);
  assert.match(js,/runtime\.onRoute/);
  assert.match(js,/runtime\.onRefresh/);
  assert.doesNotMatch(js,/new MutationObserver/);
  assert.doesNotMatch(js,/fetch\('/);
});

test('smart search supports sections players quick questions and keyboard navigation',()=>{
  const js=read('smart-search-v111.js');
  for(const token of ['SECTION','PLAYER','QUICK ANSWER','ArrowDown','ArrowUp','Escape','aria-activedescendant'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/slice\(0,8\)/);
  assert.match(js,/stopImmediatePropagation/);
});

test('smart search mobile palette remains touch friendly',()=>{
  const css=read('smart-search-v111.css');
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/position:fixed/);
  assert.match(css,/min-height:58px/);
  assert.match(css,/100dvh/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
