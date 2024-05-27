import { resets } from '$lib/static_data';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    redirect(302, '/signin');
  }
  return { todos: await event.locals.api.get_current_todos(), resets };
};

const fail_if_no_user = (locals: App.Locals) => {
  if (!locals.user) {
    throw fail(401);
  }
};

export const actions = {
  new_todo: async ({ request, locals }) => {
    fail_if_no_user(locals);

    const data = await request.formData();
    // TODO: basic validation
    const text = data.get('new_name')!.toString();
    const reset_name = data.get('reset')!.toString();
    const reset = resets.find((r) => r.name == reset_name)!;
    // TODO: check for duplicate names

    await locals.api.add_new_todo({
      text,
      lastDone: undefined,
      reset
    });
  },
  todo_check: async ({ request, locals }) => {
    fail_if_no_user(locals);
    const data = await request.formData();
    const text = data.get('text')!.toString();
    await locals.api.check_todo(text);
  },
  todo_uncheck: async ({ request, locals }) => {
    fail_if_no_user(locals);
    const data = await request.formData();
    const text = data.get('text')!.toString();
    await locals.api.uncheck_todo(text);
  },
  todo_rename: async ({ request, locals }) => {
    fail_if_no_user(locals);
    const data = await request.formData();
    const old_text = data.get('old_text')!.toString();
    const new_text = data.get('new_text')!.toString();
    await locals.api.rename_todo(old_text, new_text);
  },
  todo_remove: async ({ request, locals }) => {
    fail_if_no_user(locals);
    const data = await request.formData();
    const text = data.get('text')!.toString();
    await locals.api.remove_todo(text);
  }
} satisfies Actions;
