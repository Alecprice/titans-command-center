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

test('account module has one canonical entry path and sync is registered first',()=>{
  const html=read('index.html');
  const nav=read('mobile-navigation-v112.js');
  const runtime=read('usability-runtime.js');
  const account=read('account-v112.js');
  assert.doesNotMatch(nav,/account-v112\.js/);
  assert.match(runtime,/import '\.\/mobile-navigation-v112\.js\?v=2';/);
  assert.match(account,/if\(window\.__TitansAccountV112\)return;/);
  assert.match(account,/window\.__TitansAccountV112=true;/);
  const syncIndex=html.indexOf('/account-sync-v112.js?v=1');
  const accountIndex=html.indexOf('/account-v112.js?v=2');
  assert.ok(syncIndex>=0&&accountIndex>syncIndex,'account sync must register before the account module announces session state');
});

test('account production smoke retries the real mobile sheet entry instead of bypassing it',()=>{
  const smoke=read('scripts/account-browser-smoke.py');
  assert.match(smoke,/def open_account_from_sheet\(driver,attempts=3\):/);
  assert.match(smoke,/if not opened:/);
  assert.match(smoke,/wait_sheet_settled\(driver\)/);
  assert.match(smoke,/scrollIntoView/);
  assert.match(smoke,/button\.click\(\)/);
  assert.match(smoke,/s\.inert/);
  assert.match(smoke,/ElementNotInteractableException/);
  assert.match(smoke,/StaleElementReferenceException/);
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
