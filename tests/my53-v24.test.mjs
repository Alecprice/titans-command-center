import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('cutdown-command-v23.js');
const css=read('cutdown-command-v23.css');
const accessibility=read('accessibility-runtime.js');

test('My 53 is a local-only fan roster exercise',()=>{
  assert.match(js,/MY53_STORE='titans:my53:v1'/);
  assert.match(js,/runtime\.storage\.getJSON\(MY53_STORE,\[\]\)/);
  assert.match(js,/runtime\.storage\.setJSON\(MY53_STORE,list\)/);
  assert.match(js,/runtime\.storage\.remove\(MY53_STORE\)/);
  assert.match(js,/fan roster exercise—not an official roster projection or report/);
  assert.match(js,/No selection changes the official roster or synced account settings/);
  assert.doesNotMatch(js,/\/api\/account|preferences|PUT|POST|PATCH|DELETE/);
});

test('My 53 only offers loaded active players and caps fan picks at 53',()=>{
  assert.match(js,/filter\(p=>String\(p\.status\|\|'\'\)\.toLowerCase\(\)==='active'\)/);
  assert.match(js,/slice\(0,FINAL_LIMIT\)/);
  assert.match(js,/if\(selection\.size>=FINAL_LIMIT\)/);
  assert.match(js,/Your My 53 is full/);
  assert.match(js,/selection\.size===FINAL_LIMIT/);
});

test('My 53 persists safely and rolls back a failed local save',()=>{
  assert.match(js,/if\(!saveMy53\(selection\)\)\{selection\.delete\(key\)/);
  assert.match(js,/This browser could not save that pick\. Nothing changed\./);
  assert.match(js,/Pick removed\. Your fan board stays on this device\./);
  assert.match(js,/My 53 cleared on this device\./);
});

test('My 53 is interactive and accessible',()=>{
  assert.match(js,/data-my53-player/);
  assert.match(js,/aria-pressed="false"/);
  assert.match(js,/role="group" aria-label="Choose players for My 53"/);
  assert.match(js,/data-my53-count/);
  assert.match(js,/data-my53-shape aria-live="polite"/);
  assert.match(js,/data-my53-clear/);
});

test('My 53 review tools search filter and review the current local board',()=>{
  for(const contract of ['data-my53-search','data-my53-position','data-my53-selected','data-my53-visible','data-my53-units'])assert.match(js,new RegExp(contract));
  assert.match(js,/placeholder="Search name or number…"/);
  assert.match(js,/All positions/);
  assert.match(js,/Selected only/);
  assert.match(js,/button\.hidden=!show/);
  assert.match(js,/selectedControl\.setAttribute\('aria-pressed',String\(next\)\)/);
  assert.match(js,/\$\{shown\} shown · \$\{selection\.size\} selected/);
  assert.match(js,/my53UnitShape\(roster,selection\)/);
});

test('My 53 share output is derived from selected loaded roster facts and labeled fan-made',()=>{
  assert.match(js,/function my53ShareText\(roster,selection\)/);
  assert.match(js,/selection\.has\(playerKey\(player\)\)/);
  assert.match(js,/My Titans 53 · fan roster board/);
  assert.match(js,/Fan-made roster exercise · not an official Titans projection\./);
  assert.match(js,/navigator\.share\(\{title:'My Titans 53',text\}\)/);
  assert.match(js,/navigator\.clipboard\?\.writeText/);
  assert.match(js,/data-my53-share disabled/);
});

test('My 53 remains mobile and touch safe',()=>{
  assert.match(css,/\.my53-player\{min-height:58px/);
  assert.match(css,/@media\(max-width:720px\)/);
  assert.match(css,/\.my53-list\{grid-template-columns:1fr;max-height:520px/);
  assert.match(css,/\.my53-player\{min-height:52px/);
  assert.match(css,/\.my53-tools-actions\{display:grid;grid-template-columns:1fr 1fr\}/);
});

test('My 53 controls outspecify the injected global 44px mobile floor',()=>{
  assert.match(accessibility,/#app button,[\s\S]*min-height:44px!important/);
  const mobileBlock=css.slice(css.indexOf('@media(max-width:720px)'));
  assert.match(mobileBlock,/#app \.my53-count button\[data-my53-clear\]\{min-height:48px!important\}/);
  assert.match(mobileBlock,/#app \.my53-tools input\[data-my53-search\],#app \.my53-tools select\[data-my53-position\],#app \.my53-tools-actions button\{min-height:48px!important\}/);
});

test('My 53 re-wires tools after Cutdown refresh without another observer',()=>{
  assert.match(js,/wireMy53\(panel,snapshot\(\)\.roster\)/);
  assert.match(js,/panel\.innerHTML=rosterPanel\(\)/);
  assert.match(js,/search\?\.addEventListener\('input',refreshTools\)/);
  assert.match(js,/positionFilter\?\.addEventListener\('change',refreshTools\)/);
  assert.doesNotMatch(js,/new MutationObserver/);
});