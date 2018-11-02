const User = require('../models/user.model');

exports.emailVerify = function(req,res){
    User.findOne({
        verifiedToken:req.params.id
    }).exec(function(err,user){
        if(err){
            return res.json({
                err:err,
                failuremessage:'Something went wrong'
            })
        }
        else{
            if(!user){
                return res.json({
                    success:false,
                    userinvalidmsg:{msg1:'Token is not a valid token',msg2:'Unauthorized access/user'}
                })
            }
            else{
                if(user.isDeleted==false && user.clickStatus==0){
                    user.isVerified=true,
                    user.clickStatus=1,
                    user.save(function(err,saved){
                        if(err){
                            res.json({
                                err:err,
                                success:false,
                                failuremessage:{msg1:'Unable to verify email',msg2:'Something went wrong'}
                            })
                        }
                        else{
                            res.json({
                                code:200,
                                success:true,
                                successverification:{
                                    msg1:'Your email is verified successfully',
                                    msg2:'You can Login Now'
                                }
                            })
                        }
                    })
                }
                else{
                    res.json({linkexpiremsg:{msg1:"Link expired",msg2:"Try new verification link"}});
                }
            }
        }
    })
}