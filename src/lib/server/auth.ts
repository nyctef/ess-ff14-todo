import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import pg from 'pg';

// file based on https://lucia-auth.com/getting-started/sveltekit

export const db_pool = new pg.Pool();

const adapter = new NodePostgresAdapter(db_pool, {
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
