import type { Reset } from './types';

function floorDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function floorWeek(date: Date): Date {
  // TODO
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

  // TODO
}
