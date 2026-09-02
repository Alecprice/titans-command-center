import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Ticket Decision Center parses only the explicit next-source currency gap',async()=>{
  const source=await read('tickets-tenx-v123.js');
  assert.match(source,/Next best is \(\\\$\\s\*\[0-9\]\+\(\?:\\\.\[0-9\]\+\)\?\)/);
  assert.doesNotMatch(source,/Next best is \(\[\^ \]\+\(\?: \[\^ \]\+\)\*\) more/);
});

test('strong cross-check copy reports the real current source count',async()=>{
  const source=await read('tickets-tenx-v123.js');
  assert.match(source,/`\$\{record\.sourceCount\} sources with a relatively tight starting-price spread`/);
  assert.doesNotMatch(source,/Three sources with a relatively tight starting-price spread/);
});

test('price-memory escaping uses a complete quote entity',async()=>{
  const source=await read('tickets-trend-v124.js');
  assert.match(source,/'"':'&quot;'/);
  assert.doesNotMatch(source,/'"':'&quot'/);
  assert.match(source,/&#39;/);
});

test('saved compare gives a lone action the full action row',async()=>{
  const css=await read('tickets-compare-v125.css');
  assert.match(css,/\.tickets-compare-v125-actions button:only-child\{grid-column:1\/-1\}/);
  assert.match(css,/\.tickets-compare-v125-actions button\{min-height:46px/);
  assert.match(css,/@media\(max-width:620px\)[\s\S]*min-height:48px/);
});
