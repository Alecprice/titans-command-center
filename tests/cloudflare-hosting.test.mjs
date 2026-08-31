import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Cloudflare Worker serves static assets and runs only API paths through compute',()=>{
  const config=read('wrangler.jsonc');
  const boundary=read('cloudflare/production-worker.mjs');
  assert.match(config,/"main"\s*:\s*"cloudflare\/production-worker\.mjs"/);
  assert.doesNotMatch(config,/NEON_WAREHOUSE_DISABLED|DATABASE_URL/);
  assert.match(boundary,/import worker from '\.\/worker\.mjs'/);
  assert.match(boundary,/productionDataEnv\(env\)/);
  assert.match(boundary,/if\(property==='DATABASE_URL'\)return undefined/);
  assert.match(config,/"nodejs_compat"/);
  assert.match(config,/"directory"\s*:\s*"\.\/dist"/);
  assert.match(config,/"not_found_handling"\s*:\s*"single-page-application"/);
  assert.match(config,/"run_worker_first"\s*:\s*\["\/api\/\*"\]/);
  assert.match(config,/"15 10 \* \* \*"/);
  assert.match(config,/"binding"\s*:\s*"TITANS_DB"/);
});

test('Cloudflare adapter uses native Worker env and execution context for core API routes and trusted scheduler',()=>{
  const worker=read('cloudflare/worker.mjs');
  assert.match(worker,/import apiHandler from '\.\.\/api\/index\.js'/);
  assert.match(worker,/databaseHealth\(env\)/);
  assert.match(worker,/getBootstrapData\(env\)/);
  assert.match(worker,/preseasonStatsRoute,env/);
  assert.match(worker,/marketDataRoute,env/);
  assert.match(worker,/cachedMarketData\(request,env,ctx\)/);
  assert.match(worker,/runApi\(request,env,ctx\)/);
  assert.match(worker,/async fetch\(request,env,ctx\)/);
  assert.match(worker,/env\.ASSETS\.fetch\(request\)/);
  assert.match(worker,/executeScheduledJob/);
  assert.match(worker,/syncTitansOfficialAudit/);
  assert.match(worker,/syncEspn/);
  assert.doesNotMatch(worker,/CRON_SECRET\|\|env\.INGEST_SECRET/);
});

test('Cloudflare passes bindings explicitly through legacy gateway routes without mutating process.env',()=>{
  const worker=read('cloudflare/worker.mjs');
  const gateway=read('api/index.js');
  assert.match(worker,/apiHandler\(req,res\.api,env\)/);
  assert.doesNotMatch(worker,/SERVER_BINDINGS/);
  assert.doesNotMatch(worker,/applyRuntimeEnv/);
  assert.doesNotMatch(worker,/process\.env\[/);
  assert.match(gateway,/export default async function handler\(req,res,env=process\.env\)/);
  assert.match(gateway,/return await run\(req,res,env\)/);
  assert.match(gateway,/requireAdminAuth\(req,env\)/);
  assert.match(gateway,/requireIngestAuth\(req,env\)/);
});

test('browser-facing responses enforce a restrictive security header baseline',()=>{
  const headers=read('_headers');
  assert.match(headers,/Strict-Transport-Security: max-age=31536000; includeSubDomains/);
  assert.match(headers,/X-Content-Type-Options: nosniff/);
  assert.match(headers,/X-Frame-Options: DENY/);
  assert.match(headers,/Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers,/Cross-Origin-Resource-Policy: same-origin/);
  assert.match(headers,/Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\), payment=\(\), usb=\(\)/);
  assert.match(headers,/Content-Security-Policy: default-src 'self'/);
  assert.match(headers,/object-src 'none'/);
  assert.match(headers,/frame-ancestors 'none'/);
  assert.match(headers,/form-action 'self'/);
  assert.match(headers,/\/build-meta\.json\n\s+Cache-Control: no-store, max-age=0/);
  assert.doesNotMatch(headers,/script-src[^\n;]*'unsafe-inline'/);
});

test('Cloudflare build publishes only browser-facing assets',()=>{
  const build=read('scripts/build-cloudflare.mjs');
  for(const module of ['src/core.mjs','src/data.mjs','src/odds.mjs','src/visual-audit.mjs','src/roster-audit-20260819.mjs'])assert.match(build,new RegExp(module.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.doesNotMatch(build,/src\/db\.mjs/);
  assert.doesNotMatch(build,/src\/ingest\.mjs/);
});

test('quality gate includes Cloudflare build verification',()=>{
  const pkg=JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['build:cloudflare'],'node scripts/build-cloudflare.mjs');
  assert.equal(pkg.scripts['verify:cloudflare'],'node scripts/check-cloudflare-build.mjs');
  assert.match(pkg.scripts.check,/build:cloudflare/);
  assert.match(pkg.scripts.check,/verify:cloudflare/);
});
