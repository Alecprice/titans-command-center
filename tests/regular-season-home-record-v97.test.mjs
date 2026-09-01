import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('Home record is derived only from completed regular-season games',()=>{
  assert.match(app,/function record\(\)\{const f=games\.filter\(g=>Number\(g\.week\)>=1&&g\.status==='final'&&Number\.isFinite\(Number\(g\.score\)\)&&Number\.isFinite\(Number\(g\.opponentScore\)\)\)/);
  assert.doesNotMatch(app,/function record\(\)\{const f=games\.filter\(g=>String\(g\.week\)\.startsWith\('P'\)/);
  assert.match(app,/if\(scored>allowed\)w\+\+;else if\(scored<allowed\)l\+\+;else t\+\+/);
});

test('Home leads with regular-season truth before Week 1',()=>{
  assert.match(app,/<small>Regular season<\/small><strong>\$\{r\.w\}–\$\{r\.l\}\$\{r\.t\?`–\$\{r\.t\}`:''\}<\/strong>/);
  assert.match(app,/r\.n\?`\$\{r\.n\} final\$\{r\.n===1\?'':'s'\} indexed`:'Week 1 ahead'/);
  assert.doesNotMatch(app,/<small>Preseason<\/small><strong>\$\{r\.w\}–\$\{r\.l\}<\/strong>/);
});

test('base Home does not invent standings position from the local record',()=>{
  const recordBlock=app.slice(app.indexOf('function record()'),app.indexOf('function matchup('));
  assert.doesNotMatch(recordBlock,/rank|standing|division|seed|playoff/i);
});
