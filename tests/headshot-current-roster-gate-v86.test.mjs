import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/headshot-browser-smoke.py',import.meta.url),'utf8');

test('headshot browser gate follows the current roster contract instead of camp-size assumptions',()=>{
  assert.match(smoke,/MIN_HEADSHOT_COVERAGE=0\.85/);
  assert.match(smoke,/api_json\(f'\/api\/data\?audit=headshot-/);
  assert.match(smoke,/api_json\('\/api\/preseason-stats'\)/);
  assert.match(smoke,/expected_roster=len\(current_roster\)/);
  assert.match(smoke,/stats_roster_count != expected_roster/);
  assert.match(smoke,/math\.ceil\(expected_roster\*MIN_HEADSHOT_COVERAGE\)/);
  assert.match(smoke,/#ps-roster-wrap \.ps-player/);
  assert.match(smoke,/\.ps-former \.ps-player/);
  assert.match(smoke,/formerPreseasonParticipantRows/);
  assert.doesNotMatch(smoke,/length >= 90/);
  assert.doesNotMatch(smoke,/length >= 60/);
});

test('headshot browser diagnostics expose current-roster coverage separately from historical preseason participants',()=>{
  assert.match(smoke,/'expectedCurrentRoster':expected_roster/);
  assert.match(smoke,/'minimumCurrentRosterHeadshots':minimum_headshots/);
  assert.match(smoke,/'rosterHeadshotCoveragePct'/);
  assert.match(smoke,/'statsHeadshotCoveragePct'/);
  assert.match(smoke,/Stats Lab rendered \{stats_total\} current roster rows/);
  assert.match(smoke,/Stats Lab current-roster headshot coverage/);
});
