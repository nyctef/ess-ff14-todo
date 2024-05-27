import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import pg from 'pg';

// file based on https://lucia-auth.com/getting-started/sveltekit

// TODO: dedupe
const connectionString = process.env.FF14_TODO_PG_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('FF14_TODO_PG_CONNECTION_STRING not set');
}

export const client = new pg.Pool({
  connectionString,
  statement_timeout: 2000,
  query_timeout: 2000,
  //lock_timeout: 2000,
  application_name: 'ess-ff14-todo'
});
client.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});
// client.on('end', () => {
//   console.log('client has disconnected');
// });
// client.on('notification', (msg) => {
//   console.log('notification:', msg);
// });
// client.on('notice', (msg) => {
//   console.log('notice:', msg);
// });

const adapter = new NodePostgresAdapter(client, {
  user: 'users',
  session: 'sessions'
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
