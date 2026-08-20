import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Cloudflare Worker serves static assets and runs only API paths through compute',()=>{
  const config=read('wrangler.jsonc');
  assert.match(config,/"main"\s*:\s*"cloudflare\/worker\.mjs"/);
  assert.match(config,/"nodejs_compat"/);
  assert.match(config,/"directory"\s*:\s*"\.\/dist"/);
  assert.match(config,/"not_found_handling"\s*:\s*"single-page-application"/);
  assert.match(config,/"run_worker_first"\s*:\s*\["\/api\/\*"\]/);
  assert.match(config,/"15 10 \* \* \*"/);
  assert.match(config,/"required"\s*:\s*\["DATABASE_URL"\]/);
});

test('Cloudflare adapter uses native Worker env for core API routes and trusted scheduler',()=>{
  const worker=read('cloudflare/worker.mjs');
  assert.match(worker,/import apiHandler from '\.\.\/api\/index\.js'/);
  assert.match(worker,/databaseHealth\(env\)/);
  assert.match(worker,/getBootstrapData\(env\)/);
  assert.match(worker,/preseasonStatsRoute,env/);
  assert.match(worker,/marketDataRoute,env/);
  assert.match(worker,/runApi\(request,env\)/);
  assert.match(worker,/env\.ASSETS\.fetch\(request\)/);
  assert.match(worker,/executeScheduledJob/);
  assert.match(worker,/syncTitansOfficialAudit/);
  assert.match(worker,/syncEspn/);
  assert.doesNotMatch(worker,/CRON_SECRET\|\|env\.INGEST_SECRET/);
});

test('Cloudflare adapter retains a temporary process.env bridge only for legacy gateway routes',()=>{
  const worker=read('cloudflare/worker.mjs');
  assert.match(worker,/SERVER_BINDINGS/);
  assert.match(worker,/DATABASE_URL/);
  assert.match(worker,/applyRuntimeEnv\(env\)/);
  assert.match(worker,/process\.env\[key\]=String\(value\)/);
  assert.match(worker,/Legacy routes still share the Vercel-compatible gateway/);
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
