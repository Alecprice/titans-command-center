import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const quality=read('.github/workflows/quality.yml');
const audit=read('.github/workflows/current-experience-browser.yml');

for(const path of ['scripts/smart-search-browser-smoke.py','scripts/mobile-navigation-browser-smoke.py','scripts/account-browser-smoke.py','scripts/market-browser-smoke.py']){
  test(`${path} isolates unrelated first-run onboarding`,()=>{
    const source=read(path);
    assert.match(source,/def prepare_returning_user\(driver\):/);
    assert.match(source,/titans:v10Onboarded/);
    assert.match(source,/v10-onboarding/);
  });
}

test('mobile and account smokes wait for settled More-sheet geometry',()=>{
  const nav=read('scripts/mobile-navigation-browser-smoke.py'),account=read('scripts/account-browser-smoke.py');
  assert.match(nav,/def wait_sheet_settled\(driver/);assert.match(nav,/r\.bottom>dr\.top\+2/);
  assert.match(account,/def wait_sheet_settled\(driver/);assert.match(account,/r\.bottom<=dr\.top\+2/);assert.match(account,/def wait_account_panel\(driver/);
});

test('runtime diagnostic records a named stage and failure state',()=>{
  const source=read('scripts/runtime-365-diagnostic.py');
  assert.match(source,/result=\{'ok':False,'base':BASE,'stage':'starting','states':\[\]\}/);
  assert.match(source,/wait-sheet-settled/);assert.match(source,/wait-search-results/);assert.match(source,/failureState/);
});

test('live market smoke validates provider rows filters alternates and mobile safety',()=>{
  const source=read('scripts/market-browser-smoke.py');
  for(const token of ['/api/market-data','live-provider','providerValidation','#mh-event-filter','#mh-book-filter','#mh-alt-toggle','horizontal overflow','44px mobile target','SEVERE'])assert.ok(source.includes(token),`${token} missing from market smoke`);
});

test('market controls meet the 44px touch target floor',()=>{
  const css=read('market-hub.css');
  assert.match(css,/\.mh-head \.button\{min-height:44px\}/);
  assert.match(css,/\.mh-controls select\{min-height:44px/);
  assert.match(css,/\.mh-controls \.button\{min-height:44px/);
});

test('quality gate syntax-checks new diagnostic and market smoke',()=>{
  assert.ok(quality.includes('scripts/runtime-365-diagnostic.py'));
  assert.ok(quality.includes('scripts/market-browser-smoke.py'));
});

test('post-deploy audit targets the exact deployed SHA and runs current experience smokes',()=>{
  assert.ok(audit.includes("workflows: ['Titans Cloudflare Deploy']"));
  assert.ok(audit.includes('github.event.workflow_run.head_sha'));
  assert.ok(audit.includes('/build-meta.json'));
  for(const command of ['python scripts/runtime-365-diagnostic.py','python scripts/smart-search-browser-smoke.py','python scripts/mobile-navigation-browser-smoke.py','python scripts/account-browser-smoke.py','python scripts/market-browser-smoke.py'])assert.ok(audit.includes(command),`${command} missing from audit workflow`);
  assert.ok(audit.includes('actions/upload-artifact@v4'));
});
