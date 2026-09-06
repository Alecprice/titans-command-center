import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Advanced Analytics roster 424 tolerance is endpoint plus exact HTTP code rather than Chrome wording',()=>{
  const smoke=read('scripts/analytics-mobile-browser-smoke-v202.py');
  assert.match(smoke,/import re/);
  assert.match(smoke,/return '\/api\/roster' in message and re\.search\(r'\(\?<\!\\d\)424\(\?!\\d\)', message\) is not None/);
  assert.doesNotMatch(smoke,/status of 424/);
  assert.match(smoke,/if not expected_unrelated_roster_424\(entry\) and '500' not in str\(entry\.get\('message'\) or ''\)/);
});

test('Advanced Analytics mobile report retains all severe console evidence on success and failure',()=>{
  const smoke=read('scripts/analytics-mobile-browser-smoke-v202.py');
  assert.match(smoke,/return \{'fatal': fatal, 'toleratedRoster424': tolerated, 'allSevere': severe\}/);
  assert.match(smoke,/'allSevere': browser_errors\['allSevere'\]/);
  assert.match(smoke,/'allSevere': browser_errors\.get\('allSevere', \[\]\)/);
  assert.match(smoke,/'browserWarnings': browser_errors\.get\('fatal', \[\]\)/);
});

test('resilient analytics wrapper promotes deterministic mobile evidence into the production report',()=>{
  const wrapper=read('scripts/analytics-browser-smoke-resilient.py');
  assert.match(wrapper,/MOBILE_REPORT = Path\('\/tmp\/analytics-mobile-browser-smoke-v202\.json'\)/);
  assert.match(wrapper,/def retain_mobile_evidence\(mobile_report\):/);
  assert.match(wrapper,/strict_report\['deterministicMobile'\] = mobile_report/);
  assert.match(wrapper,/MOBILE_REPORT\.unlink\(\)/);
  assert.match(wrapper,/mobile_report = load_json\(MOBILE_REPORT\)/);
  assert.match(wrapper,/retain_mobile_evidence\(mobile_report\)/);
  assert.match(wrapper,/failed at \{stage\}: \{detail\}/);
});
