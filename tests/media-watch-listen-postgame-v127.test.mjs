import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-alternatives-v14.js',import.meta.url),'utf8');
const css=await readFile(new URL('../media-alternatives-v14.css',import.meta.url),'utf8');

test('Watch Listen keeps a bounded official postgame window after a final',()=>{
  assert.match(js,/const POSTGAME_WINDOW=8\*HOUR/);
  assert.match(js,/function recentPostgame\(game,now=Date\.now\(\)\)/);
  assert.match(js,/\/final\/i\.test\(String\(game\.status\|\|''\)\)/);
  assert.match(js,/age>=0&&age<=POSTGAME_WINDOW\?game:null/);
  assert.match(js,/latestCompletedGame/);
  assert.match(js,/fallbackLatestFinal/);
});

test('postgame routes fans to official Titans podium, video, and audio destinations',()=>{
  assert.match(js,/titansLiveVideo:'https:\/\/www\.tennesseetitans\.com\/video\/live-video'/);
  assert.match(js,/titansVideo:'https:\/\/www\.tennesseetitans\.com\/video\/'/);
  assert.match(js,/titansAudio:'https:\/\/www\.tennesseetitans\.com\/audio\/'/);
  assert.match(js,/providerName='Titans live postgame'/);
  assert.match(js,/providerUrl=OFFICIAL\.titansLiveVideo/);
  assert.match(js,/postgameListenRoute\(\)/);
  assert.match(js,/Open Titans video ↗/);
});

test('postgame messaging reflects official podium timing without pretending the stream is always live',()=>{
  assert.match(js,/FINAL · POSTGAME/);
  assert.match(js,/approximately 10 minutes after the game ends/);
  assert.match(js,/Official live video when available/);
  assert.match(js,/Continue with official Titans Radio shows and The OTP as postgame analysis is published/);
  assert.doesNotMatch(js,/postgame press conferences are live now/i);
});

test('postgame visually differs from confirmed LIVE and keeps accessible links',()=>{
  assert.match(css,/\.media-phase-postgame i\{background:#c4d600/);
  assert.match(css,/\.media-phase-postgame span\{color:#e7f18d\}/);
  assert.match(css,/\.media-gameplan a\{color:#fff;font-weight:850/);
  assert.match(css,/\.media-gameplan a:focus-visible\{outline:2px solid #fff/);
  assert.match(css,/\.media-phase-live i\{background:#ef3340/);
});
