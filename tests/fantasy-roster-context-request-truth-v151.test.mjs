import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fantasy-roster-props-v134.js',import.meta.url),'utf8');

test('roster context publish identity includes request serial route and the live saved connection',()=>{
  assert.match(js,/const requestCurrent=\(serial,key\)=>serial===requestSerial&&route\(\)===ROUTE&&connectionKey\(connection\(\)\)===key/);
  assert.match(js,/if\(!requestCurrent\(serial,key\)\)return;[\s\S]*state\.context=buildContext/);
  assert.match(js,/catch\(error\)\{\s*if\(!requestCurrent\(serial,key\)\)return;/);
});

test('a connection change during an in-flight roster read schedules current-state recovery',()=>{
  assert.match(js,/if\(serial===requestSerial\)\{\s*state\.loading=false;/);
  assert.match(js,/if\(connectionKey\(connection\(\)\)!==key\)queue\(\);\s*else decorate\(\)/);
  assert.match(js,/if\(key!==state\.connectionKey\)\{state\.context=null;state\.error='';state\.loadedAt=0;state\.rosterOnly=false;loadContext\(true\);return\}/);
});

test('a settled Sleeper roster error does not retry because unrelated DOM mutations occur',()=>{
  assert.match(js,/if\(!state\.context&&!state\.loading&&!state\.error\)loadContext\(false\);else decorate\(\)/);
  assert.match(js,/frp-refresh-roster/);
  assert.match(js,/addEventListener\('click',\(\)=>loadContext\(true\),\{once:true\}\)/);
});

test('stale roster context cannot publish badges filters or public context under a newer league',()=>{
  const successGate=js.indexOf('if(!requestCurrent(serial,key))return;');
  const contextWrite=js.indexOf('state.context=buildContext',successGate);
  const publish=js.indexOf('publish();',contextWrite);
  assert.ok(successGate>=0&&contextWrite>successGate&&publish>contextWrite,'success publish must remain behind current-connection gate');
  assert.match(js,/window\.TitansFantasyRosterContext=state\.context\?\{\.\.\.state\.context,connectionKey:state\.connectionKey,loadedAt:state\.loadedAt\}:null/);
  assert.match(js,/row\.hidden=Boolean\(state\.rosterOnly&&canFilter&&!matched\)/);
});

test('request-truth hardening preserves explicit fail-open prop visibility',()=>{
  assert.match(js,/No prop rows were guessed or hidden/);
  assert.match(js,/state\.context=null;state\.rosterOnly=false;/);
  assert.match(js,/if\(!name\|\|!state\.context\?\.matched\)return null/);
  assert.doesNotMatch(js,/\b(?:recommend|best bet|edge score|lock)\b/i);
});

test('roster request hardening adds no provider persistence timer or lifecycle owner',()=>{
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((js.match(/addEventListener\('hashchange'/g)||[]).length,1);
  assert.equal((js.match(/addEventListener\('storage'/g)||[]).length,1);
  assert.equal((js.match(/setInterval\(/g)||[]).length,0);
  const storageWrites=[...js.matchAll(/localStorage\.setItem\(([^,]+)/g)].map(match=>match[1]);
  assert.ok(storageWrites.every(key=>/PLAYER_KEY/.test(key)),`unexpected persistence owner: ${storageWrites.join(', ')}`);
});
