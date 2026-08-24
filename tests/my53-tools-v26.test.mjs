import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('my53-tools-v26.js');
const css=read('my53-tools-v26.css');
const html=read('index.html');
const sw=read('sw.js');

test('My 53 fan tools are loaded after the stable Cutdown board and packaged offline',()=>{
  assert.match(html,/cutdown-command-v23\.css\?v=1[^\n]+my53-tools-v26\.css\?v=1/);
  assert.match(html,/cutdown-command-v23\.js\?v=1[^\n]+my53-tools-v26\.js\?v=1/);
  assert.match(sw,/'\/my53-tools-v26\.css'/);
  assert.match(sw,/'\/my53-tools-v26\.js'/);
});

test('My 53 fan tools add useful review controls without changing roster truth',()=>{
  assert.match(js,/data-my53-search/);
  assert.match(js,/data-my53-position/);
  assert.match(js,/data-my53-selected/);
  assert.match(js,/data-my53-share/);
  assert.match(js,/shown · \$\{selected\.length\} selected/);
  assert.match(js,/positionValue==='all'/);
  assert.match(js,/onlySelected\|\|meta\.selected/);
  assert.doesNotMatch(js,/cut probability|projected cut|bubble score|safe player/i);
});

test('My 53 share output is local and explicitly non-official',()=>{
  assert.match(js,/My Titans 53 · fan roster board/);
  assert.match(js,/Fan-made roster exercise · not an official Titans projection/);
  assert.match(js,/navigator\.share/);
  assert.match(js,/navigator\.clipboard\?\.writeText/);
  assert.match(js,/document\.execCommand\('copy'\)/);
  assert.doesNotMatch(js,/fetch\(|\/api\/|XMLHttpRequest/);
});

test('My 53 composition summarizes selected units from rendered roster facts',()=>{
  assert.match(js,/const \[position='Other',unit='Other'\]=detail\.split\('·'\)/);
  assert.match(js,/counts\.set\(player\.unit/);
  assert.match(js,/Composition appears as you make picks/);
  assert.match(js,/data-my53-units aria-live="polite"/);
});

test('fan tools use only a narrowly scoped Cutdown-panel observer',()=>{
  assert.match(js,/observePanel\(panel\)/);
  assert.match(js,/new MutationObserver\(\(\)=>mount\(panel\.querySelector\('\[data-my53\]'\)\)\)/);
  assert.match(js,/observer\.observe\(panel,\{childList:true\}\)/);
  assert.doesNotMatch(js,/observer\.observe\(document/);
  assert.doesNotMatch(js,/subtree:true/);
});

test('My 53 fan tools remain touch safe on phones',()=>{
  assert.match(css,/@media\(max-width:720px\)/);
  assert.match(css,/my53-tools input,.my53-tools select,.my53-tools-actions button\{min-height:48px\}/);
  assert.match(css,/@media\(max-width:430px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
