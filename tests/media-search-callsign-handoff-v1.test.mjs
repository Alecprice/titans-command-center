import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const searchSource=readFileSync(new URL('../media-search-v14.js',import.meta.url),'utf8');
const affiliateSource=readFileSync(new URL('../media-affiliates-v14.js',import.meta.url),'utf8');

function helpers(){
  const start=searchSource.indexOf('const TERMS=');
  const end=searchSource.indexOf('function consumeAffiliateHandoff');
  assert.ok(start>=0&&end>start,'media search helper block must remain discoverable');
  const context={URLSearchParams,location:{hash:''}};
  vm.runInNewContext(`${searchSource.slice(start,end)}\nglobalThis.__helpers={callsignHandoff,mediaIntent,affiliateHandoff};`,context);
  return context.__helpers;
}

test('media search only treats current Titans Radio affiliates as callsigns',()=>{
  const whitelist=searchSource.match(/KNOWN_RADIO_CALLSIGNS=new Set\('([^']+)'\.split\(' '\)\)/)?.[1]?.split(' ')||[];
  const stationCalls=[...affiliateSource.matchAll(/call:'([A-Z]{4})'/g)].map(match=>match[1]);
  assert.ok(stationCalls.length>20,'official 2026 affiliate source should expose the current callsign set');
  assert.deepEqual([...new Set(whitelist)].sort(),[...new Set(stationCalls)].sort(),'search callsign whitelist must stay synchronized with the affiliate finder');

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
