export class InMemoryEventStorage implements EventStorage {
  events: TodoEvent[] = [];

  store_event(event: TodoEvent): Promise<void> {
    this.events.push(event);
    return Promise.resolve();
  }
  get_events(): Promise<TodoEvent[]> {
    return Promise.resolve(this.events);
  }
}
