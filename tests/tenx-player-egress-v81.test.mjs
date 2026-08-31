import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const player=fs.readFileSync(new URL('../src/player-api.mjs',import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');

test('public Player Profile reads only materialized D1 snapshots',()=>{
  assert.match(player,/apiSnapshotKey\('player-profile:v1',\{id:normalizedId\}\)/);
  assert.match(player,/readApiSnapshot\(env,snapshotKey\)/);
  assert.match(player,/allowExpired:true/);
  assert.match(player,/s-maxage=900, stale-while-revalidate=21600/);
  assert.match(player,/Cache-Control','no-store/);
  assert.doesNotMatch(player,/from '\.\/db\.mjs'|getPlayerProfile|getSql|writeApiSnapshot|DATABASE_URL|raw_payload|roster_snapshots|player_game_stats|injury_reports|market_odds|neon/i);
});

test('production worker keeps Player reads query-aware and isolated to the D1-only handler',()=>{
  assert.match(worker,/import \{playerProfileRoute\} from '\.\.\/src\/player-api\.mjs'/);
  assert.match(worker,/cachedQueryAdapterData\(request,route,playerProfileRoute,env,ctx,\['id'\]\)/);
});
