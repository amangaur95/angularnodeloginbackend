var passport = require('passport')
  , LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var User = require('../models/User');
  
passport.use(new LinkedInStrategy({
    clientID: "81uh8836c8uv82",
    clientSecret: "nPmi0D58WPNnRn4r",
    callbackURL: "https://angularnodelogin.herokuapp.com/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
  },
  function(token, tokenSecret, profile, done) {
      console.log(profile);
    User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));