import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('v1.15 sync includes the existing fan-platform home and display preferences',()=>{
  const sync=read('account-sync-v112.js');
  const fan=read('fan-platform-v10.js');
  assert.match(fan,/prefs:'titans:v10Prefs'/);
  assert.match(sync,/V10_PREF_KEY='titans:v10Prefs'/);
  for(const field of ['theme','density','reducedMotion','showMarkets','notifications','homeOrder','homeHidden'])assert.ok(fan.includes(field),`${field} missing from fan preferences`);
  assert.match(sync,/data-save-settings/);
  assert.match(sync,/titans:preferences-synced/);
});

test('v1.15 server only accepts known fan-platform preference fields and values',()=>{
  const api=read('src/account-api.mjs');
  assert.match(api,/V10_PREF_KEY='titans:v10Prefs'/);
  assert.match(api,/function sanitizeV10Prefs\(value\)/);
  assert.match(api,/V10_THEMES=new Set\(\['system','dark','light'\]\)/);
  assert.match(api,/V10_DENSITIES=new Set\(\['comfortable','compact'\]\)/);
  for(const key of ['game','favorites','moves','intel','markets','freshness'])assert.ok(api.includes(`'${key}'`),`${key} missing from home-card allowlist`);
  for(const key of ['kickoff','final','transactions','news'])assert.ok(api.includes(`'${key}'`),`${key} missing from notification allowlist`);
  assert.match(api,/typeof value\.reducedMotion==='boolean'/);
  assert.match(api,/typeof value\.showMarkets==='boolean'/);
  assert.match(api,/encoded\.length>12000/);
});

test('remote v1.0 preferences refresh the live fan shell once only when changed',()=>{
  const sync=read('account-sync-v112.js');
  assert.match(sync,/const refreshV10=V10_PREF_KEY in remotePreferences&&!same\(local\[V10_PREF_KEY\],merged\[V10_PREF_KEY\]\)/);
  assert.match(sync,/if\(refreshV10\)setTimeout\(\(\)=>location\.reload\(\),120\)/);
  assert.match(sync,/const merged=\{\.\.\.local,\.\.\.remotePreferences\}/);
});

test('account preference storage capability is explicit and local-safe when the migration is absent',()=>{
  const api=read('src/account-api.mjs');
  const sync=read('account-sync-v112.js');
  const ui=read('account-v112.js');
  const css=read('account-v112.css');
  assert.match(api,/function preferenceStorageNotReady\(error\)/);
  assert.match(api,/code==='42P01'/);
  assert.match(api,/PREFERENCE_STORAGE_NOT_READY/);
  assert.match(api,/localOnly:true/);
  assert.match(api,/PREFERENCE_SYNC_UNAVAILABLE/);
  assert.match(api,/DATABASE_UNAVAILABLE/);
  assert.match(sync,/error\.code=String\(data\?\.code\|\|''\)/);
  assert.match(sync,/error\.localOnly=Boolean\(data\?\.localOnly\)/);
  assert.match(sync,/PREFERENCE_STORAGE_NOT_READY/);
  assert.match(sync,/state:'local'/);
  assert.match(sync,/Account sync isn’t enabled yet\. Your settings are saved on this device\./);
  assert.match(ui,/Selected settings can sync when account storage is available\./);
  assert.match(css,/\.account-sync-status\.local i\{background:#86d2ff\}/);
});

test('account module has one canonical entry path and sync is registered first',()=>{
  const html=read('index.html');
  const nav=read('mobile-navigation-v112.js');
  const runtime=read('usability-runtime.js');
  const account=read('account-v112.js');
  assert.doesNotMatch(nav,/account-v112\.js/);
  assert.match(runtime,/import '\.\/mobile-navigation-v112\.js\?v=2';/);
  assert.match(account,/if\(window\.__TitansAccountV112\)return;/);
  assert.match(account,/window\.__TitansAccountV112=true;/);
  assert.match(account,/account-v112\.css\?v=4/);
  const syncIndex=html.indexOf('/account-sync-v112.js?v=2');
  const accountIndex=html.indexOf('/account-v112.js?v=3');
  assert.ok(syncIndex>=0&&accountIndex>syncIndex,'account sync must register before the account module announces session state');
});

test('mobile Account entry is promoted above the long More navigation and stays desktop-footer compatible',()=>{
  const account=read('account-v112.js');
  const css=read('account-v112.css');
  assert.match(account,/const phone=matchMedia\('\(max-width:760px\)'\)/);
  assert.match(account,/function placeEntryCard\(card\)/);
  assert.match(account,/if\(phone\.matches\)nav\.before\(card\);else foot\.prepend\(card\)/);
  assert.match(account,/phone\.addEventListener\?\.\('change'/);
  assert.match(css,/#sidebar>\.account-sheet-card\{flex:0 0 auto/);
  assert.match(css,/#sidebar>\.account-sheet-card button\{min-height:44px\}/);
});

test('account production smoke waits for shell readiness then requires real mobile interactions',()=>{
  const smoke=read('scripts/account-browser-smoke.py');
  assert.match(smoke,/def wait_mobile_shell_ready\(driver,timeout=8\):/);
  assert.match(smoke,/window\.TitansRuntime/);
  assert.match(smoke,/sidebar\.getAttribute\('aria-hidden'\)!=='true'/);
  assert.match(smoke,/mr\.width<44\|\|mr\.height<44/);
  assert.match(smoke,/d\.find_element\(By\.ID,'mobile-more-button'\)\.click\(\)/);
  assert.match(smoke,/def wait_account_entry\(driver,timeout=5\):/);
  assert.match(smoke,/#sidebar > \.account-sheet-card \[data-account-open\]/);
  assert.match(smoke,/r\.bottom>visibleBottom\+1/);
  assert.match(smoke,/button\.click\(\)/);
  assert.match(smoke,/ElementClickInterceptedException/);
  assert.match(smoke,/ElementNotInteractableException/);
  assert.match(smoke,/StaleElementReferenceException/);
  assert.doesNotMatch(smoke,/scrollIntoView/);
  assert.doesNotMatch(smoke,/execute_script\([^\n]*mobile-more-button[^\n]*\.click\(\)/);
  assert.doesNotMatch(smoke,/execute_script\([^\n]*data-account-open[^\n]*\.click\(\)/);
});

test('guest-first account behavior and local fallback remain unchanged',()=>{
  const sync=read('account-sync-v112.js');
  const account=read('account-v112.js');
  assert.match(sync,/Guest settings stay on this device/);
  assert.match(sync,/Your settings are still saved on this device/);
  assert.match(account,/Continue as guest/);
  assert.doesNotMatch(account,/location\.replace/);
});
