var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user.model');
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
    // const user = new User({
    //   name: profile.displayName,
    //   userid: profile.id, 
    //   email:profile.emails[0].value 
    // })
    // user.save(function(err,user){
    //   return done(err,user);
    // })
    // User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id, email:profile.emails[0].value }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

module.exports = passport;
