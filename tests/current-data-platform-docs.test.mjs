import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('current contributor docs identify Cloudflare D1 as production data authority',()=>{
  const readme=read('README.md');
  const deploy=read('docs/CLOUDFLARE_DEPLOY.md');
  const migration=read('docs/CLOUDFLARE_D1_MIGRATION.md');
  assert.match(readme,/Cloudflare D1 is the production data authority/i);
  assert.match(readme,/TITANS_DB/);
  assert.match(deploy,/Cloudflare D1 is the production data authority/i);
  assert.match(deploy,/TITANS_DB/);
  assert.match(migration,/Production data cutover is complete/i);
  assert.match(migration,/TITANS_DB/);
  assert.doesNotMatch(readme,/Neon (?:Postgres|PostgreSQL) is the production/i);
  assert.doesNotMatch(readme,/requires `?DATABASE_URL`? as a Worker secret/i);
  assert.doesNotMatch(deploy,/add the existing Neon connection string as a Worker secret/i);
});

test('retired warehouse configuration cannot return as a normal environment requirement',()=>{
  const env=read('.env.example');
  const pkg=read('package.json');
  const worker=read('cloudflare/worker.mjs');
  const productionWorker=read('cloudflare/production-worker.mjs');
  assert.doesNotMatch(env,/^DATABASE_URL\s*=/m);
  assert.doesNotMatch(pkg,/@neondatabase\/serverless/);
  assert.doesNotMatch(worker,/from ['"]\.\/\.\.\/src\/db\.mjs['"]/);
  assert.doesNotMatch(productionWorker,/process\.env\.DATABASE_URL\s*=/);
});

test('Neon documentation is historical and keeps auth separate from retired Postgres',()=>{
  const neon=read('docs/NEON.md');
  const deployment=read('docs/DEPLOYMENT.md');
  const precutover=read('docs/PRECUTOVER.md');
  assert.match(neon,/^# Retired Neon warehouse/m);
  assert.match(neon,/Neon Auth is separate/i);
  assert.match(neon,/not\*\* part of the Titans Command Center production data runtime/i);
  assert.match(deployment,/Cloudflare D1 persistence/i);
  assert.match(deployment,/DATABASE_URL.*not a current deployment variable/i);
  assert.match(precutover,/Historical migration record/i);
  assert.match(precutover,/Cloudflare D1 as the production data authority/i);
});
