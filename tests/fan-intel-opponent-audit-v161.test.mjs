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

test('Fan Intel keeps its strict D1 outage contract while carrying audited opponent context',async()=>{
  const out=recorder();
  await fanIntelRoute({method:'GET',query:{}},out.res,{});
  const {statusCode,payload,headers}=out.read();
  assert.equal(statusCode,503);
  assert.equal(payload?.ok,false);
  assert.equal(payload?.configured,false);
  assert.match(payload?.error||'',/snapshot unavailable/i);
  assert.equal(payload?.opponentAudit?.opponent,'New York Jets');
  assert.equal(payload?.opponentAudit?.activeRosterSpine?.quarterback?.starter,'Geno Smith');
  assert.equal(payload?.opponentAudit?.activeRosterSpine?.kicker,'Blake Grupe');
  assert.equal(payload?.opponentAudit?.sourceTruth?.status,'qualified-conflict');
  assert.deepEqual(payload?.opponentAudit?.rosterGroupContext?.practiceSquad,['Jason Sanders','Kohl Levao']);
  assert.match(headers.get('cache-control')||'',/no-store/i);
});

test('fan intelligence method boundary remains GET-only',async()=>{
  const out=recorder();
  await fanIntelRoute({method:'POST',query:{}},out.res,{});
  const {statusCode,payload,headers}=out.read();
  assert.equal(statusCode,405);
  assert.equal(payload?.ok,false);
  assert.equal(headers.get('allow'),'GET');
});
