interface EventStorage {
  store_event(event: TodoEvent): Promise<void>;
  get_events(): Promise<TodoEvent[]>;
}

type TodoEvent =
  | { type: 'todo_added'; text: string; reset_name: string; timestamp: Date }
  | { type: 'todo_checked'; text: string; timestamp: Date }
  | { type: 'todo_unchecked'; text: string; timestamp: Date }
  | { type: 'todo_removed'; text: string; timestamp: Date }
  | { type: 'todo_renamed'; old_text: string; new_text: string; timestamp: Date };
