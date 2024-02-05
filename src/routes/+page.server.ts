import type { PageServerLoad, Actions } from './$types';

// https://kit.svelte.dev/docs/state-management#avoid-shared-state-on-the-server
// explains why this is a bad idea, but we're just playing around for now:

type Todo = { text: string; lastDone: Date | undefined };

const todos_data: Todo[] = [
  { text: 'Learn Svelte', lastDone: undefined },
  { text: 'Build something awesome', lastDone: undefined }
];
let todos = todos_data;

export const load: PageServerLoad = () => {
  return { todos: todos };
};

export const actions = {
  new_todo: async ({ request }) => {
    const data = await request.formData();

    todos = [...todos, { text: data.get('new_name')!.toString(), lastDone: undefined }];
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
