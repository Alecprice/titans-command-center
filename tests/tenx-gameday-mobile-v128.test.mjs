import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('gameday-v16.css','utf8');

test('TENX Game Day mobile layout keeps live controls and status readable',()=>{
  assert.match(css,/\.v16-gd-feed button\{[^}]*min-height:44px/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/\.v16-gd-feed button\{min-height:48px;width:100%;margin-left:0\}/);
  assert.match(css,/\.v16-gd-tune>a,.v16-next-up>a,.v16-gd-phase>header>a\{min-height:48px;width:100%\}/);
});

test('TENX Game Day phone layout stacks dense game information instead of compressing it',()=>{
  assert.match(css,/\.v16-gd-grid\.two,.v16-gd-grid\.three\{grid-template-columns:1fr\}/);
  assert.match(css,/\.v16-gd-leaders\{grid-template-columns:1fr 1fr\}/);
  assert.match(css,/@media\(max-width:390px\)\{[^}]*\.v16-gd-phase/);
  assert.match(css,/\.v16-gd-leaders\{grid-template-columns:1fr\}/);
  assert.match(css,/\.v16-gd-row\{display:grid;grid-template-columns:1fr;gap:3px\}/);
});
