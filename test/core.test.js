import test from 'node:test';
import assert from 'node:assert/strict';
import { roundQuarter, quarterNumber, quarterStart, constants } from '../src/index.js';

test('quarterNumber maps months to quarters', () => {
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 0, 15))), 1);
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 2, 31))), 1);
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 3, 1))), 2);
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 5, 30))), 2);
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 6, 1))), 3);
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 8, 30))), 3);
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 9, 1))), 4);
  assert.equal(quarterNumber(new Date(Date.UTC(2024, 11, 31))), 4);
});

test('quarterStart returns first day of quarter at midnight UTC', () => {
  const got = quarterStart(new Date(Date.UTC(2024, 7, 20, 15, 30)));
  assert.equal(got.getTime(), Date.UTC(2024, 6, 1, 0, 0, 0, 0));
});

test('roundQuarter down returns the containing quarter', () => {
  const got = roundQuarter(new Date(Date.UTC(2024, 7, 20, 15, 30)), 'down');
  assert.equal(got.quarterStart.getTime(), Date.UTC(2024, 6, 1, 0, 0, 0, 0));
  assert.equal(got.quarterNumber, 3);
});

test('roundQuarter up moves to next quarter unless already at start', () => {
  const mid = roundQuarter(new Date(Date.UTC(2024, 7, 20)), 'up');
  assert.equal(mid.quarterStart.getTime(), Date.UTC(2024, 9, 1, 0, 0, 0, 0));
  assert.equal(mid.quarterNumber, 4);

  const exact = roundQuarter(new Date(Date.UTC(2024, 6, 1, 0, 0, 0, 0)), 'up');
  assert.equal(exact.quarterStart.getTime(), Date.UTC(2024, 6, 1, 0, 0, 0, 0));
  assert.equal(exact.quarterNumber, 3);
});

test('roundQuarter nearest uses midpoint tie-break to next quarter', () => {
  const before = roundQuarter(new Date(Date.UTC(2024, 7, 15, 23, 59, 59)), 'nearest');
  assert.equal(before.quarterStart.getTime(), Date.UTC(2024, 6, 1, 0, 0, 0, 0));
  assert.equal(before.quarterNumber, 3);

  const midpoint = roundQuarter(new Date(Date.UTC(2024, 7, 16, 0, 0, 0, 0)), 'nearest');
  assert.equal(midpoint.quarterStart.getTime(), Date.UTC(2024, 9, 1, 0, 0, 0, 0));
  assert.equal(midpoint.quarterNumber, 4);
});

test('roundQuarter nearest at exact quarter start stays put', () => {
  const got = roundQuarter(new Date(Date.UTC(2024, 3, 1, 0, 0, 0, 0)), 'nearest');
  assert.equal(got.quarterStart.getTime(), Date.UTC(2024, 3, 1, 0, 0, 0, 0));
  assert.equal(got.quarterNumber, 2);
});

test('roundQuarter handles year boundaries', () => {
  const down = roundQuarter(new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0)), 'down');
  assert.equal(down.quarterStart.getTime(), Date.UTC(2024, 0, 1, 0, 0, 0, 0));
  assert.equal(down.quarterNumber, 1);

  const up = roundQuarter(new Date(Date.UTC(2023, 11, 31, 23, 59, 59)), 'up');
  assert.equal(up.quarterStart.getTime(), Date.UTC(2024, 0, 1, 0, 0, 0, 0));
  assert.equal(up.quarterNumber, 1);
});

test('roundQuarter rejects invalid inputs', () => {
  assert.throws(() => roundQuarter(new Date('nope'), 'down'), TypeError);
  assert.throws(() => roundQuarter('2024-01-01', 'down'), TypeError);
  assert.throws(() => roundQuarter(new Date(Date.UTC(2024, 0, 1)), 'sideways'), RangeError);
});

test('constants are frozen and correct', () => {
  assert.equal(constants.QUARTER_MONTHS, 3);
  assert.equal(constants.MS_PER_DAY, 86400000);
  assert.ok(Object.isFrozen(constants));
});
