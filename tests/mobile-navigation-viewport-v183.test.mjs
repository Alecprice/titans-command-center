import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/mobile-navigation-browser-smoke.py',import.meta.url),'utf8');

test('mobile navigation browser smoke pins the requested CSS viewport with CDP',()=>{
  assert.match(smoke,/Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke,/'width':width/);
  assert.match(smoke,/'height':height/);
  assert.match(smoke,/'deviceScaleFactor':1/);
  assert.match(smoke,/'mobile':False/);
  assert.match(smoke,/for width,height in \[\(390,844\),\(360,800\)\]/);
});

test('mobile navigation browser smoke fails closed when Chrome ignores the requested viewport',()=>{
  assert.match(smoke,/actual=driver\.execute_script\('return \[innerWidth,innerHeight\]'\)/);
  assert.match(smoke,/if actual\[0\]!=width or actual\[1\]!=height/);
  assert.match(smoke,/driver\.quit\(\);raise RuntimeError\(f'Mobile navigation viewport mismatch:/);
});
