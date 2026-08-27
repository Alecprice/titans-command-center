import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [html,baseLayer,currentLayer]=await Promise.all([
  readFile(new URL('../index.html',import.meta.url),'utf8'),
  readFile(new URL('../readability-v28.css',import.meta.url),'utf8'),
  readFile(new URL('../readability-v34.css',import.meta.url),'utf8')
]);

test('ships both readability layers after component styles',()=>{
  const fantasy=html.indexOf('/fantasy-command-v1.css');
  const base=html.indexOf('/readability-v28.css?v=34');
  const current=html.indexOf('/readability-v34.css?v=1');
  assert.ok(fantasy>=0,'Fantasy styles should be present');
  assert.ok(base>fantasy,'Base readability layer should load after component styles');
  assert.ok(current>base,'Current contrast layer should load last');
});

test('current readability layer covers account and fantasy muted states',()=>{
  for(const selector of [
    '.account-mini-status',
    '.account-tabs button',
    '.fantasy-tabs button',
    '.fantasy-panel p',
    '.fantasy-empty',
    '.search-wrap input::placeholder'
  ]) assert.ok(currentLayer.includes(selector),`Missing contrast coverage for ${selector}`);
});

test('base readability layer remains part of the shipped contrast system',()=>{
  assert.match(baseLayer,/Readability\/contrast layer/);
  assert.match(baseLayer,/prefers-contrast:more/);
});
