var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/User');
const socialLogin = require('../controllers/sociallogincontroller');

passport.use(new GoogleStrategy({
    clientID: "371924117534-a2n94nnhksh54gb2sekih5r9pt14i7dr.apps.googleusercontent.com",
    clientSecret: "GxP8BaI8sHIpfoSfhDQSu-8Q",
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
