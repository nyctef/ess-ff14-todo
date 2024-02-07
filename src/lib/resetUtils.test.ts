import { internals, prevReset, nextReset } from './resetUtils';
import { describe, it, test, expect } from 'vitest';
const { floorDay, floorWeek, dateDiff } = internals;

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

describe('nextReset can return the next reset', () => {
  test('if the reset is later today', () => {
    // if now is midday and the reset is at 1pm, we should return 1pm today
    const currentTime = new Date("2024-02-23T12:00:00Z");
    const reset = { name: 'test reset', interval: 'daily', hourOffset: 13 } as const;
    const result = nextReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-23T13:00:00Z"));
  });
  test('if the reset is tomorrow', () => {
    // if now is midday and the reset is at 11am, we should return 11am tomorrow
    const currentTime = new Date("2024-02-23T12:00:00Z");
    const reset = { name: 'test reset', interval: 'daily', hourOffset: 11 } as const;
    const result = nextReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-24T11:00:00Z"));
  });
  test('if the reset is later this week', () => {
    // if now is midday Monday and the reset is midday Tuesday, we should return this week's Tuesday
    const currentTime = new Date("2024-02-05T12:00:00Z");
    const reset = { name: 'test reset', interval: 'weekly', hourOffset: 24 + 12 } as const;
    const result = nextReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-06T12:00:00Z"));
  });
  test('if the reset is next week', () => {
    // if now is midday Tuesday and the reset is midday Monday, we should return next week's Monday
    const currentTime = new Date("2024-02-06T12:00:00Z");
    const reset = { name: 'test reset', interval: 'weekly', hourOffset: 0 + 12 } as const;
    const result = nextReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-12T12:00:00Z"));
  });
});

describe('prevReset can return the previous reset', () => {
  test('if the reset was earlier today', () => {
    // if now is midday and the reset is at 11am, we should return 11am today
    const currentTime = new Date("2024-02-23T12:00:00Z");
    const reset = { name: 'test reset', interval: 'daily', hourOffset: 11 } as const;
    const result = prevReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-23T11:00:00Z"));
  });
  test('if the reset was yesterday', () => {
    // if now is midday and the reset is at 1pm, we should return 1pm yesterday
    const currentTime = new Date("2024-02-23T12:00:00Z");
    const reset = { name: 'test reset', interval: 'daily', hourOffset: 13 } as const;
    const result = prevReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-22T13:00:00Z"));
  });
  test('if the reset was earlier this week', () => {
    // if now is midday Tuesday and the reset is midday Monday, we should return this week's Monday
    const currentTime = new Date("2024-02-06T12:00:00Z");
    const reset = { name: 'test reset', interval: 'weekly', hourOffset: 0 + 12 } as const;
    const result = prevReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-05T12:00:00Z"));
  });
  test('if the reset was last week', () => {
    // if now is midday Monday and the reset is midday Tuesday, we should return last week's Tuesday
    const currentTime = new Date("2024-02-12T12:00:00Z");
    const reset = { name: 'test reset', interval: 'weekly', hourOffset: 24 + 12 } as const;
    const result = prevReset(reset, currentTime);
    expect(result).toEqual(new Date("2024-02-06T12:00:00Z"));
  });
});

describe('dateDiff', () => {
  it('returns a hours+minutes string for dates which are less than a day apart', () => {
    const from = new Date("2024-02-23T00:00:00Z");
    const to = new Date("2024-02-23T01:23:00Z");
    const result = dateDiff(from, to);
    expect(result).toEqual('01h 23m');
  });
  it('returns a days+hours string for dates which are more than a day apart', () => {
    const from = new Date("2024-02-23T00:00:00Z");
    const to = new Date("2024-02-25T01:23:00Z");
    const result = dateDiff(from, to);
    expect(result).toEqual('02d 01h');
  });
  it('returns a negative string if `from` and `to` are flipped', () => {
    // not sure if this is necessary, but might as well ensure this function does a useful thing
    const from = new Date("2024-02-25T01:23:00Z");
    const to = new Date("2024-02-23T00:00:00Z");
    const result = dateDiff(from, to);
    expect(result).toEqual('-02d 01h');
  });
});