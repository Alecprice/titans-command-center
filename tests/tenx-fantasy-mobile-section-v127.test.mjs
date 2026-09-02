import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../fantasy-command-v1.css', import.meta.url), 'utf8');

test('fantasy phone controls become deliberate touch layouts', () => {
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /\.fantasy-score-mode\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.fantasy-score-mode button\{width:100%;min-height:48px/);
  assert.match(css, /\.fantasy-tabs button\{flex:0 0 auto;min-height:48px/);
  assert.match(css, /\.fantasy-panel-head\{display:grid;grid-template-columns:1fr/);
  assert.match(css, /\.fantasy-calc input,.fantasy-add input,.fantasy-add select,.fantasy-connect input,.fantasy-select select\{min-height:48px;font-size:16px\}/);
  assert.match(css, /\.fantasy-decision-links a\{display:flex;align-items:center;min-height:44px/);
});

test('fantasy layout simplifies further on narrow phones', () => {
  assert.match(css, /@media\(max-width:390px\)/);
  assert.match(css, /\.fantasy-score-mode\{grid-template-columns:1fr\}/);
  assert.match(css, /\.fantasy-calc\{grid-template-columns:1fr\}/);
  assert.match(css, /\.fantasy-calc output\{grid-column:auto\}/);
  assert.match(css, /\.fantasy-matchup\{grid-template-columns:1fr\}/);
  assert.match(css, /\.fantasy-head h1\{font-size:1\.95rem\}/);
});
