import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room preserves the selected roster subview across app rerenders',()=>{
  assert.match(js,/TR_VIEWS=new Set\(\['roster','depth','staff','cutdown'\]\)/);
  assert.match(js,/trPreferredRosterView='roster'/);
  assert.match(js,/if\(persist\)\{trPreferredRosterView=next;syncRosterViewUrl\(next\);\}/);
  assert.match(js,/const initialView=requestedRosterView\(\)\|\|trPreferredRosterView/);
  assert.match(js,/setRosterView\(requestedRosterView\(\)\|\|app\.dataset\.teamRoomView\|\|trPreferredRosterView,\{persist:false\}\)/);
  assert.doesNotMatch(js,/wireTeamRoomSwitcher\(switcher\);setRosterView\('roster'\)/);
});

test('Team Room persists subview selection in a shareable roster URL without history spam',()=>{
  assert.match(js,/const syncRosterViewUrl=view=>/);
  assert.match(js,/if\(view==='roster'\)params\.delete\('view'\);else params\.set\('view',view\)/);
  assert.match(js,/history\.replaceState\(history\.state,'',next\)/);
  assert.doesNotMatch(js,/history\.pushState/);
  assert.match(js,/const next=`#roster\$\{query\?`\?\$\{query\}`:''\}`/);
});

test('Team Room honors deep-linked subviews without losing keyboard behavior',()=>{
  assert.match(js,/new URLSearchParams\(location\.hash\.split\('\?'\)\[1\]\|\|''\)\.get\('view'\)/);
  assert.match(js,/teamRoomButton\('cutdown','Cutdown',view==='cutdown'\)/);
  assert.match(js,/switcher\.innerHTML=teamRoomSwitcherMarkup\(initialView\)/);
  assert.match(js,/ArrowRight/);
  assert.match(js,/ArrowLeft/);
  assert.match(js,/Home/);
  assert.match(js,/End/);
  assert.match(js,/setRosterView\(target\.dataset\.teamRoomView,\{focus:true\}\)/);
});

test('async Team Room enhancements are single-flight and reacquire live DOM targets before writes',()=>{
  for(const key of ['trStatsPending','trInjuryPending','trSourcesPending']) assert.match(js,new RegExp(key));
  assert.match(js,/trBegin\(app,'trInjuryPending'\)/);
  assert.match(js,/finally\{trEnd\(app,'trInjuryPending'\);\}/);
  assert.match(js,/currentApp=trQs\('#app'\),head=trQs\('\.page-head',currentApp\)/);
  assert.match(js,/!inj\|\|!currentApp\|\|!head\|\|!\['live','roster'\]\.includes\(trRoute\(\)\)\|\|trQs\('\.official-injury-state',currentApp\)\)return/);
  assert.match(js,/head\.insertAdjacentElement\('afterend',el\)/);
  assert.match(js,/if\(!depth\.isConnected\|\|!staff\.isConnected\)return/);
});

test('injury state cannot duplicate while the first async enhancement is pending',()=>{
  assert.match(js,/trQs\('\.official-injury-state',app\)\|\|!trBegin\(app,'trInjuryPending'\)/);
  assert.match(js,/trQs\('\.official-injury-state',currentApp\)\)return;const el=document\.createElement\('aside'\)/);
});