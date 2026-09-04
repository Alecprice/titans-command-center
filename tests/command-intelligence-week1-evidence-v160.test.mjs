import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {feed,games} from '../src/data.mjs';

const js=fs.readFileSync(new URL('../command-intelligence-addons-v15.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../command-intelligence-addons-v15.css',import.meta.url),'utf8');
const intel=js.slice(js.indexOf('function sourceEvidenceCard'),js.indexOf('function battleTracker'));

test('TENX0 Week 1 research feed separates coach-confirmed truth from practice observation',()=>{
  const confirmed=feed.find(row=>row.id==='n19');
  const practice=feed.find(row=>row.id==='n18');
  assert.ok(confirmed,'coach-confirmed Week 1 item missing');
  assert.equal(confirmed.tier,'official');
  assert.equal(confirmed.source,'Tennessee Titans');
  assert.equal(confirmed.evidence,'coach-confirmed');
  assert.ok(confirmed.topics.includes('week-1'));
  assert.match(confirmed.summary,/Fernando Carmona/i);
  assert.match(confirmed.summary,/starting right guard/i);
  assert.match(confirmed.url,/^https:\/\/www\.tennesseetitans\.com\/news\//);
  assert.ok(practice,'practice-observation Week 1 item missing');
  assert.equal(practice.tier,'official');
  assert.equal(practice.evidence,'practice-observation');
  assert.ok(practice.topics.includes('week-1'));
  assert.match(practice.summary,/Tate/i);
  assert.match(practice.summary,/Martin-Robinson/i);
  assert.match(practice.summary,/Faulk/i);
  assert.match(practice.summary,/not formal injury-report designations/i);
});

test('TENX0 intelligence attaches evidence to the loaded next matchup instead of a hardcoded opponent',()=>{
  const week1=games.find(game=>game.id==='wk1');
  assert.equal(week1?.opponent,'New York Jets');
  assert.equal(week1?.network,'CBS');
  assert.match(js,/const weekKey=`week-\$\{game\.week\}`/);
  assert.match(js,/safeArr\(item\?\.topics\)\.includes\(weekKey\)/);
  assert.match(js,/game\.homeAway==='home'\?`\$\{game\.opponent\} at Titans`:`Titans at \$\{game\.opponent\}`/);
  assert.doesNotMatch(intel,/New York Jets|NYJ/);
});

test('TENX0 evidence desk renders confirmed practice-watch and formal-status lanes without inference',()=>{
  assert.match(intel,/item\?\.evidence==='coach-confirmed'/);
  assert.match(intel,/item\?\.evidence==='practice-observation'/);
  assert.match(intel,/CONFIRMED/);
  assert.match(intel,/PRACTICE WATCH/);
  assert.match(intel,/FORMAL STATUS/);
  assert.match(intel,/NOT YET CONFIRMED/);
  assert.match(intel,/No current regular-season injury-report rows are loaded/);
  assert.match(intel,/Do not infer Week/);
  assert.match(intel,/Practice reporting is context, not an injury designation or availability prediction/);
});

test('TENX0 research links remain safe and source-backed',()=>{
  assert.match(js,/const safeSourceUrl=item=>/);
  assert.match(js,/u\.protocol==='https:'/);
  assert.match(intel,/target="_blank" rel="noopener noreferrer"/);
  assert.match(intel,/Official source/);
  assert.match(intel,/esc\(item\?\.title/);
  assert.match(intel,/esc\(summary\)/);
});

test('TENX0 Command next-game intelligence no longer trusts schedule array order',()=>{
  assert.match(js,/const futureGames=\(\)=>games\(\)\.map\(game=>\(\{game,at:Date\.parse\(game\?\.date\)\}\)\)/);
  assert.match(js,/\.sort\(\(a,b\)=>a\.at-b\.at\)/);
  assert.match(js,/const nextGame=\(\)=>futureGames\(\)\[0\]\?\.game\|\|null/);
  assert.doesNotMatch(js,/const nextGame=\(\)=>games\(\)\.find/);
});

test('TENX0 evidence desk reuses existing Command data and lifecycle ownership',()=>{
  assert.doesNotMatch(intel,/fetch\(|localStorage|MutationObserver|setInterval\(|WebSocket\(|EventSource\(/);
  assert.equal((js.match(/fetch\('\/api\//g)||[]).length,2);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
  assert.match(js,/root\.innerHTML=oneMinute\(\)\+weekIntelligence\(\)/);
});

test('TENX0 evidence desk stays readable and touch-safe on phones',()=>{
  assert.match(css,/\.v15-intel-grid\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css,/@media\(max-width:759px\)[\s\S]*\.v15-intel-grid\{grid-template-columns:1fr\}/);
  assert.match(css,/@media\(max-width:759px\)[\s\S]*\.v15-intel-item a\{display:inline-flex;align-items:center;min-height:44px\}/);
  assert.match(css,/\.v15-intel-item a:focus-visible\{outline:3px solid #fff/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
