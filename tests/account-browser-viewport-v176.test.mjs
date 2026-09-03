import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/account-browser-smoke.py',import.meta.url),'utf8');

test('account browser smoke pins its requested CSS viewport with CDP',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width':width/);
  assert.match(smoke,/'height':height/);
  assert.match(smoke,/'deviceScaleFactor':1/);
  assert.match(smoke,/'mobile':False/);
});

test('account browser smoke fails closed when Chrome ignores the requested viewport',()=>{
  assert.match(smoke,/actual=driver\.execute_script\('return \[innerWidth,innerHeight\]'\)/);
  assert.match(smoke,/actual\[0\]!=width or actual\[1\]!=height/);
  assert.match(smoke,/Account browser viewport mismatch: requested=/);
  assert.match(smoke,/def driver_for\(width=390,height=844\):/);
});
