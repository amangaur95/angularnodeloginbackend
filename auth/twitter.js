var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/User');

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
    callbackURL: "http://localhost:3000/auth/twitter/callback",
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    includeEmail: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile,"from passport twitter",profile.emails);

    const obj = {
      email:email,
      profile:profile,
      facebook_id:profile.id,
    }
    socialLogin.socialLogin(obj,function(err,data){
      if(err){
        return done(err);
      }
      done(null, data);
    })
    // const user= new User({
    //   name:profile.displayName,
    // })
    // user.save(function(err,user){
    //   if(err){
    //     console.log(err);
    //     return done(err);
    //   }
    //   done(null, user);
    // });
    // User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
    //   if (err) {
    //     console.log(err); 
    //     return done(err);
    //   }
    //   done(null, user);
    // });
  }
));

module.exports = passport;