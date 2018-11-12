var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const socialLogin = require('../controllers/sociallogincontroller');

passport.use(new GoogleStrategy({
    clientID: "358256820106-j7ulil6f3tjuohb3d8jnd2shp3u3kkkk.apps.googleusercontent.com",
    clientSecret: "3qdl8WC-7osC54oSARKuo8nz",
    callbackURL: "https://angularnodelogin.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile,"ahhhhhhhhh",profile.emails[0].value)
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
