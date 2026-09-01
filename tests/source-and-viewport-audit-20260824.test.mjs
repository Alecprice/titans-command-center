import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { team, games, roster, sources } from '../src/data.mjs';
import { ROSTER_AUDIT_DATE, ROSTER_SOURCE_CONFLICT } from '../src/roster-audit-20260831.mjs';
import { auditedTeamContext } from '../src/team-context.mjs';

test('Aug 31 roster audit reflects the post-cutdown official roster',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-08-31');
  assert.equal(roster.length,61);
  assert.equal(roster.filter(p=>p.status==='Active').length,53);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured').length,6);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured; Designated for Return').length,2);
  for(const name of ['Owen Pappoe','Melvin Smith Jr.','Nazir Stackhouse','Terrell Burgess','James Hudson']){
    assert.ok(roster.some(p=>p.name===name&&p.status==='Active'),`${name} should be active`);
  }
  assert.ok(roster.some(p=>p.name==='Milo Eifler'&&p.status==='Reserve/Injured'));
  assert.ok(roster.some(p=>p.name==='Tanoh Kpassagnon'&&p.status==='Reserve/Injured'));
  assert.ok(roster.some(p=>p.name==='Dorian Mausi'&&p.status==='Reserve/Injured; Designated for Return'));
  assert.ok(roster.some(p=>p.name==='Joshua Williams'&&p.status==='Reserve/Injured; Designated for Return'));
  for(const name of ['Will Levis','Hendon Hooker','Kalel Mullings','Cordell Volson','Austin Deculus','Xavier Restrepo','Jerrick Reed II','Erick Hallett II','Mohamoud Diabate']){
    assert.equal(roster.some(p=>p.name===name),false,`${name} should not remain in the current fallback roster`);
  }
  assert.equal(ROSTER_SOURCE_CONFLICT,'');
  assert.equal(team.rosterCoverage.asOf,'2026-08-31');
  assert.equal(team.rosterCoverage.fallbackPlayers,61);
  assert.equal(team.rosterCoverage.officialActivePlayersAtAudit,53);
  assert.equal(team.rosterCoverage.officialReservePlayersAtAudit,8);
});

test('official schedule preserves TBD and complete current broadcast context',()=>{
  const week18=games.find(g=>g.week===18);
  assert.equal(week18.date,null);
  assert.equal(week18.dateTbd,true);
  assert.equal(week18.network,'TBD');
  assert.equal(week18.venue,'Reliant Stadium');
  const pre3=games.find(g=>g.week==='P3');
  assert.equal(pre3.status,'final');
  assert.equal(pre3.score,15);
  assert.equal(pre3.opponentScore,24);
  assert.match(pre3.network,/NFL Network/);
  assert.match(pre3.network,/WKRN-TV News 2/);
});

test('source policy is freshness-aware inside the official tier',()=>{
  assert.match(sources.find(s=>s.name==='NFL.com')?.purpose||'',/cross-check/i);
  assert.match(sources.find(s=>s.name==='Pro Football Reference')?.purpose||'',/cannot override official TBD/i);
  assert.match(sources.find(s=>s.name==='SportsLogos.net')?.purpose||'',/Titans official brand\/history pages remain primary/i);
  assert.match(auditedTeamContext.sourcePolicy.rule,/newer dated transaction/i);
  assert.match(auditedTeamContext.injuryReport.detail,/regular season/i);
});

test('viewport polish defines separate phone, tablet, desktop and wide-desktop layouts',()=>{
  const css=readFileSync(new URL('../viewport-polish-v101.css',import.meta.url),'utf8');
  const bridge=readFileSync(new URL('../audit-responsive.css',import.meta.url),'utf8');
  assert.match(css,/@media \(max-width:759px\)/);
  assert.match(css,/@media \(min-width:760px\) and \(max-width:1199px\)/);
  assert.match(css,/@media \(min-width:1200px\)/);
  assert.match(css,/@media \(min-width:1600px\)/);
  assert.match(css,/--touch-min:44px/);
  assert.match(css,/font-size:16px!important/);
  assert.match(css,/safe-area-inset/);
  assert.match(bridge,/@import url\('\/viewport-polish-v101\.css\?v=1'\)/);
});