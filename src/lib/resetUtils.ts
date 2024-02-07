import type { Reset } from './types';

/** Get a time near 00:01 on the current day */
function floorDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Get a time near 00:01 the previous Monday */
function floorWeek(date: Date): Date {
  const result = new Date(date);
  // .getDay() returns the day of the week (zero-indexed on Sunday)
  // so we add 1 to make it zero-indexed on Monday.
  // .setDate() is kind to us and does a useful thing even if the
  // resulting day-of-month is negative.
  result.setDate(result.getDate() - result.getDay() + 1);
  return floorDay(result);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/** Imagine a timeline like the following:

    --|----R----|----R----|
    --  ^a   ^b

where `|` indicates the interval (day/week) boundaries
and R indicates the time of the reset within that interval.

The current time is either a or b: in our current interval, we're
either before or after the reset in that interval.
In case a, we just use the reset in the current interval:
otherwise we jump ahead one interval and use that reset as
next one instead. */
export function nextReset(reset: Reset, currentTime: Date): Date {
  const startOfCurrentInterval =
    reset.interval == 'weekly' ? floorWeek(currentTime) : floorDay(currentTime);

  const startOfNextInterval = reset.interval === 'weekly' ? addDays(startOfCurrentInterval, 7) : addDays(startOfCurrentInterval, 1);

  const resetInCurrentInterval = addHours(startOfCurrentInterval, reset.hourOffset);

  const resetInNextInterval = addHours(startOfNextInterval, reset.hourOffset);

  if (currentTime < resetInCurrentInterval) {
    return resetInCurrentInterval;
  } else {
    return resetInNextInterval;
  }
}

/** same as `nextReset`, but with this timeline instead:

    --|----R----|----R----|
    --            ^a   ^b

and searching backwards instead of forwards.
 */
export function prevReset(reset: Reset, currentTime: Date): Date {
  const startOfCurrentInterval =
    reset.interval == 'weekly' ? floorWeek(currentTime) : floorDay(currentTime);

  const startOfPrevInterval = reset.interval === 'weekly' ? addDays(startOfCurrentInterval, -7) : addDays(startOfCurrentInterval, -1);

  const resetInCurrentInterval = addHours(startOfCurrentInterval, reset.hourOffset);

  const resetInPrevInterval = addHours(startOfPrevInterval, reset.hourOffset);

  if (currentTime > resetInCurrentInterval) {
    return resetInCurrentInterval;
  } else {
    return resetInPrevInterval;
  }
}

const internals = { floorDay, floorWeek };
export { internals };
