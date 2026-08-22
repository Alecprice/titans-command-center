import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('v1.9 shared runtime boots before 365 Mode from the early usability module',()=>{
  const js=read('usability-runtime.js');
  assert.match(js,/import '\.\/runtime-v19\.js';/);
  assert.match(js,/import '\.\/mode-365-v19\.js';/);
  assert.ok(js.indexOf("import './runtime-v19.js';")<js.indexOf("import './mode-365-v19.js';"));
});

test('shared runtime centralizes route and app-render subscriptions',()=>{
  const js=read('runtime-v19.js');
  assert.match(js,/const routeListeners=new Set\(\)/);
  assert.match(js,/const renderListeners=new Set\(\)/);
  assert.match(js,/function onRoute/);
  assert.match(js,/function onAppRender/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(js,/subtree:true/);
});

test('shared runtime deduplicates same-origin API requests with bounded TTL cache',()=>{
  const js=read('runtime-v19.js');
  assert.match(js,/if\(!key\.startsWith\('\/api\/'\)\)throw new Error/);
  assert.match(js,/if\(!force&&entry\?\.value&&now<entry\.expiresAt\)return entry\.value/);
  assert.match(js,/if\(entry\?\.inflight\)return entry\.inflight/);
  assert.match(js,/fetch\(key,\{cache:'no-store'\}\)/);
  assert.match(js,/invalidateApi/);
});

test('shared runtime provides storage-safe JSON helpers',()=>{
  const js=read('runtime-v19.js');
  assert.match(js,/getJSON\(key,fallback=null\)/);
  assert.match(js,/setJSON\(key,value\)/);
  assert.match(js,/try\{localStorage/);
  assert.match(js,/catch\{return fallback\}/);
});

test('premium home layer consumes shared runtime without migrating stable Ask or Change modules',()=>{
  const premium=read('premium-experience-v14.js');
  const ask=read('ask-titans-v17.js');
  const change=read('change-intelligence-v18.js');
  assert.match(premium,/const runtime=window\.TitansRuntime/);
  assert.match(premium,/runtime\.apiJson\('\/api\/fan-intel'/);
  assert.match(premium,/runtime\.onRoute/);
  assert.match(premium,/runtime\.onAppRender/);
  assert.doesNotMatch(ask,/TitansRuntime/);
  assert.doesNotMatch(change,/TitansRuntime/);
});

test('PWA v50 precaches the runtime and 365 assets',()=>{
  const sw=read('sw.js');
  assert.match(sw,/titans-cc-brand-2026-v50/);
  for(const asset of ['runtime-v19.js','mode-365-v19.js','mode-365-v19.css'])assert.match(sw,new RegExp(asset.replace('.','\\.')));
});
