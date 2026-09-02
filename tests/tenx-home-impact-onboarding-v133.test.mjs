import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const impact=read('my-player-impact-v38.js');
const watch=read('my-player-watch-v36.js');

test('TENX Home keeps Watchlist as the sole zero-follow player onboarding owner',()=>{
  assert.match(watch,/Your Titans watchlist/);
  assert.match(watch,/Open roster/);
  assert.match(impact,/const list=followed\(\)/);
  assert.match(impact,/const home=current==='home'/);
  assert.match(impact,/let root=app\.querySelector\(`\.v38-impact\[data-surface="\$\{current\}"\]`\)/);
  assert.match(impact,/if\(home&&!list\.length\)\{root\?\.remove\(\);return;\}/);
});

test('TENX Home removes a stale Impact root when the final follow disappears',()=>{
  assert.match(impact,/if\(home&&!list\.length\)\{root\?\.remove\(\);return;\}/);
  assert.match(impact,/addEventListener\('titans:player-watchlist',\(\)=>queueMicrotask\(mount\)\)/);
  assert.match(impact,/addEventListener\('storage',event=>\{if\(event\.key===PROFILE_KEY\)queueMicrotask\(mount\);\}\)/);
});

test('TENX zero-follow Home exits before Player Impact loads its data feeds',()=>{
  const guard=impact.indexOf("if(home&&!list.length){root?.remove();return;}");
  const load=impact.indexOf("if(list.length&&(!data||!fan)&&!loading){load();return;}");
  assert.ok(guard>=0,'Home zero-follow guard must exist');
  assert.ok(load>guard,'Home zero-follow guard must run before Player Impact data hydration');
  assert.match(impact,/apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(impact,/apiJson\?\.\('\/api\/fan-intel',\{ttl:30000\}\)/);
});

test('TENX followed Home still uses the existing verified Impact path',()=>{
  assert.match(impact,/const impacts=list\.map\(impactFor\)/);
  assert.match(impact,/const visibleImpacts=home\?impacts\.filter\(impact=>impact\.flagged\):impacts/);
  assert.match(impact,/const verified=Boolean\(rosterRow&&canonicalName\)/);
  assert.match(impact,/const injuryRows=verified&&Array\.isArray\(fan\?\.injuries\)\?fan\.injuries:\[\]/);
  assert.match(impact,/const transactionRows=verified&&Array\.isArray\(data\?\.transactions\)\?data\.transactions:\[\]/);
  assert.match(impact,/const depthRows=verified&&Array\.isArray\(fan\?\.depthChart\?\.changes\)\?fan\.depthChart\.changes:\[\]/);
});

test('TENX Game Day retains the complete Player Impact empty and followed states',()=>{
  assert.match(impact,/\['home','live'\]\.includes\(route\(\)\)/);
  assert.match(impact,/if\(home&&!list\.length\)/);
  assert.match(impact,/const visibleImpacts=home\?impacts\.filter\(impact=>impact\.flagged\):impacts/);
  assert.match(impact,/Watch a player from the roster to build your personal impact feed/);
  assert.match(impact,/if\(current==='live'\)return app\?\.querySelector\('\.v37-my-gameday'\)\|\|app\?\.querySelector\('\.v16-gameday'\)/);
});

test('TENX player route and stale-follow trust boundaries are unchanged',()=>{
  assert.match(impact,/const id=verified\?String\(rosterRow\?\.id\|\|''\)\.trim\(\):''/);
  assert.match(impact,/id\?`#player\?id=\$\{encodeURIComponent\(id\)\}`:verified\?`#player\?name=\$\{encodeURIComponent\(canonicalName\)\}`:'#roster'/);
  assert.match(impact,/routeState=verified\?'verified':'review'/);
  assert.match(impact,/Player-specific signals are withheld until current roster identity is verified/);
});

test('TENX onboarding ownership adds no provider persistence polling timer or observer owner',()=>{
  assert.match(impact,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(impact,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(impact,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.match(impact,/runtime\.onRefresh/);
  assert.doesNotMatch(impact,/\bfetch\s*\(/);
  assert.doesNotMatch(impact,/localStorage\.setItem|sessionStorage\.setItem/);
  assert.doesNotMatch(impact,/new MutationObserver/);
  assert.doesNotMatch(impact,/setInterval\(|setTimeout\(/);
});
