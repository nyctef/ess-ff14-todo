import { internals } from './resetUtils';
import { describe, it, expect } from 'vitest';
const { floorDay, floorWeek } = internals;

describe('floorWeek', () => {
  it('returns the start of a week in the middle of a month', () => {
    const result = floorWeek(new Date("2024-02-23T12:34:56Z"));

    // Feb 23 -> Feb 19
    expect(result).toEqual(new Date("2024-02-19T00:00:00Z"));
  });

  it('returns the start of a week over a month boundary', () => {
    const result = floorWeek(new Date("2024-02-02T12:34:56Z"));

    // Feb 02 -> Jan 29
    expect(result).toEqual(new Date("2024-01-29T00:00:00Z"));
  });

  it('returns the start of a week over a leap day', () => {
    const result = floorWeek(new Date("2024-03-02T12:34:56Z"));

    // March 02 -> Feb 26
    expect(result).toEqual(new Date("2024-02-26T00:00:00Z"));
  });
});

describe('floorDay', () => {
  it('returns the start of a day', () => {
    const result = floorDay(new Date("2024-02-23T12:34:56Z"));

    // just removes all of the hour/min/second parts
    expect(result).toEqual(new Date("2024-02-23T00:00:00Z"));
  });
});