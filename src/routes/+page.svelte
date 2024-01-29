<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import type { PageData } from './$types';
  import { writable } from 'svelte/store';

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

<input type="text" placeholder="add new todo" bind:this={new_todo_name} />
<button
  on:click={() => {
    data.todos = [...data.todos, { text: new_todo_name.value, done: false }];
    new_todo_name.value = '';
  }}>add</button
>
