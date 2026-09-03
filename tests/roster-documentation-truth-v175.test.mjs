import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ROSTER_AUDIT_DATE,
  auditedRoster20260902,
  auditedPracticeSquad20260902,
} from '../src/roster-audit-20260831.mjs';

const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const integrityPolicy = readFileSync(new URL('../docs/CONTENT_INTEGRITY.md', import.meta.url), 'utf8');
const active = auditedRoster20260902.filter(player => player.status === 'Active').length;
const reserveInjured = auditedRoster20260902.filter(player => player.status === 'Reserve/Injured').length;
const designatedForReturn = auditedRoster20260902.filter(player => player.status === 'Reserve/Injured; Designated for Return').length;
const reserve = reserveInjured + designatedForReturn;
const practiceSquad = auditedPracticeSquad20260902.length;

test('README roster baseline stays synchronized with the executable audit', () => {
  assert.equal(ROSTER_AUDIT_DATE, '2026-09-02');
  assert.equal(active, 53);
  assert.equal(reserveInjured, 5);
  assert.equal(designatedForReturn, 2);
  assert.equal(reserve, 7);
  assert.equal(practiceSquad, 17);

  assert.match(readme, /current fallback roster is the \*\*Sept\. 2, 2026 cross-source official audit\*\*/);
  assert.match(readme, new RegExp(`${active} Active players plus ${reserve} separately labeled reserve-list players`));
  assert.match(readme, new RegExp(`\\(${reserveInjured} Reserve/Injured and ${designatedForReturn} Reserve/Injured–Designated for Return\\)`));
  assert.match(readme, new RegExp(`audited Sept\\. 2 practice squad contains ${practiceSquad} players`));
});

test('content-integrity policy distinguishes full-audit history from current roster freshness', () => {
  assert.match(integrityPolicy, /Last full audit: \*\*2026-08-19\*\*/);
  assert.match(integrityPolicy, new RegExp(`Current-team roster fallback audit: \\*\\*${ROSTER_AUDIT_DATE}\\*\\*`));
  assert.match(integrityPolicy, new RegExp(`${active} Active players plus ${reserve} reserve-list players`));
  assert.match(integrityPolicy, new RegExp(`the ${practiceSquad}-player practice squad is tracked separately`));
});

test('documentation does not regress to the superseded Aug. 31 roster claim', () => {
  for (const document of [readme, integrityPolicy]) {
    assert.doesNotMatch(document, /current fallback roster is the \*\*Aug\. 31 post-cutdown official audit\*\*/);
    assert.doesNotMatch(document, /53 Active players plus 8 separately labeled Reserve/i);
  }
});
