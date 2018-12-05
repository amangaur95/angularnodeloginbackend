var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const socialLogin = require('../controllers/sociallogincontroller');

passport.use(new GoogleStrategy({
    clientID: " ", // Enter your google clientId  
    clientSecret: " ", // Enter your google clientSecret
    callbackURL: "https://angularnodelogin.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const obj = {
      email:profile.emails[0].value,
      profile:profile,
      google_id:profile.id,
    }
    socialLogin.socialLogin(obj,function(err,data){
      if(err){
        return done(err,null)
      }
      done(null,data);
    })
  }
));

module.exports = passport;
