import { internals } from './resetUtils';
import { describe, it, expect } from 'vitest';
const { floorDay, floorWeek } = internals;

describe('floorWeek', () => {
  it('floors weeks', () => {
    floorWeek(undefined);
  });
});
