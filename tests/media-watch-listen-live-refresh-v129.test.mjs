import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-alternatives-v14.js',import.meta.url),'utf8');

test('Watch Listen refreshes game-day state on a fan-safe one minute cadence',()=>{
  const cadence=js.match(/const REFRESH_INTERVAL=(\d+)\*1000/);
  assert.equal(Number(cadence?.[1]),60);
  assert.match(js,/setInterval\(\(\)=>\{/);
  assert.match(js,/renderQuickStart\(\);\s*\},REFRESH_INTERVAL\)/);
});

test('pregame minute changes invalidate the quick-start signature',()=>{
  assert.match(js,/phase\.key,phase\.title,providerName/);
  assert.match(js,/Kickoff is \$\{Math\.max\(1,Math\.ceil\(diff\/60000\)\)\} min away/);
});

test('refresh work pauses off route and while the tab is hidden',()=>{
  assert.match(js,/if\(route\(\)==='media'&&document\.visibilityState!=='hidden'\)renderQuickStart\(\)/);
  assert.match(js,/if\(refreshTimer!==null\)\{clearInterval\(refreshTimer\);refreshTimer=null\}/);
  assert.match(js,/visibilitychange/);
  assert.match(js,/document\.visibilityState==='visible'&&route\(\)==='media'/);
});

test('live refresh continues to use the shared cached API and truthful status states',()=>{
  assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/if\(\/live\/i\.test\(String\(game\.status\|\|''\)\)\)/);
  assert.match(js,/GAME WINDOW/);
  assert.match(js,/live status is not yet confirmed/);
});

test('media observer only watches app-level replacement instead of every immersive child mutation',()=>{
  assert.match(js,/MutationObserver\(\(\)=>queueMicrotask\(render\)\)\.observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(js,/observe\(app,\{childList:true,subtree:true\}\)/);
});
