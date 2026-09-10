import test from 'node:test';
import assert from 'node:assert/strict';
import { gameStatus } from '../src/core.mjs';

const NOW = new Date('2026-09-09T20:00:00.000Z');

test('game status preserves established valid schedule states', () => {
  assert.equal(gameStatus({ status: 'bye' }, NOW), 'Bye');
  assert.equal(gameStatus({ status: 'final' }, NOW), 'Final');
  assert.equal(gameStatus({ status: 'live', detail: 'Q3 04:12' }, NOW), 'Q3 04:12');
  assert.equal(gameStatus({ status: 'live' }, NOW), 'Live');
  assert.equal(gameStatus({ dateTbd: true }, NOW), 'TBD');
  assert.equal(gameStatus({ date: '2026-09-11T20:00:00.000Z' }, NOW), '2d away');
  assert.equal(gameStatus({ date: '2026-09-09T23:00:00.000Z' }, NOW), '3h away');
  assert.equal(gameStatus({ date: '2026-09-09T19:00:00.000Z' }, NOW), 'Scheduled');
});

test('game status contains malformed game and clock inputs', () => {
  for (const game of [null, undefined, [], 'game', 42, true]) assert.equal(gameStatus(game, NOW), 'TBD');
  assert.equal(gameStatus({ date: 'not-a-date' }, NOW), 'TBD');
  assert.equal(gameStatus({ date: '2026-09-11T20:00:00.000Z' }, 'not-a-date'), 'TBD');
  assert.equal(gameStatus({ date: '2026-09-11T20:00:00.000Z' }, new Date(Number.NaN)), 'TBD');
});
