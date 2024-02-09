import { Client } from 'pg';

/*

CREATE TABLE events(
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp timestamptz DEFAULT current_timestamp,
    data jsonb
);

*/

class PostgresEventStorage implements EventStorage {
  constructor(private client: Client) {}

  static async create_from_env(): Promise<PostgresEventStorage> {
    const client = new Client(process.env.FF14_TODO_PG_CONNECTION_STRING);
    await client.connect();
    return new PostgresEventStorage(client);
  }

  async store_event(event: TodoEvent): Promise<void> {
    await this.client.query('INSERT INTO events (type, data) VALUES ($1, $2)', [event.type, event]);
  }
  async get_events(): Promise<TodoEvent[]> {
    const result = await this.client.query('SELECT data FROM events');
    return result.rows.map((row) => row.data);
  }
}
