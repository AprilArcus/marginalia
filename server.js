/* @flow */

import koa from 'koa';
var app = koa();

// database connection
import koaPg from 'koa-pg';
import { prod } from './database';

app.use(koaPg(
	`postgres://${prod.user}:${prod.password}@` +
	`${prod.host}:${prod.port}/${prod.database}`
));

// sessions
app.keys = [`our-session-secret`];
import genericSession from 'koa-generic-session';
import PgStore from 'koa-pg-session';
var session = genericSession({
	store: new PgStore(prod, {
		schema: `public`,
		table: `sessions`,
		create: false,
		cleanupTime: 2700000 // ms, === 45 min
	})
});
app.use(function * (next) {
	console.log(this.pg);
	yield session.call(this, next);
});

// body parser
import bodyParser from 'koa-bodyparser';
app.use(bodyParser());

// authentication
import passport from 'koa-passport';
import {
	serializeUserCallback,
	deserializeUserCallback,
	strategies
} from './auth';
passport.serializeUser(serializeUserCallback);
passport.deserializeUser(deserializeUserCallback);
Object.values(strategies).forEach(strategy => passport.use(strategy));
app.use(passport.initialize());
app.use(passport.session());

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
	yield passport.authenticate(strategies.local.name, {
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
