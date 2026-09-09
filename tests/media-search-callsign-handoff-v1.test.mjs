import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const searchSource=readFileSync(new URL('../media-search-v14.js',import.meta.url),'utf8');
const affiliateSource=readFileSync(new URL('../media-affiliates-v14.js',import.meta.url),'utf8');
const stationCalls=[...affiliateSource.matchAll(/call:'([A-Z]{4})'/g)].map(match=>match[1]);
const knownCallsigns=new Set(stationCalls);

function helpers(){
  const start=searchSource.indexOf('const TERMS=');
  const end=searchSource.indexOf('function consumeAffiliateHandoff');
  assert.ok(start>=0&&end>start,'media search helper block must remain discoverable');
  const context={
    URLSearchParams,
    location:{hash:''},
    TitansMediaAffiliates:{isKnownCallsign:value=>knownCallsigns.has(String(value||'').trim().toUpperCase())}
  };
  vm.runInNewContext(`${searchSource.slice(start,end)}\nglobalThis.__helpers={callsignHandoff,mediaIntent,affiliateHandoff};`,context);
  return context.__helpers;
}

test('affiliate finder remains the single callsign truth owner',()=>{
  assert.ok(stationCalls.length>20,'official 2026 affiliate source should retain the current station dataset');
  assert.match(affiliateSource,/affiliateApi\.isKnownCallsign=value=>/);
  assert.match(affiliateSource,/STATIONS\.some\(station=>station\.call===canonical\)/,'callsign validation must derive directly from the existing station dataset');
  assert.match(searchSource,/import '\.\/media-affiliates-v14\.js'/);
  assert.match(searchSource,/globalThis\.TitansMediaAffiliates\?\.isKnownCallsign\?\.\(call\)/);
  assert.doesNotMatch(searchSource,/KNOWN_RADIO_CALLSIGNS|WIKQ|WXSM|WCRK|WOKI|WKFN|WAIN/,'search bridge must not copy affiliate station truth');
});

test('known callsigns hand off without ordinary four-letter-name false positives',()=>{
  const {callsignHandoff,mediaIntent,affiliateHandoff}=helpers();
  assert.equal(callsignHandoff('WGFX'),'WGFX');
  assert.equal(callsignHandoff('wgfx'),'WGFX');
  assert.equal(callsignHandoff('radio WIKQ'),'WIKQ');
  assert.equal(callsignHandoff('Will'),'');
  assert.equal(callsignHandoff('Kyle'),'');
  assert.equal(mediaIntent('Will'),false);
  assert.equal(mediaIntent('Kyle'),false);
  assert.equal(affiliateHandoff('Will'),'');
  assert.equal(affiliateHandoff('104.5'),'104.5','existing bare flagship-frequency handoff must remain intact');
  assert.equal(mediaIntent('104.5'),true);
});
