import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');
const preseason=fs.readFileSync(new URL('../src/preseason-api.mjs',import.meta.url),'utf8');
const production=fs.readFileSync(new URL('../scripts/production-regression.mjs',import.meta.url),'utf8');

test('Data API keeps Neon health visible while D1 and audited data provide labeled fallback paths',()=>{
  assert.match(worker,/function auditedBootstrapFallback/);
  assert.match(worker,/mode:'audited-fallback'/);
  assert.match(worker,/databaseAvailable:false/);
  assert.match(worker,/fallback:\{active:true/);
  assert.match(worker,/const snapshot=await readD1Bootstrap\(env\)/);
  assert.match(worker,/if\(snapshot\)return jsonResponse\(snapshot,200,headers\)/);
  assert.match(worker,/data=await getBootstrapData\(env\)/);
  assert.match(worker,/readD1Bootstrap\(env,\{allowExpired:true/);
  assert.match(worker,/auditedBootstrapFallback\(data\?\.error\|\|'Live database unavailable'\)/);
  assert.match(worker,/writeD1Bootstrap\(env,fallback,\{source:'audited-fallback'\}\)/);
  assert.match(worker,/getAuditedTeamContext\(null\)/);
  assert.doesNotMatch(worker,/if\(!data\.configured\)return jsonResponse/);
  assert.doesNotMatch(worker,/if\(!data\.ok\)return jsonResponse\(data,503/);
  assert.match(worker,/status:db\.ok\?'healthy':'degraded'/);
  assert.match(worker,/'Cache-Control':'no-store'/);
});

test('database fallback uses the current Aug 27 audited roster everywhere',()=>{
  assert.match(worker,/roster as fallbackRoster/);
  assert.match(preseason,/auditedRoster20260827, ROSTER_AUDIT_DATE.*roster-audit-20260827\.mjs/);
  assert.match(preseason,/let roster=auditedRoster20260827\.map/);
  assert.match(preseason,/serving the dated \$\{auditedRoster20260827\.length\}-player/);
  assert.doesNotMatch(preseason,/auditedRoster20260824/);
  assert.doesNotMatch(preseason,/96-player Aug\. 24/);
});

test('production gate accepts degraded only when fallback truth is proven',()=>{
  assert.match(production,/appStatus==='healthy'\|\|appStatus==='degraded'/);
  assert.match(production,/if\(appStatus==='degraded'\)assert\(!databaseOk/);
  assert.match(production,/Degraded Neon health must serve the explicit audited Data API fallback/);
  assert.match(production,/data\.body\?\.databaseAvailable===false/);
  assert.match(production,/data\.body\?\.fallback\?\.active===true/);
  assert.match(production,/Degraded Neon health must keep Stats Lab on the audited fallback roster/);
  assert.match(production,/Stats Lab roster count .* does not match Data API roster count/);
});
