<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import type { PageData } from './$types';
  import { writable } from 'svelte/store';
  import { enhance } from '$app/forms';

  export let data: PageData;
  let new_todo_name: HTMLInputElement;
</script>

<h1>event-sourced svelte ff14 todo</h1>
<ul>
  {#each data.todos as todo}
    <li>
      <input type="checkbox" bind:checked={todo.done} />
      {todo.text}
    </li>
  {/each}
</ul>

<form method="POST" use:enhance>
  <input name="new_name" type="text" placeholder="add new todo" bind:this={new_todo_name} />
  <button formaction="?/new_todo">add</button>
</form>
