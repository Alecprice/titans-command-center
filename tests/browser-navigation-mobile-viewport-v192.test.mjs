import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/browser-navigation-smoke.py',import.meta.url),'utf8');

test('global navigation smoke uses deterministic CDP mobile metrics at both phone widths',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/set_mobile_viewport\(driver, 390, 844\)/);
  assert.match(smoke,/set_mobile_viewport\(driver, 320, 760\)/);
  assert.doesNotMatch(smoke,/set_window_size\(390, 844\)/);
  assert.doesNotMatch(smoke,/set_window_size\(320, 760\)/);
});

test('global navigation verifies exact viewport geometry and the app mobile breakpoint',()=>{
  assert.match(smoke,/innerWidth:innerWidth/);
  assert.match(smoke,/innerHeight:innerHeight/);
  assert.match(smoke,/clientWidth:document\.documentElement\.clientWidth/);
  assert.match(smoke,/max-width:759px/);
  assert.match(smoke,/state\['innerWidth'\] != width/);
  assert.match(smoke,/state\['innerHeight'\] != height/);
  assert.match(smoke,/state\['clientWidth'\] != width/);
  assert.match(smoke,/not state\['mobile'\]/);
});

test('global navigation keeps mobile dock, drawer, search, transactions, schedule and team room coverage',()=>{
  assert.match(smoke,/expected_labels=\{'Home','Roster','Game','Search','More'\}/);
  assert.match(smoke,/mobile:transactions-from-more/);
  assert.match(smoke,/mobile:schedule-from-more/);
  assert.match(smoke,/mobile:search-quick-jump/);
  assert.match(smoke,/mobile:depth-route-state/);
  assert.match(smoke,/mobile:staff-arrow-key/);
  assert.match(smoke,/320px Transactions/);
  assert.match(smoke,/'mobileViewportState': mobile_viewport/);
  assert.match(smoke,/'smallPhoneViewportState': small_phone_viewport/);
});
