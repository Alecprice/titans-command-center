import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {
  auditedPracticeSquad20260902,
  PRACTICE_SQUAD_SOURCE_URL,
  ROSTER_AUDIT_DATE
} from '../src/roster-audit-20260831.mjs';

const source=await readFile(new URL('../roster-practice-squad-v0.js',import.meta.url),'utf8');
const bootstrap=await readFile(new URL('../ios-home-screen.js',import.meta.url),'utf8');

test('Sept. 2 audited practice squad is complete and source-backed',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-09-02');
  assert.equal(auditedPracticeSquad20260902.length,17);
  assert.match(PRACTICE_SQUAD_SOURCE_URL,/tennesseetitans\.com\/news\//);
  const names=new Set(auditedPracticeSquad20260902.map(player=>player.name));
  for(const name of ['Xavier Restrepo','Jerrick Reed II','Erick Hallett II','Mohamoud Diabate','Hendon Hooker','K.J. Osborn'])assert.ok(names.has(name),`missing ${name}`);
});

test('roster enhancement keeps practice squad distinct from active and reserve',()=>{
  assert.match(source,/Active \+ Reserve/);
  assert.match(source,/Practice Squad/);
  assert.match(source,/All current groups/);
  assert.match(source,/mainGrid\.hidden=selectedGroup==='practice'/);
  assert.match(source,/practiceGrid\.hidden=selectedGroup==='main'/);
  assert.doesNotMatch(source,/player-card[^\n]*href=/);
});

test('roster enhancement reuses existing roster search and unit filters',()=>{
  assert.match(source,/root\.querySelector\('#rs'\)/);
  assert.match(source,/root\.querySelector\('#ru'\)/);
  assert.match(source,/normalize\(`\$\{player\.name\} \$\{player\.position\} \$\{player\.number\} \$\{player\.status\}`\)/);
  assert.match(source,/search\?\.addEventListener\('input',draw\)/);
  assert.match(source,/unit\?\.addEventListener\('input',draw\)/);
});

test('enhancement is mobile-aware, route-scoped and bootstrapped fail-soft',()=>{
  assert.match(source,/@media\(max-width:620px\)/);
  assert.match(source,/if\(route\(\)!=='roster'\)return/);
  assert.match(source,/MutationObserver\(queueEnhance\)/);
  assert.match(bootstrap,/import\('\.\/roster-practice-squad-v0\.js'\)\.catch\(\(\)=>\{\}\)/);
});
