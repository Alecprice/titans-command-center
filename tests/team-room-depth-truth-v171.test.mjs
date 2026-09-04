import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {team,roster,feed} from '../src/data.mjs';
import {auditedTeamContext} from '../src/team-context.mjs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const src=read('team-room.js');
const css=read('team-room.css');

test('TENX Team Room keeps Aug 25 depth order separate from Sept 2 roster membership truth',()=>{
  assert.equal(auditedTeamContext.depthChartPolicy.status,'dated-unofficial-snapshot');
  assert.equal(auditedTeamContext.depthChartPolicy.sourceDate,'2026-08-25');
  assert.equal(team.rosterCoverage.asOf,'2026-09-02');
  assert.match(auditedTeamContext.sourcePolicy.domains.find(item=>item.key==='depth-chart')?.note||'',/Preserve it as a dated snapshot/i);
  assert.match(src,/Role order stays exactly as the dated team-published snapshot/);
  assert.match(src,/Membership is checked against the .* Active\/Reserve roster/);
  assert.doesNotMatch(src,/depth\.rows\.sort\(|depth\.rows\.toSorted\(/);
});

test('TENX Team Room current depth identity accepts Active and Reserve but never practice-squad membership',()=>{
  assert.match(src,/const trCurrentRosterStatus=v=>\/\^active\$\/i\.test\(String\(v\|\|''\)\)\|\|\/\^reserve/);
  assert.match(src,/filter\(player=>trCurrentRosterStatus\(player\?\.status\)\)/);
  assert.doesNotMatch(src,/practice\s*squad/i);
  assert.ok(roster.every(player=>/^(Active|Reserve\/)/.test(player.status)), 'the current roster payload should remain Active/Reserve only');
});

test('TENX Team Room reconciles a depth row by current id or normalized current name',()=>{
  assert.match(src,/function currentDepthMember\(index,row\)/);
  assert.match(src,/index\.byId\.get\(id\)/);
  assert.match(src,/index\.byName\.get\(trNameKey\(row\?\.name\)\)/);
  assert.match(src,/normalize\('NFKD'\)/);
  assert.match(src,/currentRosterNumber\(member,row\)/);
  assert.match(src,/member\?\.number\|\|member\?\.jerseyNumber\|\|member\?\.jersey_number\|\|row\?\.number/);
});

test('TENX Team Room snapshot-only depth rows cannot masquerade as current player links',()=>{
  assert.match(src,/data-depth-membership=\"snapshot-only\"/);
  assert.match(src,/Snapshot only — not in current Active\/Reserve roster/);
  const branch=src.slice(src.indexOf('function depthRowMarkup'),src.indexOf('function starterRoleUpdate'));
  const stale=branch.slice(branch.indexOf('if(!member)'),branch.indexOf("const status="));
  assert.doesNotMatch(stale,/<a href=/);
  assert.match(branch,/data-depth-membership=\"current\"/);
  assert.match(branch,/<a href=\"#player\?id=\$\{encodeURIComponent\(routeId\)\}\"/);
});

test('TENX Team Room surfaces only official coach-confirmed starter updates for a current Active player',()=>{
  const role=feed.find(item=>item.evidence==='coach-confirmed'&&item.topics?.includes('starter'));
  assert.equal(role?.title,'Fernando Carmona named Week 1 starting right guard');
  assert.match(role?.url||'',/^https:\/\/www\.tennesseetitans\.com\//);
  assert.equal(roster.find(player=>player.name==='Fernando Carmona Jr.')?.status,'Active');
  assert.match(src,/item\?\.evidence!==['"]coach-confirmed['"]/);
  assert.match(src,/!item\.topics\.includes\(['"]starter['"]\)/);
  assert.match(src,/trActiveStatus\(player\?\.status\)/);
  assert.match(src,/u\.protocol===['"]https:['"]&&u\.hostname===['"]www\.tennesseetitans\.com['"]/);
  assert.match(src,/Current role update · coach-confirmed/);
  assert.match(src,/Newer coach-confirmed evidence does not rewrite the .* depth ranks/);
});

test('TENX Team Room reuses the loaded data payload instead of adding another provider or state owner',()=>{
  assert.match(src,/depth\.innerHTML=depthPanel\(data\.teamContext,data\)/);
  assert.equal((src.match(/fetch\(['"]\/api\/data['"]/g)||[]).length,1);
  assert.equal((src.match(/new MutationObserver/g)||[]).length,2);
  assert.doesNotMatch(src,/setInterval|setTimeout|localStorage|sessionStorage|indexedDB|WebSocket|EventSource/);
});

test('TENX Team Room keeps source actions safe and inherits the existing mobile touch floor',()=>{
  assert.match(src,/officialTitansSourceLink\(depth\.sourceUrl,['"]Titans depth chart['"]\)/);
  assert.match(src,/target=\"_blank\" rel=\"noopener noreferrer\"/);
  assert.match(css,/@media\(max-width:480px\)/);
  assert.match(css,/\.depth-audit-banner a[^}]*min-height:44px/);
});
