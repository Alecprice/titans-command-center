import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Advanced Analytics verifies startup mobile emulation after the app document loads and falls back through CDP only when needed',()=>{
  const smoke=read('scripts/analytics-mobile-browser-smoke-v202.py');
  assert.match(smoke,/MOBILE_WIDTH = 390/);
  assert.match(smoke,/MOBILE_HEIGHT = 844/);
  assert.match(smoke,/def set_mobile_viewport\(driver, width=MOBILE_WIDTH, height=MOBILE_HEIGHT\):/);
  assert.match(smoke,/def verify_mobile_viewport\(driver, width=MOBILE_WIDTH, height=MOBILE_HEIGHT\):/);
  assert.match(smoke,/def ensure_mobile_viewport\(driver\):/);
  assert.match(smoke,/options\.add_experimental_option\('mobileEmulation', mobile_emulation\(\)\)/);
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/driver\.get\(f'\{BASE\}\/\#stats'\)\s*\n\s*wait_for\(driver, "document\.readyState === 'complete' && location\.hash === '#stats'"\)\s*\n\s*viewport = ensure_mobile_viewport\(driver\)/);
  assert.match(smoke,/def ensure_mobile_viewport\(driver\):[\s\S]*?if viewport_is_exact\(state\):\s*\n\s*return state\s*\n\s*set_mobile_viewport\(driver\)\s*\n\s*driver\.refresh\(\)\s*\n\s*wait_for\(driver, "document\.readyState === 'complete' && location\.hash === '#stats'"\)\s*\n\s*return verify_mobile_viewport\(driver\)/);

  const setStart=smoke.indexOf('def set_mobile_viewport');
  const viewportStateStart=smoke.indexOf('def viewport_state');
  const setBody=smoke.slice(setStart,viewportStateStart);
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
  assert.match(smoke,/return verify_mobile_viewport\(driver\)/);
  assert.match(smoke,/state\['innerWidth'\] == width/);
  assert.match(smoke,/state\['innerHeight'\] == height/);
  assert.match(smoke,/state\['clientWidth'\] == width/);
  assert.match(smoke,/and state\['mobile'\]/);
  assert.match(smoke,/if not viewport_is_exact\(state, width, height\):/);
  assert.match(smoke,/assert_no_overflow\(driver\)/);
  assert.match(smoke,/if browser_errors\['fatal'\]:/);
  assert.match(smoke,/Advanced Stats Lab mobile browser has severe errors/);
});
