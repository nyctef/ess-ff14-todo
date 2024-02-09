import { EventSourcedApi } from '$lib/event_sourced_api';
import { InMemoryEventStorage } from '$lib/in_memory_event_storage';
import { resets } from '$lib/static_data';
import type { PageServerLoad, Actions } from './$types';

// https://kit.svelte.dev/docs/state-management#avoid-shared-state-on-the-server
// explains why this is a bad idea, but we're just playing around for now:
const storage = new InMemoryEventStorage();

const api = await EventSourcedApi.create(storage);
api.add_new_todo({ text: 'Arkasodara dailies', lastDone: undefined, reset: resets[1] });
api.add_new_todo({ text: 'Omicron dailies', lastDone: undefined, reset: resets[1] });

export const load: PageServerLoad = async () => {
  return { todos: await api.get_current_todos(), resets };
};

export const actions = {
  new_todo: async ({ request }) => {
    const data = await request.formData();
    // TODO: basic validation
    const text = data.get('new_name')!.toString();
    const reset_name = data.get('reset')!.toString();
    const reset = resets.find((r) => r.name == reset_name)!;
    // TODO: check for duplicate names

    api.add_new_todo({
      text,
      lastDone: undefined,
      reset
    });
  },
  todo_check: async ({ request }) => {
    const data = await request.formData();
    const text = data.get('text')!.toString();
    api.check_todo(text);
  },
  todo_uncheck: async ({ request }) => {
    const data = await request.formData();
    const text = data.get('text')!.toString();
    api.uncheck_todo(text);
  }
} satisfies Actions;
