import type { Todo } from './types';

// TODO: probably assuming that validation is done before these methods are hit.
// So we'd still need to work on error handling at some point, but any errors
// coming out of this interface are probably 500s from something serverside going
// wrong as opposed to 400s, and so don't need to be explicitly described in the
// return type.
export interface Api {
  get_current_todos(): Promise<Todo[]>;
  add_new_todo(new_todo: Todo): Promise<void>;
  check_todo(todo_name: string): Promise<void>;
  uncheck_todo(todo_name: string): Promise<void>;
  remove_todo(todo_name: string): Promise<void>;
}
