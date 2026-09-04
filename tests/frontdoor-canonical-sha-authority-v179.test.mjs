import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../scripts/custom-domain-regression.mjs',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');

test('front-door verifier binds canonical production to the exact GitHub release SHA',()=>{
  assert.match(source,/process\.env\.EXPECTED_SHA\|\|process\.env\.GITHUB_SHA/);
  assert.match(source,/\^\[0-9a-f\]\{40\}\$/);
  assert.match(source,/waitForCanonicalRevision/);
  assert.match(source,/meta\.commit===EXPECTED_SHA/);
  assert.match(source,/Canonical hostname did not reach expected release/);
  assert.match(source,/expectedCommit:EXPECTED_SHA/);
  assert.match(source,/deployedCommit:canonicalMeta\.commit/);
  assert.match(workflow,/Verify canonical front door and Worker rollback path/);
  assert.match(workflow,/run: node scripts\/custom-domain-regression\.mjs/);
});

test('rollback revision lag is reported but no longer controls canonical release identity',()=>{
  assert.match(source,/rollbackCommit:originMeta\.commit/);
  assert.match(source,/rollbackCurrent:originMeta\.commit===EXPECTED_SHA/);
  assert.doesNotMatch(source,/canonicalMeta\.body\.commit===originMeta\.body\.commit/);
  assert.doesNotMatch(source,/CloudFront and Worker revisions did not converge/);
  assert.doesNotMatch(source,/CloudFront is not serving the current Worker revision/);
  assert.doesNotMatch(source,/canonicalMeta\.body\?\.version===originMeta\.body\?\.version/);
});

test('canonical shell stays release-exact while rollback shell remains a mandatory reachable surface',()=>{
  assert.match(source,/pair\.canonical\.body!==body/);
  assert.match(source,/canonical-stale/);
  assert.match(source,/pair\.origin\.status!==200/);
  assert.match(source,/rollback-status-/);
  assert.doesNotMatch(source,/pair\.origin\.body!==body/);
  assert.match(source,/Worker rollback root returned/);
});

test('rollback security and health remain release gates independent of rollback revision age',()=>{
  assert.match(source,/workers\.dev rollback surface must remain staging-only/);
  assert.match(source,/request\(origin,'\/api\/health'/);
  assert.match(source,/validateHealth\(originHealth,'Worker rollback'\)/);
  assert.match(source,/rollbackHealth:/);
  assert.match(source,/cloudflare-d1/);
});

test('front-door repair does not weaken bounded convergence or canonical cache and security assertions',()=>{
  assert.match(source,/REVISION_CONVERGENCE_ATTEMPTS=6/);
  assert.match(source,/REVISION_CONVERGENCE_DELAY_MS=2500/);
  assert.match(source,/SHELL_CONVERGENCE_ATTEMPTS=8/);
  assert.match(source,/SHELL_CONVERGENCE_DELAY_MS=2500/);
  assert.match(source,/X-Content-Type-Options: nosniff/);
  assert.match(source,/X-Frame-Options: DENY/);
  assert.match(source,/frame-ancestors 'none'/);
  assert.match(source,/Canonical root cache policy can retain stale shell HTML/);
  assert.match(source,/Canonical service worker cache policy can retain a stale shell generation/);
});
