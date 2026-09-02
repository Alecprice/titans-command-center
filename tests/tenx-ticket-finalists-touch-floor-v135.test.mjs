import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const finalistsCss=readFileSync(new URL('../tickets-finalists-v127.css',import.meta.url),'utf8');
const signalCss=readFileSync(new URL('../tickets-signal-lens-v128.css',import.meta.url),'utf8');

test('TENX Ticket Finalists and group-budget controls keep a 44px base touch floor',()=>{
  assert.match(finalistsCss,/\.tickets-finalists-v127 button\{[^}]*min-height:44px/);
  assert.doesNotMatch(finalistsCss,/\.tickets-finalists-v127 button\{[^}]*min-height:40px/);
});

test('Ticket Signal Lens already keeps its base action floor at 44px or better',()=>{
  assert.match(signalCss,/\.tickets-signal-v128-card>button,\.tickets-signal-v128-card>em\{[^}]*min-height:44px/);
  assert.match(signalCss,/@media\(max-width:430px\)[^\n]*\.tickets-signal-v128-card>button\{[^}]*min-height:48px/);
});
