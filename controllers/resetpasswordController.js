const User = require('../models/user.model');

exports.resetPassword = function(req,res){
    if(req.body.details.password === req.body.details.confirm_password){
        User.findOne({
            passwordResetToken:req.body.id
        }).exec(function(err,user){
            if(err){
                return res.json({
                    err:err,
                })
            }
            else{
                if(!user){
                    return res.json({
                        failuremessage:{msg1:'Unauthorized access/user',msg2:'Invalid Token'}
                    })
                }
                else{
                    if(user.resetPasswordExpires==0){
                        let socialLoginFlag=false;
                        user.provider.forEach(element => {
                            if(element == 'System Login'){
                                socialLoginFlag=true;
                            }
                        });
                        let query={};
                        query.password=req.body.details.password;
                        query.resetPasswordExpires=1;
                        query.systemlogin=true;

                        if(socialLoginFlag==false){
                            User.findByIdAndUpdate({_id:user._id},
                                {
                                    $set:query,
                                    $push:{
                                        provider:'System Login'
                                    }
                                }
                            ).exec(function(err,updated){
                                if(err){
                                    res.json({
                                        err:err,
                                        success:false,
                                        failuremessage:{msg1:'Unable to reset password',msg2:'Something went wrong'}
                                    })
                                }
                                else{
                                    res.json({
                                        code:200,
                                        success:true,
                                        successmessage:{msg1:'Password Reset Successfully',msg2:'You can Login Now'}
                                    })
                                }
                            })
                        }
                        else{
                            User.findByIdAndUpdate({_id:user._id},
                                {
                                    $set:query
                                }
                            ).exec(function(err,updated){
                                if(err){
                                    res.json({
                                        err:err,
                                        success:false,
                                        failuremessage:{msg1:'Unable to reset password',msg2:'Something went wrong'}
                                    })
                                }
                                else{
                                    res.json({
                                        code:200,
                                        success:true,
                                        successmessage:{msg1:'Password Reset Successfully',msg2:'You can Login Now'}
                                    })
                                }
                            })
                        }
                    }
                    else{
                        return res.json({
                            failuremessage:{msg1:'Linked Expired',msg2:''}
                        })
                    }
                }
            }
        })
    }
    else{
        res.json({
            code:401,
            failuremessage:{msg1:'Password Do Not Match', msg2:''}
        })
    }
}