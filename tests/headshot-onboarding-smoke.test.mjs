import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/headshot-browser-smoke.py',import.meta.url),'utf8');

test('headshot browser smoke removes mounted onboarding before roster clicks',()=>{
  assert.match(smoke,/localStorage\.setItem\('titans:v10Onboarded','1'\)/);
  assert.match(smoke,/document\.querySelector\('#v10-onboarding \[data-v10-close\]'\)\?\.click\(\)/);
  assert.match(smoke,/until\(lambda d:not d\.find_elements\(By\.CSS_SELECTOR,'#v10-onboarding'\)\)/);
  assert.match(smoke,/prepare_returning_user\(driver\)[\s\S]*driver\.get\(f'\{BASE\}\/\#roster'\)/);
});
