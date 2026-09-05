import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/legacy-browser-smoke.py',import.meta.url),'utf8');

test('mobile Legacy trail keeps a native click after scrolling clear of fixed chrome',()=>{
  assert.match(smoke,/next_button=m\.find_element\(By\.CSS_SELECTOR,'\[data-legacy-trail-next\]'\)/);
  assert.match(smoke,/scrollIntoView\(\{block:'center',inline:'nearest'\}\)/);
  assert.match(smoke,/document\.elementFromPoint\(x,y\)/);
  assert.match(smoke,/owner===b\|\|b\.contains\(owner\)/);
  assert.match(smoke,/next_button\.click\(\)/);
  assert.doesNotMatch(smoke,/execute_script\([^\n]*\.click\(/);
});

test('mobile Legacy trail keeps strict viewport, touch, state and semantic progression contracts',()=>{
  assert.match(smoke,/mobile\['viewport'\]!=390/);
  assert.match(smoke,/mobile\['overflow'\]/);
  assert.match(smoke,/mobile\['trailRect'\]\['right'\]>mobile\['viewport'\]\+1/);
  assert.match(smoke,/a\['h'\]<44 or a\['w'\]<44/);
  assert.match(smoke,/'steve mcnair' not in active\['text'\]\.casefold\(\)/);
  assert.match(smoke,/toLowerCase\(\)\.includes\('eddie george'\)/);
  assert.match(smoke,/mobile_passport\.get\('visited'\)!=\['1999-run:2','1999-run:3'\]/);
});
