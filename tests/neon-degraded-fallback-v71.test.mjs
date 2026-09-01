import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');
const preseason=fs.readFileSync(new URL('../src/preseason-api.mjs',import.meta.url),'utf8');
const production=fs.readFileSync(new URL('../scripts/production-regression.mjs',import.meta.url),'utf8');

test('Data API is D1-first with a dated bundled fallback and no request-time warehouse path',()=>{
  const dataBlock=worker.match(/async function nativeData\([\s\S]*?\n\}/)?.[0]||'';
  assert.match(worker,/function auditedBootstrapFallback/);
  assert.match(worker,/mode:'audited-fallback'/);
  assert.match(worker,/databaseAvailable:false/);
  assert.match(worker,/fallback:\{active:true/);
  assert.match(dataBlock,/const snapshot=await readD1Bootstrap\(env\)/);
  assert.match(dataBlock,/if\(snapshot\)return jsonResponse\(snapshot,200,headers\)/);
  assert.doesNotMatch(dataBlock,/readD1Bootstrap\(env,\{allowExpired:true/);
  assert.match(dataBlock,/auditedBootstrapFallback\(reason\)/);
  assert.match(dataBlock,/writeD1Bootstrap\(env,fallback,\{source:'audited-fallback'\}\)/);
  assert.match(dataBlock,/getAuditedTeamContext\(null\)/);
  assert.match(worker,/status:primaryReady\?'healthy':'degraded'/);
  assert.match(worker,/provider:'cloudflare-d1'/);
  assert.match(worker,/'Cache-Control':'no-store'/);
  assert.doesNotMatch(worker,/DATABASE_URL|getBootstrapData\(|getSql\(|databaseHealth\(|source:'neon-bootstrap'/);
});

test('database fallback uses the current Aug 31 audited roster everywhere',()=>{
  assert.match(worker,/roster as fallbackRoster/);
  assert.match(preseason,/auditedRoster20260831, ROSTER_AUDIT_DATE.*roster-audit-20260831\.mjs/);
  assert.match(preseason,/let roster=auditedRoster20260831\.map/);
  assert.match(preseason,/serving the dated \$\{auditedRoster20260831\.length\}-player/);
  assert.match(preseason,/getD1Snapshot\(env,BOOTSTRAP_SNAPSHOT_KEY\)/);
  assert.doesNotMatch(preseason,/getD1Snapshot\(env,BOOTSTRAP_SNAPSHOT_KEY,\{allowExpired:true\}\)/);
  assert.doesNotMatch(preseason,/auditedRoster20260827|auditedRoster20260824/);
});

test('production gate accepts degraded only when audited fallback truth is proven',()=>{
  assert.match(production,/appStatus==='healthy'\|\|appStatus==='degraded'/);
  assert.match(production,/if\(appStatus==='degraded'\)\{assert\(!databaseOk/);
  assert.match(production,/snapshotFresh===false/);
  assert.match(production,/data\.body\?\.databaseAvailable===false/);
  assert.match(production,/data\.body\?\.fallback\?\.active===true/);
  assert.match(production,/Stats Lab roster count .* does not match Data API roster count/);
});
