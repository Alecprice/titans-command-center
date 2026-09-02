import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const workflow=await readFile(new URL('../.github/workflows/ticket-observed-drops-production.yml',import.meta.url),'utf8');
const browser=await readFile(new URL('../scripts/ticket-observed-drops-browser-smoke-v141.py',import.meta.url),'utf8');
const runtime=await readFile(new URL('../tickets-tenx-v123.js',import.meta.url),'utf8');

test('Observed Drops production gate follows real completed main deploys and exact deployed SHA',()=>{
  assert.match(workflow,/name: Titans Ticket Observed Drops Production Gate/);
  assert.match(workflow,/workflow_run:/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/types: \[completed\]/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/github\.event\.workflow_run\.head_branch == 'main'/);
  assert.match(workflow,/select\(\.name == "Deploy to Cloudflare"\)/);
  assert.match(workflow,/if \[\[ "\$DEPLOY_OUTCOME" == "success" \]\]/);
  assert.match(workflow,/ref: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.doesNotMatch(workflow,/workflow_run\.conclusion == 'success'/);
});

test('production browser gate exercises shipped v123 and v124 modules through a deterministic local fixture',()=>{
  assert.match(browser,/window\.__TitansTicketTenxV123/);
  assert.match(browser,/window\.__TitansTicketTrendV124/);
  assert.match(browser,/data-smoke-fixture="alpha"/);
  assert.match(browser,/data-smoke-fixture="bravo"/);
  assert.match(browser,/data-smoke-fixture="charlie"/);
  assert.match(browser,/window\.dispatchEvent\(new Event\('hashchange'\)\)/);
  assert.match(browser,/StorageEvent\('storage'/);
  assert.match(browser,/MEMORY_KEY='titans:tickets-price-memory-v124'/);
  assert.doesNotMatch(browser,/fetch\(|urlopen|requests\.|axios|XMLHttpRequest|WebSocket/);
});

test('positive path verifies two local drops and largest dollar drop sorting without hiding games',()=>{
  assert.match(browser,/price:160/);
  assert.match(browser,/price:100/);
  assert.match(browser,/price:140/);
  assert.match(browser,/price:120/);
  assert.match(browser,/Observed drops \(2\)/);
  assert.match(browser,/ticketObservedDrop==='60'/);
  assert.match(browser,/ticketObservedDrop==='20'/);
  assert.match(browser,/alpha\|bravo\|charlie/);
  assert.match(browser,/any\(card\['hidden'\] for card in state\['cards'\]\)/);
  assert.match(browser,/largest price drops observed in this browser first/);
  assert.match(browser,/local history, not marketplace-wide/);
});

test('memory reset verifies automatic Cheapest fallback and removes drop diagnostics',()=>{
  assert.match(browser,/JSON\.stringify\(\{events:\{\},updatedAt:Date\.now\(\)\}\)/);
  assert.match(browser,/button\?\.disabled/);
  assert.match(browser,/cheapest\?\.getAttribute\('aria-pressed'\)==='true'/);
  assert.match(browser,/!card\.dataset\.ticketObservedDrop&&!card\.dataset\.ticketObservedDropPct/);
  assert.match(browser,/charlie\|alpha\|bravo/);
  assert.match(browser,/resetFallback':'Cheapest'/);
  assert.match(runtime,/if\(state\.sort==='drops'&&!dropCount\)state\.sort='price'/);
});

test('mobile gate uses an exact 390px CSS viewport and keeps sort controls touch safe',()=>{
  assert.match(browser,/Emulation\.setDeviceMetricsOverride/);
  assert.match(browser,/exact_viewport\(driver,390,844\)/);
  assert.match(browser,/state\['viewport'\]!=390 or state\['innerWidth'\]!=390/);
  assert.match(browser,/state\['dropButton'\]\['height'\]<44/);
  assert.match(browser,/len\(set\(tops\)\)!=3/);
  assert.match(browser,/state\['overflow'\]/);
});

test('release gate is read-only server-side, bounded, and cleans browser-local fixture state',()=>{
  assert.match(workflow,/permissions:\n  contents: read\n  actions: read/);
  assert.match(workflow,/timeout-minutes: 10/);
  assert.match(workflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/python scripts\/ticket-observed-drops-browser-smoke-v141\.py/);
  assert.doesNotMatch(workflow,/contents: write|pull-requests: write/);
  assert.match(browser,/localStorage\.removeItem\(arguments\[0\]\)/);
  assert.doesNotMatch(browser,/setInterval\(|while\s*\(true\)/);
});
