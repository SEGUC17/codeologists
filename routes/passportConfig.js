var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/RegisteredUser');
var hasher = require('password-hash-and-salt');

var localStrategy = new LocalStrategy(
	function (username, password, done) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username or password' });
			}
			hasher(password).verifyAgainst(user.password, function (error, verified) {
				if (error)
					return done(error);
				else if (!verified)
					return done(null, false, { message: 'Incorrect username or password' });
				else
					return done(null, user);
			});

		});
	}
);




passport.use(localStrategy);

passport.serializeUser(function (user, done) {
	done(null, {username:user.username,type:user.type,_id:user._id});
});

passport.deserializeUser(function (user, done) {
	done(null, {username:user.username,type:user.type,_id:user._id});
});


module.exports = passport;
