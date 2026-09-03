import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../account-v112.js',import.meta.url),'utf8');

test('mobile account sheet opens at the top without forcing the keyboard',()=>{
  assert.match(source,/const phone=matchMedia\('\(max-width:760px\)'\)/);
  assert.match(source,/const panel=modal\.querySelector\('\.account-panel'\)/);
  assert.match(source,/panel\?\.scrollTo\?\.\(\{top:0,left:0/);
  assert.match(source,/const initialFocus=phone\.matches\?modal\.querySelector\('\.account-close'\):modal\.querySelector\('input'\)\|\|modal\.querySelector\('\.account-close'\)/);
  assert.match(source,/initialFocus\?\.focus\(\{preventScroll:true\}\)/);

  const openBlock=source.slice(source.indexOf("function open(mode='signin')"),source.indexOf('function trapFocus('));
  assert.doesNotMatch(openBlock,/modal\.querySelector\('input'\)\?\.focus\(\)/);
});

test('desktop still receives convenient autofocus without scrolling the sheet',()=>{
  assert.match(source,/const initialFocus=phone\.matches\?modal\.querySelector\('\.account-close'\):modal\.querySelector\('input'\)\|\|modal\.querySelector\('\.account-close'\)/);
  assert.match(source,/try\{initialFocus\?\.focus\(\{preventScroll:true\}\);\}catch\{initialFocus\?\.focus\(\);\}/);
});

test('account request ownership remains in the existing account module',()=>{
  assert.match(source,/const AUTH='\/api\/account\/auth'/);
  assert.match(source,/async function auth\(path,/);
  assert.doesNotMatch(source,/setInterval|setTimeout\([^)]*auth|MutationObserver|WebSocket|EventSource/);
});
