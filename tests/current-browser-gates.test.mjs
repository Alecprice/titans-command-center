import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const quality=read('.github/workflows/quality.yml');
const audit=read('.github/workflows/current-experience-browser.yml');
const deploy=read('.github/workflows/cloudflare-deploy.yml');

for(const path of ['scripts/smart-search-browser-smoke.py','scripts/mobile-navigation-browser-smoke.py','scripts/account-browser-smoke.py','scripts/market-browser-smoke.py']){
  test(`${path} isolates unrelated first-run onboarding`,()=>{
    const source=read(path);
    assert.match(source,/def prepare_returning_user\(driver\):/);
    assert.match(source,/titans:v10Onboarded/);
    assert.match(source,/v10-onboarding/);
  });
}

test('mobile and account smokes suppress test-only sheet motion and verify settled geometry',()=>{
  const nav=read('scripts/mobile-navigation-browser-smoke.py'),account=read('scripts/account-browser-smoke.py');
  assert.match(nav,/def stabilize_mobile_sheet\(driver\):/);
  assert.match(nav,/transition:none!important;animation:none!important/);
  assert.match(nav,/def wait_sheet_settled\(driver/);
  assert.match(nav,/r\.bottom>dr\.top\+2/);
  assert.match(account,/def disable_sidebar_motion\(driver\):/);
  assert.match(account,/transition:none!important;animation:none!important/);
  assert.match(account,/def wait_sheet_settled\(driver/);
  assert.match(account,/r\.bottom<=dr\.top\+2/);
  assert.match(account,/def wait_account_panel\(driver/);
});

test('account smoke reports explicit stage and browser state on failure',()=>{
  const source=read('scripts/account-browser-smoke.py');
  assert.match(source,/stage='starting'/);
  assert.match(source,/stage='wait-more'/);
  assert.match(source,/stage='wait-account-panel'/);
  assert.match(source,/result\['state'\]=state\(d\)/);
});

test('runtime diagnostic records a named stage and failure state',()=>{
  const source=read('scripts/runtime-365-diagnostic.py');
  assert.match(source,/result=\{'ok':False,'base':BASE,'stage':'starting','states':\[\]\}/);
  assert.match(source,/wait-sheet-settled/);assert.match(source,/wait-search-results/);assert.match(source,/failureState/);
});

test('market smoke validates truthful live reference unavailable modes and real controls',()=>{
  const source=read('scripts/market-browser-smoke.py');
  for(const token of ["quality=='Live'","quality=='Published reference'","quality=='Unavailable'",'#mh-event-filter','#mh-book-filter','#mh-category-filter','#mh-alt-toggle','desktop:refresh','EC.staleness_of','Mobile market controls below 44px','horizontal overflow','SEVERE'])assert.ok(source.includes(token),`${token} missing from market smoke`);
  assert.match(source,/Select\(element\)/);
  assert.match(source,/select\.select_by_index\(1\)/);
  assert.match(source,/find_element\(By\.ID,'mh-refresh'\)\.click\(\)/);
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

test('Cloudflare release chain blocks on Market Pulse browser regression',()=>{
  assert.match(deploy,/name: Run Market Pulse browser regression/);
  assert.match(deploy,/id: market_browser/);
  assert.match(deploy,/if: steps\.media_browser\.outcome == 'success'/);
  assert.match(deploy,/run: python scripts\/market-browser-smoke\.py/);
  assert.match(deploy,/if: steps\.market_browser\.outcome == 'success'/);
  assert.match(deploy,/MARKET_BROWSER_OUTCOME: \$\{\{ steps\.market_browser\.outcome \}\}/);
  assert.match(deploy,/Market Pulse browser regression \$\{MARKET_BROWSER_OUTCOME:-not-run\}/);
  assert.match(deploy,/Market Pulse browser regression: \$\{MARKET_BROWSER_OUTCOME:-not-run\}/);
  assert.match(deploy,/## Market Pulse browser regression/);
});

test('post-deploy audit targets the exact deployed SHA and runs current experience smokes',()=>{
  assert.ok(audit.includes("workflows: ['Titans Cloudflare Deploy']"));
  assert.ok(audit.includes('github.event.workflow_run.head_sha'));
  assert.ok(audit.includes('/build-meta.json'));
  for(const command of ['python scripts/runtime-365-diagnostic.py','python scripts/smart-search-browser-smoke.py','python scripts/mobile-navigation-browser-smoke.py','python scripts/account-browser-smoke.py','python scripts/market-browser-smoke.py'])assert.ok(audit.includes(command),`${command} missing from audit workflow`);
  assert.ok(audit.includes('actions/upload-artifact@v4'));
});

test('post-deploy SHA probe uses the Node fetch path accepted by production',()=>{
  assert.match(audit,/node - <<'NODE'/);
  assert.match(audit,/await fetch\(`/);
  assert.match(audit,/user-agent': 'Titans-Current-Experience-Audit\/1\.0'/);
  assert.doesNotMatch(audit,/urllib\.request/);
});

test('post-deploy audit publishes an inspectable commit status and still fails on regressions',()=>{
  assert.match(audit,/statuses: write/);
  assert.match(audit,/continue-on-error: true/);
  assert.match(audit,/createCommitStatus/);
  assert.match(audit,/context: 'Titans Current Experience'/);
  assert.match(audit,/target_url:/);
  assert.match(audit,/Fail audit when any current-experience check failed/);
});
