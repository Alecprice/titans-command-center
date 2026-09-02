import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../legacy-challenge-v10.js',import.meta.url),'utf8');
const compact=value=>value.replace(/\s+/g,' ');
const shareStart=source.indexOf('async function shareResult(){');
const shareEnd=source.indexOf("root.addEventListener('click'",shareStart);
const shareSource=shareStart>=0&&shareEnd>shareStart?source.slice(shareStart,shareEnd):'';

test('completed Legacy Challenge rounds expose a fan challenge share action only after the final score',()=>{
  assert.match(source,/data-legacy-challenge-share hidden>Challenge another fan<\/button>/);
  assert.match(source,/let round=\[\],index=0,score=0,answered=false,completed=false/);
  assert.match(source,/function finish\(\)\{\s*completed=true/);
  assert.match(source,/shareButton\.hidden=false/);
  assert.match(source,/index=0;score=0;completed=false/);
  assert.match(source,/shareButton\.hidden=true/);
  assert.match(source,/if\(!completed\|\|!round\.length\)return/);
});

test('shared result contains only the score challenge copy and a clean Legacy destination',()=>{
  assert.match(source,/const cleanChallengeUrl=\(\)=>`\$\{location\.origin\}\$\{location\.pathname\}\$\{location\.search\}#legacy`/);
  assert.match(shareSource,/I scored \$\{score\}\/\$\{round\.length\} in the Titans Legacy Challenge\. Think you can beat it\?/);
  assert.match(shareSource,/title:'Titans Legacy Challenge',text,url/);
  assert.doesNotMatch(shareSource,/item\.answer|item\.prompt|item\.reference|\.options|exhibit=|trail=|step=|scope=|q=/);
  assert.doesNotMatch(shareSource,/location\.hash\s*=|history\.(?:pushState|replaceState)/);
});

test('sharing prefers native share, uses clipboard only as fallback, and treats cancellation neutrally',()=>{
  assert.match(shareSource,/if\(navigator\.share\)\{await navigator\.share\(payload\);feedback\.textContent='Challenge share sheet opened\.';return;\}/);
  assert.match(shareSource,/if\(navigator\.clipboard\?\.writeText\)\{await navigator\.clipboard\.writeText\(`\$\{text\}\\n\$\{url\}`\);feedback\.textContent='Challenge result copied\.';return;\}/);
  assert.match(shareSource,/if\(error\?\.name==='AbortError'\)\{feedback\.textContent='Share cancelled\.';return;\}/);
  assert.match(shareSource,/Sharing is unavailable on this browser\./);
  assert.match(shareSource,/Challenge sharing is unavailable right now\./);
});

test('share result adds no leaderboard, persistence, account, or network ownership',()=>{
  assert.doesNotMatch(shareSource,/leaderboard|ranking|global score|account sync|localStorage|sessionStorage|indexedDB/i);
  assert.doesNotMatch(shareSource,/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|setInterval\s*\(|setTimeout\s*\(|MutationObserver/);
});

test('fan challenge share remains touch friendly and uses the existing live status surface',()=>{
  const oneLine=compact(source);
  assert.match(oneLine,/\.legacy-challenge-options button,.legacy-challenge-action\{min-height:44px/);
  assert.match(oneLine,/@media\(max-width:760px\).*\.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start\{min-height:48px/);
  assert.match(source,/data-legacy-challenge-feedback role="status" aria-live="polite"/);
  assert.match(source,/data-legacy-challenge-share/);
});
