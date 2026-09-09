import test from 'node:test';
import assert from 'node:assert/strict';
import { numberOrNull } from '../src/csv.mjs';

test('numberOrNull preserves finite numeric CSV values', () => {
  assert.equal(numberOrNull(0), 0);
  assert.equal(numberOrNull(-12.5), -12.5);
  assert.equal(numberOrNull(' 42 '), 42);
  assert.equal(numberOrNull('1e3'), 1000);
  assert.equal(numberOrNull('0'), 0);
});

test('numberOrNull treats blank and NA fields as missing rather than zero', () => {
  for (const value of ['', '   ', '\t', 'NA', ' na ', null, undefined]) {
    assert.equal(numberOrNull(value), null, `expected ${String(value)} to be null`);
  }
});

test('numberOrNull rejects non-finite and non-scalar values', () => {
  for (const value of [Infinity, -Infinity, NaN, 'Infinity', '-Infinity', 'NaN', true, false, {}, [], ['12']]) {
    assert.equal(numberOrNull(value), null, `expected ${String(value)} to be rejected`);
  }
});
