import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/change-intelligence-browser-smoke.py',import.meta.url),'utf8');

test('Change Intelligence mobile smoke uses CDP device metrics',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width':width/);
  assert.match(smoke,/'height':height/);
  assert.match(smoke,/'mobile':True/);
  assert.match(smoke,/set_mobile_viewport\(driver,390,844\)/);
  assert.doesNotMatch(smoke,/set_window_size\(390,844\)/);
});

test('Change Intelligence verifies the exact mobile breakpoint state',()=>{
  assert.match(smoke,/innerWidth:innerWidth/);
  assert.match(smoke,/innerHeight:innerHeight/);
  assert.match(smoke,/clientWidth:document\.documentElement\.clientWidth/);
  assert.match(smoke,/max-width:759px/);
  assert.match(smoke,/state\['innerWidth'\]!=width/);
  assert.match(smoke,/state\['innerHeight'\]!=height/);
  assert.match(smoke,/state\['clientWidth'\]!=width/);
  assert.match(smoke,/not state\['mobile'\]/);
});

test('Change Intelligence keeps mobile overflow and touch-target assertions',()=>{
  assert.match(smoke,/no_overflow\(driver,'Change Intelligence 390px'\)/);
  assert.match(smoke,/mobile\['viewport'\]!=390/);
  assert.match(smoke,/any\(x\['h'\]<44 for x in mobile\['filters'\]\)/);
  assert.match(smoke,/mobile\['review'\]<44/);
  assert.match(smoke,/'mobileViewport':mobile_viewport/);
});
