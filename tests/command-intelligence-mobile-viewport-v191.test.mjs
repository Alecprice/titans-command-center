import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/command-intelligence-browser-smoke.py',import.meta.url),'utf8');

test('Command Intelligence mobile smoke uses CDP device metrics',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width': width/);
  assert.match(smoke,/'height': height/);
  assert.match(smoke,/'mobile': True/);
  assert.match(smoke,/set_mobile_viewport\(driver, 390, 844\)/);
  assert.doesNotMatch(smoke,/set_window_size\(390, 844\)/);
});

test('Command Intelligence verifies the exact mobile breakpoint state',()=>{
  assert.match(smoke,/innerWidth:innerWidth/);
  assert.match(smoke,/innerHeight:innerHeight/);
  assert.match(smoke,/clientWidth:document\.documentElement\.clientWidth/);
  assert.match(smoke,/max-width:759px/);
  assert.match(smoke,/state\['innerWidth'\] != width/);
  assert.match(smoke,/state\['innerHeight'\] != height/);
  assert.match(smoke,/state\['clientWidth'\] != width/);
  assert.match(smoke,/not state\['mobile'\]/);
});

test('Command Intelligence retains seven-tab, add-on, overflow and touch-target checks',()=>{
  assert.match(smoke,/document\.querySelectorAll\('\[data-v15-tab\]'\)\.length === 7/);
  assert.match(smoke,/ONE-MINUTE TITANS/);
  assert.match(smoke,/no_overflow\(driver, '390px command'\)/);
  assert.match(smoke,/mobile\['viewport'\] != 390/);
  assert.match(smoke,/len\(mobile\['tabTargets'\]\) != 7/);
  assert.match(smoke,/any\(x\['h'\] < 44 for x in mobile\['tabTargets'\]\)/);
  assert.match(smoke,/'mobileViewportState': mobile_viewport/);
});
