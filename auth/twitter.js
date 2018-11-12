var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user.model');
const socialLogin = require('../controllers/sociallogincontroller');

passport.serializeUser(function (user, fn) {
  fn(null, user);
});

passport.deserializeUser(function (id, fn) {
  User.findOne({_id: id.doc}, function (err, user) {
    fn(err, user);
  });
});

passport.use(new TwitterStrategy({
    consumerKey: "ntykZzV4c3SxEE9jvb1vgO01u",
    consumerSecret: "GqfSj7zjDFGjN2WQAXEPFssIoCfbCbIxo2cKDl6JvWIVifQPCb",
    callbackURL: "https://angularnodelogin.herokuapp.com/auth/twitter/callback",
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    includeEmail: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile,"from passport twitter",profile.emails);

    const obj = {
      email:profile.emails[0].value,
      profile:profile,
      facebook_id:profile.id,
    }
    socialLogin.socialLogin(obj,function(err,data){
      if(err){
        return done(err);
      }
      done(null, data);
    })
  }
));

module.exports = passport;