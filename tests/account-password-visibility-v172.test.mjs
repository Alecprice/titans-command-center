import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const interaction=fs.readFileSync(new URL('../account-interaction-v117.js',import.meta.url),'utf8');
const account=fs.readFileSync(new URL('../account-v112.js',import.meta.url),'utf8');
const accountImport=fs.readFileSync(new URL('../account-import-v116.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('TENX account password visibility runtime is in the live account import chain',()=>{
  assert.match(account,/import ['"]\.\/account-import-v116\.js\?v=1['"]/);
  assert.match(accountImport,/import ['"]\.\/account-interaction-v117\.js\?v=1['"]/);
});

test('TENX password control uses explicit accessible state and valid label structure',()=>{
  assert.match(interaction,/fieldLabel\.htmlFor=input\.id/);
  assert.match(interaction,/label\.replaceWith\(field\)/);
  assert.match(interaction,/toggle\.type='button'/);
  assert.match(interaction,/toggle\.setAttribute\('aria-controls',input\.id\)/);
  assert.match(interaction,/toggle\.setAttribute\('aria-pressed','false'\)/);
  assert.match(interaction,/toggle\.setAttribute\('aria-label','Show password'\)/);
  assert.match(interaction,/toggle\.textContent='Show'/);
});

test('TENX password reveal remains presentation-only and restores editing position',()=>{
  assert.match(interaction,/const reveal=input\.type==='password'/);
  assert.match(interaction,/input\.type=reveal\?'text':'password'/);
  assert.match(interaction,/toggle\.textContent=reveal\?'Hide':'Show'/);
  assert.match(interaction,/toggle\.setAttribute\('aria-pressed',String\(reveal\)\)/);
  assert.match(interaction,/input\.focus\(\{preventScroll:true\}\)/);
  assert.match(interaction,/input\.setSelectionRange\(start,end,direction\|\|'none'\)/);
  assert.doesNotMatch(interaction,/fetch\(|XMLHttpRequest|WebSocket|EventSource|localStorage|sessionStorage|MutationObserver|setInterval|setTimeout/);
});

test('TENX password manager semantics remain native for sign in and sign up',()=>{
  assert.match(account,/autocomplete="\$\{mode==='signup'\?'new-password':'current-password'\}"/);
  assert.match(account,/type="password"/);
  assert.match(account,/minlength="8"/);
});

test('TENX password control meets mobile touch and focus contracts',()=>{
  assert.match(interaction,/\.account-password-toggle\{[^}]*min-height:48px/);
  assert.match(interaction,/\.account-password-toggle:focus-visible\{outline:3px solid #86d2ff;outline-offset:2px\}/);
  assert.match(interaction,/@media\(max-width:400px\)/);
  assert.match(interaction,/@media\(forced-colors:active\)/);
});

test('TENX password enhancement survives account mode replacement and programmatic opens',()=>{
  assert.match(interaction,/closest\('\[data-account-mode\]'\)/);
  assert.match(interaction,/queueMicrotask\(enhancePassword\)/);
  assert.match(interaction,/account\.open=wrappedOpen/);
  assert.match(interaction,/requestAnimationFrame\(\(\)=>\{account\.open[\s\S]*enhancePassword\(\)/);
});

test('TENX offline shell packages the imported interaction dependency',()=>{
  assert.match(sw,/titans-cc-brand-2026-v86/);
  assert.match(sw,/['"]\/account-interaction-v117\.js['"]/);
  assert.match(sw,/const NETWORK_FIRST=\/\\\.\(\?:js\|mjs\|css\|webmanifest\)\$\/i/);
});
