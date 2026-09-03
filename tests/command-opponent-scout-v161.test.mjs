import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {WEEK1_OPPONENT_INTEL_2026} from '../src/week1-opponent-intel-2026.mjs';

const read=name=>fs.readFileSync(new URL(`../${name}`,import.meta.url),'utf8');
const scout=read('command-opponent-scout-v161.js');
const guard=read('command-route-guard-v15.js');
const css=read('command-intelligence-addons-v15.css');
const build=read('scripts/build-cloudflare.mjs');
const sw=read('sw.js');

test('Command opponent scout imports the canonical audited source instead of duplicating facts',()=>{
  assert.match(scout,/from '\.\/src\/week1-opponent-intel-2026\.mjs'/);
  assert.match(scout,/WEEK1_OPPONENT_INTEL_2026/);
  assert.match(scout,/opponentIntelSourceTruth/);
  assert.doesNotMatch(scout,/Geno Smith|Breece Hall|Blake Grupe|Jason Sanders|Kohl Levao/);
});

test('Command opponent scout is route and date scoped to the Week 1 intelligence desk',()=>{
  assert.match(scout,/route\(\)!=='command'/);
  assert.match(scout,/withinWeek1Window\(\)/);
  assert.match(scout,/WEEK1_WINDOW_MS=21\*24\*60\*60\*1000/);
  assert.match(scout,/POSTGAME_GRACE_MS=8\*60\*60\*1000/);
  assert.match(scout,/kickoff-WEEK1_WINDOW_MS/);
  assert.match(scout,/kickoff\+POSTGAME_GRACE_MS/);
  assert.match(scout,/\.v15-addon-root\[data-tab="changes"\]/);
  assert.match(scout,/\.v15-intel-desk:not\(\.v161-opponent-scout\)/);
  assert.doesNotMatch(scout,/text\.includes\(String\(intel\.opponent/);
  assert.match(scout,/desk\.insertAdjacentElement\('afterend',panel\)/);
});

test('opponent scout communicates active roster, practice squad, source conflict and availability boundaries',()=>{
  assert.match(scout,/ACTIVE ROSTER SPINE/);
  assert.match(scout,/ROSTER-GROUP TRUTH/);
  assert.match(scout,/AVAILABILITY BOUNDARY/);
  assert.match(scout,/unofficial depth chart as active-roster authority/i);
  assert.match(scout,/Practice squad context/);
  assert.equal(WEEK1_OPPONENT_INTEL_2026.activeRosterSpine.kicker,'Blake Grupe');
  assert.deepEqual(WEEK1_OPPONENT_INTEL_2026.rosterGroupContext.practiceSquad,['Jason Sanders','Kohl Levao']);
});

test('opponent scout remains read-only and adds no data provider or persistence owner',()=>{
  assert.doesNotMatch(scout,/fetch\s*\(/);
  assert.doesNotMatch(scout,/XMLHttpRequest|WebSocket|EventSource|setInterval\s*\(/);
  assert.doesNotMatch(scout,/localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(scout,/new MutationObserver/);
  assert.match(scout,/safeUrl=source/);
  assert.match(scout,/url\.protocol==='https:'/);
});

test('source links and phone presentation reuse the accessible Intelligence Desk contract',()=>{
  assert.match(scout,/aria-labelledby="v161-opponent-title"/);
  assert.match(scout,/target="_blank" rel="noopener noreferrer"/);
  assert.match(scout,/v15-intel-grid/);
  assert.match(scout,/v15-intel-item/);
  assert.match(css,/@media\(max-width:759px\)[\s\S]*\.v15-intel-grid\{grid-template-columns:1fr\}/);
  assert.match(css,/@media\(max-width:759px\)[\s\S]*\.v15-intel-item a\{display:inline-flex;align-items:center;min-height:44px\}/);
  assert.match(css,/\.v15-intel-item a:focus-visible\{outline:3px solid #fff/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('Command owner, Cloudflare build and PWA shell package the opponent scout',()=>{
  assert.match(guard,/import '\.\/command-opponent-scout-v161\.js'/);
  assert.match(build,/'src\/week1-opponent-intel-2026\.mjs'/);
  assert.match(sw,/'\/command-opponent-scout-v161\.js'/);
  assert.match(sw,/'\/src\/week1-opponent-intel-2026\.mjs'/);
  assert.match(sw,/titans-cc-brand-2026-v85/);
});
