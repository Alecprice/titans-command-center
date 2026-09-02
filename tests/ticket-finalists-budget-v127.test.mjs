import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Ticket finalists layer is loaded after the existing TENX compare stack',async()=>{
  const fallback=await read('tickets-price-fallback-v58.js');
  assert.match(fallback,/import '\.\/tickets-tenx-v123\.js';/);
  assert.match(fallback,/import '\.\/tickets-trend-v124\.js';/);
  assert.match(fallback,/import '\.\/tickets-compare-v125\.js';/);
  assert.match(fallback,/import '\.\/tickets-finalists-v127\.js';/);
  assert.ok(fallback.indexOf("tickets-finalists-v127.js")>fallback.indexOf("tickets-compare-v125.js"));
});

test('Finalists mode filters only against the existing saved shortlist',async()=>{
  const js=await read('tickets-finalists-v127.js');
  assert.match(js,/SHORTLIST_KEY='titans:tickets-shortlist-v123'/);
  assert.match(js,/data-ticket-finalists-view=\"saved\"/);
  assert.match(js,/state\.view==='all'\|\|saved\.has\(item\.key\)/);
  assert.match(js,/if\(state\.view==='saved'&&!saved\.size\)state\.view='all'/);
  assert.match(js,/savedButton\.disabled=savedCount===0/);
});

test('Group budget uses reported starting price times selected party size without fee invention',async()=>{
  const js=await read('tickets-finalists-v127.js');
  assert.match(js,/data-ticket-finalists-budget=\"200\"/);
  assert.match(js,/data-ticket-finalists-budget=\"300\"/);
  assert.match(js,/data-ticket-finalists-budget=\"500\"/);
  assert.match(js,/item\.price\*party<=totalBudget/);
  assert.match(js,/current reported starting price × selected party size/);
  assert.match(js,/Checkout fees and seat quality are never estimated/);
  assert.doesNotMatch(js,/feeEstimate|estimatedFee|seatScore|dealScore/i);
});

test('Finalists mode composes with the existing per-ticket budget instead of replacing it',async()=>{
  const js=await read('tickets-finalists-v127.js');
  assert.match(js,/data-ticket-tenx-budget\]\[aria-pressed=\"true\"\]/);
  assert.match(js,/const baseOk=baseBudget==null\|\|\(item\.price!=null&&item\.price<=baseBudget\)/);
  assert.match(js,/const groupOk=totalBudget==null\|\|\(item\.price!=null&&item\.price\*party<=totalBudget\)/);
  assert.match(js,/const show=baseOk&&groupOk&&viewOk/);
});

test('View offers clears finalists and group-budget filters before focusing a live matchup',async()=>{
  const js=await read('tickets-finalists-v127.js');
  assert.match(js,/function resetForOfferReveal\(center\)/);
  assert.match(js,/state\.view='all'/);
  assert.match(js,/state\.groupBudget='all'/);
  assert.match(js,/target\.closest\('\[data-ticket-compare-focus\]'\)/);
  assert.match(js,/Showing all games so the saved matchup and its live offers stay visible/);
});

test('Finalists layer stays additive and makes no network or persistence writes',async()=>{
  const js=await read('tickets-finalists-v127.js');
  assert.doesNotMatch(js,/\bfetch\s*\(/);
  assert.doesNotMatch(js,/apiJson\s*\(/);
  assert.doesNotMatch(js,/setJSON\s*\(/);
  assert.doesNotMatch(js,/localStorage\.setItem/);
  assert.match(js,/storage\?\.getJSON/);
});

test('Finalists controls keep mobile touch targets and small-screen layout',async()=>{
  const css=await read('tickets-finalists-v127.css');
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/\.tickets-finalists-v127 button\{min-height:44px/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
