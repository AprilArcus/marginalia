import genericSession from 'koa-generic-session';
import PgStore from 'koa-pg-session';
import database from './database';

export default genericSession({
	store: new PgStore(database.prod, {
		schema: `public`,
		table: `sessions`,
		create: false,
		cleanupTime: 2700000 // ms, === 45 min
	})
});
