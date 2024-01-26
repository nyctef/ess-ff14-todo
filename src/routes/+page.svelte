<script lang="ts">
  import { writable } from 'svelte/store';
  let todos_data = [
    { text: 'Learn Svelte', done: false },
    { text: 'Build something awesome', done: false }
  ];
  export let todos = writable(todos_data);
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
