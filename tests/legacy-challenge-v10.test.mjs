import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../legacy-challenge-v10.js',import.meta.url),'utf8');
const indexSource=await readFile(new URL('../index.html',import.meta.url),'utf8');
const compact=value=>value.replace(/\s+/g,' ');

test('Legacy Challenge loads after the audited museum, Finder, and anniversary lens',()=>{
  assert.match(indexSource,/legacy-polish\.js\?v=21[\s\S]*legacy-finder-v2\.js\?v=1[\s\S]*legacy-anniversary-v9\.js\?v=1[\s\S]*legacy-challenge-v10\.js\?v=1/);
});

test('question facts are derived from rendered Record Book and Retired Numbers cards',()=>{
  assert.match(source,/querySelectorAll\('\.legacy-record-card'\)/);
  assert.match(source,/querySelectorAll\('\.legacy-retired-card'\)/);
  assert.match(source,/card\.querySelector\('h3'\)/);
  assert.match(source,/card\.querySelector\('span'\)/);
  assert.match(source,/card\.dataset\.legacyExhibitKey/);
  assert.doesNotMatch(source,/Warren Moon|Eddie George|Derrick Henry|Steve McNair|Earl Campbell|Bruce Matthews/);
});

test('five-question rounds use four same-kind museum-derived options and unseen-first replay selection',()=>{
  assert.match(source,/const ROUND_SIZE=5/);
  assert.match(source,/const OPTION_COUNT=4/);
  assert.match(source,/record:\[\.\.\.new Set\(records\.map\(item=>item\.answer\)\)\]/);
  assert.match(source,/retired:\[\.\.\.new Set\(retired\.map\(item=>item\.answer\)\)\]/);
  assert.match(source,/pools\[item\.kind\]\.filter\(value=>value!==item\.answer\)/);
  assert.match(source,/shuffle\(\[item\.answer,\.\.\.distractors\]\)/);
  assert.match(source,/function selectRound\(bank,previousKeys=\[\]\)/);
  assert.match(source,/const fresh=shuffle\(bank\.filter\(item=>!previous\.has\(questionIdentity\(item\)\)\)\)/);
  assert.match(source,/const repeats=shuffle\(bank\.filter\(item=>previous\.has\(questionIdentity\(item\)\)\)\)/);
  assert.match(source,/return \[\.\.\.fresh,\.\.\.repeats\]\.slice\(0,Math\.min\(ROUND_SIZE,bank\.length\)\)/);
  assert.doesNotMatch(source,/shuffle\(bank\)\.slice\(0,Math\.min\(ROUND_SIZE,bank\.length\)\)/);
  assert.doesNotMatch(source,/sort\(\(\)=>Math\.random/);
});

test('answer lifecycle is single-shot, scores truthfully, and exposes the museum reveal',()=>{
  assert.match(source,/if\(!item\|\|answered\)return/);
  assert.match(source,/answered=true/);
  assert.match(source,/if\(correct\)score\+=1/);
  assert.match(source,/option\.disabled=true/);
  assert.match(source,/Correct — \$\{item\.answer\}/);
  assert.match(source,/the museum answer is \$\{item\.answer\}/);
  assert.match(source,/Final \$\{score\} \/ \$\{round\.length\}/);
  assert.match(source,/data-legacy-challenge-reveal/);
});

test('Start control cannot shadow the game start function',()=>{
  assert.match(source,/function start\(\)/);
  assert.match(source,/const startControl=event\.target\.closest\('\[data-legacy-challenge-start\]'\)/);
  assert.match(source,/if\(startControl\)\{start\(\);return;\}/);
  assert.doesNotMatch(source,/const start=event\.target\.closest/);
});

test('Reveal in museum delegates to the existing exact-exhibit controller and fails soft to focus',()=>{
  assert.match(source,/page\._legacyFinderController/);
  assert.match(source,/controller\?\.focusExhibit/);
  assert.match(source,/controller\.focusExhibit\(item\.key,\{syncUrl:true,scroll:true\}\)/);
  assert.match(source,/item\.card\.scrollIntoView/);
  assert.match(source,/item\.card\.focus/);
  assert.doesNotMatch(source,/location\.hash\s*=/);
  assert.doesNotMatch(source,/history\.(?:pushState|replaceState)/);
});

test('challenge stays ephemeral and adds no network, persistence, timer, or observer owner',()=>{
  const banned=[
    /\bfetch\s*\(/,/XMLHttpRequest/,/WebSocket/,/EventSource/,
    /localStorage/,/sessionStorage/,/indexedDB/,/setInterval\s*\(/,/setTimeout\s*\(/,/MutationObserver/
  ];
  banned.forEach(pattern=>assert.doesNotMatch(source,pattern));
  assert.match(source,/frame\+\+>=12/);
  assert.match(source,/requestAnimationFrame\(tick\)/);
});

test('dynamic museum-derived content is escaped before option HTML insertion',()=>{
  assert.match(source,/const esc=value=>/);
  assert.match(source,/data-legacy-challenge-answer="\$\{esc\(option\)\}"/);
  assert.match(source,/>\$\{esc\(option\)\}<\/button>/);
});

test('mobile and accessibility contracts keep quiz controls and copy readable',()=>{
  const oneLine=compact(source);
  assert.match(oneLine,/\.legacy-challenge-options button,.legacy-challenge-action\{min-height:44px/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-head small\{font-size:12px;line-height:1\.35\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-head p\{font-size:14px;line-height:1\.6\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-meta\{font-size:12px;line-height:1\.35\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-mode strong\{font-size:12px;line-height:1\.25\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-mode span\{font-size:12px;line-height:1\.4\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-reference\{font-size:13px;line-height:1\.5\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-feedback\{font-size:13px;line-height:1\.5\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-options\{grid-template-columns:1fr\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start\{min-height:48px;font-size:12px;line-height:1\.25\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-mode\{min-height:48px\}/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge\[data-legacy-challenge-state="idle"\] \.legacy-challenge-head p\{font-size:13px;line-height:1\.5\}/);
  assert.doesNotMatch(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start\{min-height:48px;font-size:10px\}/);
  assert.match(oneLine,/button:focus-visible\{outline:3px/);
  assert.match(oneLine,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(oneLine,/@media\(forced-colors:active\)/);
  assert.match(source,/aria-labelledby="legacy-challenge-title"/);
  assert.match(source,/role="status" aria-live="polite"/);
});
