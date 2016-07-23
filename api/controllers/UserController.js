/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
module.exports = {
	signin: function (req, res) {
        passport.authenticate('local', function(err, user, info){
            if((err) || (!user))
            {
                res.status(403);
                res.send({ message:info.message });
            }
            req.session.authenticated =true;
            return res.ok();
        })(req, res);
    }
};

