import { Lucia } from 'lucia';
import { building, dev } from '$app/environment';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import { client } from '../../hooks.server';

// file based on https://lucia-auth.com/getting-started/sveltekit

// TODO: dedupe

// client.on('end', () => {
//   console.log('client has disconnected');
// });
// client.on('notification', (msg) => {
//   console.log('notification:', msg);
// });
// client.on('notice', (msg) => {
//   console.log('notice:', msg);
// });
export { client };

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
