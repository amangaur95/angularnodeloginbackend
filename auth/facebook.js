const passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
const socialLogin = require('../controllers/sociallogincontroller');
const User = require('../models/user.model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

passport.use(new FacebookStrategy({
    clientID: "164660424479132",
    clientSecret: "ade61c0e86e4af5baf9fca52b4a062d0",
    callbackURL: "https://angularnodelogin.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'photos'] // also 'email' is not working
  },
  function facebookHandler(accessToken, refreshToken, profile, done) {
    if (!profile.emails || !profile.emails[0].value || !profile._json.email) {
      User.findOne({facebook_id:profile.id})
      .exec(function(err,user){
        if(err){
          return done(err,null)
        }
        if(!user){
          const newUser = new User({
            facebook_id:profile.id,
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
  }
));

module.exports = passport;
