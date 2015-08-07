/* @flow */

import passport from 'koa-passport';
import compose from 'koa-compose';

var testUser = { id: 1, username: `test` };

passport.serializeUser( (user, done) => done(null, user.id) );
passport.deserializeUser( (id, done) => done(null, testUser) );

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
var localStrategy = new LocalStrategy(
	(username, password, done) => done(
		null,
		currentUser(username, password)
	)
);
passport.use(localStrategy);

// import { Strategy as FacebookStrategy } from 'passport-facebook';
// var facebookStrategy: new FacebookStrategy(
// 	{
// 		clientID: ``,
// 		clientSecret: ``,
// 		callbackURL: ``
// 	},
// 	(token, tokenSecret, profile, done) => done(null, testUser)
// );
// passport.use(facebookStrategy);

// import { Strategy as TwitterStrategy } from 'passport-twitter';
// var twitterStrategy: new TwitterStrategy(
// 	{
// 		consumerKey: ``,
// 		consumerSecret: ``,
// 		callbackURL: ``
// 	},
// 	(token, tokenSecret, profile, done) => done(null, testUser)
// );
// passport.use(twitterStrategy);

// import { Strategy as GoogleStrategy } from 'passport-google-auth';
// var googleStrategy = new GoogleStrategy(
// 	{
// 		clientId: ``,
// 		clientSecret: ``,
// 		callbackURL: ``
// 	},
// 	(token, tokenSecret, profile, done) => done(null, testUser)
// );
// passport.use(googleStrategy);

export function withLocalStrategy(
	{ successRedirect, failureRedirect }:
	{ successRedirect: string, failureRedirect: string } = {}
) {
	return passport.authenticate(
		localStrategy.name,
		{ successRedirect, failureRedirect }
	);
}

export function middleware() {
	return compose([
		passport.initialize(),
		passport.session()
	]);
}
