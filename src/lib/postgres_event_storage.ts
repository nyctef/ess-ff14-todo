import pg from 'pg';

/*

CREATE TABLE events(
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp timestamptz DEFAULT current_timestamp,
    data jsonb
);

CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username text UNIQUE NOT NULL,
    hashed_password text NOT NULL
);

CREATE TABLE sessions(
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id integer NOT NULL REFERENCES users(id)
)

*/

export class PostgresEventStorage implements EventStorage {
  constructor(private client: pg.Client) {}

  static async create_from_env(): Promise<PostgresEventStorage> {
    const connectionString = process.env.FF14_TODO_PG_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('FF14_TODO_PG_CONNECTION_STRING not set');
    }

    const client = new pg.Client(connectionString);
    await client.connect();

    return new PostgresEventStorage(client);
  }

  async store_event(event: TodoEvent): Promise<void> {
    await this.client.query('INSERT INTO events (data) VALUES ($1)', [event]);
  }
  async get_events(): Promise<TodoEvent[]> {
    const result = await this.client.query('SELECT data FROM events');
    return result.rows.map((row) => row.data);
  }
}
