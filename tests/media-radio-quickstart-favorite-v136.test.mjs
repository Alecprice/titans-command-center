import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-affiliates-v14.js',import.meta.url),'utf8');
const css=await readFile(new URL('../media-affiliates-v14.css',import.meta.url),'utf8');
const browser=await readFile(new URL('../scripts/media-affiliate-browser-smoke.py',import.meta.url),'utf8');

test('saved affiliate decorates the existing Quick Start Listen card without becoming a stream',()=>{
  assert.match(js,/const listen=document\.querySelector\('\.media-quick-listen'\)/);
  assert.match(js,/const favorite=readFavorite\(\)/);
  assert.match(js,/badge\.dataset\.mediaSavedRadio='true'/);
  assert.match(js,/label\.textContent='SAVED AM\/FM'/);
  assert.match(js,/station\.textContent=`\$\{favorite\.call\} · \$\{favorite\.frequency\}`/);
  assert.match(js,/city\.textContent=`\$\{favorite\.city\} · tune a radio when in range`/);
  assert.doesNotMatch(js,/listen\.href\s*=/);
  assert.doesNotMatch(js,/favorite\.url/);
});

test('Quick Start favorite truth still comes from the validated official finder state',()=>{
  assert.match(js,/STATIONS\.find\(station=>station\.key===saved\.key\)\|\|null/);
  assert.match(js,/syncQuickstartFavorite\(\)/);
  assert.match(js,/syncFavorite\(details\)[\s\S]*syncQuickstartFavorite\(\)/);
  assert.match(js,/if\(!favorite\)\{[\s\S]*existing\?\.remove\(\);[\s\S]*listen\.removeAttribute\('data-saved-affiliate'\)/);
  assert.doesNotMatch(js,/fetch\(/);
  assert.doesNotMatch(js,/navigator\.geolocation/);
});

test('Quick Start bridge owns only narrow media child-list observers',()=>{
  assert.match(js,/pageObserver\.observe\(page,\{childList:true,subtree:false\}\)/);
  assert.match(js,/quickstartObserver\.observe\(quickstart,\{childList:true,subtree:false\}\)/);
  assert.match(js,/resetMediaObservers\(\)/);
  assert.doesNotMatch(js,/setInterval\(/);
  assert.doesNotMatch(js,/subtree:true/);
});

test('saved radio badge remains readable on phones and high contrast',()=>{
  assert.match(css,/media-quick-card \.media-quick-saved-radio\{[^}]*display:grid/);
  assert.match(css,/media-quick-card \.media-quick-saved-radio small/);
  assert.match(css,/@media\(max-width:390px\)[^{]*\{[^}]*media-affiliate-source/);
  assert.match(css,/media-quick-card \.media-quick-saved-radio\{grid-template-columns:1fr/);
  assert.match(css,/@media\(prefers-contrast:more\)/);
});

test('production affiliate gate proves saved radio persistence and preserves official digital audio',()=>{
  assert.match(browser,/quickSavedText/);
  assert.match(browser,/Saved AM\/FM station WIKQ 103\.1 FM in Greeneville/);
  assert.match(browser,/tennesseetitans\.com\/broadcast\/titans-radio\/live-game-day-audio/);
  assert.match(browser,/Saved AM\/FM reminder changed the authorized digital Listen route/);
  assert.match(browser,/!document\.querySelector\('\[data-media-saved-radio\]'\)/);
});
