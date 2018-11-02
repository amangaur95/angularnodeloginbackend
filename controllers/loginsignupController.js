const User = require('../models/user.model');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

let randomToken,host,verificationlink;

exports.signUp = function(req,res){
    email=req.body.email;
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
    if (!req.body.email || !req.body.password) {
      res.json({success: false, msg: 'Please pass email and password.'});
    } 
    else {
      User.findOne({email:{
        "$regex": "^" + email + "\\b", "$options": "i"}
      })
      .exec(function(err,data){
        if(err){
          res.json({
            err:err,
            success:false
          })
        }
        if(data){
          if(data.systemlogin==true){
            res.json({
              msg:{msg1:'User already registered', msg2:'Either you can login or try new email'}
            })
          }
          else{
            if(data.sociallogin==true){
              let provider_name=[];
              let email=data.email;
              data.provider.forEach(element => {
                if(element === 'facebook' || element === 'google' || element === 'linkedin' || element === 'twitter'){
                  provider_name.push(element);
                }
              })
              res.json({
                exists_message:{msg1:'User already exists' ,msg2:''},
                provider_name:provider_name,
                email:email
              })
            }
            else{
              res.json({
                msg:{msg1:'User already registered', msg2:'Either you can login or try new email'}
              })
            }
          }
        }
        else{
          if(validateEmail(email)){
            console.log("from emailvalidation")
            const newUser =new User({
              name: req.body.name,
              username: req.body.username,
              email: email,
              password: req.body.password,
              provider:'System Login',
              sociallogin:false,
              systemlogin:true
            })
            newUser.save(function(err,data){
              console.log("dfsdfsfddfsfdsfds")
              if (err) {
                return res.json({success: false, msg: {msg1:'Something went wrong'
                  ,msg2:'Unable to create new user'}
                });
              }
              randomToken = randomstring.generate(12);
              User.findOneAndUpdate({_id:data._id},
                {$set:{
                verifiedToken:randomToken
                }
              }).exec(function(err,updated){
              if(err){
                console.log(err)
              }
              else{
                console.log('Successfully updated');
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
            verificationlink="https://"+host+"/emailverify/"+randomToken;
            const mailOptions = {
              from: 'amankumargaur1995@gmail.com',
              to:email,
              subject: 'Please confirm account',
              text: 'Hello,<br> Please Click on the link to verify your email.<br><a href='+verificationlink+'>Click here to verify</a><br>This link is expire after a single click',
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 
            res.json({success: true, 
              msg:{ str1: 'Verify your email now.', str2: 'Successful created new user.'},
              code:200
            });
            })
          }
          else{
            res.json({success:false, msg:{msg1:'Email is not a valid email',msg2:'Unable to create new user'}})
          }
        }
      });
    }
}

exports.signIn = function(req,res){
    User.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) throw err;
    
        if (!user) {
          res.json({code:401,success: false, msg: {str1:'Authentication failed.', str2: 'User not found.'}});
        } else {
            if(user.isVerified==true){
          // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
              // if user is found and password is right create a token
              // var token = jwt.sign(user.toJSON(), config.secret);
              let token = jwt.sign({ id: user._id }, config.secret, {
                // expiresIn: 10 // expires in 10 seconds
                expiresIn: 86400 // expires in 24 hours
              });
                User.update({
                  _id: user._id
                }, {
                  $set: {
                    token: token
                  }
                },
                function (err, userupdated) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("User Update");
                  }
                });
              // return the information including token as JSON
              res.json({success: true, 
                token: token,
                code:200,
                user:user,
                msg: {
                str1: 'Successfully LoggedIn',
                str2: ''
                }
              });
            } else {
              res.json({code:401, success: false, msg: {str1:'Authentication failed' ,str2:'Wrong password.'}});
            }
          });
          }
          else{
            res.json({
              msg: {
                str1: 'Please verify your email',
                str2: 'Link is send to your registered email'
                }
            })
          }
        }
      });
}