import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('account layer is loaded through the existing mobile runtime and packaged offline',()=>{
  const mobile=read('mobile-navigation-v112.js'),sw=read('sw.js');
  assert.match(mobile,/import '\.\/account-v112\.js';/);
  assert.match(sw,/account-v112\.js/);
  assert.match(sw,/account-v112\.css/);
  assert.match(sw,/titans-cc-brand-2026-v56/);
});

test('guest access is the default and auth does not gate public routes',()=>{
  const js=read('account-v112.js');
  assert.match(js,/Guest/);
  assert.match(js,/No account required/);
  assert.match(js,/Continue as guest/);
  assert.doesNotMatch(js,/location\.replace/);
  assert.doesNotMatch(js,/location\.href\s*=/);
  assert.doesNotMatch(js,/auth\.protect/);
});

test('account flow supports session signup signin and signout with managed auth cookies',()=>{
  const js=read('account-v112.js');
  assert.match(js,/get-session/);
  assert.match(js,/sign-up\/email/);
  assert.match(js,/sign-in\/email/);
  assert.match(js,/sign-out/);
  assert.match(js,/credentials:'include'/);
  assert.match(js,/type=\\"password\\"/);
  assert.doesNotMatch(js,/localStorage.*password/);
});

test('auth failure gracefully falls back to guest instead of breaking the PWA',()=>{
  const js=read('account-v112.js');
  assert.match(js,/catch\{state\.session=null;\}/);
  assert.match(js,/window\.TitansAccount/);
});

test('account UI is mobile safe and modal controls meet touch target expectations',()=>{
  const css=read('account-v112.css');
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/env\(safe-area-inset-bottom\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/min-height:50px/);
  assert.match(css,/width:44px;height:44px/);
});
