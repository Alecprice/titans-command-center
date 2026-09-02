import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('Ticket production browser gate exercises Finalists mode and group budget',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/def advanced_snapshot\(driver\):/);
  assert.match(smoke,/data-ticket-finalists-v127/);
  assert.match(smoke,/data-ticket-finalists-view=\\?"saved\\?"/);
  assert.match(smoke,/Finalists only leaked unsaved games/);
  assert.match(smoke,/data-ticket-finalists-budget=\\?"300\\?"/);
  assert.match(smoke,/groupBudgetVerified/);
  assert.match(smoke,/finalistsOnlyVerified/);
});

test('Ticket production browser gate exercises factual Signal Lens focus',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/data-ticket-signal-lens-v128/);
  assert.match(smoke,/not a deal score or buy\/wait recommendation/);
  assert.match(smoke,/data-ticket-signal-focus/);
  assert.match(smoke,/Signal Lens has no actionable factual signal/);
  assert.match(smoke,/signalLensVerified/);
  assert.match(smoke,/signalFocusKey/);
});

test('Signal focus proves every Ticket filter layer is reset before focusing the matchup',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/data-ticket-filter=\\?"away\\?"/);
  assert.match(smoke,/data-ticket-tenx-budget=\\?"75\\?"/);
  assert.match(smoke,/data-ticket-filter=\\?"all\\?"/);
  assert.match(smoke,/data-ticket-tenx-budget=\\?"all\\?"/);
  assert.match(smoke,/data-ticket-finalists-view=\\?"all\\?"/);
  assert.match(smoke,/data-ticket-finalists-budget=\\?"all\\?"/);
  assert.match(smoke,/card\.contains\(document\.activeElement\)/);
});

test('Finalists and Signal Lens are hard-gated for phone geometry and touch size',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/short_finalists=.*height.*<44/s);
  assert.match(smoke,/short_signals=.*height.*<44/s);
  assert.match(smoke,/Signal Lens card escapes mobile viewport/);
  assert.match(smoke,/driver\.set_window_size\(390,844\)/);
  assert.match(smoke,/mobileViewportChecked/);
});

test('Shortlist cleanup returns Finalists mode to a safe disabled All-games state',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/saved\?\.disabled/);
  assert.match(smoke,/data-ticket-finalists-view=\\?"all\\?"/);
  assert.match(smoke,/clearLifecycle/);
});
