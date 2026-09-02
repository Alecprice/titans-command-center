import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fantasy-command-v1.js',import.meta.url),'utf8');

test('missing Sleeper matchup rows stay unavailable instead of becoming fake zero points',()=>{
  assert.match(js,/const matchupPoints=row=>\{/);
  assert.match(js,/if\(raw==null\|\|raw===' '\.trim\(\)\)return null|if\(raw==null\|\|raw===''\)return null/);
  assert.match(js,/return value==null\?'—':value\.toFixed\(2\)/);
  assert.match(js,/Week \$\{state\.week\} matchup not returned by Sleeper/);
  assert.doesNotMatch(js,/Number\(matchup\?\.points\|\|0\)\.toFixed\(2\)/);
});

test('real numeric zero remains a valid Sleeper score',()=>{
  assert.match(js,/const value=Number\(raw\);/);
  assert.match(js,/Number\.isFinite\(value\)\?value:null/);
  assert.doesNotMatch(js,/if\(!raw\)return null/);
});

test('starter count resolves actual rostered players and excludes placeholder slots',()=>{
  assert.match(js,/const resolvedRosterCounts=owner=>\{/);
  assert.match(js,/owner\?\.players\)\?owner\.players\.map\(String\)\.filter\(id=>id&&id!=='0'\)/);
  assert.match(js,/starters\.filter\(id=>id&&id!=='0'&&rostered\.has\(id\)\)\.length/);
  assert.match(js,/\$\{counts\.starters\} resolved starters · \$\{counts\.rostered\} rostered players/);
  assert.doesNotMatch(js,/owner\.starters\?\.length\|\|0/);
});

test('opponent availability is explicit when the owner matchup is absent or incomplete',()=>{
  assert.match(js,/const opponentLabel=opp\?userByRoster\(opp\.roster_id\):matchup\?'Opponent unavailable':'Opponent not returned';/);
  assert.match(js,/\$\{matchupScore\(opp\)\}/);
});

test('matchup truth repair keeps the existing read-only Sleeper boundary',()=>{
  assert.match(js,/Sleeper integration is read-only/i);
  assert.doesNotMatch(js,/fetch\([^\n]*(?:POST|PUT|PATCH|DELETE)/i);
  assert.doesNotMatch(js,/localStorage\.setItem\([^\n]*matchup/i);
});