import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('fan, player, team-room and responsive polish assets are loaded by the app shell',()=>{const index=read('index.html');for(const asset of ['fan-polish.css','fan-polish.js','player-polish.css','player-polish.js','team-room.css','team-room.js','audit-responsive.css'])assert.match(index,new RegExp(asset.replace('.','\\.')));});
test('service worker keeps API responses out of cache and versions the current shell',()=>{const sw=read('sw.js');assert.match(sw,/startsWith\('\/api\/'\)/);assert.match(sw,/audit-responsive\.css/);assert.match(sw,/titans-cc-brand-2026-v\d+/);});
test('rich player pages use the server player endpoint',()=>{const player=read('player-polish.js');assert.match(player,/\/api\/player\?id=/);assert.match(player,/does not mean the player has zero production/i);assert.match(player,/not a medical clearance/i);});
test('warehouse UI distinguishes missing ingest from real zero values',()=>{const fan=read('fan-polish.js');assert.match(fan,/awaiting ingest/i);assert.match(fan,/No stored market snapshot/i);assert.match(fan,/No injury-report rows loaded/i);});
test('v0.6 database adapter uses current live schema columns',()=>{const db=read('src/db.mjs');assert.match(db,/rs\.captured_at/);assert.match(db,/roster_status/);assert.match(db,/transaction_date/);assert.doesNotMatch(db,/transacted_at/);});
test('responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint',()=>{const css=read('audit-responsive.css');assert.match(css,/min-width:760px[^]*max-width:1100px/);assert.match(css,/max-width:390px/);assert.match(css,/min-width:1440px/);assert.match(css,/legacy-strip:not\(\[data-polished\]\)/);});
