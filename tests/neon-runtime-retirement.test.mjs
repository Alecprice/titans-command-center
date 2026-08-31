import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const exists=path=>fs.existsSync(new URL(`../${path}`,import.meta.url));

test('retired Neon runtime adapter and package dependency stay removed',()=>{
  const pkg=JSON.parse(read('package.json'));
  assert.equal(exists('src/db.mjs'),false);
  assert.equal(pkg.dependencies?.['@neondatabase/serverless'],undefined);
  assert.doesNotMatch(read('api/index.js'),/db\.mjs|getSql\(|hasDatabase\(|databaseHealth\(/);
  assert.doesNotMatch(read('cloudflare/worker.mjs'),/db\.mjs|getSql\(|hasDatabase\(|databaseHealth\(|@neondatabase\/serverless/);
  assert.doesNotMatch(read('src/ingest.mjs'),/db\.mjs|getSql\(|hasDatabase\(|databaseHealth\(|@neondatabase\/serverless/);
});

test('D1 remains the production data authority while Neon Auth stays isolated',()=>{
  const worker=read('cloudflare/worker.mjs');
  const account=read('src/account-api.mjs');
  const config=JSON.parse(read('wrangler.jsonc'));
  assert.match(worker,/TITANS_DB|hasD1\(env\)/);
  assert.ok(config.d1_databases?.some(entry=>entry.binding==='TITANS_DB'&&entry.database_name==='titans-command-center'));
  assert.match(account,/\.neonauth\./);
  assert.doesNotMatch(account,/DATABASE_URL/);
});
