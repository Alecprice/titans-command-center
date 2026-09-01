import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('shared runtime boots before 365 Mode from the early usability module',()=>{
  const js=read('usability-runtime.js');
  assert.match(js,/import '\.\/runtime-v19\.js';/);
  assert.match(js,/import '\.\/mode-365-v19\.js';/);
  assert.ok(js.indexOf("import './runtime-v19.js';")<js.indexOf("import './mode-365-v19.js';"));
});

test('shared runtime centralizes route, render, and refresh subscriptions',()=>{
  const js=read('runtime-v19.js');
  assert.match(js,/const routeListeners=new Set\(\)/);
  assert.match(js,/const renderListeners=new Set\(\)/);
  assert.match(js,/const refreshListeners=new Set\(\)/);
  assert.match(js,/function onRoute/);
  assert.match(js,/function onAppRender/);
  assert.match(js,/function onRefresh/);
  assert.match(js,/function refresh\(/);
  assert.match(js,/version:'1\.10\.0'/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(js,/subtree:true/);
});

test('shared runtime exposes core game focus and completion truth without duplicating kickoff math',()=>{
  const js=read('runtime-v19.js');
  assert.match(js,/import \{scheduleFocus,latestCompletedGame,GAME_FOCUS_WINDOW_MS\} from '\.\/src\/core\.mjs';/);
  assert.match(js,/scheduleFocus,/);
  assert.match(js,/latestCompletedGame,/);
  assert.match(js,/gameFocusWindowMs:GAME_FOCUS_WINDOW_MS/);
  assert.doesNotMatch(js,/5\*60\*60\*1000/);
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

test('global scoreboard control invalidates the shared runtime cache',()=>{
  const js=read('runtime-v19.js');
  assert.match(js,/const refreshButton=document\.querySelector\('#refresh-button'\)/);
  assert.match(js,/refreshButton\?\.addEventListener\('click',\(\)=>refresh\(\{reason:'scoreboard-control'\}\)\)/);
  assert.match(js,/apiCache\.clear\(\)/);
  assert.match(js,/refreshInfo/);
});

test('365 premium and Ask reuse shared runtime while stable Change remains isolated',()=>{
  const mode=read('mode-365-v19.js');
  const premium=read('premium-experience-v14.js');
  const ask=read('ask-titans-v17.js');
  const change=read('change-intelligence-v18.js');
  assert.match(mode,/runtime\.onRefresh\(refreshMode\)/);
  assert.match(mode,/document\.querySelector\('\.v19-365'\)\?\.remove\(\)/);
  assert.match(premium,/runtime\.onRefresh\(refreshPremium\)/);
  assert.match(premium,/document\.querySelectorAll\('\.v14-now,\.v14-gameday-quick,\.v14-stats-help,\.v14-player-help'\)/);
  assert.match(ask,/const runtime=window\.TitansRuntime/);
  assert.match(ask,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(ask,/runtime\.apiJson\('\/api\/espn-scoreboard',\{ttl:5000\}\)/);
  assert.doesNotMatch(change,/TitansRuntime/);
});

test('runtime 365 browser smoke uses returning-user setup and current five-action dock contract',()=>{
  const smoke=read('scripts/runtime-365-browser-smoke.py');
  assert.match(smoke,/def prepare_returning_user\(driver\):/);
  assert.match(smoke,/titans:v10Onboarded/);
  assert.match(smoke,/prepare_returning_user\(d\)/);
  assert.match(smoke,/prepare_returning_user\(m\)/);
  assert.match(smoke,/len\(mobile\['dockTargets'\]\)!=5/);
  assert.match(smoke,/\{'Home','Roster','Game','Search','More'\}/);
  assert.doesNotMatch(smoke,/len\(mobile\['dockTargets'\]\)!=6/);
});

test('runtime 365 mobile sheet check is deterministic and records precise failure stages',()=>{
  const smoke=read('scripts/runtime-365-browser-smoke.py');
  assert.match(smoke,/def disable_sidebar_motion\(driver\):/);
  assert.match(smoke,/#sidebar\{transition:none!important;animation:none!important\}/);
  assert.match(smoke,/stage='mobile:more-settle'/);
  assert.match(smoke,/stage='mobile:search-panel'/);
  assert.match(smoke,/result\['stage'\]=stage/);
  assert.match(smoke,/result\['mobileState'\]=mobile_state\(m\)/);
  assert.match(smoke,/r\.bottom>dr\.top\+2/);
  assert.match(smoke,/dockTop:dr\.top/);
});

test('PWA precaches the runtime and 365 assets',()=>{
  const sw=read('sw.js');
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  for(const asset of ['runtime-v19.js','mode-365-v19.js','mode-365-v19.css'])assert.match(sw,new RegExp(asset.replace('.','\\.')));
});