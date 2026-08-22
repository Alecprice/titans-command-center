import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Command route guard is loaded after Command Intelligence and precached',()=>{
  const html=read('index.html'),sw=read('sw.js');
  const command=html.indexOf('/command-intelligence-v15.js?v=1');
  const guard=html.indexOf('/command-route-guard-v15.js?v=1');
  assert.ok(command>=0);
  assert.ok(guard>command);
  assert.match(sw,/command-route-guard-v15\.js/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v43'/);
});

test('Command route guard hands control back after legacy hydration overwrites the app',()=>{
  const js=read('command-route-guard-v15.js');
  assert.match(js,/route\(\)!=='command'/);
  assert.match(js,/\.v15-command,\.v15-loading/);
  assert.match(js,/new MutationObserver\(handBackToCommand\)/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.match(js,/new PopStateEvent\('popstate'\)/);
  assert.match(js,/window\.dispatchEvent/);
  assert.doesNotMatch(js,/location\.hash\s*=/);
  assert.doesNotMatch(js,/history\.(?:pushState|replaceState)/);
});
