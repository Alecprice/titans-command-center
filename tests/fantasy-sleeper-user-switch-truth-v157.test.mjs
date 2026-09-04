import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fantasy-command-v1.js',import.meta.url),'utf8');

test('starting a Sleeper username connection invalidates older league work before provider reads can publish',()=>{
  const connectStart=js.indexOf('async function connectSleeper');
  const userFetch=js.indexOf('const user=await sleeperFetch',connectStart);
  const invalidate=js.indexOf('leagueLoadSerial++;sleeper.connecting=true',connectStart);
  assert.ok(connectStart>=0&&invalidate>connectStart&&userFetch>invalidate,'league request ownership must be invalidated before the new user lookup');
  assert.match(js,/leagueLoadSerial\+\+;sleeper\.connecting=true;sleeper\.connectingUser=clean;sleeper\.loading=false;sleeper\.error='';sleeper\.draftError='';clearLeagueData\(\);/);
});

test('switching accounts clears prior in-memory identity while same-user refresh stays reusable',()=>{
  assert.match(js,/const normalizedSleeperUser=value=>String\(value\|\|''\)\.trim\(\)\.toLowerCase\(\)/);
  assert.match(js,/const switchingUser=normalizedSleeperUser\(clean\)!==normalizedSleeperUser\(state\.sleeperUser\),serial=\+\+connectSerial/);
  assert.match(js,/if\(switchingUser\)\{sleeper\.user=null;sleeper\.leagues=\[\];\}/);
  assert.doesNotMatch(js,/if\(!switchingUser\)\{sleeper\.user=null/);
});

test('an unverified username stays ephemeral until Sleeper confirms user and league ownership',()=>{
  const connectStart=js.indexOf('async function connectSleeper');
  const userFetch=js.indexOf('const user=await sleeperFetch',connectStart);
  const leaguesFetch=js.indexOf('const leagues=await sleeperFetch',userFetch);
  const persistUser=js.indexOf('state.sleeperUser=clean',leaguesFetch);
  const save=js.indexOf('sleeper.connecting=false;save()',persistUser);
  assert.ok(userFetch>connectStart&&leaguesFetch>userFetch&&persistUser>leaguesFetch&&save>persistUser,'saved connection must change only after both identity reads succeed');
  assert.match(js,/connectingUser:''/);
  assert.match(js,/usernameValue=sleeper\.connectingUser\|\|state\.sleeperUser/);
  assert.match(js,/state\.sleeperUser=clean;sleeper\.connectingUser=''/);
});

test('Sleeper Connect hides stale dependent truth and disables league changes during username verification',()=>{
  assert.match(js,/Connecting Sleeper account… Previous league, matchup and draft data stays hidden until Sleeper confirms this username\./);
  assert.match(js,/id="sleeper-league"\$\{sleeper\.connecting\|\|sleeper\.loading\?' disabled':''\}/);
  assert.match(js,/\$\{!sleeper\.connecting&&!sleeper\.loading&&league\?/);
});

test('Draft Command cannot expose prior draft state while a replacement Sleeper username is pending',()=>{
  const connectGate=js.indexOf("if(sleeper.connecting)return `<section class=\"fantasy-grid\"");
  const leagueGate=js.indexOf("if(sleeper.loading)return `<section class=\"fantasy-grid\"",connectGate);
  assert.ok(connectGate>=0&&leagueGate>connectGate,'Draft Command must gate account verification before league loading');
  assert.match(js,/Connecting Sleeper account…<\/h2><p>Previous draft data stays hidden until Sleeper confirms this username\./);
});

test('user-switch truth hardening preserves read-only provider and lifecycle boundaries',()=>{
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.doesNotMatch(js,/localStorage\.setItem\((?!STORE)/);
  assert.doesNotMatch(js,/setInterval\(/);
  assert.doesNotMatch(js,/WebSocket|EventSource/);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
});
