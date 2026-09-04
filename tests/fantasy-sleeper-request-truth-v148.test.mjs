import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fantasy-command-v1.js',import.meta.url),'utf8');

test('Sleeper league loads capture the selected week instead of reading mutable state after requests start',()=>{
  assert.match(js,/const requestWeek=state\.week,serial=\+\+leagueLoadSerial/);
  assert.match(js,/matchups\/\$\{requestWeek\}/);
  assert.doesNotMatch(js,/matchups\/\$\{state\.week\}/);
});

test('only the newest exact league and week request may publish returned data',()=>{
  assert.match(js,/const leagueRequestCurrent=\(serial,leagueId,week\)=>serial===leagueLoadSerial&&state\.leagueId===leagueId&&state\.week===week/);
  const guards=js.match(/if\(!leagueRequestCurrent\(serial,leagueId,requestWeek\)\)return;/g)||[];
  assert.ok(guards.length>=2,'expected guards before and after the draft-picks request');
  assert.match(js,/sleeper\.league=league;sleeper\.rosters=Array\.isArray\(rosters\)\?rosters:\[\]/);
});

test('changing league or week hides stale league matchup and draft data while the new request is pending',()=>{
  assert.match(js,/const clearLeagueData=\(\)=>\{sleeper\.league=null;sleeper\.rosters=\[\];sleeper\.users=\[\];sleeper\.matchups=\[\];sleeper\.drafts=\[\];sleeper\.picks=\[\];sleeper\.draftLoading=false;\}/);
  assert.match(js,/sleeper\.loading=true;clearLeagueData\(\);render\(\);/);
  assert.match(js,/Previous league and matchup data stays hidden until Sleeper returns this selection/);
  assert.doesNotMatch(js,/Previous league, matchup and draft data stays hidden until Sleeper returns this selection/);
  assert.match(js,/\$\{!sleeper\.connecting&&!sleeper\.loading&&league\?/);
  assert.match(js,/Previous draft data stays hidden until the current league request finishes/);
});

test('failed current league requests fail closed instead of restoring the previous selection',()=>{
  assert.match(js,/catch\(e\)\{if\(!leagueRequestCurrent\(serial,leagueId,requestWeek\)\)return;clearLeagueData\(\);sleeper\.error=/);
  assert.match(js,/Draft data unavailable/);
  assert.match(js,/Sleeper has not returned draft data for the selected league/);
});

test('saved Sleeper auto-connect cannot spin in an error retry loop',()=>{
  assert.match(js,/if\(sleeper\.connecting\)return;/);
  assert.match(js,/sleeper\.connecting=false;sleeper\.error=e\?\.name===/);
  assert.match(js,/!sleeper\.user&&!sleeper\.connecting&&!sleeper\.error\)connectSleeper\(state\.sleeperUser\)/);
});

test('request-truth hardening keeps the existing read-only and persistence boundaries',()=>{
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.doesNotMatch(js,/localStorage\.setItem\((?!STORE)/);
  assert.doesNotMatch(js,/setInterval\(/);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
});
