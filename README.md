# quarter-rounding-utils

Rounds a Date down, up, or to the nearest quarter boundary and returns the quarter start plus the quarter number.

```js
import { roundQuarter } from './src/index.js';

const result = roundQuarter(new Date(Date.UTC(2024, 7, 20, 15, 30)), 'nearest');
console.log(result.quarterStart.toISOString()); // 2024-07-01T00:00:00.000Z
console.log(result.quarterNumber);              // 3
```

## Why this exists

Quarter boundaries are calendar boundaries, not fixed-length intervals. A naive implementation that adds 90 days drifts across leap years and month lengths, so this library anchors every result to the first day of the relevant calendar quarter at midnight UTC. The trade-off is that all arithmetic is UTC-only; if you need local-time quarters you should convert before calling and convert back after.

## API

- `roundQuarter(date, mode)` — `mode` is `'down'`, `'up'`, or `'nearest'`. Returns `{ quarterStart: Date, quarterNumber: number }`.
- `quarterNumber(date)` — returns the quarter number (1–4) for the date's month.
- `quarterStart(date)` — returns the first day of the quarter containing `date` at midnight UTC.
- `constants` — frozen object with `MS_PER_DAY` and `QUARTER_MONTHS`.

## Edge case to watch

`'nearest'` uses the exact midpoint between quarter starts. When a date lands precisely on that midpoint the result rounds up to the next quarter. This is a deliberate tie-break, not a bug, but it means 15 August 2024 at 00:00:00 UTC rounds to Q4 rather than Q3.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

