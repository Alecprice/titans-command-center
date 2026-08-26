import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { games, sources } from '../src/data.mjs';
import { auditedRoster20260824, ROSTER_AUDIT_DATE, ROSTER_SOURCE_CONFLICT } from '../src/roster-audit-20260824.mjs';
import { auditedTeamContext } from '../src/team-context.mjs';

test('Aug 24 roster audit preserves the dated official move snapshot',()=>{
  const roster=auditedRoster20260824;
  assert.equal(ROSTER_AUDIT_DATE,'2026-08-24');
  assert.equal(roster.length,96);
  assert.equal(roster.filter(p=>p.status==='Active').length,91);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured').length,5);
  assert.ok(roster.some(p=>p.name==='Reid Carrico'&&p.status==='Active'&&p.number===''));
  assert.ok(roster.some(p=>p.name==='Milo Eifler'&&p.number==='45'&&p.status==='Reserve/Injured'));
  assert.ok(roster.some(p=>p.name==='Tanoh Kpassagnon'&&p.number==='58'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='Nazeeh Johnson'&&p.status==='Reserve/Injured'));
  assert.equal(roster.some(p=>p.name==='Sean Brown'),false);
  assert.equal(roster.some(p=>p.name==='Dominic Richardson'),false);
  assert.equal(roster.some(p=>p.name==='Matt Lauter'),false);
  assert.match(ROSTER_SOURCE_CONFLICT,/newer official transaction/i);
});

test('official schedule preserves TBD and complete current broadcast context',()=>{
  const week18=games.find(g=>g.week===18);
  assert.equal(week18.date,null);
  assert.equal(week18.dateTbd,true);
  assert.equal(week18.network,'TBD');
  assert.equal(week18.venue,'Reliant Stadium');
  const pre3=games.find(g=>g.week==='P3');
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
