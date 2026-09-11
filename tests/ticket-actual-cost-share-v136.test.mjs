import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../tickets-actual-cost-compare-v135.js',import.meta.url),'utf8');
const css=await readFile(new URL('../tickets-actual-cost-compare-v135.css',import.meta.url),'utf8');

test('actual-cost compare exposes an explicit share action only after real checkout exists',()=>{
  assert.match(js,/data-ticket-cost-share/);
  assert.match(js,/Share actual costs/);
  assert.match(js,/ready\.length\?'':'disabled'/);
  assert.match(js,/if\(!items\.some\(item=>item\.ready\)\)/);
  assert.match(js,/Enter at least one actual ticket checkout total before sharing/);
});

test('shared plan contains user-entered actual costs and explicit incomplete states',()=>{
  assert.match(js,/Tennessee Titans saved game actual-cost plan/);
  assert.match(js,/Actual ticket checkout: \$\{money\(item\.checkout\)\}/);
  assert.match(js,/Entered extras: \$\{money\(item\.extras\)\}/);
  assert.match(js,/Outing total: \$\{money\(item\.total\)\}/);
  assert.match(js,/Actual ticket checkout: not entered · outing total not ranked/);
  assert.match(js,/Amounts above are user-entered in Ticket Center/);
  assert.match(js,/Starting prices, unentered fees, seat quality, and projected spending are excluded/);
});

test('actual-cost share text never substitutes reported starting-price values',()=>{
  const shareStart=js.indexOf('function shareText');
  const shareEnd=js.indexOf('function cardMarkup',shareStart);
  const share=js.slice(shareStart,shareEnd);
  assert.doesNotMatch(share,/Current start|before fees|ticketTenxPrice|data-ticket-tenx-price|price\s*\*/i);
  assert.doesNotMatch(share,/deal score|buy now|wait to buy|guaranteed deal/i);
});

test('sharing prefers native share, treats cancellation neutrally, and falls back to clipboard',()=>{
  assert.match(js,/typeof navigator\.share==='function'/);
  assert.match(js,/navigator\.share\(\{title:'Titans actual-cost plan',text,url\}\)/);
  assert.match(js,/error\?\.name==='AbortError'/);
  assert.match(js,/Share canceled\. Your actual-cost plans are unchanged\./);
  assert.match(js,/navigator\.clipboard\?\.writeText/);
  assert.match(js,/Open Ticket Center: \$\{url\}/);
  assert.match(js,/actual-cost plan was copied to your clipboard/);
});

test('actual-cost sharing remains read-only and zero-network',()=>{
  assert.match(js,/titans:tickets-shortlist-v123/);
  assert.match(js,/titans:tickets-outing-budget-v134/);
  assert.doesNotMatch(js,/setJSON|setItem\s*\(/);
  assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|setInterval\s*\(/);
});

test('share action remains accessible on desktop and phone layouts',()=>{
  assert.match(js,/aria-label="Share saved game actual-cost plan"/);
  assert.match(js,/data-ticket-cost-status role="status" aria-live="polite"/);
  assert.match(css,/tickets-cost-v135-panel-footer button\{min-height:44px/);
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/tickets-cost-v135-panel-footer button\{min-height:48px;width:100%\}/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(forced-colors:active\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
