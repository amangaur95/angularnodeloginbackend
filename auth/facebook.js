const passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
const socialLogin = require('../controllers/sociallogincontroller');

passport.use(new FacebookStrategy({
    clientID: "164660424479132",
    clientSecret: "ade61c0e86e4af5baf9fca52b4a062d0",
    callbackURL: "https://angularnodelogin.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'photos'] // also 'email' is not working
  },
  function facebookHandler(accessToken, refreshToken, profile, done) {
    if (!profile.emails || !profile.emails[0].value || !profile._json.email) {
      throw new UnprocessableEntity('No Email in Facebook');
    }
    let email = profile.emails[0].value || profile._json.email;
    const obj = {
      email:email,
      profile:profile,
      facebook_id:profile.id,
    }
    socialLogin.socialLogin(obj,function(err,data){
      if(err){
        return done(err,null)
      }
      done(null,data)
    })
  }
));

module.exports = passport;
