import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Change Intelligence 2.0 loads after Command Intelligence and is precached',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/change-intelligence-v18\.css/);
  const base=html.indexOf('/command-intelligence-addons-v15.js?v=1'),change=html.indexOf('/change-intelligence-v18.js?v=1');
  assert.ok(base>=0&&change>base);
  assert.match(sw,/change-intelligence-v18\.css/);
  assert.match(sw,/change-intelligence-v18\.js/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
});

test('reviewed snapshot changes only when fan explicitly marks current state reviewed',()=>{
  const js=read('change-intelligence-v18.js');
  assert.match(js,/SNAP_KEY='titans:v18ReviewedSnapshot'/);
  assert.match(js,/data-v18-review/);
  assert.match(js,/setJson\(SNAP_KEY,current\)/);
  assert.doesNotMatch(js,/setJson\(SNAP_KEY,current\);state/);
});

test('Change Intelligence compares roster transactions injuries depth and broadcasts',()=>{
  const js=read('change-intelligence-v18.js');
  for(const token of ['roster:','transactions:','injuries:','depth:','games:'])assert.match(js,new RegExp(token));
  for(const label of ['Roster','Transaction','Injury / availability','Depth chart','Schedule / broadcast'])assert.match(js,new RegExp(label.replace('/','\\/')));
  assert.match(js,/BEFORE/);
  assert.match(js,/NOW/);
});

test('favorite-player changes are prioritized locally',()=>{
  const js=read('change-intelligence-v18.js');
  assert.match(js,/titans:v15MyTitans/);
  assert.match(js,/priority:favHit\?'favorite'/);
  assert.match(js,/★ MY TITANS/);
  assert.match(js,/Compared locally on this device/);
});

test('Change Intelligence does not infer practice reps or hidden coaching intent',()=>{
  const js=read('change-intelligence-v18.js');
  assert.match(js,/structured depth snapshots/);
  assert.match(js,/weekly-report rows/);
  assert.match(js,/compact comparison snapshot in this browser/);
});

test('Change Intelligence uses narrow observers and mobile-safe targets',()=>{
  const js=read('change-intelligence-v18.js'),css=read('change-intelligence-v18.css');
  assert.match(js,/observe\(host,\{childList:true,subtree:false\}\)/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});

test('Change Intelligence mounts synchronously and resolves the live host after async hydration',()=>{
  const js=read('change-intelligence-v18.js');
  assert.match(js,/data-v18-loading/);
  assert.match(js,/ensureMount\(firstHost\)/);
  assert.match(js,/state\.rendering/);
  assert.match(js,/const host=document\.querySelector\('\.v15-command-view'\);/);
  assert.match(js,/!host\|\|!host\.isConnected/);
  assert.match(js,/routeEpoch/);
  assert.doesNotMatch(js,/const token=\+\+state\.serial/);
});
