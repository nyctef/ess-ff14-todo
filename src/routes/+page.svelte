<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { writable } from 'svelte/store';
  let todos_data = [
    { text: 'Learn Svelte', done: false },
    { text: 'Build something awesome', done: false }
  ];
  export let todos = writable(todos_data);
  let new_todo_name: HTMLInputElement;
</script>

<h1>event-sourced svelte ff14 todo</h1>
<ul>
  {#each $todos as todo}
    <li>
      <input type="checkbox" bind:checked={todo.done} />
      {todo.text}
    </li>
  {/each}
</ul>

<input type="text" placeholder="add new todo" bind:this={new_todo_name} />
<button
  on:click={() => {
    $todos = [...$todos, { text: new_todo_name.value, done: false }];
    new_todo_name.value = '';
  }}>add</button
>
