import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');
const preseason=fs.readFileSync(new URL('../src/preseason-api.mjs',import.meta.url),'utf8');
const production=fs.readFileSync(new URL('../scripts/production-regression.mjs',import.meta.url),'utf8');

test('Data API is D1-first with a dated bundled fallback and no request-time warehouse path',()=>{
  assert.match(worker,/function auditedBootstrapFallback/);
  assert.match(worker,/mode:'audited-fallback'/);
  assert.match(worker,/databaseAvailable:false/);
  assert.match(worker,/fallback:\{active:true/);
  assert.match(worker,/const snapshot=await readD1Bootstrap\(env\)/);
  assert.match(worker,/if\(snapshot\)return jsonResponse\(snapshot,200,headers\)/);
  assert.match(worker,/readD1Bootstrap\(env,\{allowExpired:true,reason\}/);
  assert.match(worker,/auditedBootstrapFallback\(reason\)/);
  assert.match(worker,/writeD1Bootstrap\(env,fallback,\{source:'audited-fallback'\}\)/);
  assert.match(worker,/getAuditedTeamContext\(null\)/);
  assert.match(worker,/status:primaryReady\?'healthy':'degraded'/);
  assert.match(worker,/provider:'cloudflare-d1'/);
  assert.match(worker,/'Cache-Control':'no-store'/);
  assert.doesNotMatch(worker,/DATABASE_URL|getBootstrapData\(|getSql\(|databaseHealth\(|source:'neon-bootstrap'/);
});

test('database fallback uses the current Aug 27 audited roster everywhere',()=>{
  assert.match(worker,/roster as fallbackRoster/);
  assert.match(preseason,/auditedRoster20260827, ROSTER_AUDIT_DATE.*roster-audit-20260827\.mjs/);
  assert.match(preseason,/let roster=auditedRoster20260827\.map/);
  assert.match(preseason,/serving the dated \$\{auditedRoster20260827\.length\}-player/);
  assert.doesNotMatch(preseason,/auditedRoster20260824/);
  assert.doesNotMatch(preseason,/96-player Aug\. 24/);
});

test('production gate accepts degraded only when audited fallback truth is proven',()=>{
  assert.match(production,/appStatus==='healthy'\|\|appStatus==='degraded'/);
  assert.match(production,/if\(appStatus==='degraded'\)assert\(!databaseOk/);
  assert.match(production,/data\.body\?\.databaseAvailable===false/);
  assert.match(production,/data\.body\?\.fallback\?\.active===true/);
  assert.match(production,/Stats Lab roster count .* does not match Data API roster count/);
});
