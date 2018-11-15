var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user.model');
const socialLogin = require('../controllers/sociallogincontroller');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

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
    if (!profile.emails || !profile.emails[0].value || !profile._json.email) {
      User.findOne({twitter_id:profile.id})
      .exec(function(err,user){
        if(err){
          return done(err,null)
        }
        if(!user){
          const newUser = new User({
            twitter_id:profile.id,
            name:profile.displayName,
            provider:profile.provider,
            isVerified:true,
            sociallogin:true
          })
          newUser.save(function(err,user){
            if(err){
              return done(err,null);
            }
            else{
              let token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
              });
              User.findByIdAndUpdate({_id:user._id},
                {
                  $set:{
                    token:token
                  }
                }
              ).exec(function(err,updated){
                if(err){
                  done(err,null);
                }
                else{
                  done(null,token);
                }
              })
            }
          })
        }
        else{
          let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          User.findByIdAndUpdate({_id:user._id},
            {
              $set:{
                token:token
              }
            }
          ).exec(function(err,updated){
            if(err){
              done(err,null);
            }
            else{
              done(null,token);
            }
          })
        }
      })
    }
    else{
      const obj = {
        email:profile.emails[0].value,
        profile:profile,
        twitter_id:profile.id,
      }
      socialLogin.socialLogin(obj,function(err,data){
        if(err){
          return done(err);
        }
        done(null, data);
      })
    }
  }
));

module.exports = passport;