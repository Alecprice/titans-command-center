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

test('guest-first account behavior and local fallback remain unchanged',()=>{
  const sync=read('account-sync-v112.js');
  const account=read('account-v112.js');
  assert.match(sync,/Guest settings stay on this device/);
  assert.match(sync,/Your settings are still saved on this device/);
  assert.match(account,/Continue as guest/);
  assert.doesNotMatch(account,/location\.replace/);
});
