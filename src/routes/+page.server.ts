import type { PageServerLoad, Actions } from './$types';

type Reset = { name: string; interval: 'daily' | 'weekly'; hourOffset: number };

const resets = [
  // TODO: doublecheck these times (which ones are affected by DST, if any?)
  { name: 'Weekly reset', interval: 'weekly', hourOffset: 24 + 8 },
  { name: 'Duty reset', interval: 'daily', hourOffset: 15 },
  { name: 'GC Supply reset', interval: 'daily', hourOffset: 20 },
  { name: 'Jumbo Cactpot reset', interval: 'weekly', hourOffset: 5 * 24 + 20 }
] as const;

type Todo = { text: string; lastDone: Date | undefined; reset: Reset };

const todos_data: Todo[] = [
  { text: 'Arkasodara dailies', lastDone: undefined, reset: resets[1] },
  { text: 'Omicron dailies', lastDone: undefined, reset: resets[1] }
];

// https://kit.svelte.dev/docs/state-management#avoid-shared-state-on-the-server
// explains why this is a bad idea, but we're just playing around for now:
let todos = todos_data;

export const load: PageServerLoad = () => {
  return { todos, resets };
};

export const actions = {
  new_todo: async ({ request }) => {
    const data = await request.formData();
    // TODO: basic validation
    const text = data.get('new_name')!.toString();
    const reset_name = data.get('reset')!.toString();
    const reset = resets.find((r) => r.name == reset_name)!;
    // TODO: check for duplicate names

    todos = [...todos, { text, lastDone: undefined, reset }];
  },
  todo_check: async ({ request }) => {
    const data = await request.formData();
    const text = data.get('text')!.toString();
    const now = new Date();
    todos = todos.map((t) => (t.text == text ? { ...t, lastDone: now } : t));
  },
  todo_uncheck: async ({ request }) => {
    const data = await request.formData();
    const text = data.get('text')!.toString();
    todos = todos.map((t) => (t.text == text ? { ...t, lastDone: undefined } : t));
  }
} satisfies Actions;
