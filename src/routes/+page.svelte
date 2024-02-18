<script lang="ts">
  import type { Todo } from '$lib/types';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import TodoCheckbox from './todo_checkbox.svelte';
  import { invalidate, invalidateAll } from '$app/navigation';
  import { is_done, millis_remaining } from '$lib/reset_utils';

  export let data: PageData;

  // based on the clock example on svelte.dev:
  let time = new Date();

  onMount(() => {
    // force our component to reevaluate once per minute:
    const interval = setInterval(() => {
      time = new Date();
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  });

  async function handleTodoChange(text: string, checked: boolean) {
    let body = new FormData();
    body.append('text', text);
    let endpoint = checked ? '?/todo_check' : '?/todo_uncheck';
    await fetch(endpoint, { method: 'POST', body });
    await invalidateAll();
  }

  async function handleRename(oldText: string, newText: string) {
    let body = new FormData();
    body.append('old_text', oldText);
    body.append('new_text', newText);
    await fetch('?/todo_rename', { method: 'POST', body });
    await invalidateAll();
  }

  async function handleRemove(text: string) {
    let body = new FormData();
    body.append('text', text);
    await fetch('?/todo_remove', { method: 'POST', body });
    await invalidateAll();
  }

  function sort_key(a: Todo) {
    return [is_done(a, time), millis_remaining(a, time), a.text];
  }

  $: sorted_todos = data.todos.toSorted((a, b) => {
    return sort_key(a) < sort_key(b) ? -1 : 1;
  });
</script>

<h1>event-sourced svelte ff14 todo</h1>
<ul>
  {#each sorted_todos as todo (todo.text)}
    <li>
      <TodoCheckbox {todo} {time} {handleTodoChange} {handleRename} {handleRemove} />
    </li>
  {/each}
</ul>

<form method="POST" action="?/new_todo" use:enhance>
  <input name="new_name" type="text" placeholder="add new todo" />
  <select name="reset">
    {#each data.resets as reset}
      <option value={reset.name}>{reset.name}</option>
    {/each}
  </select>
  <button type="submit">add</button>
</form>
