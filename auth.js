/* @flow */

import passport from 'koa-passport';
// export { initialize, session } from 'koa-passport';

var testUser = { id: 1, username: `test` };

function serializeUserCallback(user: {id: number}, done: Function) {
	done(null, user.id);
}
function deserializeUserCallback(id: number, done: Function) {
	done(null, testUser);
}
passport.serializeUser(serializeUserCallback);
passport.deserializeUser(deserializeUserCallback);

import { Strategy as LocalStrategy } from 'passport-local';
function currentUser(username, password) {
	// validate the mooted credentials against the sessions table...
	if (username === testUser.username && password === `test`) {
		// ...and return the current user...
		return testUser;
	}
	// ...if we find one.
	return false;
}
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as TwitterStrategy } from 'passport-twitter';
// import { Strategy as GoogleStrategy } from 'passport-google-auth';
export var strategies = {
	local: new LocalStrategy(
		(username, password, done) => done(
			null,
			currentUser(username, password)
		)
	)
	// facebook: new FacebookStrategy(
	// 	{
	// 		clientID: ``,
	// 		clientSecret: ``,
	// 		callbackURL: ``
	// 	},
	// 	(token, tokenSecret, profile, done) => done(null, testUser)
	// ),
	// twitter: new TwitterStrategy(
	// 	{
	// 		consumerKey: ``,
	// 		consumerSecret: ``,
	// 		callbackURL: ``
	// 	},
	// 	(token, tokenSecret, profile, done) => done(null, testUser)
	// ),
	// new GoogleStrategy(
	// 	{
	// 		clientId: ``,
	// 		clientSecret: ``,
	// 		callbackURL: ``
	// 	},
	// 	(token, tokenSecret, profile, done) => done(null, testUser)
	// );
};

Object.values(strategies).forEach(strategy => passport.use(strategy));

export function authenticateWithLocalStrategy(
	{ successRedirect, failureRedirect }:
	{ successRedirect: string, failureRedirect: string } = {}
) {
	return passport.authenticate(
		strategies.local.name,
		{ successRedirect, failureRedirect }
	);
}
