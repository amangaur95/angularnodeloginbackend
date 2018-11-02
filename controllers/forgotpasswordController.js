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
            user: 'amankumargaur1995@gmail.com',
            pass: 'gaur@123'
          }
        });
        host="angularnodelogin.herokuapp.com" 
        resetpasswordlink="https://"+host+"/passwordreset/"+randomToken;
        const mailOptions = {
          from: 'amankumargaur1995@gmail.com',
          to:email,
          subject: 'Please confirm account',
          text: 'Hello,<br> Please Click on the link to verify your email.<br><a href='+resetpasswordlink+'>Click here to verify</a><br>This link is expire after a single click',
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