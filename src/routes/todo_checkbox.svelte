<script lang="ts">
  import { dateDiff, nextReset, prevReset } from '$lib/reset_utils';
  import type { Todo } from '$lib/types';

  export let todo: Todo;
  export let time: Date;
  export let handleTodoChange: (text: string, checked: boolean) => void;
  export let handleRename: (oldText: string, newText: string) => void;

  function doRename() {
    const oldText = todo.text;
    let newText = prompt('Rename todo:', oldText);
    if (newText != null) {
      handleRename(oldText, newText);
    }
  }
</script>

<label>
  <input
    type="checkbox"
    checked={todo.lastDone != undefined && new Date(todo.lastDone) >= prevReset(todo.reset, time)}
    on:change={(e) => handleTodoChange(todo.text, e.currentTarget.checked)}
  />
  {todo.text}
  {dateDiff(time, nextReset(todo.reset, time))}
  <button title="Rename todo" on:click={doRename}>🖉</button>
</label>
