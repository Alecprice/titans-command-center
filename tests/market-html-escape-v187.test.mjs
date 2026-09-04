import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('market-hub.js','utf8');

test('Market Pulse shared HTML escape helper uses complete named and numeric entities',()=>{
  const helper=source.match(/const mhEsc=v=>[^\n]+/s)?.[0]||'';
  assert.match(helper,/'&':'&amp;'/);
  assert.match(helper,/'<':'&lt;'/);
  assert.match(helper,/'\\"':'&quot;'/);
  assert.match(helper,/"'":'&#39;'/);
  assert.doesNotMatch(helper,/'\\"':'&quot'(?!;)/);
});

test('Market Pulse keeps dynamic provider, event, market, side, source, and diagnostic copy behind mhEsc',()=>{
  for(const contract of [
    /mhEsc\(book\)/,
    /mhEsc\(title\)/,
    /mhEsc\(r\.marketName\|\|''\)/,
    /mhEsc\(r\.side\|\|'—'\)/,
    /mhEsc\(name\)/,
    /mhEsc\(d\.provider\|\|'No source'\)/,
    /d\.diagnostics\.map\(mhEsc\)/
  ]) assert.match(source,contract);
});

test('Market Pulse quote-entity repair does not broaden URL, network, persistence, or lifecycle ownership',()=>{
  assert.match(source,/const safeUrl=v=>/);
  assert.match(source,/\['http:','https:'\]\.includes\(u\.protocol\)/);
  assert.match(source,/fetch\('\/api\/market-data'/);
  assert.doesNotMatch(source,/localStorage|sessionStorage|WebSocket|EventSource|setInterval/);
});
