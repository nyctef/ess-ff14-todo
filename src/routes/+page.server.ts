import type { PageServerLoad, Actions } from './$types';

// https://kit.svelte.dev/docs/state-management#avoid-shared-state-on-the-server
// explains why this is a bad idea, but we're just playing around for now:

const todos_data = [
  { text: 'Learn Svelte', done: false },
  { text: 'Build something awesome', done: false }
];
let todos = todos_data;

export const load: PageServerLoad = () => {
  return { todos: todos };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    todos = [...todos, { text: data.get('new_name')!.toString(), done: false }];
  }
} satisfies Actions;
