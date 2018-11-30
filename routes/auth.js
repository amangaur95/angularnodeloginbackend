const express = require('express');
const router = express.Router();
const passportFacebook = require('../auth/facebook');
const passportTwitter = require('../auth/twitter');
const passportGoogle = require('../auth/google');
const passport = require('passport')
  , LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const socialLogin = require('../controllers/sociallogincontroller');
const User = require('../models/user.model');

/* FACEBOOK ROUTER */
router.get('/facebook',
  passportFacebook.authenticate('facebook', { scope: ['email']}));

router.get('/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: 'https://loginangularnode.herokuapp.com/login' }),
  function(req, res) {
    let token = req.user;
    // Successful authentication, redirect home.
    res.redirect('https://loginangularnode.herokuapp.com/socialprofile/' + token);
  });

/* GOOGLE ROUTER */
router.get('/google',
  passportGoogle.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
] }));

router.get('/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: 'https://loginangularnode.herokuapp.com/login' }),
  function(req, res) {
    let token = req.user;
    res.redirect('https://loginangularnode.herokuapp.com/socialprofile/' + token);
  });

/* TWITTER ROUTER */
router.get('/twitter',
  passportTwitter.authenticate('twitter', {scope: 'email'}));

router.get('/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: 'https://loginangularnode.herokuapp.com/login' }),
    function(req, res) {
      let token = req.user;
      res.redirect('https://loginangularnode.herokuapp.com/socialprofile/' + token);
});


passport.use(new LinkedInStrategy({
    clientID: "86721oa8ii4dxm",
    clientSecret: "DB8bka0WeolsOIQ3", 
    callbackURL: "https://angularnodelogin.herokuapp.com/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
    state: true
  }, function(accessToken, refreshToken, profile, done) {
    console.log(profile,"============")
    if (!profile.emails || !profile.emails[0].value || !profile._json.email) {
      User.findOne({linkedin_id:profile.id})
      .exec(function(err,user){
        if(err){
          return done(err,null)
        }
        if(!user){
          const newUser = new User({
            linkedin_id:profile.id,
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
      const obj ={
        profile:profile,
        linkedin_id:profile.id,
        email:profile.emails[0].value,
      }
      socialLogin.socialLogin(obj,function(err,data){
        if(err){
          return done(err,null);
        }
        done(null,data);
      })
    } 
  }));

/* LINKEDIN ROUTER */
router.get('/linkedin',
  passport.authenticate('linkedin'));

router.get('/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: 'https://loginangularnode.herokuapp.com/login'}) ,
    function(req,res){
      let token = req.user;
      res.redirect('https://loginangularnode.herokuapp.com/socialprofile/' + token);
  });

module.exports = router;
