import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const workflow=await readFile(new URL('../.github/workflows/ticket-budget-production.yml',import.meta.url),'utf8');
const browser=await readFile(new URL('../scripts/ticket-budget-browser-smoke-v140.py',import.meta.url),'utf8');

test('Ticket budget production gate follows completed main Cloudflare deploy workflows without trusting the parent conclusion',()=>{
  assert.match(workflow,/name: Titans Ticket Budget Production Gate/);
  assert.match(workflow,/workflow_run:/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/types: \[completed\]/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/github\.event\.workflow_run\.head_branch == 'main'/);
  assert.match(workflow,/WORKFLOW_CONCLUSION: \$\{\{ github\.event\.workflow_run\.conclusion \}\}/);
  assert.doesNotMatch(workflow,/workflow_run\.conclusion == 'success'/);
});

test('gate verifies the real Cloudflare deploy step and checks out the exact deployed SHA',()=>{
  assert.match(workflow,/actions\/runs\/\$\{WORKFLOW_RUN_ID\}\/jobs\?per_page=100/);
  assert.match(workflow,/select\(\.name == "Deploy to Cloudflare"\)/);
  assert.match(workflow,/if \[\[ "\$DEPLOY_OUTCOME" == "success" \]\]/);
  assert.match(workflow,/even if a later unrelated regression changed the parent workflow conclusion/);
  assert.match(workflow,/ref: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.match(workflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/python scripts\/ticket-budget-browser-smoke-v140\.py/);
});

test('browser gate exercises actual checkout inputs and ranking without depending on provider prices',()=>{
  assert.match(browser,/SHORTLIST_KEY='titans:tickets-shortlist-v123'/);
  assert.match(browser,/BUDGET_KEY='titans:tickets-outing-budget-v134'/);
  assert.match(browser,/window\.__TitansTicketOutingBudgetV134/);
  assert.match(browser,/window\.__TitansTicketActualCostCompareV135/);
  assert.match(browser,/titans:ticket-shortlist-change/);
  assert.match(browser,/data-ticket-outing-field/);
  assert.match(browser,/\('checkout',480\.25\)/);
  assert.match(browser,/\('checkout',450\)/);
  assert.match(browser,/\$572\.75/);
  assert.match(browser,/\$505/);
  assert.match(browser,/LOWEST ENTERED OUTING/);
  assert.match(browser,/lower entered outing total did not sort first/);
  assert.doesNotMatch(browser,/ticketmaster|seatgeek|stubhub/i);
});

test('browser gate locks state-aware truth, edit/clear lifecycle, mobile geometry, and cleanup',()=>{
  assert.match(browser,/Ticket Center never guesses fees\./);
  assert.match(browser,/This reference is not used as your checkout total\./);
  assert.match(browser,/No fee, parking, food, or merch estimate is generated\./);
  assert.match(browser,/Starting prices, unentered fees, seat quality, and projected spending are excluded\./);
  assert.match(browser,/require_incomplete/);
  assert.match(browser,/Starting prices are not substituted for checkout\./);
  assert.match(browser,/estimated fee/);
  assert.match(browser,/deal score/);
  assert.match(browser,/input===document\.activeElement/);
  assert.match(browser,/data-ticket-outing-clear/);
  assert.match(browser,/NEEDS CHECKOUT/);
  assert.match(browser,/1\/2 actual totals ready/);
  assert.match(browser,/driver\.set_window_size\(390,844\)/);
  assert.match(browser,/mobileTouchFloor':48/);
  assert.match(browser,/fontSize.*16/);
  assert.match(browser,/document\.documentElement\.scrollWidth>viewport\+3/);
  assert.match(browser,/localStorage\.removeItem\(arguments\[0\]\);localStorage\.removeItem\(arguments\[1\]\)/);
});

test('production gate keeps permissions tight and runtime bounded',()=>{
  assert.match(workflow,/permissions:\n  contents: read\n  actions: read/);
  assert.match(workflow,/timeout-minutes: 10/);
  assert.doesNotMatch(workflow,/contents: write/);
  assert.doesNotMatch(workflow,/pull-requests: write/);
  assert.doesNotMatch(browser,/setInterval\(|while\s*\(true\)/);
});
