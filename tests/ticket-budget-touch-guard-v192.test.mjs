import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const guard=readFileSync(new URL('../tickets-budget-touch-guard-v192.js',import.meta.url),'utf8');
const loader=readFileSync(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/ticket-budget-browser-smoke-v140.py',import.meta.url),'utf8');

test('Ticket budget touch guard loads before budget and actual-cost modules',()=>{
  const guardIndex=loader.indexOf("import './tickets-budget-touch-guard-v192.js';");
  const budgetIndex=loader.indexOf("import './tickets-outing-budget-v134.js';");
  const costIndex=loader.indexOf("import './tickets-actual-cost-compare-v135.js';");
  assert.ok(guardIndex>=0);
  assert.ok(guardIndex<budgetIndex);
  assert.ok(guardIndex<costIndex);
});

test('Ticket budget mobile controls retain the 48px and 16px accessibility floors',()=>{
  assert.match(guard,/@media \(max-width:620px\)/);
  for(const selector of [
    '[data-ticket-outing-game]',
    '[data-ticket-outing-field]',
    '[data-ticket-outing-clear]',
    '[data-ticket-cost-edit]'
  ])assert.ok(guard.includes(selector));
  assert.match(guard,/min-height:48px!important/);
  assert.match(guard,/\[data-ticket-outing-field\]\{font-size:16px!important\}/);
});

test('production smoke keeps exact mobile viewport and touch assertions',()=>{
  assert.match(smoke,/set_css_viewport\(driver,390,844\)/);
  assert.match(smoke,/mobile\['picker'\]\['height'\]<48/);
  assert.match(smoke,/item\['height'\]<48 or item\['fontSize'\]<16/);
  assert.match(smoke,/card\['action'\]\['height'\]<48/);
  assert.match(smoke,/mobile\['clear'\]\['height'\]<48/);
});
