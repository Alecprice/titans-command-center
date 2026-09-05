import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Advanced Analytics mobile production smoke pins real 390x844 CSS geometry with CDP',()=>{
  const smoke=read('scripts/analytics-mobile-browser-smoke-v202.py');
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width': width/);
  assert.match(smoke,/'height': height/);
  assert.match(smoke,/'mobile': True/);
  assert.match(smoke,/set_mobile_viewport\(driver, 390, 844\)/);
  assert.match(smoke,/innerWidth/);
  assert.match(smoke,/innerHeight/);
  assert.match(smoke,/document\.documentElement\.clientWidth/);
  assert.match(smoke,/matchMedia\('\(max-width:759px\)'\)\.matches/);
  assert.doesNotMatch(smoke,/set_window_size\(390,\s*844\)/);
});

test('Advanced Analytics mobile gate preserves D1 and explicit unavailable truth paths',()=>{
  const smoke=read('scripts/analytics-mobile-browser-smoke-v202.py');
  assert.match(smoke,/storage'\) != 'cloudflare-d1'/);
  assert.match(smoke,/status'\) == 'database-unavailable'/);
  assert.match(smoke,/summary'\) is None/);
  assert.match(smoke,/Advanced analytics could not load\./);
  assert.match(smoke,/Advanced analytics query failed/);
  assert.match(smoke,/retryHeight.*44/s);
  assert.match(smoke,/metricCount.*0/s);
  assert.match(smoke,/coreStats/);
  assert.match(smoke,/seasonFallback/);
  assert.match(smoke,/bannerVisible/);
  assert.match(smoke,/assert_no_overflow\(driver\)/);
});

test('resilient analytics release wrapper runs deterministic mobile smoke after strict smoke succeeds',()=>{
  const wrapper=read('scripts/analytics-browser-smoke-resilient.py');
  assert.match(wrapper,/MOBILE_SMOKE = Path\(__file__\)\.with_name\('analytics-mobile-browser-smoke-v202\.py'\)/);
  assert.match(wrapper,/def run_mobile_smoke\(\):/);
  assert.match(wrapper,/mobile = run_mobile_smoke\(\)/);
  assert.match(wrapper,/if mobile\.returncode != 0:/);
  assert.match(wrapper,/Deterministic Advanced Analytics mobile smoke failed\./);
});
