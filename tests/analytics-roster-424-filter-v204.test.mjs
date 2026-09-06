import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/analytics-mobile-browser-smoke-v202.py',import.meta.url),'utf8');

test('Advanced Analytics mobile smoke tolerates only the known unrelated roster 424',()=>{
  assert.match(smoke,/def expected_unrelated_roster_424\(entry\):/);
  assert.match(smoke,/return '\/api\/roster' in message and 'status of 424' in message/);
  assert.match(smoke,/toleratedRoster424/);
  assert.match(smoke,/browser_errors\['fatal'\]/);
});

test('Advanced Analytics mobile smoke keeps unrelated severe browser errors fatal',()=>{
  assert.match(smoke,/entry\.get\('level'\) == 'SEVERE'/);
  assert.match(smoke,/if not expected_unrelated_roster_424\(entry\) and '500' not in str\(entry\.get\('message'\) or ''\)/);
  assert.match(smoke,/raise RuntimeError\(f"Advanced Stats Lab mobile browser has severe errors:/);
  assert.doesNotMatch(smoke,/'status of 404'/);
  assert.doesNotMatch(smoke,/'status of 403'/);
  assert.doesNotMatch(smoke,/\/api\/advanced-analytics' in message/);
});

test('roster 424 tolerance is retained as evidence rather than silently discarded',()=>{
  assert.match(smoke,/'toleratedRoster424': browser_errors\['toleratedRoster424'\]/);
  assert.match(smoke,/'browserWarnings': browser_errors\['fatal'\]/);
});
