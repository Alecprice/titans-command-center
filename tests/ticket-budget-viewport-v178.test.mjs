import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/ticket-budget-browser-smoke-v140.py',import.meta.url),'utf8');

test('Ticket budget production smoke pins the exact CSS viewport with CDP',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width':width/);
  assert.match(smoke,/'height':height/);
  assert.match(smoke,/'deviceScaleFactor':1/);
  assert.match(smoke,/'mobile':False/);
  assert.match(smoke,/set_css_viewport\(driver,390,844\)/);
  assert.doesNotMatch(smoke,/driver\.set_window_size\(390,844\)/);
});

test('Ticket budget mobile assertion proves the responsive media query is actually active',()=>{
  assert.match(smoke,/matchMedia\('\(max-width:620px\)'\)\.matches/);
  assert.match(smoke,/window\.innerWidth===390/);
  assert.match(smoke,/window\.innerHeight===844/);
  assert.match(smoke,/mobile\['innerWidth'\]!=390 or not mobile\['phoneMedia'\]/);
  assert.match(smoke,/CSS viewport override failed/);
});

test('Ticket budget keeps the 48px production touch floor after viewport hardening',()=>{
  assert.match(smoke,/mobile\['picker'\]\['height'\]<48/);
  assert.match(smoke,/item\['height'\]<48/);
  assert.match(smoke,/card\['action'\]\['height'\]<48/);
  assert.match(smoke,/mobile\['clear'\]\['height'\]<48/);
  assert.match(smoke,/'mobileTouchFloor':48/);
});
