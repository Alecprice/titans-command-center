import test from 'node:test';
import assert from 'node:assert/strict';
import {team,games,roster,feed,sources} from '../src/data.mjs';
import {ROSTER_AUDIT_DATE,auditedRoster20260908,auditedPracticeSquad20260908} from '../src/roster-audit-20260831.mjs';

test('Sep 8 fallback audit keeps current roster membership separate from availability',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-09-08');
  assert.equal(team.rosterCoverage.asOf,'2026-09-08');
  assert.match(team.auditedAt,/^2026-09-08T/);
  assert.equal(auditedRoster20260908.filter(player=>player.status==='Active').length,53);
  assert.equal(auditedRoster20260908.length,60);
  assert.equal(auditedPracticeSquad20260908.length,17);
  const gray=roster.find(player=>player.name==='Cedric Gray');
  assert.ok(gray);
  assert.equal(gray.status,'Active');
});

test('official Cedric Gray availability statement leads the audited fallback without overclaiming game status',()=>{
  const gray=feed[0];
  assert.equal(gray.id,'n21');
  assert.equal(gray.type,'injury');
  assert.equal(gray.tier,'official');
  assert.equal(gray.evidence,'team-statement');
  assert.equal(gray.publishedAt,'2026-09-07T20:28:00Z');
  assert.equal(gray.url,'https://www.tennesseetitans.com/news/titans-lb-cedric-gray-in-concussion-protocol-after-utv-accident');
  assert.match(gray.summary,/concussion protocol/i);
  assert.match(gray.summary,/medical clearance/i);
  assert.doesNotMatch(gray.summary,/\b(?:out|inactive|injured reserve|IR)\b/i);
  assert.doesNotMatch(gray.summary,/160 tackles|started 16 games in 2026/i);
});

test('Week 1 matchup context stays aligned to the official Sept 13 Jets opener',()=>{
  const week1=games.find(game=>game.week===1);
  assert.deepEqual({opponent:week1?.opponent,date:week1?.date,homeAway:week1?.homeAway,network:week1?.network,status:week1?.status},{
    opponent:'New York Jets',
    date:'2026-09-13T17:00:00Z',
    homeAway:'home',
    network:'CBS',
    status:'scheduled'
  });
  const johnson=feed.find(item=>item.id==='n20');
  assert.ok(johnson);
  assert.equal(johnson.tier,'official');
  assert.match(johnson.summary,/former team/i);
  assert.match(johnson.summary,/Sept\. 13/);
  assert.equal(johnson.url,'https://www.tennesseetitans.com/news/titans-de-jermaine-johnson-ii-ready-to-kick-off-the-2026-season-against-his-old-team-the-jets');
});

test('official team source policy explicitly owns current injury and availability statements',()=>{
  const titans=sources.find(source=>source.name==='Tennessee Titans');
  assert.ok(titans);
  assert.equal(titans.tier,'official');
  assert.match(titans.purpose,/injury\/availability statements/);
});
