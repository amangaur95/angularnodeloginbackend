const express = require('express');
const router = express.Router();
const passportFacebook = require('../auth/facebook');
const passportTwitter = require('../auth/twitter');
const passportGoogle = require('../auth/google');
const passport = require('passport')
  , LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const socialLogin = require('../controllers/sociallogincontroller');

/* FACEBOOK ROUTER */
router.get('/facebook',
  passportFacebook.authenticate('facebook'));

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