/* @flow */

import koa from 'koa';
var app = koa();

// sessions
import session from './session';
app.keys = [`our-session-secret`];
app.use(session);

// body parser
import bodyParser from 'koa-bodyparser';
app.use(bodyParser());

// authentication
import passport from 'koa-passport';
import {
	serializeUserCallback,
	deserializeUserCallback,
	strategies
} from './authentication';
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
	this.body = yield this.render(`login`);
});

routes.public.post(`/login`,
	passport.authenticate(strategies.local.name, {
		successRedirect: `/app`,
		failureRedirect: `/`
	})
);

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
