import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../account-interaction-v117.js',import.meta.url),'utf8');

test('TENX account password control is explicit and accessible',()=>{
  assert.match(source,/data\.accountPasswordToggle=''/);
  assert.match(source,/toggle\.type='button'/);
  assert.match(source,/aria-pressed/);
  assert.match(source,/aria-label','Show password'/);
  assert.match(source,/textContent='Show'/);
});

test('TENX password reveal changes only the existing password input presentation',()=>{
  assert.match(source,/input\.type===['"]text['"]/);
  assert.match(source,/input\.type=showing\?['"]password['"]:['"]text['"]/);
  assert.match(source,/toggle\.textContent=showing\?['"]Show['"]:['"]Hide['"]/);
  assert.match(source,/input\.focus\(\{preventScroll:true\}\)/);
});

test('TENX password control remounts after Log in and Sign up mode replacement',()=>{
  assert.match(source,/closest\('\[data-account-mode\]'\)/);
  assert.match(source,/queueMicrotask\(enhancePassword\)/);
  assert.match(source,/requestAnimationFrame\(\(\)=>\{account\.open[\s\S]*enhancePassword\(\)/);
});

test('TENX password control stays mobile touch safe and keyboard visible',()=>{
  assert.match(source,/\.account-password-toggle:focus-visible\{outline:3px solid #86d2ff/);
  assert.match(source,/@media\(max-width:760px\)[\s\S]*min-height:40px/);
  assert.match(source,/@media\(prefers-reduced-motion:reduce\)/);
});

test('TENX password visibility adds no auth storage or lifecycle owner',()=>{
  assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|WebSocket|EventSource|localStorage|sessionStorage|MutationObserver|setInterval|setTimeout/);
});
