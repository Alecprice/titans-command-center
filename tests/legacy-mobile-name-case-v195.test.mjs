import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/legacy-browser-smoke.py',import.meta.url),'utf8');

test('Legacy mobile deep-link assertion ignores rendered text casing without weakening state checks',()=>{
  assert.match(smoke,/'steve mcnair' not in active\['text'\]\.casefold\(\)/);
  assert.doesNotMatch(smoke,/'Steve McNair' not in active\['text'\]/);
  assert.match(smoke,/active\['matches'\]<1/);
  assert.match(smoke,/'1 \/ 19 stamps' not in active\['passport'\]\.casefold\(\)/);
  assert.match(smoke,/'0 \/ 12 saved' not in active\['museum'\]\.casefold\(\)/);
});
