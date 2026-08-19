import assert from 'node:assert/strict';
import { team, games, roster, feed } from '../src/data.mjs';

const errors=[];
const check=(label,fn)=>{try{fn();console.log(`✓ ${label}`)}catch(error){errors.push(`${label}: ${error.message}`);console.error(`✗ ${label}`)}};

check('current team identity metadata',()=>{
  assert.equal(team.name,'Tennessee Titans');
  assert.equal(team.coach,'Robert Saleh');
  assert.equal(team.generalManager,'Mike Borgonzi');
  assert.equal(team.owner,'Amy Adams Strunk');
  assert.equal(team.president,'Burke Nihill');
  assert.deepEqual(team.colors,['Titans blue','red','white','navy blue']);
  assert.equal(team.primaryLogo,'The Shield');
});

check('franchise milestone dates preserve 1959 vs 1960 distinction',()=>{
  assert.equal(team.franchiseGranted,'1959-08-14');
  assert.equal(team.firstSeason,1960);
  assert.equal(team.firstSeasonInTennessee,1997);
  assert.equal(team.firstSeasonAsTitans,1999);
});

check('2026 schedule contains Week 9 bye',()=>{
  const bye=games.find(g=>g.week===9&&g.status==='bye');
  assert.ok(bye,'Week 9 bye is missing');
});

check('Week 18 stays genuinely TBD',()=>{
  const week18=games.find(g=>g.week===18&&g.opponentAbbr==='HOU');
  assert.ok(week18,'Week 18 at Houston is missing');
  assert.equal(week18.date,null);
  assert.equal(week18.dateTbd,true);
  assert.equal(week18.network,'TBD');
});

check('fallback roster is explicitly a sample',()=>{
  assert.equal(team.rosterCoverage.fallbackType,'featured-sample');
  assert.equal(team.rosterCoverage.fallbackPlayers,roster.length);
  assert.ok(team.rosterCoverage.officialActivePlayersAtAudit>roster.length);
});

check('fallback player metadata avoids unsupported editorial tags',()=>{
  for(const player of roster)assert.equal('tag' in player,false,`${player.name} has an unsupported editorial tag`);
});

check('Peter Skoronski fallback position matches official roster',()=>{
  const player=roster.find(p=>p.name==='Peter Skoronski');
  assert.equal(player?.position,'G');
});

check('fallback feed contains sourceable links instead of placeholder social claims',()=>{
  assert.ok(feed.length>0);
  for(const item of feed){
    assert.match(item.url,/^https:\/\//,`${item.id} does not link to an external source`);
    assert.notEqual(item.source,'Reporter watchlist');
  }
});

if(errors.length){console.error(`\nContent audit failed (${errors.length}):\n- ${errors.join('\n- ')}`);process.exit(1)}
console.log(`\nContent audit passed: ${games.length} schedule rows, ${roster.length} verified fallback players, ${feed.length} sourced fallback feed items.`);
