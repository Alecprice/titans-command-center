import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/headshot-browser-smoke.py',import.meta.url),'utf8');

test('headshot browser gate follows current roster scale instead of the retired camp roster',()=>{
  assert.match(smoke,/MIN_CURRENT_ROSTER_CARDS=50/);
  assert.match(smoke,/MIN_CURRENT_ROSTER_HEADSHOT_COVERAGE=\.85/);
  assert.match(smoke,/def wait_for_current_roster_headshots\(driver,timeout=12,stable_seconds=\.5\):/);
  assert.match(smoke,/state\['cards'\]>=MIN_CURRENT_ROSTER_CARDS/);
  assert.match(smoke,/state\['coverage'\]>=MIN_CURRENT_ROSTER_HEADSHOT_COVERAGE/);
  assert.doesNotMatch(smoke,/\.player-card'\)\.length >= 90/);
  assert.doesNotMatch(smoke,/\.player-card \.jersey\.has-headshot img'\)\.length >= 60/);
});

test('headshot browser gate preserves historical Stats Lab and real-image checks',()=>{
  assert.match(smoke,/\.ps-player'\)\.length >= 90/);
  assert.match(smoke,/\.ps-player \.ps-number\.has-headshot img'\)\.length >= 50/);
  assert.match(smoke,/wait_for_loaded_images\(driver,'\.player-card \.jersey\.has-headshot img'\)/);
  assert.match(smoke,/find_element\(By\.CSS_SELECTOR,'\.player-card:has\(\.jersey\.has-headshot img\)'\)/);
  assert.match(smoke,/richPlayerHeadshotLoaded/);
  assert.match(smoke,/rosterHeadshotCoveragePct/);
  assert.match(smoke,/Stats headshots introduced mobile horizontal overflow/);
  assert.match(smoke,/Headshot browser regression has severe console errors/);
});
