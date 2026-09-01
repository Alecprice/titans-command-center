import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py',import.meta.url),'utf8');

test('responsive matrix blocks actual root overflow without treating body-only off-canvas width as page overflow',()=>{
  assert.match(smoke,/root_overflow=state\['scrollWidth'\]>state\['clientWidth'\]\+3/);
  assert.match(smoke,/if root_overflow:/);
  assert.doesNotMatch(smoke,/if root_overflow or body_overflow:/);
  assert.doesNotMatch(smoke,/body_overflow=state\['bodyScrollWidth'\]/);
  assert.match(smoke,/'bodyExceedsViewport':state\['bodyScrollWidth'\]>state\['innerWidth'\]\+3/);
  assert.match(smoke,/'bodyExcessDiagnosticSurfaces':len\(body_excess_samples\)/);
});
