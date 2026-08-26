import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync('scripts/responsive-matrix-smoke.py','utf8');

test('responsive matrix inventories undersized interactive controls on mobile surfaces', () => {
  assert.match(script, /#app button,#app select,#app input:not\(\[type=\"hidden\"\]\),#app \[role=\"button\"\]/);
  assert.match(script, /\.filter\(x=>x\.w<44\|\|x\.h<44\)/);
  assert.match(script, /'smallControls':state\['smallControls'\] if mode=='mobile' else \[\]/);
});

test('responsive report surfaces control and tiny-text inventories separately', () => {
  assert.match(script, /'undersizedControlSurfaces':len\(control_samples\)/);
  assert.match(script, /'undersizedControlSamples':control_samples\[:18\]/);
  assert.match(script, /'tinyTextSurfaces':len\(tiny_samples\)/);
  assert.match(script, /'tinyTextSamples':tiny_samples\[:12\]/);
});

test('mobile dock remains a hard 44px gate while legacy controls are diagnostic-only', () => {
  assert.match(script, /if any\(x\['w'\]<44 or x\['h'\]<44 for x in state\['touchTargets'\]\): raise RuntimeError/);
  assert.doesNotMatch(script, /raise RuntimeError\(f'.*smallControls/);
});
