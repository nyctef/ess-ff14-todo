import type { Api } from './api';
import { get_reset_by_name } from './static_data';
import type { Todo } from './types';

export class EventSourcedApi implements Api {
  storage: EventStorage;
  todos_data: Todo[];

  constructor(init_todos: Todo[], storage: EventStorage) {
    this.todos_data = init_todos;
    this.storage = storage;
  }

  static async create(storage: EventStorage): Promise<EventSourcedApi> {
    const start = performance.now();
    const events = await storage.get_events();
    const impl = new EventSourcedApi([], storage);
    for (const event of events) {
      impl.#process_event(event);
    }
    console.log(`Loaded ${events.length} events in ${(performance.now() - start).toFixed(2)}ms`);
    return impl;
  }

  #process_event(event: TodoEvent): void {
    switch (event.type) {
      case 'todo_added':
        this.todos_data.push({
          text: event.text,
          lastDone: undefined,
          reset: get_reset_by_name(event.reset_name)
        });
        break;
      case 'todo_checked':
        this.todos_data = this.todos_data.map((t) =>
          t.text == event.text ? { ...t, lastDone: event.timestamp } : t
        );
        break;
      case 'todo_unchecked':
        this.todos_data = this.todos_data.map((t) =>
          t.text == event.text ? { ...t, lastDone: undefined } : t
        );
        break;
      case 'todo_removed':
        this.todos_data = this.todos_data.filter((t) => t.text != event.text);
        break;
      case 'todo_renamed':
        this.todos_data = this.todos_data.map((t) =>
          t.text == event.old_text ? { ...t, text: event.new_text } : t
        );
        break;
      default:
        throw Error(`Unknown event type: ${(event as any).type}`);
    }
  }

  get_current_todos(): Promise<Todo[]> {
    return Promise.resolve(this.todos_data);
  }
  async add_new_todo(new_todo: Todo): Promise<void> {
    const event = {
      type: 'todo_added',
      text: new_todo.text,
      timestamp: new Date(),
      reset_name: new_todo.reset.name
    } as const;
    await this.storage.store_event(event);
    this.#process_event(event);
  }
  async check_todo(todo_name: string): Promise<void> {
    const event = { type: 'todo_checked', text: todo_name, timestamp: new Date() } as const;
    await this.storage.store_event(event);
    this.#process_event(event);
  }
  async uncheck_todo(todo_name: string): Promise<void> {
    const event = { type: 'todo_unchecked', text: todo_name, timestamp: new Date() } as const;
    await this.storage.store_event(event);
    this.#process_event(event);
  }
  async remove_todo(todo_name: string): Promise<void> {
    const event = { type: 'todo_removed', text: todo_name, timestamp: new Date() } as const;
    await this.storage.store_event(event);
    this.#process_event(event);
  }
  async rename_todo(old_text: string, new_text: string): Promise<void> {
    const event = { type: 'todo_renamed', old_text, new_text, timestamp: new Date() } as const;
    await this.storage.store_event(event);
    this.#process_event(event);
  }
}
