import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const quality=read('.github/workflows/quality.yml');
const deploy=read('.github/workflows/cloudflare-deploy.yml');

for(const [label,path] of [
  ['Smart Search','scripts/smart-search-browser-smoke.py'],
  ['mobile navigation','scripts/mobile-navigation-browser-smoke.py'],
  ['guest/account','scripts/account-browser-smoke.py'],
  ['live market','scripts/market-browser-smoke.py']
]){
  test(`${label} production smoke suppresses unrelated first-run onboarding`,()=>{
    const script=read(path);
    assert.match(script,/def prepare_returning_user\(driver\):/);
    assert.match(script,/titans:v10Onboarded/);
    assert.match(script,/v10-onboarding/);
  });
}

test('transition-sensitive mobile smokes wait for settled More-sheet geometry',()=>{
  const nav=read('scripts/mobile-navigation-browser-smoke.py');
  const account=read('scripts/account-browser-smoke.py');
  assert.match(nav,/def wait_sheet_settled\(driver/);
  assert.match(nav,/r\.bottom>dr\.top\+2/);
  assert.match(account,/def wait_sheet_settled\(driver/);
  assert.match(account,/r\.bottom<=dr\.top\+2/);
  assert.match(account,/def wait_account_panel\(driver/);
});

test('live market smoke covers API validation filters alternates and mobile safety',()=>{
  const script=read('scripts/market-browser-smoke.py');
  assert.match(script,/\/api\/market-data/);
  assert.match(script,/live-provider/);
  assert.match(script,/providerValidation/);
  assert.match(script,/#mh-event-filter/);
  assert.match(script,/#mh-book-filter/);
  assert.match(script,/#mh-alt-toggle/);
  assert.match(script,/horizontal overflow/);
  assert.match(script,/44px mobile target/);
  assert.match(script,/SEVERE/);
});

test('market controls meet the 44px touch target contract',()=>{
  const css=read('market-hub.css');
  assert.match(css,/\.mh-head \.button\{min-height:44px\}/);
  assert.match(css,/\.mh-controls select\{min-height:44px/);
  assert.match(css,/\.mh-controls \.button\{min-height:44px/);
});

test('quality gate syntax-checks current Smart Search mobile Account and market smokes',()=>{
  for(const path of [
    'scripts/smart-search-browser-smoke.py',
    'scripts/mobile-navigation-browser-smoke.py',
    'scripts/account-browser-smoke.py',
    'scripts/market-browser-smoke.py'
  ]) assert.ok(quality.includes(path),`${path} missing from quality workflow`);
});

test('Cloudflare deployment gates analytics on current Smart Search mobile Account and market smokes',()=>{
  for(const id of ['smart_search_browser','mobile_nav_browser','account_browser','market_browser'])assert.match(deploy,new RegExp(`id: ${id}`));
  assert.match(deploy,/if: steps\.runtime_365_browser\.outcome == 'success'/);
  assert.match(deploy,/if: steps\.smart_search_browser\.outcome == 'success'/);
  assert.match(deploy,/if: steps\.mobile_nav_browser\.outcome == 'success'/);
  assert.match(deploy,/if: steps\.account_browser\.outcome == 'success'/);
  assert.match(deploy,/if: steps\.market_browser\.outcome == 'success'/);
  for(const label of ['Smart Search browser regression','Mobile navigation browser regression','Account / Guest browser regression','Live market browser regression'])assert.ok(deploy.includes(label),`${label} missing from deployment record`);
  for(const file of ['/tmp/smart-search-browser-smoke.json','/tmp/mobile-navigation-browser-smoke.json','/tmp/account-browser-smoke.json','/tmp/market-browser-smoke.json'])assert.ok(deploy.includes(file),`${file} missing from deployment record`);
});
