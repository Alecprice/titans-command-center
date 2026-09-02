import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../tickets-signal-lens-v128.js',import.meta.url),'utf8');

test('TENX Signal Lens keeps a one-source live marketplace state actionable without inventing a price',()=>{
  assert.match(source,/function pickMarketplaceAvailable\(items\)\{[\s\S]*item\.sources>=1/);
  assert.match(source,/kind:'marketplace',label:'MARKETPLACE AVAILABLE'/);
  assert.match(source,/source\$\{marketplaceAvailable\.sources===1\?'':'s'\} with offers · live price pending/);
  assert.match(source,/Open the current marketplace for live price and inventory\./);
  assert.match(source,/data-ticket-signal-focus=/);
});

test('marketplace fallback yields to stronger numeric, cross-check, or observed-drop signals',()=>{
  assert.match(source,/const marketplaceAvailable=!lowest&&!lowestHome&&!crossChecked&&!biggestDrop\?pickMarketplaceAvailable\(items\):null/);
  const marketplaceIndex=source.indexOf("kind:'marketplace'");
  assert.ok(marketplaceIndex>source.indexOf("kind:'sources'"));
  assert.ok(marketplaceIndex<source.indexOf("kind:'drop'"));
});

test('marketplace fallback adds no provider traffic, persistence, recommendation, or price fabrication',()=>{
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/setItem\s*\(/);
  const start=source.indexOf("kind:'marketplace'");
  const end=source.indexOf('biggestDrop?',start);
  assert.ok(start>=0&&end>start);
  const marketplaceBlock=source.slice(start,end);
  assert.doesNotMatch(marketplaceBlock,/\bmoney\s*\(/);
  assert.doesNotMatch(marketplaceBlock,/buy|wait|deal|guarante/i);
});

test('Signal Lens keeps its HTML escaping and factual framing intact',()=>{
  assert.match(source,/['"]&quot;['"]/);
  assert.match(source,/These are factual board signals, not a deal score or buy\/wait recommendation\./);
  assert.match(source,/Price-drop context uses only observations stored in this browser\./);
});
