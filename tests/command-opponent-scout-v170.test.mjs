import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {games} from '../src/data.mjs';
import {WEEK1_OPPONENT_INTEL_2026,opponentIntelSourceTruth} from '../src/week1-opponent-intel-2026.mjs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const intel=WEEK1_OPPONENT_INTEL_2026;
const truth=opponentIntelSourceTruth(intel);

test('TENX opponent scout keeps the Sept 5 official Jets research current and source-backed',()=>{
  assert.equal(intel.version,'2026-w1-20260905.1');
  assert.ok(Date.parse(intel.checkedAt)>=Date.parse('2026-09-05T11:00:00Z'));
  assert.deepEqual(intel.leadership.captains,['Geno Smith','Joe Tippmann','Demario Davis','Minkah Fitzpatrick','Harrison Phillips','Isaiah Williams']);
  for(const key of ['jetsRoster','jetsRosterAnalysis','jetsTransactions','jetsDepthChart','jetsOssai','jetsHall','jetsPractice','jetsCaptains']){
    assert.match(intel.sources[key]?.publisher||'',/^New York Jets(?: Communications Department)?$/,`${key} should stay on the official Jets source boundary`);
    assert.match(intel.sources[key]?.url||'',/^https:\/\/www\.newyorkjets\.com\//);
  }
  assert.equal(truth.conflictCount,2);
  assert.equal(truth.hasHighSeverityConflict,true);
});

test('TENX opponent special teams truth keeps active-roster status separate from the unsettled Week 1 starter job',()=>{
  const kicker=intel.specialTeams.kicker;
  assert.equal(intel.activeRosterSpine.kicker,'Blake Grupe');
  assert.equal(kicker.activeRoster,'Blake Grupe');
  assert.equal(kicker.practiceSquad,'Jason Sanders');
  assert.equal(kicker.competitionStatus,'open');
  assert.equal(kicker.settledStarter,false);
  assert.equal(kicker.sourceKey,'jetsRosterAnalysis');
  assert.match(kicker.note,/competition remains ongoing/i);
  assert.match(intel.depthChart.conflicts.find(item=>item.subject==='Jason Sanders')?.resolution||'',/Do not surface Sanders as an active-roster kicker or Grupe as a settled Week 1 starter/);
});

test('TENX opponent availability signals never masquerade as formal Week 1 game statuses',()=>{
  const signals=intel.availability.signals;
  assert.equal(intel.availability.confidence,'limited');
  assert.equal(signals.length,4);
  assert.equal(truth.availabilitySignalCount,4);
  assert.equal(truth.formalGameStatusCount,0);
  assert.equal(truth.availabilityIsInferred,false);
  assert.ok(signals.every(signal=>signal.formalGameStatus===false));
  assert.deepEqual(signals.find(signal=>signal.subjects.includes('Joseph Ossai'))&&{kind:signals.find(signal=>signal.subjects.includes('Joseph Ossai')).evidenceKind,status:signals.find(signal=>signal.subjects.includes('Joseph Ossai')).status},{kind:'coach-status',status:'week-to-week'});
  assert.equal(signals.find(signal=>signal.subjects.includes('Breece Hall'))?.evidenceKind,'team-expectation');
  assert.equal(signals.find(signal=>signal.subjects.includes('Jeremy Ruckert'))?.status,'did-not-practice-wednesday');
  assert.equal(signals.find(signal=>signal.subjects.includes('Kenyon Sadiq'))?.status,'position-drills');
  assert.match(intel.availability.note,/no formal Week 1 NYJ game-status designation/i);
});

test('TENX opponent scout attaches only to the exact loaded Week 1 matchup',()=>{
  const wk1=games.find(game=>game.id==='wk1');
  assert.equal(wk1?.week,intel.game.week);
  assert.equal(wk1?.opponentAbbr,intel.opponentAbbr);
  assert.equal(wk1?.date,intel.game.kickoff);
  const js=read('command-opponent-scout-v170.js');
  assert.match(js,/Number\(game\.week\)===Number\(intel\?\.game\?\.week\)/);
  assert.match(js,/String\(game\.opponentAbbr\|\|''\)\.toUpperCase\(\)===String\(intel\?\.opponentAbbr\|\|''\)\.toUpperCase\(\)/);
  assert.match(js,/String\(game\.date\|\|''\)===String\(intel\?\.game\?\.kickoff\|\|''\)/);
  assert.match(js,/runtime\.scheduleFocus\?\.\(safeArr\(payload\?\.games\),new Date\(\)\)\?\.next/);
});

test('TENX opponent scout renders source-ranked fan context without overstating the kicker or availability',()=>{
  const js=read('command-opponent-scout-v170.js');
  assert.match(js,/OPPONENT SCOUT · WEEK/);
  assert.match(js,/CURRENT ROSTER/);
  assert.match(js,/Special teams truth/);
  assert.match(js,/Week 1 competition remains open/);
  assert.match(js,/kicker\?\.competitionStatus==='open'&&!kicker\?\.settledStarter/);
  assert.match(js,/sourceLink\(kicker\?\.sourceKey,'Kicker source'\)/);
  assert.match(js,/TEAM-ELECTED CAPTAINS/);
  assert.match(js,/AVAILABILITY WATCH/);
  assert.match(js,/not formal Week 1 game-status designations/);
  assert.match(js,/No availability prediction is inferred/);
  assert.match(js,/Current roster and transactions control when the Jets’ unofficial depth chart disagrees/);
  assert.match(js,/target=\"_blank\" rel=\"noopener noreferrer\"/);
  assert.match(js,/\['www\.newyorkjets\.com','www\.tennesseetitans\.com'\]\.includes\(url\.hostname\)/);
  assert.match(js,/const esc=value=>/);
});

test('TENX opponent scout reuses shared runtime data and lifecycle ownership',()=>{
  const js=read('command-opponent-scout-v170.js');
  assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/runtime\.onRoute\(schedule,\{immediate:true\}\)/);
  assert.match(js,/runtime\.onAppRender\(schedule,\{immediate:true\}\)/);
  assert.match(js,/runtime\.onRefresh/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
  assert.doesNotMatch(js,/new MutationObserver/);
  assert.doesNotMatch(js,/setInterval|setTimeout/);
  assert.doesNotMatch(js,/localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(js,/WebSocket|EventSource/);
  assert.match(js,/MAX_SETTLE_FRAMES=12/);
});

test('TENX opponent scout ships through the stable runtime and offline shell',()=>{
  const runtime=read('runtime-v19.js'),sw=read('sw.js'),build=read('scripts/build-cloudflare.mjs');
  assert.match(runtime,/import\('\.\/command-opponent-scout-v170\.js'\)/);
  assert.match(sw,/command-opponent-scout-v170\.js/);
  assert.match(sw,/src\/week1-opponent-intel-2026\.mjs/);
  assert.match(sw,/titans-cc-brand-2026-v(?:8[6-9]|9\d|[1-9]\d{2,})/);
  assert.match(build,/src\/week1-opponent-intel-2026\.mjs/);
});

test('TENX opponent scout inherits Command mobile, focus, and reduced-motion safeguards',()=>{
  const js=read('command-opponent-scout-v170.js'),css=read('command-intelligence-addons-v15.css');
  for(const className of ['v15-addon-panel','v15-intel-desk','v15-intel-grid','v15-intel-lane','v15-intel-item','v15-addon-note'])assert.match(js,new RegExp(className));
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/\.v15-intel-item a\{display:inline-flex;align-items:center;min-height:44px\}/);
  assert.match(css,/\.v15-intel-item a:focus-visible/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
