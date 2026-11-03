const MS_PER_DAY = 86400000;
const QUARTER_MONTHS = 3;

function assertValidDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('date must be a valid Date');
  }
}

function assertValidMode(mode) {
  if (mode !== 'down' && mode !== 'up' && mode !== 'nearest') {
    throw new RangeError("mode must be 'down', 'up', or 'nearest'");
  }
}

function quarterStartFor(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const quarterIndex = Math.floor(month / QUARTER_MONTHS);
  const startMonth = quarterIndex * QUARTER_MONTHS;
  return new Date(Date.UTC(year, startMonth, 1, 0, 0, 0, 0));
}

export function roundQuarter(date, mode) {
  assertValidDate(date);
  assertValidMode(mode);

  const start = quarterStartFor(date);
  const next = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + QUARTER_MONTHS, 1, 0, 0, 0, 0));

  let chosen = start;
  if (mode === 'up') {
    chosen = date.getTime() === start.getTime() ? start : next;
  } else if (mode === 'nearest') {
    const midpoint = start.getTime() + (next.getTime() - start.getTime()) / 2;
    chosen = date.getTime() < midpoint ? start : next;
  }

  const quarterNumber = Math.floor(chosen.getUTCMonth() / QUARTER_MONTHS) + 1;
  return { quarterStart: chosen, quarterNumber };
}

export function quarterNumber(date) {
  assertValidDate(date);
  return Math.floor(date.getUTCMonth() / QUARTER_MONTHS) + 1;
}

export function quarterStart(date) {
  assertValidDate(date);
  return quarterStartFor(date);
}

// Re-exported for callers that want the raw constants without importing core directly.
export const constants = Object.freeze({ MS_PER_DAY, QUARTER_MONTHS });
