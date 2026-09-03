import test from 'node:test';
import assert from 'node:assert/strict';
import {fanIntelRoute} from '../src/fan-intel-api.mjs';

function recorder(){
  const headers=new Map();
  let statusCode=200,payload=null;
  const res={
    setHeader(name,value){headers.set(String(name).toLowerCase(),String(value));return res;},
    status(code){statusCode=Number(code);return res;},
    json(value){payload=value;return res;}
  };
  return {res,read:()=>({headers,statusCode,payload})};
}

test('fan intelligence keeps audited Week 1 opponent truth available without D1',async()=>{
  const out=recorder();
  await fanIntelRoute({method:'GET',query:{}},out.res,{});
  const {statusCode,payload,headers}=out.read();
  assert.equal(statusCode,200);
  assert.equal(payload?.ok,true);
  assert.equal(payload?.available,false);
  assert.equal(payload?.mode,'bundled-opponent-only');
  assert.equal(payload?.opponentAudit?.opponent,'New York Jets');
  assert.equal(payload?.opponentAudit?.activeRosterSpine?.quarterback?.starter,'Geno Smith');
  assert.equal(payload?.opponentAudit?.activeRosterSpine?.kicker,'Blake Grupe');
  assert.equal(payload?.opponentAudit?.sourceTruth?.status,'qualified-conflict');
  assert.deepEqual(payload?.opponentAudit?.rosterGroupContext?.practiceSquad,['Jason Sanders','Kohl Levao']);
  assert.match(headers.get('cache-control')||'',/s-maxage=60/);
});

test('fan intelligence method boundary remains GET-only',async()=>{
  const out=recorder();
  await fanIntelRoute({method:'POST',query:{}},out.res,{});
  const {statusCode,payload,headers}=out.read();
  assert.equal(statusCode,405);
  assert.equal(payload?.ok,false);
  assert.equal(headers.get('allow'),'GET');
});
