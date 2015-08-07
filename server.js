/* @flow */

import koa from 'koa';
var app = koa();

// database connection
import koaPg from 'koa-pg';
import db from './database';
function conStr({ user, password, host, port, database }) {
	return `postgres://${user}:${password}@${host}:${port}/${database}`;
}
app.use(koaPg({ name: `db`, conStr: conStr(db.prod) }));

// sessions
app.keys = [`our-session-secret`];
import * as session from './session';
app.use(session.middleware());

// body parser
import bodyParser from 'koa-bodyparser';
app.use(bodyParser());

// authentication
import * as auth from './auth';
app.use(auth.middleware());

// KILL ME

import views from 'koa-render';
app.use(views(`./views`, {
	map: { html: `handlebars` },
	cache: false
}));

import Router from 'koa-router';
var routes = {
	public: new Router(),
	private: new Router()
};

routes.public.get(`/`, function * (next) {
	this.redirect(this.isAuthenticated() ? `/app` : `/login`);
});

routes.public.get(`/login`, function * (next) {
	this.body = yield this.render(`login`);
});

routes.public.post(`/login`, function * (next) {
	yield auth.withLocalStrategy({
		successRedirect: `/app`,
		failureRedirect: `/`
	});
});

routes.private.get(`/logout`, function * (next) {
	this.logout();
	this.redirect();
});

routes.private.get(`/app`, function * (next) {
	this.body = yield this.render(`app`);
});

app.use(routes.public.middleware());

app.use(function * (next) {
	if (this.isAuthenticated())
	{
		yield next;
	} else {
		this.redirect(`/`);
	}
});

app.use(routes.private.middleware());

export default app;
