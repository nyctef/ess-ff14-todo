import type { Reset } from '$lib/types';

export const resets: Reset[] = [
  // TODO: doublecheck these times (which ones are affected by DST, if any?)
  { name: 'Weekly reset', interval: 'weekly', hourOffset: 24 + 8 },
  { name: 'Duty reset', interval: 'daily', hourOffset: 15 },
  { name: 'GC Supply reset', interval: 'daily', hourOffset: 20 },
  { name: 'Jumbo Cactpot reset', interval: 'weekly', hourOffset: 5 * 24 + 20 },
  { name: 'Island Sanctuary reset', interval: 'daily', hourOffset: 8 }
];

export function get_reset_by_name(name: string): Reset {
  const result = resets.find((r) => r.name == name);
  if (!result) throw new Error(`No reset found with name ${name}`);
  return result;
}
