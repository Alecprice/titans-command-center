import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync('legacy-challenge-v10.js','utf8');
// This contract intentionally runs in the full Titans gate so replay variety is checked against the current repository baseline.

test('Legacy Challenge v10.4 remembers only the previous round per mode',()=>{
  assert.match(js,/const VERSION='10\.4\.0'/);
  assert.match(js,/const lastRoundKeysByMode=\{fan:\[\],diehard:\[\]\}/);
  assert.match(js,/round=selectRound\(bank,lastRoundKeysByMode\[mode\]\|\|\[\]\)/);
  assert.match(js,/lastRoundKeysByMode\[mode\]=round\.map\(questionIdentity\)/);
});

test('round selection prefers unseen semantic exhibits before repeat fallback',()=>{
  assert.match(js,/const questionIdentity=item=>item\?\.key\|\|`\$\{item\?\.kind\|\|'question'\}:\$\{clean\(item\?\.prompt\)\}`/);
  assert.match(js,/const previous=new Set\(previousKeys\)/);
  assert.match(js,/const fresh=shuffle\(bank\.filter\(item=>!previous\.has\(questionIdentity\(item\)\)\)\)/);
  assert.match(js,/const repeats=shuffle\(bank\.filter\(item=>previous\.has\(questionIdentity\(item\)\)\)\)/);
  assert.match(js,/return \[\.\.\.fresh,\.\.\.repeats\]\.slice\(0,Math\.min\(ROUND_SIZE,bank\.length\)\)/);
});

test('replay protection preserves five-question and mode contracts',()=>{
  assert.match(js,/const ROUND_SIZE=5/);
  assert.match(js,/createGame\(page,root,\{fan:bank,diehard:diehardBank\}\)/);
  assert.match(js,/roundMode=mode/);
  assert.match(js,/Run it back for another mix\./);
});

test('replay memory remains ephemeral and does not add network or persistence owners',()=>{
  assert.doesNotMatch(js,/localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(js,/setInterval|setTimeout|MutationObserver/);
  assert.match(js,/frame\+\+>=12/);
  assert.match(js,/addEventListener\('hashchange',scheduleEnsure\)/);
});
