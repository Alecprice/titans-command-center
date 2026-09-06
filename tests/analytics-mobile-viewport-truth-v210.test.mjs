import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Advanced Analytics verifies the CDP mobile viewport only after the app document loads',()=>{
  const smoke=read('scripts/analytics-mobile-browser-smoke-v202.py');
  assert.match(smoke,/def set_mobile_viewport\(driver, width=390, height=844\):/);
  assert.match(smoke,/def verify_mobile_viewport\(driver, width=390, height=844\):/);
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/set_mobile_viewport\(driver, 390, 844\)\s*\n\s*driver\.get\(f'\{BASE\}\/\#stats'\)\s*\n\s*wait_for\(driver, "document\.readyState === 'complete' && location\.hash === '#stats'"\)\s*\n\s*viewport = verify_mobile_viewport\(driver, 390, 844\)/);

  const setStart=smoke.indexOf('def set_mobile_viewport');
  const verifyStart=smoke.indexOf('def verify_mobile_viewport');
  const setBody=smoke.slice(setStart,verifyStart);
  assert.doesNotMatch(setBody,/execute_script/);
  assert.doesNotMatch(setBody,/override did not take effect/);
});

test('Advanced Analytics composite report becomes failed when deterministic mobile evidence fails',()=>{
  const wrapper=read('scripts/analytics-browser-smoke-resilient.py');
  assert.match(wrapper,/strict_report\['deterministicMobile'\] = mobile_report/);
  assert.match(wrapper,/if mobile_report\.get\('ok'\) is False:/);
  assert.match(wrapper,/strict_report\['ok'\] = False/);
  assert.match(wrapper,/strict_report\['stage'\] = 'deterministic-mobile'/);
  assert.match(wrapper,/strict_report\['error'\] = mobile_report\.get\('error'\) or 'Deterministic mobile analytics smoke failed'/);
  assert.match(wrapper,/if mobile\.returncode != 0:/);
  assert.match(wrapper,/return mobile\.returncode or 1/);
});

test('Advanced Analytics viewport repair preserves strict mobile geometry and fail-closed browser checks',()=>{
  const smoke=read('scripts/analytics-mobile-browser-smoke-v202.py');
  assert.match(smoke,/verify_mobile_viewport\(driver, 390, 844\)/);
  assert.match(smoke,/state\['innerWidth'\] != width/);
  assert.match(smoke,/state\['innerHeight'\] != height/);
  assert.match(smoke,/state\['clientWidth'\] != width/);
  assert.match(smoke,/not state\['mobile'\]/);
  assert.match(smoke,/assert_no_overflow\(driver\)/);
  assert.match(smoke,/if browser_errors\['fatal'\]:/);
  assert.match(smoke,/Advanced Stats Lab mobile browser has severe errors/);
});
