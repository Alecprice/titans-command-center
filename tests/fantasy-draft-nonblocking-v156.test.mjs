import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fantasy-command-v1.js',import.meta.url),'utf8');

test('core Sleeper readiness and optional draft readiness use separate state',()=>{
  assert.match(js,/loading:false,draftLoading:false/);
  assert.match(js,/clearLeagueData=.*sleeper\.draftLoading=false/);
  assert.match(js,/sleeper\.loading=false;sleeper\.draftLoading=true;render\(\);/);
});

test('valid league roster and matchup render before optional draft requests start',()=>{
  const publish=js.indexOf('sleeper.league=league;sleeper.rosters=Array.isArray(rosters)?rosters:[];sleeper.users=Array.isArray(users)?users:[];sleeper.matchups=Array.isArray(matchups)?matchups:[];sleeper.loading=false;sleeper.draftLoading=true;render();');
  const optional=js.indexOf('void loadDraftData(serial,leagueId,requestWeek);');
  assert.ok(publish>=0,'core publish boundary missing');
  assert.ok(optional>publish,'optional draft work must begin only after core render');
  assert.doesNotMatch(js,/await loadDraftData\(serial,leagueId,requestWeek\)/);
});

test('Sleeper Connect copy no longer claims optional draft data blocks the matchup',()=>{
  assert.match(js,/Previous league and matchup data stays hidden until Sleeper returns this selection\./);
  assert.doesNotMatch(js,/Previous league, matchup and draft data stays hidden until Sleeper returns this selection\./);
  assert.match(js,/\$\{!sleeper\.connecting&&!sleeper\.loading&&league\?/);
  assert.match(js,/id="sleeper-league"\$\{sleeper\.connecting\|\|sleeper\.loading\?' disabled':''\}/);
});

test('Draft Command exposes progressive optional loading without fake zero picks',()=>{
  assert.match(js,/sleeper\.draftLoading&&!draft/);
  assert.match(js,/League ready · loading draft data…/);
  assert.match(js,/selected league and matchup are already available/);
  assert.match(js,/sleeper\.draftLoading\?'picks loading'/);
  assert.match(js,/Draft metadata loaded\. Loading picks…/);
  assert.match(js,/sleeper\.draftLoading\|\|sleeper\.draftError\?'—':picks\.length/);
});

test('optional draft completion can publish only for the exact current league and week',()=>{
  const helper=js.slice(js.indexOf('async function loadDraftData'),js.indexOf('async function loadLeague'));
  const guards=helper.match(/leagueRequestCurrent\(serial,leagueId,requestWeek\)/g)||[];
  assert.ok(guards.length>=4,`expected draft helper to revalidate current request; found ${guards.length}`);
  assert.match(helper,/finally\{if\(leagueRequestCurrent\(serial,leagueId,requestWeek\)\)\{sleeper\.draftLoading=false;render\(\);\}\}/);
});

test('nonblocking draft loading adds no provider persistence or lifecycle owner',()=>{
  assert.equal((js.match(/https:\/\/api\.sleeper\.app\/v1/g)||[]).length,1);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
  assert.doesNotMatch(js,/setInterval\(|WebSocket\(|EventSource\(/);
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.doesNotMatch(js,/localStorage\.setItem\((?!STORE)/);
});
