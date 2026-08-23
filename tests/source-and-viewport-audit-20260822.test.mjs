import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { team, games, roster, sources } from '../src/data.mjs';
import { ROSTER_AUDIT_DATE, ROSTER_SOURCE_CONFLICT } from '../src/roster-audit-20260822.mjs';

test('Aug 22 roster audit preserves cross-source truth instead of stale membership',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-08-22');
  assert.equal(roster.length,95);
  assert.equal(roster.filter(p=>p.status==='Active').length,91);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured').length,4);
  assert.ok(roster.some(p=>p.name==='Milo Eifler'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='Nazeeh Johnson'&&p.status==='Reserve/Injured'));
  assert.equal(roster.some(p=>p.name==='Sean Brown'),false);
  assert.equal(roster.some(p=>p.name==='Dominic Richardson'),false);
  assert.ok(roster.some(p=>p.name==='Matt Lauter'&&p.status==='Active'));
  assert.match(ROSTER_SOURCE_CONFLICT,/Matt Lauter/i);
  assert.equal(team.rosterCoverage.asOf,'2026-08-22');
});

test('official schedule outranks secondary references for TBD and current broadcast fields',()=>{
  const week18=games.find(g=>g.week===18);
  assert.equal(week18.date,null);
  assert.equal(week18.dateTbd,true);
  assert.equal(week18.network,'TBD');
  assert.equal(week18.venue,'Reliant Stadium');
  const pre3=games.find(g=>g.week==='P3');
  assert.equal(pre3.network,'NFL Network');
});

test('source policy distinguishes primary authorities from cross-checks',()=>{
  assert.match(sources.find(s=>s.name==='NFL.com')?.purpose||'',/cross-check/i);
  assert.match(sources.find(s=>s.name==='Pro Football Reference')?.purpose||'',/cannot override official TBD/i);
  assert.match(sources.find(s=>s.name==='SportsLogos.net')?.purpose||'',/Titans official brand\/history pages remain primary/i);
});

test('viewport polish defines separate phone, tablet and desktop layouts',()=>{
  const css=readFileSync(new URL('../viewport-polish-v101.css',import.meta.url),'utf8');
  const bridge=readFileSync(new URL('../audit-responsive.css',import.meta.url),'utf8');
  assert.match(css,/@media \(max-width:759px\)/);
  assert.match(css,/@media \(min-width:760px\) and \(max-width:1199px\)/);
  assert.match(css,/@media \(min-width:1200px\)/);
  assert.match(css,/--touch-min:44px/);
  assert.match(css,/font-size:16px!important/);
  assert.match(bridge,/@import url\('\/viewport-polish-v101\.css\?v=1'\)/);
});
