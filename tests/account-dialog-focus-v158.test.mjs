import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../account-v112.js',import.meta.url),'utf8');

test('account dialog keeps keyboard focus inside the modal',()=>{
  assert.match(source,/const focusableSelector=/);
  assert.match(source,/function trapFocus\(event,modal\)/);
  assert.match(source,/event\.key!==['"]Tab['"]/);
  assert.match(source,/modal\.querySelectorAll\(focusableSelector\)/);
  assert.match(source,/event\.preventDefault\(\);last\.focus\(\)/);
  assert.match(source,/event\.preventDefault\(\);first\.focus\(\)/);
});

test('mobile account sheet focuses a safe control without summoning the keyboard',()=>{
  assert.match(source,/const initialFocus=phone\.matches\?modal\.querySelector\('\.account-close'\)/);
  assert.match(source,/initialFocus\?\.focus\(\{preventScroll:true\}\)/);
  assert.doesNotMatch(source,/if\(!phone\.matches\)\{\s*const firstInput/);
});

test('closing the account dialog restores the invoking control',()=>{
  assert.match(source,/let resetTimer=0,returnFocus=null/);
  assert.match(source,/returnFocus=document\.activeElement instanceof HTMLElement\?document\.activeElement:null/);
  assert.match(source,/function close\(\{restoreFocus=true\}=\{\}\)/);
  assert.match(source,/target\.focus\(\{preventScroll:true\}\)/);
  assert.match(source,/state\.mode=mode;close\(\{restoreFocus:false\}\)/);
});

test('dialog focus work does not add network or persistence ownership',()=>{
  const trapBlock=source.slice(source.indexOf('function trapFocus'),source.indexOf('async function refresh'));
  assert.doesNotMatch(trapBlock,/fetch\(|localStorage|sessionStorage|indexedDB|MutationObserver|setInterval|setTimeout|WebSocket|EventSource/);
});
