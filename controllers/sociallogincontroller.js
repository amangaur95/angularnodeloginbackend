const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

exports.socialLogin = function(data, callback){
    User.findOne({email:data.email})
    .exec(function(err,user){
        if(err){
            callback(err, null)
        }
        if(!user){
            const newUser = new User({
                facebook_id:data.facebook_id,
                google_id:data.google_id,
                linkedin_id:data.linkedin_id,
                twitter_id:data.twitter_id,
                name:data.profile.displayName,
                email:data.email,
                provider:data.profile.provider,
                isVerified:true,
                sociallogin:true
            })
            newUser.save(function(err,user){
                if(err){
                    callback(err, null)
                }
                else{
                    let token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    User.findByIdAndUpdate({_id:user._id},{
                        $set:{
                            token:token
                        }
                    }).exec(function(err,updated){
                        if(err){
                            callback(err,null)
                        }
                        else{
                            callback(null, token)
                        }
                    })
                }
            })
        }
        else{
            let token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 10 // expires in 24 hours
            });
            let socialLoginFlag = false;
            if(user.facebook_id == data.facebook_id || user.google_id==data.google_id || user.twitter_id==data.twitter_id || user.linkedin_id==data.linkedin_id){
                socialLoginFlag = true
            }
            if(socialLoginFlag==false){
                let query = {}
                if(data.facebook_id) {
                    query.facebook_id = data.facebook_id
                }
                if(data.google_id){
                    query.google_id = data.facebook_id
                }
                if(data.linkedin_id){
                    query.linkedin_id = data.linkedin_id
                }
                if(data.twitter_id){
                    query.twitter_id = data.twitter_id
                }
                query.sociallogin=true;
                query.token=token;
                User.findOneAndUpdate({email:data.email},
                    {
                        $set: query,
                        $push:{
                            provider:data.profile.provider
                        }
                    }
                ).exec(function(err,updated){
                    if(err){
                        callback(err, null)
                    }
                    else{
                        callback(null, token)
                    }
                })
            }
            else{
                User.findOneAndUpdate({email:data.email},
                    {
                        $set:{
                            token:token
                        }
                    }
                ).exec(function(err,updated){
                    if(err){
                        callback(err,null)
                    }
                    else{
                        callback(null,token);
                    }
                })
            }
        }
    })
}