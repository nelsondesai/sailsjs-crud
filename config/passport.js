var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, { message: 'Credentials not recognised!' });
        }

        bcrypt.compare(password, user.password, function (err, res) {
            if (!res) {
                return done(null, false, { message: 'Credentials not recognised!' });
            }

            return done(null, user, 'Signin success');
        });
    });
}));
