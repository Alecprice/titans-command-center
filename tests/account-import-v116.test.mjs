import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('v1.16 backup restore is loaded through the stable account module and packaged offline',()=>{
  const account=read('account-v112.js'),sw=read('sw.js');
  assert.match(account,/import '\.\/account-import-v116\.js\?v=1';/);
  assert.match(sw,/account-import-v116\.js/);assert.match(sw,/account-import-v116\.css/);assert.match(sw,/titans-cc-brand-2026-v59/);
});

test('backup parser accepts only the versioned Titans format and known preference namespaces',()=>{
  const sync=read('account-sync-v112.js');
  assert.match(sync,/MAX_IMPORT_BYTES=32000/);
  assert.match(sync,/payload\.format!=='titans-command-center-settings'\|\|payload\.version!==1/);
  assert.match(sync,/const unknown=keys\.filter\(key=>!KEYS\.includes\(key\)\)/);
  assert.match(sync,/if\(unknown\.length\)throw new Error/);
  assert.match(sync,/if\(encoded\.length>MAX_IMPORT_BYTES\)throw new Error/);
  assert.match(sync,/prepareImport/);assert.match(sync,/importSettings/);
});

test('selecting a backup only creates a preview; applying is a separate explicit action',()=>{
  const ui=read('account-import-v116.js');
  assert.match(ui,/data-account-import-file/);assert.match(ui,/prepareImport\?\.\(raw\)/);assert.match(ui,/renderPreview\(preview\)/);
  assert.match(ui,/Nothing has changed yet/);assert.match(ui,/data-account-import-apply/);assert.match(ui,/Apply imported settings/);
  assert.match(ui,/window\.TitansAccountSync\?\.importSettings\?\.\(pending\.raw\)/);
  const changeHandler=ui.slice(ui.indexOf("document.addEventListener('change'"));
  const beforeApply=changeHandler.slice(0,changeHandler.indexOf("document.addEventListener('keydown'"));
  assert.doesNotMatch(beforeApply,/importSettings\?\./);
});

test('restore never imports unknown metadata as app preferences and keeps backup inspection browser-local',()=>{
  const sync=read('account-sync-v112.js'),ui=read('account-import-v116.js');
  assert.match(sync,/preferences:Object\.fromEntries\(keys\.map/);
  assert.doesNotMatch(sync,/apply\(payload\)/);
  assert.doesNotMatch(ui,/fetch\(/);
  assert.match(ui,/file\.text\(\)/);assert.match(ui,/JSON\.parse/);
});

test('guest restore is local while signed-in restore makes a best-effort preference sync',()=>{
  const sync=read('account-sync-v112.js');
  assert.match(sync,/if\(!window\.TitansAccount\?\.user\)/);
  assert.match(sync,/Imported .* on this device/);
  assert.match(sync,/await request\('PUT',snapshot\(\)\)/);
  assert.match(sync,/Imported on this device, but cloud sync did not complete yet/);
});

test('backup restore UI remains touch-safe and collapses on small phones',()=>{
  const css=read('account-import-v116.css');
  assert.match(css,/\.account-import-file/);assert.match(css,/min-height:46px/);assert.match(css,/@media\(max-width:400px\)/);assert.match(css,/grid-template-columns:1fr/);
});
