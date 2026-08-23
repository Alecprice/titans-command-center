import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scanner=fs.readFileSync(new URL('../scripts/check-secrets.mjs',import.meta.url),'utf8');

test('secret scanner explicitly includes env example files',()=>{
  assert.match(scanner,/name==='\.env\.example'/);
  assert.match(scanner,/shouldScan\(ent\.name\)/);
  assert.match(scanner,/ent\.name!=='.env\.example'/);
});

test('secret scanner covers common credential families beyond project-specific keys',()=>{
  for(const label of [
    'GitHub classic token',
    'GitHub fine-grained token',
    'AWS access key id',
    'private key material',
    'literal bearer credential',
    'hard-coded Cloudflare API token',
    'hard-coded ingest secret'
  ])assert.match(scanner,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
});

test('secret scanner still covers database and configured odds-provider credentials',()=>{
  for(const label of ['database credential','Neon password token','hard-coded PropLine key','hard-coded Odds-API.io key'])assert.match(scanner,new RegExp(label));
});
