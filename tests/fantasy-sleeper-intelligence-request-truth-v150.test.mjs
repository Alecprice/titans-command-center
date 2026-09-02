import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fantasy-sleeper-intelligence-v2.js',import.meta.url),'utf8');

test('Sleeper intelligence request identity is connection-scoped rather than week-scoped',()=>{
  assert.match(js,/const connectionKey=s=>`\$\{String\(s\?\.username\|\|''\)\.trim\(\)\.toLowerCase\(\)\}\|\$\{String\(s\?\.leagueId\|\|''\)\}`/);
  const start=js.indexOf('const connectionKey=');
  const end=js.indexOf(';',start);
  assert.ok(start>=0&&end>start,'missing connection identity helper');
  assert.doesNotMatch(js.slice(start,end),/week/);
});

test('an older Sleeper intelligence response cannot publish under a newer connection',()=>{
  assert.match(js,/const live=state\(\),liveContent=root\(\)\?\.querySelector\('\.fantasy-content'\)/);
  assert.match(js,/if\(mine!==serial\|\|route\(\)!==ROUTE\|\|connectionKey\(live\)!==key\)return/);
  assert.match(js,/if\(pending\|\|\(route\(\)===ROUTE&&connectionKey\(live\)!==key\)\)\{pending=false;queueMicrotask\(hydrate\)\}/);
});

test('a canonical rerender during an in-flight request schedules one current-state recovery pass',()=>{
  assert.match(js,/if\(running\)\{pending=true;return\}/);
  assert.match(js,/finally\{[\s\S]*running=false;[\s\S]*queueMicrotask\(hydrate\)/);
  assert.doesNotMatch(js,/setInterval\(|setTimeout\([^\n]*hydrate/);
});

test('week changes reuse the same week-independent intelligence snapshot without provider refetch',()=>{
  assert.match(js,/if\(key===lastKey&&s\.week!==lastWeek&&lastPayload\)\{lastWeek=s\.week;style\(\);renderIntel\(content,lastPayload\);return\}/);
  assert.match(js,/lastPayload=payload;lastError='';lastWeek=live\.week/);
  assert.doesNotMatch(js,/\/matchups\/|\/week\//,'week-specific Sleeper data requires revisiting connection-scoped cache identity');
});

test('week changes preserve an existing truthful error without starting an automatic retry loop',()=>{
  assert.match(js,/if\(key===lastKey&&lastError&&content\.querySelector\('\.fsi-error'\)\)return/);
  assert.match(js,/if\(key===lastKey&&s\.week!==lastWeek&&lastError\)\{lastWeek=s\.week;renderError\(content,lastError\);return\}/);
  assert.match(js,/function renderError\(host,message\)/);
  assert.match(js,/host\.querySelector\('\.fsi-error'\)\?\.remove\(\)/);
});

test('request-truth hardening keeps Sleeper read-only and adds no persistence or lifecycle silo',()=>{
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((js.match(/addEventListener\('hashchange'/g)||[]).length,1);
  const keys=[...js.matchAll(/localStorage\.setItem\(([^,]+)/g)].map(match=>match[1]);
  assert.ok(keys.every(key=>/STATE_KEY|PLAYER_KEY/.test(key)),`unexpected persistence owner: ${keys.join(', ')}`);
});
