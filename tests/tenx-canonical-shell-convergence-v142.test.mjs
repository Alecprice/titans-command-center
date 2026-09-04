import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const headers=fs.readFileSync(new URL('../_headers',import.meta.url),'utf8');
const audit=fs.readFileSync(new URL('../scripts/custom-domain-regression.mjs',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');

// Keep this contract merge-context sensitive: release ordering must be validated against current main.
test('canonical shell HTML and service worker cannot be retained across releases',()=>{
  assert.match(headers,/\n\/\n  Cache-Control: no-store, max-age=0, must-revalidate/);
  assert.match(headers,/\/index\.html\n  Cache-Control: no-store, max-age=0, must-revalidate/);
  assert.match(headers,/\/sw\.js\n  Cache-Control: no-store, max-age=0, must-revalidate/);
  assert.match(headers,/\/build-meta\.json\n  Cache-Control: no-store, max-age=0, must-revalidate/);
});

test('stable browser code paths must revalidate instead of hiding a new Worker release',()=>{
  for(const pattern of [/\/\*\.js/,/\/\*\.mjs/,/\/\*\.css/,/\/src\/\*/]){
    assert.match(headers,pattern);
  }
  assert.equal((headers.match(/Cache-Control: public, max-age=0, must-revalidate/g)||[]).length,5);
});

test('custom-domain gate compares canonical critical assets to the checked-out release and keeps rollback reachable',()=>{
  for(const path of ['/', '/index.html','/sw.js','/app.js','/tickets-price-fallback-v58.js','/tickets-tenx-v123.js','/tickets-compare-v125.js','/tickets-compare-cache-bridge-v141.js']){
    assert.ok(audit.includes(`'${path}'`),`missing critical shell path ${path}`);
  }
  assert.match(audit,/function expectedStaticBody\(path\)\{return fs\.readFileSync\(localPath\(path\),'utf8'\);\}/);
  assert.match(audit,/pair\.canonical\.body!==body/);
  assert.match(audit,/pair\.origin\.status!==200/);
  assert.doesNotMatch(audit,/pair\.origin\.body!==body/);
  assert.match(audit,/Canonical shell did not match checked-out release or rollback shell was unavailable/);
});

test('front-door gate proves shell cache policy before browser regressions',()=>{
  assert.match(audit,/cacheControl\(canonicalRoot\)\.includes\('no-store'\)/);
  assert.match(audit,/cacheControl\(canonicalSw\)\.includes\('no-store'\)/);
  assert.match(audit,/cacheControl\(canonicalTicketCompare\)\.includes\('max-age=0'\)/);
  assert.match(audit,/shellPropagationAttempts/);
  const frontDoor=workflow.indexOf('node scripts/custom-domain-regression.mjs');
  const tickets=workflow.indexOf('python scripts/tickets-browser-smoke.py');
  assert.ok(frontDoor>=0&&tickets>frontDoor,'Ticket browser command must remain downstream of canonical front-door convergence');
});

test('shell convergence remains bounded and adds no cache-busting URL ownership',()=>{
  assert.match(audit,/const SHELL_CONVERGENCE_ATTEMPTS=8/);
  assert.match(audit,/const SHELL_CONVERGENCE_DELAY_MS=2500/);
  assert.doesNotMatch(audit,/CRITICAL_SHELL_PATHS\.map[^]*Date\.now\(\)/);
  assert.doesNotMatch(audit,/setInterval/);
});
