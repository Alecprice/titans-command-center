import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/legacy-browser-smoke.py',import.meta.url),'utf8');

test('mobile Legacy deep-link smoke tolerates presentation-only heading casing',()=>{
  assert.match(smoke,/if 'steve mcnair' not in active\['text'\]\.casefold\(\)/);
});

test('mobile Legacy deep-link smoke keeps isolated state and geometry contracts strict',()=>{
  assert.match(smoke,/active\['matches'\]<1/);
  assert.match(smoke,/'1 \/ 19 stamps' not in active\['passport'\]\.casefold\(\)/);
  assert.match(smoke,/'0 \/ 12 saved' not in active\['museum'\]\.casefold\(\)/);
  assert.match(smoke,/mobile\['overflow'\]/);
  assert.match(smoke,/a\['h'\]<44 or a\['w'\]<44/);
  assert.match(smoke,/mobile_passport\.get\('visited'\)!=\['1999-run:2','1999-run:3'\]/);
});
