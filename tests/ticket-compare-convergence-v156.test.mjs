import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('saved compare convergence owns state-to-view recovery without polling',async()=>{
  const source=await read('tickets-compare-cache-bridge-v141.js');

  assert.match(source,/version:'v156'/);
  assert.match(source,/__TitansTicketCompareConvergenceV156/);
  assert.match(source,/titans:tickets-shortlist-v123/);
  assert.match(source,/data-ticket-tenx-saved-count/);
  assert.match(source,/attributeFilter:\['data-ticket-tenx-saved-count'\]/);
  assert.match(source,/new MutationObserver/);
  assert.match(source,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.match(source,/data-ticket-compare-v125/);
  assert.match(source,/tickets-compare-v125-card/);
  assert.match(source,/data-ticket-compare-owner="v156"/);
  assert.match(source,/Party totals are starting price × ticket count, before fees/);
  assert.match(source,/Seat quality and checkout fees are not inferred/);
  assert.match(source,/data-ticket-compare-share/);
  assert.match(source,/data-ticket-compare-focus/);
  assert.match(source,/data-ticket-tenx-save/);

  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/\bsetInterval\s*\(/);
  assert.doesNotMatch(source,/\bsetTimeout\s*\(/);
});

test('saved compare convergence remains a direct, release-verified canonical shell asset',async()=>{
  const [html,sw,regression]=await Promise.all([
    read('index.html'),
    read('sw.js'),
    read('scripts/custom-domain-regression.mjs')
  ]);

  const aggregate=html.indexOf('/tickets-price-fallback-v58.js?v=1');
  const bridge=html.indexOf('/tickets-compare-cache-bridge-v141.js');
  assert.ok(aggregate>=0,'Ticket aggregate module must remain in the shell');
  assert.ok(bridge>aggregate,'Convergence owner must load directly after the Ticket aggregate');
  assert.match(sw,/['"]\/tickets-compare-cache-bridge-v141\.js['"]/);
  assert.match(regression,/['"]\/tickets-compare-cache-bridge-v141\.js['"]/);
  assert.match(regression,/pair\.canonical\.body!==body/);
  assert.match(regression,/Canonical shell did not match checked-out release or rollback shell was unavailable/);
});
