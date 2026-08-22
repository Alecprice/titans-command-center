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

test('live market smoke covers API validation, filters, alternates and mobile safety',()=>{
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

test('quality gate syntax-checks every current-feature browser smoke',()=>{
  for(const path of [
    'scripts/smart-search-browser-smoke.py',
    'scripts/mobile-navigation-browser-smoke.py',
    'scripts/account-browser-smoke.py',
    'scripts/market-browser-smoke.py'
  ]) assert.match(quality,new RegExp(path.replaceAll('/','\\/').replaceAll('.','\\.')));
});

test('Cloudflare deployment gates analytics on current v1.11 v1.12 and market browser smokes',()=>{
  for(const id of ['smart_search_browser','mobile_nav_browser','account_browser','market_browser'])assert.match(deploy,new RegExp(`id: ${id}`));
  assert.match(deploy,/steps\.runtime_365_browser\.outcome == 'success'/);
  assert.match(deploy,/steps\.smart_search_browser\.outcome == 'success'/);
  assert.match(deploy,/steps\.mobile_nav_browser\.outcome == 'success'/);
  assert.match(deploy,/steps\.account_browser\.outcome == 'success'/);
  assert.match(deploy,/steps\.market_browser\.outcome == 'success'/);
  assert.match(deploy,/Smart Search browser regression/);
  assert.match(deploy,/Mobile navigation browser regression/);
  assert.match(deploy,/Guest \/ account browser regression/);
  assert.match(deploy,/Live market browser regression/);
  assert.match(deploy,/\/tmp\/smart-search-browser-smoke\.json/);
  assert.match(deploy,/\/tmp\/mobile-navigation-browser-smoke\.json/);
  assert.match(deploy,/\/tmp\/account-browser-smoke\.json/);
  assert.match(deploy,/\/tmp\/market-browser-smoke\.json/);
});
