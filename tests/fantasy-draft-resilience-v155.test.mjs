import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fantasy-command-v1.js',import.meta.url),'utf8');

test('Sleeper core league truth no longer depends on the optional draft endpoints',()=>{
  assert.match(js,/const \[league,rosters,users,matchups\]=await Promise\.all\(\[/);
  const coreStart=js.indexOf('const [league,rosters,users,matchups]=await Promise.all([');
  const core=js.slice(coreStart,js.indexOf(']);',coreStart)+3);
  assert.match(core,/\/league\/\$\{leagueId\}/);
  assert.match(core,/\/league\/\$\{leagueId\}\/rosters/);
  assert.match(core,/\/league\/\$\{leagueId\}\/users/);
  assert.match(core,/matchups\/\$\{requestWeek\}/);
  assert.doesNotMatch(core,/\/drafts|\/draft\//);
  assert.match(js,/sleeper\.league=league;sleeper\.rosters=Array\.isArray\(rosters\)\?rosters:\[\];sleeper\.users=Array\.isArray\(users\)\?users:\[\];sleeper\.matchups=Array\.isArray\(matchups\)\?matchups:\[\]/);
  assert.match(js,/void loadDraftData\(serial,leagueId,requestWeek\)/);
});

test('draft-list failure preserves the already loaded league roster and matchup data',()=>{
  const optionalStart=js.indexOf('async function loadDraftData');
  const optionalEnd=js.indexOf('async function loadLeague',optionalStart);
  const optional=js.slice(optionalStart,optionalEnd);
  assert.match(optional,/const drafts=await sleeperFetch\(`\/league\/\$\{leagueId\}\/drafts`\)/);
  assert.match(optional,/sleeper\.drafts=\[\];sleeper\.picks=\[\];sleeper\.draftError=/);
  assert.doesNotMatch(optional,/clearLeagueData\(\)/);
  assert.match(optional,/Sleeper drafts request timed out/);
  assert.match(optional,/Sleeper draft data unavailable/);
});

test('draft-pick failure keeps draft metadata and never masquerades as zero loaded picks',()=>{
  assert.match(js,/const draft=safeDrafts\[0\]/);
  assert.match(js,/sleeper\.drafts=safeDrafts/);
  assert.match(js,/sleeper\.picks=\[\];sleeper\.draftError=e\?\.name==='AbortError'\?'Sleeper draft-picks request timed out\.'/);
  assert.match(js,/sleeper\.draftLoading\|\|sleeper\.draftError\?'—':picks\.length/);
  assert.match(js,/sleeper\.draftLoading\?'picks loading':sleeper\.draftError\?'picks unavailable':'picks loaded'/);
  assert.match(js,/Draft metadata loaded, but picks are unavailable right now/);
});

test('a real empty pick list still remains distinct from provider failure',()=>{
  assert.match(js,/sleeper\.picks=Array\.isArray\(picks\)\?picks:\[\]/);
  assert.match(js,/No picks have been recorded yet/);
  assert.match(js,/sleeper\.draftLoading\?.*sleeper\.draftError\?.*picks\.slice\(-36\)\.reverse\(\)/s);
});

test('optional draft responses retain exact league and week stale-request guards',()=>{
  const guards=js.match(/if\(!leagueRequestCurrent\(serial,leagueId,requestWeek\)\)return;/g)||[];
  assert.ok(guards.length>=5,`expected stale guards across core, drafts and picks; found ${guards.length}`);
  assert.match(js,/const drafts=await sleeperFetch\(`\/league\/\$\{leagueId\}\/drafts`\);if\(!leagueRequestCurrent\(serial,leagueId,requestWeek\)\)return;/);
  assert.match(js,/const picks=await sleeperFetch\(`\/draft\/\$\{encodeURIComponent\(draft\.draft_id\)\}\/picks`\);if\(!leagueRequestCurrent\(serial,leagueId,requestWeek\)\)return;/);
  assert.match(js,/finally\{if\(leagueRequestCurrent\(serial,leagueId,requestWeek\)\)\{sleeper\.draftLoading=false;render\(\);\}\}/);
});

test('draft resilience keeps Sleeper read-only and adds no new persistence or lifecycle owner',()=>{
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.doesNotMatch(js,/localStorage\.setItem\((?!STORE)/);
  assert.doesNotMatch(js,/setInterval\(/);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((js.match(/https:\/\/api\.sleeper\.app\/v1/g)||[]).length,1);
});
