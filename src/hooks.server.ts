import { building } from '$app/environment';
import { EventSourcedApi } from '$lib/event_sourced_api';
import { InMemoryEventStorage } from '$lib/in_memory_event_storage';
import { PostgresEventStorage } from '$lib/postgres_event_storage';
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import pg from 'pg';

const connectionString = process.env.FF14_TODO_PG_CONNECTION_STRING;
// if (!connectionString) {
//   throw new Error(`FF14_TODO_PG_CONNECTION_STRING not set (asdf)`);
// }
export const client = new pg.Pool({
  connectionString,
  statement_timeout: 2000,
  query_timeout: 2000,
  //lock_timeout: 2000,
  application_name: 'ess-ff14-todo'
});
client.on('error', (err: unknown) => {
  console.error('Unexpected error on idle client', err);
});

const storage = new PostgresEventStorage(client);
const api = building ? new InMemoryEventStorage() : await EventSourcedApi.create(storage);

// based on https://lucia-auth.com/getting-started/sveltekit

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    // sveltekit types deviates from the de-facto standard
    // you can use 'as any' too
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }
  event.locals.user = user;
  event.locals.session = session;

  event.locals.api = api;

  return resolve(event);
};
