import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync('scripts/readability-browser-smoke.py','utf8');

test('readability browser audit covers the main responsive surface matrix', () => {
  for (const route of ['home','live','games','roster','roster?view=depth','roster?view=staff','roster?view=cutdown','transactions','stats','fantasy','markets','feed','legacy','sources','fan','media','command']) {
    assert.match(script, new RegExp(route.replace(/[?]/g,'\\?')));
  }
  assert.match(script, /\('phone',390,844\)/);
  assert.match(script, /\('tablet',768,1024\)/);
  assert.match(script, /\('desktop',1440,1000\)/);
});

test('contrast calculation uses WCAG relative luminance thresholds', () => {
  assert.match(script, /v<=\.04045\?v\/12\.92:Math\.pow\(\(v\+\.055\)\/1\.055,2\.4\)/);
  assert.match(script, /const required=large\?3:4\.5/);
  assert.match(script, /lowContrastOccurrences/);
  assert.match(script, /skippedComplexBackground/);
});

test('contrast diagnostic avoids pretending gradients and images are solid backgrounds', () => {
  assert.match(script, /backgroundImage&&s\.backgroundImage!==['"]none['"]/);
  assert.match(script, /skippedComplexBackground\+\+/);
  assert.match(script, /REPORT=Path\('\/tmp\/readability-browser-smoke\.json'\)/);
});
