import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-alternatives-v14.js',import.meta.url),'utf8');
const css=await readFile(new URL('../media-alternatives-v14.css',import.meta.url),'utf8');

test('Watch Listen adds a first-screen game-day quick start',()=>{
  assert.match(js,/GAME DAY QUICK START/);
  assert.match(js,/media-quickstart/);
  assert.match(js,/media-quick-watch/);
  assert.match(js,/media-quick-listen/);
  assert.match(js,/hero\.insertAdjacentElement\('afterend',section\)/);
  assert.match(js,/60 MIN BEFORE/);
  assert.match(js,/KICKOFF/);
  assert.match(js,/POSTGAME/);
});

test('quick start changes language for live, game-window, countdown, game-day and upcoming states',()=>{
  assert.match(js,/key:'live'/);
  assert.match(js,/key:'game-window'/);
  assert.match(js,/key:'pregame'/);
  assert.match(js,/key:'today'/);
  assert.match(js,/key:'upcoming'/);
  assert.match(js,/diff>0&&diff<=HOUR/);
  assert.match(js,/diff>0&&diff<=DAY/);
  assert.match(js,/gameFocusWindowMs/);
  assert.match(js,/Titans Countdown begins one hour before kickoff/);
});

test('kickoff time alone never claims the Titans game is live',()=>{
  assert.match(js,/if\(\/live\/i\.test\(String\(game\.status\|\|''\)\)\)return\{key:'live',eyebrow:'LIVE'/);
  assert.match(js,/if\(diff<=0&&diff>=-windowMs\)return\{key:'game-window',eyebrow:'GAME WINDOW'/);
  assert.match(js,/live status is not yet confirmed/);
  assert.match(js,/phase\.key==='game-window'\?'Check the broadcast'/);
  assert.doesNotMatch(js,/\/live\/i\.test\(String\(game\.status\|\|''\)\)\|\|\(diff<=0/);
});

test('quick start reuses the rendered authorized watch route and changes audio by territory',()=>{
  assert.match(js,/watch\.querySelector\('\.media-watch-card'\)/);
  assert.match(js,/provider\?\.href\|\|OFFICIAL\.titansGuide/);
  assert.match(js,/currentArea==='nashville'/);
  assert.match(js,/titansLiveAudio/);
  assert.match(js,/currentArea==='us'/);
  assert.match(js,/nflPlus/);
  assert.match(js,/titansRadio/);
  assert.doesNotMatch(js,/navigator\.geolocation/);
});

test('quick start uses shared runtime schedule focus and cached same-origin data',()=>{
  assert.match(js,/runtime\?\.apiJson/);
  assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/runtime\?\.scheduleFocus/);
  assert.match(js,/5\*HOUR/);
  assert.match(js,/\.sort\(\(a,b\)=>gameTime\(a\)-gameTime\(b\)\)/);
});

test('quick start stays thumb-friendly and reduced-motion safe on mobile',()=>{
  assert.match(css,/\.media-quick-grid\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/\.media-quick-head,\.media-quick-grid,\.media-gameplan\{grid-template-columns:1fr\}/);
  assert.match(css,/\.media-quick-card b\{display:flex;align-items:center;min-height:56px\}/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/\.media-phase-live i\{animation:none\}/);
});
