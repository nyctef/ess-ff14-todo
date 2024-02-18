<script lang="ts">
  import { dateDiff, is_done, nextReset, prevReset } from '$lib/reset_utils';
  import type { Todo } from '$lib/types';

  export let todo: Todo;
  export let time: Date;
  export let handleTodoChange: (text: string, checked: boolean) => void;
  export let handleRename: (oldText: string, newText: string) => void;
  export let handleRemove: (text: string) => void;

  function doRename() {
    const oldText = todo.text;
    let newText = prompt('Rename todo:', oldText);
    if (newText != null) {
      handleRename(oldText, newText);
    }
  }

  function doRemove() {
    if (confirm(`Remove todo"${todo.text}"?`)) {
      handleRemove(todo.text);
    }
  }
</script>

<label>
  <input
    type="checkbox"
    checked={is_done(todo, time)}
    on:change={(e) => handleTodoChange(todo.text, e.currentTarget.checked)}
  />
  {todo.text}
  {dateDiff(time, nextReset(todo.reset, time))}
  <button title="Rename todo" on:click={doRename}>🖉</button>
  <button title="Remove todo" on:click={doRemove}>🗑</button>
</label>
