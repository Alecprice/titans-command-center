import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const impact=read('my-player-impact-v38.js');
const player=read('player-polish.js');

test('TENX Player Impact treats followed preference identity as input rather than route authority',()=>{
  assert.match(impact,/const storedId=String\(item\?\.id\|\|''\)\.trim\(\)/);
  assert.match(impact,/const storedName=norm\(item\?\.name\)/);
  assert.match(impact,/const rosterRow=roster\.find\(row=>\(storedId&&String\(row\?\.id\|\|''\)\.trim\(\)===storedId\)\|\|\(storedName&&norm\(playerName\(row\)\)===storedName\)\)\|\|null/);
  assert.match(impact,/const verified=Boolean\(rosterRow&&canonicalName\)/);
});

test('TENX Player Impact routes verified loaded players UUID first with audited-name fallback',()=>{
  assert.match(impact,/const id=verified\?String\(rosterRow\?\.id\|\|''\)\.trim\(\):''/);
  assert.match(impact,/const href=id\?`#player\?id=\$\{encodeURIComponent\(id\)\}`:verified\?`#player\?name=\$\{encodeURIComponent\(canonicalName\)\}`:'#roster'/);
  assert.doesNotMatch(impact,/rosterRow\?\.id\|\|item\.id/);
  assert.doesNotMatch(impact,/#player\?name=\$\{encodeURIComponent\(item\.name\)\}/);
});

test('TENX Player Impact withholds player-specific evidence until current roster verification',()=>{
  assert.match(impact,/const injuryRows=verified&&Array\.isArray\(fan\?\.injuries\)\?fan\.injuries:\[\]/);
  assert.match(impact,/const transactionRows=verified&&Array\.isArray\(data\?\.transactions\)\?data\.transactions:\[\]/);
  assert.match(impact,/const depthRows=verified&&Array\.isArray\(fan\?\.depthChart\?\.changes\)\?fan\.depthChart\.changes:\[\]/);
  assert.match(impact,/const injury=verified\?/);
  assert.match(impact,/const transaction=verified\?/);
  assert.match(impact,/const depth=verified\?/);
  assert.match(impact,/Player-specific signals are withheld until current roster identity is verified/);
});

test('TENX Player Impact keeps unresolved saved follows visible as truthful roster-review cards',()=>{
  assert.match(impact,/const routeState=verified\?'verified':'review'/);
  assert.match(impact,/Saved player is not on the loaded roster/);
  assert.match(impact,/Current roster verification unavailable/);
  assert.match(impact,/data-v38-state="\$\{impact\.routeState\}"/);
  assert.match(impact,/Review roster →/);
  assert.match(impact,/Review \$\{impact\.resolvedName\} in Team Room/);
  assert.match(impact,/\.v38-impact-card\.needs-review/);
});

test('TENX Player Impact distinguishes no flagged change from unavailable evidence feeds',()=>{
  assert.match(impact,/if\(verified&&Array\.isArray\(fan\?\.injuries\)\)loadedFeeds\.push\('injury-report'\)/);
  assert.match(impact,/if\(verified&&Array\.isArray\(data\?\.transactions\)\)loadedFeeds\.push\('transaction'\)/);
  assert.match(impact,/if\(verified&&Array\.isArray\(fan\?\.depthChart\?\.changes\)\)loadedFeeds\.push\('depth'\)/);
  assert.match(impact,/Unavailable feeds are excluded/);
  assert.match(impact,/Player-specific change feeds are currently unavailable/);
});

test('TENX Player Impact reuses established audited-name Player Intelligence support',()=>{
  assert.match(player,/const playerName=\(\)=>playerParams\(\)\.get\('name'\)\|\|''/);
  assert.match(player,/playerNorm\(row\?\.name\)===playerNorm\(name\)/);
  assert.match(player,/layer\.dataset\.mode='audited-fallback'/);
  assert.match(player,/No live injury or depth-chart claim is made/);
});

test('TENX Player Impact keeps existing data lifecycle persistence and mobile boundaries',()=>{
  assert.match(impact,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(impact,/apiJson\?\.\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(impact,/apiJson\?\.\('\/api\/fan-intel',\{ttl:30000\}\)/);
  assert.match(impact,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(impact,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(impact,/localStorage\.setItem/);
  assert.doesNotMatch(impact,/fetch\(/);
  assert.doesNotMatch(impact,/new MutationObserver/);
  assert.doesNotMatch(impact,/setInterval/);
  assert.match(impact,/min-height:44px/);
  assert.match(impact,/@media\(max-width:620px\)/);
});
