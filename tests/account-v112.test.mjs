import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('account layer is explicitly loaded and packaged offline',()=>{
  const html=read('index.html'),sw=read('sw.js'),quality=read('.github/workflows/quality.yml');
  assert.match(html,/account-sync-v112\.js\?v=1/);
  assert.match(html,/account-v112\.js\?v=2/);
  assert.match(sw,/account-sync-v112\.js/);
  assert.match(sw,/account-v112\.js/);
  assert.match(sw,/account-v112\.css/);
  assert.match(sw,/titans-cc-brand-2026-v57/);
  assert.match(quality,/scripts\/account-browser-smoke\.py/);
});

test('guest access is the default and auth does not gate public routes',()=>{
  const js=read('account-v112.js');
  assert.match(js,/Guest/);assert.match(js,/No account required/);assert.match(js,/Continue as guest/);
  assert.doesNotMatch(js,/location\.replace/);assert.doesNotMatch(js,/location\.href\s*=/);assert.doesNotMatch(js,/auth\.protect/);
});

test('account flow uses a narrow same-origin managed auth proxy',()=>{
  const js=read('account-v112.js'),api=read('src/account-api.mjs'),worker=read('cloudflare/worker.mjs');
  assert.match(js,/const AUTH='\/api\/account\/auth'/);assert.match(js,/get-session/);assert.match(js,/sign-up\/email/);assert.match(js,/sign-in\/email/);assert.match(js,/sign-out/);assert.match(js,/credentials:'same-origin'/);assert.ok(js.includes('type="password"'));assert.doesNotMatch(js,/localStorage.*password/);
  assert.match(api,/\['get-session','sign-in\/email','sign-up\/email','sign-out'\]/);
  assert.match(api,/const allowedMethod=safe==='get-session'\?'GET':'POST'/);
  assert.match(api,/headers\.set\('origin',new URL\(AUTH_ORIGIN\)\.origin\)/);
  assert.match(api,/Cache-Control','no-store'/);
  assert.match(worker,/route\.startsWith\('account\/auth\/'\)/);
});

test('signed-in preferences sync only approved local preference keys and real save controls',()=>{
  const sync=read('account-sync-v112.js'),api=read('src/account-api.mjs'),worker=read('cloudflare/worker.mjs'),player=read('player-intelligence-v16.js');
  for(const key of ['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks']){assert.ok(sync.includes(key));assert.ok(api.includes(key));}
  assert.match(sync,/\/api\/account\/preferences/);assert.match(sync,/titans:account/);assert.match(sync,/titans:preferences-synced/);
  assert.match(sync,/data-v16-favorite/);assert.match(player,/data-v16-favorite/);
  assert.match(sync,/data-v15-profile-save/);assert.match(sync,/data-v15-alert-save/);assert.match(sync,/data-custom-remove/);
  assert.match(api,/sanitizePreferences/);assert.match(api,/Authentication required/);assert.match(api,/\$\{encoded\}::jsonb/);assert.match(worker,/accountPreferencesRoute/);
});

test('account sync reports progress success and local-safe failure states',()=>{
  const sync=read('account-sync-v112.js'),ui=read('account-v112.js'),css=read('account-v112.css');
  assert.match(sync,/titans:sync-status/);assert.match(sync,/Syncing your Titans settings/);assert.match(sync,/Your Titans settings are synced/);assert.match(sync,/Your settings are still saved on this device/);
  assert.match(ui,/account-sync-status/);assert.match(ui,/titans:sync-status/);assert.match(ui,/syncStatus/);
  assert.match(css,/\.account-sync-status\.syncing/);assert.match(css,/\.account-sync-status\.synced/);assert.match(css,/\.account-sync-status\.error/);
});

test('saved media link copy is accurate for guests and signed-in users',()=>{
  const media=read('media-custom-links-v14.js');assert.match(media,/Guest links stay on this device/);assert.match(media,/signed-in users can sync saved links/);assert.doesNotMatch(media,/stored only on this device/);
});

test('auth failure gracefully falls back to guest instead of breaking the PWA',()=>{
  const js=read('account-v112.js');assert.match(js,/catch\{state\.session=null;\}/);assert.match(js,/window\.TitansAccount/);
});

test('account UI is mobile safe and modal controls meet touch target expectations',()=>{
  const css=read('account-v112.css');assert.match(css,/@media\(max-width:760px\)/);assert.match(css,/env\(safe-area-inset-bottom\)/);assert.match(css,/min-height:48px/);assert.match(css,/min-height:50px/);assert.match(css,/width:44px;height:44px/);assert.match(css,/:focus-visible/);
});
