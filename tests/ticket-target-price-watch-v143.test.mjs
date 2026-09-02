import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const loader=await readFile(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');
const js=await readFile(new URL('../tickets-target-price-watch-v143.js',import.meta.url),'utf8');
const css=await readFile(new URL('../tickets-target-price-watch-v143.css',import.meta.url),'utf8');

test('Target Price Watch is additive to the Ticket runtime chain',()=>{
  assert.match(loader,/import '\.\/tickets-target-price-watch-v143\.js';/);
  assert.match(js,/window\.__TitansTicketTargetPriceWatchV143/);
  assert.match(js,/SHORTLIST_KEY='titans:tickets-shortlist-v123'/);
  assert.match(js,/TARGET_KEY='titans:tickets-target-price-v143'/);
  assert.match(js,/MAX_TARGETS=3/);
});

test('targets are bounded browser-local values tied only to currently saved matchups',()=>{
  assert.match(js,/if\(!Number\.isFinite\(parsed\)\|\|parsed<1\|\|parsed>MAX_AMOUNT\)return null/);
  assert.match(js,/const allowed=new Set\(saved\.map\(item=>item\.key\)\)/);
  assert.match(js,/for\(const \[key,value\] of Object\.entries\(source\)\)/);
  assert.match(js,/if\(!allowed\.has\(key\)\)continue/);
  assert.match(js,/if\(Object\.keys\(targets\)\.length>=MAX_TARGETS\)break/);
  assert.match(js,/JSON\.stringify\(original\)!==JSON\.stringify\(clean\.targets\)/);
  assert.match(js,/delete store\.targets\[key\]/);
  assert.doesNotMatch(js,/title:.*targets|date:.*targets|price:.*targets/);
});

test('target state is factual current-starting-price math without recommendation or fee inference',()=>{
  assert.match(js,/badge:'TARGET MET'/);
  assert.match(js,/badge:'ABOVE TARGET'/);
  assert.match(js,/badge:'PRICE UNAVAILABLE'/);
  assert.match(js,/Current reported start \$\{money\(current\)\} per ticket is/);
  assert.match(js,/Targets compare current reported starting prices per ticket only\. Checkout fees, seat quality, and future prices are not inferred\./);
  assert.doesNotMatch(js,/buy now/i);
  assert.doesNotMatch(js,/wait to buy/i);
  assert.doesNotMatch(js,/deal score/i);
  assert.doesNotMatch(js,/estimated fee|estimate fees/i);
});

test('Target Price Watch never claims background monitoring or creates provider traffic',()=>{
  assert.match(js,/Targets are checked only while Ticket Center is open or refreshed/);
  assert.match(js,/does not monitor prices or send background alerts while closed/);
  assert.match(js,/It will be checked only when Ticket Center is open or refreshed/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
  assert.doesNotMatch(js,/XMLHttpRequest|WebSocket|EventSource|setInterval\s*\(/);
  assert.doesNotMatch(js,/apiJson\s*\(|api\/tickets|ticketmaster|seatgeek|stubhub/i);
});

test('Target Price Watch composes with shortlist and refresh lifecycle without owning another poller',()=>{
  assert.match(js,/app\.addEventListener\('titans:ticket-shortlist-change',schedule\)/);
  assert.match(js,/event\.key===SHORTLIST_KEY\|\|event\.key===TARGET_KEY/);
  assert.match(js,/target\.closest\('\[data-ticket-refresh\]'\)\)requestAnimationFrame\(schedule\)/);
  assert.match(js,/new MutationObserver\(schedule\)\.observe\(app,\{childList:true,subtree:false\}\)/);
  assert.match(js,/runtime\?\.onRoute\?\.\(schedule,\{immediate:true\}\)/);
  assert.match(js,/runtime\?\.onAppRender\?\.\(schedule,\{immediate:true\}\)/);
  assert.doesNotMatch(js,/setTimeout\s*\(|setInterval\s*\(/);
});

test('inputs and controls remain phone-safe and accessible',()=>{
  assert.match(js,/inputmode="decimal"/);
  assert.match(js,/Target starting price per ticket/);
  assert.match(js,/aria-label="Target reported starting price per ticket for/);
  assert.match(js,/role="status" aria-live="polite"/);
  assert.match(css,/font-size:16px/);
  assert.match(css,/\.tickets-target-v143-money input\{[^}]*min-height:44px/);
  assert.match(css,/\.tickets-target-v143 button\{min-height:44px/);
  assert.match(css,/@media\(max-width:620px\)[\s\S]*\.tickets-target-v143-money input,\.tickets-target-v143 button\{min-height:48px\}/);
  assert.match(css,/\.tickets-target-v143-grid\{grid-template-columns:1fr\}/);
  assert.match(css,/@media\(forced-colors:active\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('clearing targets does not clear the saved matchup shortlist',()=>{
  assert.match(js,/writeStore\(\{targets:\{\}\}\)/);
  assert.match(js,/All saved target prices cleared\. Your matchup shortlist is unchanged\./);
  assert.doesNotMatch(js,/setJSON\?\.\(SHORTLIST_KEY/);
});
