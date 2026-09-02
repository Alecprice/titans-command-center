import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('gameday-v16.css','utf8');

test('TENX Game Day mobile layout keeps live controls and status readable',()=>{
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/\.v16-gd-feed\{align-items:flex-start;padding:12px;font-size:\.875rem;line-height:1\.5\}/);
  assert.match(css,/\.v16-gd-feed strong\{font-size:\.9rem\}/);
  assert.match(css,/\.v16-gd-feed button\{min-height:48px;width:100%;margin-left:0\}/);
  assert.match(css,/\.v16-gd-tune>a,.v16-next-up>a,.v16-gd-phase>header>a,.v16-gd-grid a\{min-height:48px;width:100%/);
});

test('TENX Game Day phone layout avoids compressed desktop information density',()=>{
  assert.match(css,/\.v16-gd-grid\.two,.v16-gd-grid\.three\{grid-template-columns:1fr\}/);
  assert.match(css,/\.v16-gd-row strong,.v16-gd-row span\{font-size:\.9rem;line-height:1\.4\}/);
  assert.match(css,/\.v16-last-play p\{font-size:\.875rem;line-height:1\.5\}/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/\.v16-gd-leaders\{grid-template-columns:1fr\}/);
  assert.match(css,/\.v16-gd-row\{display:grid;grid-template-columns:1fr;gap:4px\}/);
  assert.match(css,/\.v16-live-score h2\{font-size:clamp\(1\.45rem,9vw,1\.9rem\);line-height:1\.12\}/);
});
