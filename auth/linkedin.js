const passport = require('passport')
  , LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const socialLogin = require('../controllers/sociallogincontroller');
  
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