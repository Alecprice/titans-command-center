import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('account layer is explicitly loaded and packaged offline',()=>{
  const html=read('index.html'),sw=read('sw.js'),quality=read('.github/workflows/quality.yml'),ui=read('account-v112.js');
  assert.match(html,/account-sync-v112\.js\?v=2/);assert.match(html,/account-v112\.js\?v=3/);assert.match(ui,/account-v112\.css\?v=4/);assert.match(sw,/account-sync-v112\.js/);assert.match(sw,/account-v112\.js/);assert.match(sw,/account-v112\.css/);assert.match(sw,/titans-cc-brand-2026-v\d+/);assert.match(quality,/scripts\/account-browser-smoke\.py/);
});

test('guest access is the default and auth does not gate public routes',()=>{
  const js=read('account-v112.js');assert.match(js,/Guest/);assert.match(js,/No account required/);assert.match(js,/Continue as guest/);assert.doesNotMatch(js,/location\.replace/);assert.doesNotMatch(js,/location\.href\s*=/);assert.doesNotMatch(js,/auth\.protect/);
});

test('account flow uses a narrow same-origin managed auth proxy',()=>{
  const js=read('account-v112.js'),api=read('src/account-api.mjs'),worker=read('cloudflare/worker.mjs');
  assert.match(js,/const AUTH='\/api\/account\/auth'/);assert.match(js,/get-session/);assert.match(js,/sign-up\/email/);assert.match(js,/sign-in\/email/);assert.match(js,/sign-out/);assert.match(js,/credentials:'same-origin'/);assert.ok(js.includes('type="password"'));assert.doesNotMatch(js,/localStorage.*password/);
  assert.match(api,/\['get-session','sign-in\/email','sign-up\/email','sign-out'\]/);assert.match(api,/const allowedMethod=safe==='get-session'\?'GET':'POST'/);assert.match(api,/headers\.set\('origin',new URL\(AUTH_ORIGIN\)\.origin\)/);assert.match(api,/Cache-Control','no-store'/);assert.match(worker,/route\.startsWith\('account\/auth\/'\)/);
});

test('signed-in preferences sync only approved local preference keys and real save controls',()=>{
  const sync=read('account-sync-v112.js'),api=read('src/account-api.mjs'),worker=read('cloudflare/worker.mjs'),player=read('player-intelligence-v16.js');
  for(const key of ['titans:v15MyTitans','titans:v15SmartAlerts','titans:v14CustomMediaLinks']){assert.ok(sync.includes(key));assert.ok(api.includes(key));}
  assert.match(sync,/\/api\/account\/preferences/);assert.match(sync,/titans:account/);assert.match(sync,/titans:preferences-synced/);assert.match(sync,/data-v16-favorite/);assert.match(player,/data-v16-favorite/);assert.match(sync,/data-v15-profile-save/);assert.match(sync,/data-v15-alert-save/);assert.match(sync,/data-custom-remove/);assert.match(api,/sanitizePreferences/);assert.match(api,/Authentication required/);assert.match(api,/\$\{encoded\}::jsonb/);assert.match(worker,/accountPreferencesRoute/);
});

test('account sync reports progress success explicit local-only capability and local-safe failure states',()=>{
  const sync=read('account-sync-v112.js'),ui=read('account-v112.js'),css=read('account-v112.css'),api=read('src/account-api.mjs');
  assert.match(sync,/titans:sync-status/);assert.match(sync,/Syncing your Titans settings/);assert.match(sync,/Your Titans settings are synced/);assert.match(sync,/Account sync isn’t enabled yet\. Your settings are saved on this device\./);assert.match(sync,/Your settings are still saved on this device/);assert.match(sync,/state:'local'/);assert.match(api,/PREFERENCE_STORAGE_NOT_READY/);assert.match(api,/localOnly:true/);assert.match(ui,/account-sync-status/);assert.match(ui,/titans:sync-status/);assert.match(ui,/syncStatus/);assert.match(css,/\.account-sync-status\.syncing/);assert.match(css,/\.account-sync-status\.synced/);assert.match(css,/\.account-sync-status\.local/);assert.match(css,/\.account-sync-status\.error/);
});

test('account portability exports only selected preferences and resets safely',()=>{
  const sync=read('account-sync-v112.js'),ui=read('account-v112.js'),css=read('account-v112.css');
  assert.match(sync,/format:'titans-command-center-settings'/);assert.match(sync,/exportSettings/);assert.match(sync,/resetSettings/);assert.match(sync,/clearLocal/);assert.match(sync,/await request\('PUT',\{\}\)/);assert.match(sync,/Couldn’t reset synced settings\. Nothing was changed\./);assert.doesNotMatch(sync,/password/);assert.doesNotMatch(sync,/sessionToken|accessToken|refreshToken/);
  assert.match(ui,/data-account-export/);assert.match(ui,/data-account-reset/);assert.match(ui,/Confirm reset/);assert.match(ui,/within 6 seconds/);assert.match(ui,/It does not delete your account/);assert.match(css,/\.account-tools/);assert.match(css,/\.account-danger\.armed/);assert.match(css,/@media\(max-width:400px\)/);
});

test('account portability relies on the canonical idempotent migration and explicit rollback',()=>{
  const sql=read('db/migrations/20260822_fan_user_preferences.sql');
  const rollback=read('db/migrations/20260822_fan_user_preferences.rollback.sql');
  assert.match(sql,/create table if not exists fan_user_preferences/);assert.match(sql,/user_id text primary key/);assert.match(sql,/preferences jsonb not null default '\{\}'::jsonb/);assert.match(sql,/schema_version integer not null default 1/);assert.match(sql,/jsonb_typeof\(preferences\) = 'object'/);assert.match(sql,/create index if not exists fan_user_preferences_updated_at_idx/);assert.match(rollback,/Never run automatically from application deploys/);assert.match(rollback,/drop table if exists fan_user_preferences/);
});

test('production deployment gates on guest and account browser health',()=>{
  const deploy=read('.github/workflows/cloudflare-deploy.yml');assert.match(deploy,/id: account_browser/);assert.match(deploy,/python scripts\/account-browser-smoke\.py/);assert.match(deploy,/ACCOUNT_BROWSER_OUTCOME/);assert.match(deploy,/Account \/ Guest browser regression/);assert.match(deploy,/if: steps\.account_browser\.outcome == 'success'/);
});

test('account browser smoke waits for initialized mobile shell before its first More interaction',()=>{
  const smoke=read('scripts/account-browser-smoke.py');
  assert.match(smoke,/def wait_mobile_shell_ready\(driver,timeout=8\):/);assert.match(smoke,/document\.readyState!=='complete'\|\|!window\.TitansRuntime/);assert.match(smoke,/sidebar\.getAttribute\('aria-hidden'\)!=='true'/);assert.match(smoke,/more\.getAttribute\('aria-expanded'\)!=='false'/);assert.match(smoke,/mr\.width<44\|\|mr\.height<44/);assert.match(smoke,/style\.pointerEvents==='none'/);assert.match(smoke,/stage='wait-mobile-shell'/);assert.match(smoke,/shell=wait_mobile_shell_ready\(d\)/);assert.match(smoke,/def open_more_sheet\(driver,attempts=3\):/);assert.match(smoke,/driver\.find_element\(By\.ID,'mobile-more-button'\)\.click\(\)/);assert.match(smoke,/return wait_sheet_settled\(driver,timeout=2\)/);assert.match(smoke,/stage='open-more';sheet=open_more_sheet\(d\)/);assert.match(smoke,/result\.update\(\{'ok':True,'guest':guest,'mobileShell':shell/);assert.doesNotMatch(smoke,/execute_script\([^\n]*mobile-more-button[^\n]*\.click\(\)/);
});

test('account browser smoke isolates onboarding and diagnoses each production stage',()=>{
  const smoke=read('scripts/account-browser-smoke.py');
  assert.match(smoke,/def prepare_returning_user\(driver\):/);assert.match(smoke,/titans:v10Onboarded/);assert.match(smoke,/def disable_sidebar_motion\(driver\):/);assert.match(smoke,/#sidebar\{transition:none!important;animation:none!important\}/);assert.match(smoke,/stage='wait-guest'/);assert.match(smoke,/stage='wait-mobile-shell'/);assert.match(smoke,/stage='open-more'/);assert.match(smoke,/stage='wait-account-panel'/);assert.match(smoke,/stage='simulate-auth-outage'/);assert.match(smoke,/stage='wait-roster'/);assert.match(smoke,/runtimeVersion:window\.TitansRuntime\?\.version/);assert.match(smoke,/ariaHidden:sidebar\?\.getAttribute\('aria-hidden'\)/);assert.match(smoke,/result\['stage'\]=stage/);assert.match(smoke,/result\['state'\]=state\(d\)/);
});

test('runtime 365 regression preserves current returning-user and five-action dock contract',()=>{
  const smoke=read('scripts/runtime-365-browser-smoke.py');assert.match(smoke,/prepare_returning_user/);assert.match(smoke,/titans:v10Onboarded/);assert.match(smoke,/len\(mobile\['dockTargets'\]\)!=5/);assert.match(smoke,/\{'Home','Roster','Game','Search','More'\}/);assert.doesNotMatch(smoke,/len\(mobile\['dockTargets'\]\)!=6/);
});

test('saved media link copy stays accurate while preference storage is optional',()=>{const media=read('media-custom-links-v14.js');assert.match(media,/Guest links stay on this device/);assert.match(media,/when account sync is available/);assert.doesNotMatch(media,/stored only on this device/);});
test('auth failure gracefully falls back to guest instead of breaking the PWA',()=>{const js=read('account-v112.js');assert.match(js,/catch\{state\.session=null;\}/);assert.match(js,/window\.TitansAccount/);});
test('account UI is mobile safe and modal controls meet touch target expectations',()=>{const css=read('account-v112.css');assert.match(css,/@media\(max-width:760px\)/);assert.match(css,/env\(safe-area-inset-bottom\)/);assert.match(css,/min-height:48px/);assert.match(css,/min-height:50px/);assert.match(css,/width:44px;height:44px/);assert.match(css,/:focus-visible/);});
