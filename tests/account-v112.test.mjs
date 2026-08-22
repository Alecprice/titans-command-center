import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('account layer is explicitly loaded and packaged offline',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/account-sync-v112\.js\?v=1/);
  assert.match(html,/account-v112\.js\?v=2/);
  assert.match(sw,/account-sync-v112\.js/);
  assert.match(sw,/account-v112\.js/);
  assert.match(sw,/account-v112\.css/);
  assert.match(sw,/titans-cc-brand-2026-v57/);
});

test('guest access is the default and auth does not gate public routes',()=>{
  const js=read('account-v112.js');
  assert.match(js,/Guest/);assert.match(js,/No account required/);assert.match(js,/Continue as guest/);
  assert.doesNotMatch(js,/location\.replace/);assert.doesNotMatch(js,/location\.href\s*=/);assert.doesNotMatch(js,/auth\.protect/);
});

test('account flow uses same-origin managed auth proxy',()=>{
  const js=read('account-v112.js'),api=read('src/account-api.mjs'),worker=read('cloudflare/worker.mjs');
  assert.match(js,/const AUTH='\/api\/account\/auth'/);assert.match(js,/get-session/);assert.match(js,/sign-up\/email/);assert.match(js,/sign-in\/email/);assert.match(js,/sign-out/);assert.match(js,/credentials:'same-origin'/);assert.match(js,/type=\\"password\\"/);assert.doesNotMatch(js,/localStorage.*password/);
  assert.match(api,/accountAuthProxy/);assert.match(api,/\['get-session','sign-in\/email','sign-up\/email','sign-out'\]/);assert.match(worker,/route\.startsWith\('account\/auth\/'\)/);
});

test('signed-in preferences sync only approved local preference keys',()=>{
  const sync=read('account-sync-v112.js'),api=read('src/account-api.mjs'),worker=read('cloudflare/worker.mjs');
  for(const key of ['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks']){assert.ok(sync.includes(key));assert.ok(api.includes(key));}
  assert.match(sync,/\/api\/account\/preferences/);assert.match(sync,/titans:account/);assert.match(sync,/titans:preferences-synced/);assert.match(api,/sanitizePreferences/);assert.match(api,/Authentication required/);assert.match(worker,/accountPreferencesRoute/);
});

test('saved media link copy is accurate for guests and signed-in users',()=>{
  const media=read('media-custom-links-v14.js');assert.match(media,/Guest links stay on this device/);assert.match(media,/signed-in users can sync saved links/);assert.doesNotMatch(media,/stored only on this device/);
});

test('auth failure gracefully falls back to guest instead of breaking the PWA',()=>{
  const js=read('account-v112.js');assert.match(js,/catch\{state\.session=null;\}/);assert.match(js,/window\.TitansAccount/);
});

test('account UI is mobile safe and modal controls meet touch target expectations',()=>{
  const css=read('account-v112.css');assert.match(css,/@media\(max-width:760px\)/);assert.match(css,/env\(safe-area-inset-bottom\)/);assert.match(css,/min-height:48px/);assert.match(css,/min-height:50px/);assert.match(css,/width:44px;height:44px/);
});
