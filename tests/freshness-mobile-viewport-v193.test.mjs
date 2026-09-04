import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/freshness-browser-smoke.py',import.meta.url),'utf8');

test('freshness smoke uses deterministic CDP mobile metrics',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/set_mobile_viewport\(driver,390,844\)/);
  assert.doesNotMatch(smoke,/set_window_size\(390,844\)/);
});

test('freshness smoke verifies exact mobile breakpoint geometry',()=>{
  assert.match(smoke,/innerWidth:innerWidth/);
  assert.match(smoke,/innerHeight:innerHeight/);
  assert.match(smoke,/clientWidth:document\.documentElement\.clientWidth/);
  assert.match(smoke,/max-width:759px/);
  assert.match(smoke,/state\['innerWidth'\]!=width/);
  assert.match(smoke,/state\['innerHeight'\]!=height/);
  assert.match(smoke,/state\['clientWidth'\]!=width/);
  assert.match(smoke,/not state\['mobile'\]/);
});

test('freshness smoke keeps data-truth and mobile rendering contracts',()=>{
  assert.match(smoke,/Recent server snapshot/);
  assert.match(smoke,/Roster snapshot needs review/);
  assert.match(smoke,/Verified backup/);
  assert.match(smoke,/Freshness unknown/);
  assert.match(smoke,/transport reachability is still presented as data freshness/);
  assert.match(smoke,/mobile\['viewport'\]\['width'\]!=390/);
  assert.match(smoke,/mobile\['viewport'\]\['height'\]!=844/);
  assert.match(smoke,/'mobileViewportState':mobile_viewport/);
});
