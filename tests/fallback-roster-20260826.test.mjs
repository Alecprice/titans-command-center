import test from 'node:test';
import assert from 'node:assert/strict';
import { auditedRoster20260824 } from '../src/roster-audit-20260824.mjs';
import { auditedRoster20260826, ROSTER_AUDIT_DATE, ROSTER_AUDIT_NOTE } from '../src/roster-audit-20260826.mjs';
import { team, roster, feed, metrics } from '../src/data.mjs';

test('Aug 26 fallback is an additive audit layer over the preserved Aug 24 snapshot',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-08-26');
  assert.equal(auditedRoster20260824.length,96);
  assert.equal(auditedRoster20260826.length,95);
  assert.match(ROSTER_AUDIT_NOTE,/Aug\. 25 official transaction/i);
});

test('current fallback applies Hampton Johnson Kane transaction without guessing',()=>{
  assert.equal(roster.some(p=>p.name==='Dominique Hampton'),false);
  assert.equal(roster.some(p=>p.name==='Sanoussi Kane'),false);
  assert.deepEqual(
    roster.find(p=>p.name==='Dyontae Johnson'),
    {name:'Dyontae Johnson',number:'45',position:'LB',unit:'Defense',status:'Active',experience:''}
  );
  assert.equal(roster.filter(p=>p.status==='Active').length,91);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured').length,4);
});

test('fallback freshness metadata and fan-facing roster metric agree',()=>{
  assert.equal(team.rosterCoverage.asOf,'2026-08-26');
  assert.equal(team.rosterCoverage.fallbackPlayers,95);
  assert.equal(team.rosterCoverage.officialActivePlayersAtAudit,91);
  assert.equal(team.rosterCoverage.officialReservePlayersAtAudit,4);
  const metric=metrics.find(x=>x.label==='Audited roster');
  assert.equal(metric?.value,'95');
  assert.match(metric?.delta||'',/91 active · 4 reserve\/injured/);
});

test('fallback feed carries the dated official transaction as its newest roster move',()=>{
  const move=feed.find(x=>x.id==='n11');
  assert.ok(move);
  assert.equal(move.tier,'official');
  assert.match(move.title,/Dyontae Johnson/);
  assert.match(move.summary,/Dominique Hampton/);
  assert.match(move.summary,/Sanoussi Kane/);
  assert.match(move.url,/tennesseetitans\.com\/team\/transactions/);
});
