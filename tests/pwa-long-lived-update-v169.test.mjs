import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const runtime=readFileSync(new URL('../usability-runtime.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('long-lived installed sessions check for service-worker updates only when useful',()=>{
  assert.match(runtime,/const SW_UPDATE_MIN_MS=30\*60\*1000;/);
  assert.match(runtime,/async function checkForAppUpdate\(\)\{[^]*!swRegistration\|\|swUpdateInFlight\|\|document\.visibilityState!==['"]visible['"]\|\|navigator\.onLine===false[^]*now-swUpdateCheckedAt<SW_UPDATE_MIN_MS[^]*swRegistration\.update\(\)/);
  assert.match(runtime,/navigator\.serviceWorker\.ready\.then\(registration=>\{\s*swRegistration=registration;\s*swUpdateCheckedAt=Date\.now\(\);/);
  assert.match(runtime,/document\.addEventListener\(['"]visibilitychange['"],[^]*document\.visibilityState===['"]visible['"]\)checkForAppUpdate\(\)/);
  assert.match(runtime,/window\.addEventListener\(['"]online['"],[^]*checkForAppUpdate\(\)/);
});

test('PWA update discovery remains event-driven and reuses the single registration owner',()=>{
  assert.doesNotMatch(runtime,/serviceWorker\.register\s*\(/);
  assert.match(app,/navigator\.serviceWorker\.register\(['"]\/sw\.js['"]\)/);
  assert.doesNotMatch(runtime,/setInterval\s*\(/);
  const start=runtime.indexOf('async function checkForAppUpdate');
  const end=runtime.indexOf('function trapMobileDrawerFocus',start);
  const updateBlock=runtime.slice(start,end);
  assert.doesNotMatch(updateBlock,/\bfetch\s*\(|localStorage|sessionStorage|setTimeout\s*\(/);
});

test('a newly controlling worker stays user-controlled instead of forcing a reload',()=>{
  assert.match(runtime,/navigator\.serviceWorker\.addEventListener\(['"]controllerchange['"],[^]*if\(hadController\)showUpdateReady\(\)/);
  assert.match(runtime,/data-update-reload[^]*Reload/);
  assert.match(runtime,/update-dismiss[^]*Dismiss update notice/);
  assert.match(runtime,/target\.closest\(['"]\[data-update-reload\]['"]\)\)\{location\.reload\(\);return;\}/);
  const start=runtime.indexOf("navigator.serviceWorker.addEventListener('controllerchange'");
  const end=runtime.indexOf("window.addEventListener('load'",start);
  assert.doesNotMatch(runtime.slice(start,end),/location\.reload\s*\(/);
});
