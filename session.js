/* @flow */

import genericSession from 'koa-generic-session';
import PgSession from 'koa-pg-session';

export function middleware() {
	return function * (next) {
		var session = genericSession({
			store: new PgSession(
				// Reuse koa-pg's co-pg client pool. Replace this with a database.json type connection specification if we ever relocate the sessions table to its own machine
				this.pg.db,
				{
					schema: `public`,
					table: `sessions`,
					create: false,
					cleanupTime: 2700000 // ms, === 45 min
				}
			)
		});
		yield session.call(this, next);
	};
}
