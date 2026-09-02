import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../legacy-challenge-v10.js',import.meta.url),'utf8');
const compact=value=>value.replace(/\s+/g,' ');

test('Legacy Challenge mounts compact instead of occupying a full quiz panel while idle',()=>{
  assert.match(source,/data-version="\$\{VERSION\}" data-legacy-challenge-state="idle"/);
  assert.match(source,/\.legacy-challenge\[data-legacy-challenge-state="idle"\]\{gap:10px;padding:18px 20px\}/);
  assert.match(source,/\.legacy-challenge\[data-legacy-challenge-state="idle"\] \.legacy-challenge-stage\{grid-template-columns:minmax\(0,1fr\) auto/);
  assert.match(source,/\.legacy-challenge\[data-legacy-challenge-state="idle"\] \.legacy-challenge-meta,[\s\S]*\.legacy-challenge-options\{display:none\}/);
});

test('idle density keeps difficulty choice and start action visible',()=>{
  assert.match(source,/legacy-challenge-modes/);
  assert.match(source,/data-legacy-challenge-mode="fan"/);
  assert.match(source,/data-legacy-challenge-mode="diehard"/);
  assert.match(source,/data-legacy-challenge-start>Start Fan challenge<\/button>/);
  assert.doesNotMatch(source,/data-legacy-challenge-state="idle"[^`]*\.legacy-challenge-modes\{display:none\}/);
  assert.doesNotMatch(source,/data-legacy-challenge-state="idle"[^`]*\.legacy-challenge-start\{display:none\}/);
});

test('idle feedback remains available to assistive technology instead of being display-none',()=>{
  const idleFeedback=/\.legacy-challenge\[data-legacy-challenge-state="idle"\] \.legacy-challenge-feedback\{([^}]*)\}/.exec(source)?.[1]||'';
  assert.match(idleFeedback,/position:absolute/);
  assert.match(idleFeedback,/width:1px/);
  assert.match(idleFeedback,/clip:rect\(0 0 0 0\)/);
  assert.doesNotMatch(idleFeedback,/display:none/);
  assert.match(source,/data-legacy-challenge-feedback role="status" aria-live="polite"/);
});

test('starting a question expands the challenge and completing the round keeps the score surface expanded',()=>{
  assert.match(source,/const setChallengeState=value=>\{root\.dataset\.legacyChallengeState=value;\}/);
  assert.match(source,/function renderQuestion\(\)\{[\s\S]*setChallengeState\('active'\)/);
  assert.match(source,/function finish\(\)\{[\s\S]*setChallengeState\('complete'\)/);
  assert.doesNotMatch(source,/setChallengeState\('idle'\)/);
});

test('compact mode preserves the existing Fan Diehard score reveal and share behaviors',()=>{
  assert.match(source,/roundMode=mode/);
  assert.match(source,/controller\.focusExhibit\(item\.key,\{syncUrl:true,scroll:true\}\)/);
  assert.match(source,/I scored \$\{score\}\/\$\{round\.length\} in the Titans Legacy Challenge/);
  assert.match(source,/data-legacy-challenge-share hidden>Challenge another fan<\/button>/);
  assert.match(source,/if\(correct\)score\+=1/);
});

test('compact idle layout remains touch friendly and becomes one column on phones',()=>{
  const oneLine=compact(source);
  assert.match(oneLine,/\.legacy-challenge-mode\{min-height:44px/);
  assert.match(oneLine,/\.legacy-challenge-start\{min-height:46px/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-mode\{min-height:48px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*data-legacy-challenge-state="idle".*\.legacy-challenge-stage\{grid-template-columns:1fr/);
  assert.match(oneLine,/@media\(max-width:760px\).*data-legacy-challenge-state="idle".*\.legacy-challenge-start\{width:100%;min-width:0\}/);
});

test('density pass adds no new network persistence timer observer or route ownership',()=>{
  const banned=[
    /\bfetch\s*\(/,/XMLHttpRequest/,/WebSocket/,/EventSource/,
    /localStorage/,/sessionStorage/,/indexedDB/,/setInterval\s*\(/,/setTimeout\s*\(/,/MutationObserver/
  ];
  banned.forEach(pattern=>assert.doesNotMatch(source,pattern));
  assert.doesNotMatch(source,/location\.hash\s*=/);
  assert.match(source,/frame\+\+>=12/);
  assert.match(source,/requestAnimationFrame\(tick\)/);
});
