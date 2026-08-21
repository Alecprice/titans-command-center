import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('watch guide always exposes local ET CT and UTC kickoff times',()=>{
  const js=read('media-timecodes-v14.js');
  assert.match(js,/YOUR TIME/);
  assert.match(js,/EASTERN TIME/);
  assert.match(js,/NASHVILLE TIME/);
  assert.match(js,/WORLD TIME/);
  assert.match(js,/America\/New_York/);
  assert.match(js,/America\/Chicago/);
  assert.match(js,/UTC/);
  assert.match(js,/resolvedOptions\(\)\.timeZone/);
});

test('time guide uses ET and CT labels but actual daylight or standard abbreviations',()=>{
  const js=read('media-timecodes-v14.js');
  assert.match(js,/timeZoneName:'short'/);
  assert.match(js,/ET · New York/);
  assert.match(js,/CT · Tennessee/);
  assert.match(js,/EDT\/CDT/);
  assert.match(js,/EST\/CST/);
});

test('every next-game watch guide states how to watch and listen',()=>{
  const js=read('media-timecodes-v14.js');
  assert.match(js,/NEXT TITANS BROADCAST/);
  assert.match(js,/<small>WATCH<\/small>/);
  assert.match(js,/<small>LISTEN<\/small>/);
  assert.match(js,/CBS locally/);
  assert.match(js,/FOX locally/);
  assert.match(js,/NBC → Peacock/);
  assert.match(js,/Prime Video/);
  assert.match(js,/NFL Sunday Ticket/);
  assert.match(js,/WGFX 104\.5 FM/);
  assert.match(js,/NFL\+/);
});

test('international mode avoids U.S.-only viewing assumptions',()=>{
  const js=read('media-timecodes-v14.js');
  assert.match(js,/saved==='outside'\?'us'/);
  assert.match(js,/area==='international'/);
  assert.match(js,/NFL International by-country guide/);
  assert.match(js,/Game Pass provider/);
  assert.match(js,/International options/);
  assert.match(js,/rights vary/);
});

test('timecode runtime tolerates browser storage and formatting edge cases',()=>{
  const js=read('media-timecodes-v14.js');
  assert.match(js,/const storageGet=key=>\{try\{return localStorage\.getItem\(key\)\}catch\{return null\}\}/);
  assert.match(js,/function zoneParts\(value,timeZone\)\{try\{/);
  assert.match(js,/function stopTimer\(\)/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(js,/observe\(app,\{childList:true,subtree:true\}\)/);
});

test('global kickoff guide includes countdown and responsive mobile layout',()=>{
  const js=read('media-timecodes-v14.js'),css=read('media-timecodes-v14.css'),html=read('index.html'),sw=read('sw.js');
  assert.match(js,/STARTS IN/);
  assert.match(js,/setInterval/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(html,/media-timecodes-v14\.css\?v=2/);
  assert.match(html,/media-timecodes-v14\.js\?v=2/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
  assert.match(sw,/media-timecodes-v14\.css/);
  assert.match(sw,/media-timecodes-v14\.js/);
});
