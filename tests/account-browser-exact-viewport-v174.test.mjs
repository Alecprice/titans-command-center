import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const entry=fs.readFileSync(new URL('../scripts/account-browser-smoke.py',import.meta.url),'utf8');
const core=fs.readFileSync(new URL('../scripts/account-browser-smoke-core.py',import.meta.url),'utf8');
const deploy=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const current=fs.readFileSync(new URL('../.github/workflows/current-experience-browser.yml',import.meta.url),'utf8');
const postdeploy=fs.readFileSync(new URL('../.github/workflows/tenx-postdeploy-verification.yml',import.meta.url),'utf8');

test('Account smoke entrypoint enforces the exact requested CSS viewport through CDP',()=>{
  assert.match(entry,/--window-size=/);
  assert.match(entry,/Emulation\.setDeviceMetricsOverride/);
  assert.match(entry,/'deviceScaleFactor':1/);
  assert.match(entry,/'mobile':False/);
  assert.match(entry,/return \[innerWidth,innerHeight\]/);
  assert.match(entry,/actual\[0\]!=width or actual\[1\]!=height/);
  assert.match(entry,/Account viewport mismatch/);
});

test('Account viewport guard wraps the existing smoke rather than replacing its product assertions',()=>{
  assert.match(entry,/account-browser-smoke-core\.py/);
  assert.match(entry,/runpy\.run_path/);
  for(const stage of ['password-initial','password-reveal','password-hide','password-signup-remount','password-signin-remount','guest-portability-tools','simulate-auth-outage','navigate-roster'])assert.match(core,new RegExp(stage));
  assert.doesNotMatch(entry,/setTimeout|setInterval|fetch\(|requests\.|urllib/);
});

test('all release Account gates keep the guarded account-browser-smoke entrypoint',()=>{
  for(const workflow of [deploy,current,postdeploy])assert.match(workflow,/python scripts\/account-browser-smoke\.py/);
});
