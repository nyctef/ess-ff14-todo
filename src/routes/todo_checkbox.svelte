<script lang="ts">
  import { dateDiff, nextReset, prevReset } from '$lib/reset_utils';
  import type { Todo } from '$lib/types';

  export let todo: Todo;
  export let time: Date;
  export let handleTodoChange: (text: string, checked: boolean) => void;
</script>

<label>
  <input
    type="checkbox"
    checked={todo.lastDone != undefined && todo.lastDone >= prevReset(todo.reset, time)}
    on:change={(e) => handleTodoChange(todo.text, e.currentTarget.checked)}
  />
  {todo.text}
  {dateDiff(time, nextReset(todo.reset, time))}
</label>
