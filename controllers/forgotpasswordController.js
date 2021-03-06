const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const User = require('../models/user.model');

randomToken = randomstring.generate(30);

exports.forgotPassword = function(req,res){
    let email=req.body.email;
    User.findOne({email:email})
    .exec(function(err,user){
      if(err){
        res.json({
          err:err,
          success:false
        })
      }
      if(!user){
        return res.json({
          code:403,
          success:false,
          failuremessage:{msg1:'Please provide a valid email', msg:'Email not found'}
        })
      }
      else{
        User.findOneAndUpdate({email:email},{$set:{
          passwordResetToken:randomToken,
          resetPasswordExpires:0
        }}).exec(function(err,updated){
          if(err){
            console.log(err)
          }
          else{
            console.log("Successfully updated")
          }
        })
        
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: '',  // Enter your gmail id
            pass: ''  // Enter your gmail password
          }
        });
        host="loginangularnode.herokuapp.com" 
        resetpasswordlink="https://"+host+"/passwordreset/"+randomToken;
        const mailOptions = {
          from: '',  // Enter your gmail id
          to:email,
          subject: 'Please Reset Password',
          html: 'Hello,<br> Please Click on the link to reset your password.<br><a href='+resetpasswordlink+'>Click here to verify</a><br>This link is expire after a single click',
        };
          
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.json({
              error:error,
              failuremessage:{msg1:'Unable to sent verification link to your email',msg2:'Something went wrong'}
            })
          } else {
            res.json({
              code:200,
              successmessage:{msg1:'Link is sent to your email',msg2:'Reset password'},
              info:info,
            })
          }
        }); 
      }
    })
}
