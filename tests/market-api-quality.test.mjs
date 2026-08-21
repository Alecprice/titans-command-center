import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateConfiguredMarketData } from '../src/market-api.mjs';

test('configured market validator accepts normalized sportsbook rows',()=>{
  const result=validateConfiguredMarketData({odds:[
    {marketKey:'h2h',marketName:'Moneyline',book:'FanDuel',bookId:'fanduel',side:'Tennessee Titans',price:-220,available:true},
    {marketKey:'spreads',marketName:'Spread',book:'DraftKings',bookId:'draftkings',side:'Tennessee Titans',line:-4.5,price:-110,available:true}
  ]});
  assert.equal(result.ok,true);
  assert.equal(result.acceptedRows,2);
  assert.equal(result.rejectedRows,0);
});

test('configured market validator rejects old flattened and unavailable rows',()=>{
  const result=validateConfiguredMarketData({odds:[
    {marketKey:'outcomes',marketName:'outcomes',book:'PropLine',side:'Tennessee Titans',price:-220,available:true},
    {marketKey:'spreads',marketName:'Spread',book:'FanDuel',side:'Tennessee Titans',price:-110,available:false},
    {marketKey:'spreads',marketName:'Spread',book:'',side:'Tennessee Titans',price:-110,available:true}
  ]});
  assert.equal(result.ok,false);
  assert.equal(result.acceptedRows,0);
  assert.equal(result.rejectedRows,3);
});

test('market route only labels validated configured data as live',()=>{
  const source=fs.readFileSync(new URL('../src/market-api.mjs',import.meta.url),'utf8');
  assert.match(source,/fetchFreeOdds\(env,\{maxEvents:2\}\)/);
  assert.match(source,/configured\.ok&&validated\.ok/);
  assert.match(source,/providerValidation/);
  assert.match(source,/no display-safe normalized rows/);
});
