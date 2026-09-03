import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/runtime-365-browser-smoke.py',import.meta.url),'utf8');
const mode=readFileSync(new URL('../mode-365-v19.js',import.meta.url),'utf8');

test('365 product keeps full and Premium-integrated Season Lens ownership distinct',()=>{
  assert.match(mode,/desiredMode=\(\)=>document\.querySelector\('\.v14-now'\)\?'season-lens':'full'/);
  assert.match(mode,/regular:\['standings','changes'\]/);
  assert.match(mode,/section\.dataset\.v19Mode=integrated\?'season-lens':'full'/);
});

test('production smoke accepts only the current mode-specific card counts',()=>{
  assert.match(smoke,/mode==='season-lens'\?premiumPresent&&cards\.length===2:mode==='full'&&!premiumPresent&&cards\.length===4/);
  assert.match(smoke,/expected=2 if mode=='season-lens' else 4 if mode=='full' else None/);
  assert.doesNotMatch(smoke,/cards\.length!==4/);
  assert.doesNotMatch(smoke,/len\(cards\)!=4/);
});

test('production smoke enforces Premium and Season Lens ownership in both directions',()=>{
  assert.match(smoke,/if premium and mode!='season-lens'/);
  assert.match(smoke,/if not premium and mode!='full'/);
  assert.match(smoke,/premiumPresent:Boolean\(document\.querySelector\('\.v14-now'\)\)/);
});

test('regular-season readiness follows the active 365 ownership mode without weakening truth',()=>{
  assert.match(smoke,/changes:row\('WHAT CHANGED\?'\)/);
  assert.match(smoke,/if mode=='season-lens': required=\('standings','changes'\)/);
  assert.match(smoke,/elif mode=='full': required=\('availability','standings'\)/);
  assert.match(smoke,/Missing report data is not treated as an all-clear|all-clear/);
});

test('365 readiness keeps the existing 15 second SLA and exposes actionable timeout diagnostics',()=>{
  assert.match(smoke,/def wait_365_panel\(driver,timeout=15\):/);
  assert.match(smoke,/except TimeoutException as exc:/);
  assert.match(smoke,/365 panel failed mode\/count readiness/);
  for(const field of ['mode','cards','premiumPresent','visible'])assert.match(smoke,new RegExp(field));
});
