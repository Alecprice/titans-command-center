import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const player=fs.readFileSync(new URL('../src/player-api.mjs',import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');

test('Cloudflare player enrichment extracts only needed roster JSON scalars',()=>{
  assert.doesNotMatch(player,/select\s+rs\.raw_payload\s*,/i);
  for(const field of ['college','age','height','weight','source_url','source','audited_on']){
    assert.match(player,new RegExp(`raw_payload->>'${field}'`));
  }
  assert.match(player,/s-maxage=900, stale-while-revalidate=21600/);
});

test('production worker routes player reads through the scalar-only handler',()=>{
  assert.match(worker,/import \{playerProfileRoute\} from '\.\.\/src\/player-api\.mjs'/);
  assert.match(worker,/cachedQueryAdapterData\(request,route,playerProfileRoute,env,ctx,\['id'\]\)/);
});
