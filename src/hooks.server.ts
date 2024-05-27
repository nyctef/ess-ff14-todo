import { EventSourcedApi } from '$lib/event_sourced_api';
import { PostgresEventStorage } from '$lib/postgres_event_storage';
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

const storage = await PostgresEventStorage.create_from_env();
const api = await EventSourcedApi.create(storage);

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
