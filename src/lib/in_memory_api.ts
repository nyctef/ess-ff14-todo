import type { Api } from "./api";
import type { Todo } from "./types";

export class InMemoryApi implements Api {
    todos_data: Todo[] = [];
    get_current_todos(): Promise<Todo[]> {
        return Promise.resolve(this.todos_data);
    }
    add_new_todo(new_todo: Todo): Promise<void> {
        this.todos_data = [...this.todos_data, new_todo];
        return Promise.resolve();
    }
    check_todo(todo_name: string): Promise<void> {
        const now = new Date();
        this.todos_data = this.todos_data.map((t) => (t.text == todo_name ? { ...t, lastDone: now } : t));
        return Promise.resolve();
    }
    uncheck_todo(todo_name: string): Promise<void> {
        this.todos_data = this.todos_data.map((t) => (t.text == todo_name ? { ...t, lastDone: undefined } : t));
        return Promise.resolve();
    }
    remove_todo(todo_name: string): Promise<void> {
        this.todos_data = this.todos_data.filter((t) => t.text != todo_name);
        return Promise.resolve();
    }
}
