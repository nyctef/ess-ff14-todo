import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import pg from 'pg';

// file based on https://lucia-auth.com/getting-started/sveltekit

// TODO: dedupe (plus use a pool instead of a single client?)
const connectionString = process.env.FF14_TODO_PG_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('FF14_TODO_PG_CONNECTION_STRING not set');
}

export const client = new pg.Client(connectionString);

const adapter = new NodePostgresAdapter(client, {
  user: 'auth_user',
  session: 'user_session'
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: !dev
    }
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}
