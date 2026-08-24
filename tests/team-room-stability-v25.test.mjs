import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room preserves the selected roster subview across app rerenders',()=>{
  assert.match(js,/TR_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(js,/trPreferredRosterView='roster'/);
  assert.match(js,/if\(persist\)trPreferredRosterView=next/);
  assert.match(js,/setRosterView\(requestedRosterView\(\)\|\|trPreferredRosterView,\{persist:false\}\)/);
  assert.doesNotMatch(js,/wireTeamRoomSwitcher\(switcher\);setRosterView\('roster'\)/);
});

test('Team Room honors deep-linked subviews without losing keyboard behavior',()=>{
  assert.match(js,/new URLSearchParams\(location\.hash\.split\('\?'\)\[1\]\|\|''\)\.get\('view'\)/);
  assert.match(js,/data-team-room-view="cutdown"/);
  assert.match(js,/ArrowRight/);
  assert.match(js,/ArrowLeft/);
  assert.match(js,/Home/);
  assert.match(js,/End/);
  assert.match(js,/setRosterView\(target\.dataset\.teamRoomView,\{focus:true\}\)/);
});

test('async Team Room enhancements are single-flight and refuse detached writes',()=>{
  for(const key of ['trStatsPending','trInjuryPending','trSourcesPending']) assert.match(js,new RegExp(key));
  assert.match(js,/trBegin\(app,'trInjuryPending'\)/);
  assert.match(js,/finally\{trEnd\(app,'trInjuryPending'\);\}/);
  assert.match(js,/!app\.isConnected\|\|!head\.isConnected/);
  assert.match(js,/trQs\('\.official-injury-state',app\)\)return/);
  assert.match(js,/if\(!depth\.isConnected\|\|!staff\.isConnected\)return/);
});

test('injury state cannot duplicate while the first async enhancement is pending',()=>{
  assert.match(js,/trQs\('\.official-injury-state',app\)\|\|!trBegin\(app,'trInjuryPending'\)/);
  assert.match(js,/trQs\('\.official-injury-state',app\)\)return;const el=document\.createElement\('aside'\)/);
});
