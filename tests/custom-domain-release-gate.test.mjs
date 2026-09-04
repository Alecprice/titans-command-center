import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('custom-domain verification is manual-only, read-only, and targets the canonical hostname',()=>{
  const workflow=read('.github/workflows/custom-domain-verify.yml');
  assert.match(workflow,/on:\s*\n\s*workflow_dispatch:/);
  assert.doesNotMatch(workflow,/\n\s*push:/);
  assert.match(workflow,/permissions:\s*\n\s*contents: read/);
  assert.match(workflow,/persist-credentials: false/);
  assert.match(workflow,/name: Use Node 24/);
  assert.match(workflow,/node-version: '24'/);
  assert.match(workflow,/package-manager-cache: false/);
  assert.match(workflow,/CUSTOM_DOMAIN_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/ORIGIN_URL: https:\/\/titans-command-center\.alecjordanprice\.workers\.dev/);
  assert.match(workflow,/PRODUCTION_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.doesNotMatch(workflow,/\$\{\{\s*secrets\./);
  assert.doesNotMatch(workflow,/\baws\s+(?:cloudfront|route53|acm|cloudformation)\b/i);
});

test('custom-domain probe proves CloudFront fronts the exact canonical release without weakening rollback or D1 truth',()=>{
  const probe=read('scripts/custom-domain-regression.mjs');
  assert.match(probe,/EXPECTED_CUSTOM_HOST='titans\.alecjprice\.com'/);
  assert.match(probe,/EXPECTED_ORIGIN_HOST='titans-command-center\.alecjordanprice\.workers\.dev'/);
  assert.match(probe,/process\.env\.EXPECTED_SHA\|\|process\.env\.GITHUB_SHA/);
  assert.match(probe,/canonicalMeta\.commit===EXPECTED_SHA/);
  assert.match(probe,/rollbackCommit:originMeta\.commit/);
  assert.match(probe,/rollbackCurrent:originMeta\.commit===EXPECTED_SHA/);
  assert.doesNotMatch(probe,/canonicalMeta\.body\.commit===originMeta\.body\.commit/);
  assert.doesNotMatch(probe,/canonicalMeta\.body\?\.version===originMeta\.body\?\.version/);
  assert.match(probe,/originHeaders\.robots\.includes\('noindex'\)/);
  assert.match(probe,/!canonicalHeaders\.robots\.includes\('noindex'\)/);
  assert.match(probe,/x-amz-cf-id/);
  assert.match(probe,/x-amz-cf-pop/);
  assert.match(probe,/cloudfront/i);
  assert.match(probe,/contentTypeOptions==='nosniff'/);
  assert.match(probe,/frameOptions==='DENY'/);
  assert.match(probe,/frame-ancestors 'none'/);
  assert.match(probe,/database\?\.provider==='cloudflare-d1'/);
  assert.match(probe,/database\?\.configured===true/);
  assert.match(probe,/validateHealth\(originHealth,'Worker rollback'\)/);
  assert.match(probe,/custom-domain-smoke\.json/);
  assert.doesNotMatch(probe,/DATABASE_URL/);
});

test('canonical revision comparison tolerates bounded edge propagation but still fails closed',()=>{
  const probe=read('scripts/custom-domain-regression.mjs');
  assert.match(probe,/REVISION_CONVERGENCE_ATTEMPTS=6/);
  assert.match(probe,/REVISION_CONVERGENCE_DELAY_MS=2500/);
  assert.match(probe,/async function waitForCanonicalRevision\(\)/);
  assert.match(probe,/for\(let attempt=1;attempt<=REVISION_CONVERGENCE_ATTEMPTS;attempt\+\+\)/);
  assert.match(probe,/if\(meta\.commit===EXPECTED_SHA\)return \{meta,attempts:attempt\}/);
  assert.match(probe,/await wait\(REVISION_CONVERGENCE_DELAY_MS\)/);
  assert.match(probe,/Canonical hostname did not reach expected release/);
  assert.match(probe,/const \{meta:canonicalMeta,attempts:revisionAttempts\}=await waitForCanonicalRevision\(\)/);
  assert.match(probe,/revisionAttempts,/);
  assert.match(probe,/assert\(canonicalMeta\.commit===EXPECTED_SHA/);
  assert.doesNotMatch(probe,/assert\(canonicalMeta\.body\.commit===originMeta\.body\.commit/);
});

test('custom-domain workflow reuses the established production and browser gates',()=>{
  const workflow=read('.github/workflows/custom-domain-verify.yml');
  for(const command of [
    'node scripts/custom-domain-regression.mjs',
    'node scripts/production-regression.mjs',
    'node scripts/advanced-analytics-regression.mjs',
    'node scripts/headshot-production-regression.mjs',
    'python scripts/browser-navigation-smoke.py',
    'python scripts/media-browser-smoke.py',
    'python scripts/market-browser-smoke.py',
    'python scripts/command-intelligence-browser-smoke.py',
    'python scripts/player-gameday-browser-smoke.py',
    'python scripts/ask-titans-browser-smoke.py',
    'python scripts/change-intelligence-browser-smoke.py',
    'python scripts/runtime-365-browser-smoke.py',
    'python scripts/freshness-browser-smoke.py',
    'python scripts/account-browser-smoke.py',
    'python scripts/analytics-browser-smoke.py',
    'python scripts/headshot-browser-smoke.py'
  ])assert.ok(workflow.includes(command),`custom-domain workflow is missing: ${command}`);
});
