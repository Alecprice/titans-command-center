import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py',import.meta.url),'utf8');

test('responsive matrix does not mistake the vertical scrollbar gutter for horizontal overflow',()=>{
  assert.match(smoke,/root_overflow=state\['scrollWidth'\]>state\['clientWidth'\]\+3/);
  assert.match(smoke,/body_overflow=state\['bodyScrollWidth'\]>state\['innerWidth'\]\+3/);
  assert.doesNotMatch(smoke,/state\['bodyScrollWidth'\]>state\['clientWidth'\]\+3/);
});
