import { lucia, client } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import type { RequestEvent } from '../$types.js';

// based on https://lucia-auth.com/tutorials/username-and-password/sveltekit

export const actions = {
  default: async (event: RequestEvent) => {
    return fail(400, { message: 'Signup currently unavailable' });

    const formData = await event.request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (
      typeof username !== 'string' ||
      username.length < 3 ||
      username.length > 31 ||
      !/^[a-z0-9_-]+$/.test(username)
    ) {
      console.log('Invalid username');
      return fail(400, {
        message: 'Invalid username'
      });
    }
    if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
      console.log('Invalid password');
      return fail(400, {
        message: 'Invalid password'
      });
    }

    const hashedPassword = await new Argon2id().hash(password);
    let userId = null;

    try {
      const idResult = await client.query(
        `
      INSERT INTO users(username, hashed_password)
      VALUES ($1, $2)
      RETURNING id`,
        [username, hashedPassword]
      );
      console.log({ idresult });
      userId = idResult.rows[0].id;
    } catch (e) {
      // TODO: catch unique constraint violation for duplicate username explicitly
      console.log(e);
      return fail(500, {
        message: 'Internal server error ' + e
      });
    }

    // TODO: how important is it to create the session with a userId here instead of just using the username?
    // the docs seem to make the distinction explicit
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    redirect(302, '/');
  }
};
