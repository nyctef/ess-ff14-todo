<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { dateDiff, nextReset, prevReset } from '$lib/resetUtils';

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

  function handleTodoChange(text: string, checked: boolean) {
    let body = new FormData();
    body.append('text', text);
    let endpoint = checked ? '?/todo_check' : '?/todo_uncheck';
    fetch(endpoint, { method: 'POST', body });
  }
</script>

<h1>event-sourced svelte ff14 todo</h1>
<ul>
  {#each data.todos as todo}
    <li>
      <input
        type="checkbox"
        checked={todo.lastDone != undefined && todo.lastDone >= prevReset(todo.reset, time)}
        on:change={(e) => handleTodoChange(todo.text, e.currentTarget.checked)}
      />
      {todo.text}
      {dateDiff(time, nextReset(todo.reset, time))}
    </li>
  {/each}
</ul>

<form method="POST" use:enhance>
  <input name="new_name" type="text" placeholder="add new todo" />
  <select name="reset">
    {#each data.resets as reset}
      <option value={reset.name}>{reset.name}</option>
    {/each}
  </select>
  <button formaction="?/new_todo">add</button>
</form>
