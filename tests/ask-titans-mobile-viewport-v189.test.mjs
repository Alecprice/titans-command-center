import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/ask-titans-browser-smoke.py',import.meta.url),'utf8');

test('Ask Titans mobile smoke uses CDP device metrics instead of desktop window resizing',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width':width/);
  assert.match(smoke,/'height':height/);
  assert.match(smoke,/'mobile':True/);
  assert.match(smoke,/set_mobile_viewport\(driver,390,844\)/);
  assert.doesNotMatch(smoke,/set_window_size\(390,844\)/);
});

test('Ask Titans verifies the real 390x844 mobile media-query state',()=>{
  assert.match(smoke,/innerWidth:innerWidth/);
  assert.match(smoke,/innerHeight:innerHeight/);
  assert.match(smoke,/clientWidth:document\.documentElement\.clientWidth/);
  assert.match(smoke,/max-width:759px/);
  assert.match(smoke,/state\['innerWidth'\]!=width/);
  assert.match(smoke,/state\['innerHeight'\]!=height/);
  assert.match(smoke,/state\['clientWidth'\]!=width/);
  assert.match(smoke,/not state\['mobile'\]/);
});

test('Ask Titans keeps mobile overflow, target, and Fantasy handoff checks after viewport pinning',()=>{
  assert.match(smoke,/no_overflow\(driver,'Ask Titans 390px'\)/);
  assert.match(smoke,/mobile\['viewport'\]!=390/);
  assert.match(smoke,/mobile\['askButton'\]<44/);
  assert.match(smoke,/mobile\['input'\]<44/);
  assert.match(smoke,/mobile_handoff\['overflow'\]/);
  assert.match(smoke,/mobile_handoff\['actionHeight'\]<44/);
  assert.match(smoke,/'mobileViewport':mobile_viewport/);
});
