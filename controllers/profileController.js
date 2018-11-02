const User = require('../models/user.model');
const passport = require('passport');
require('../config/passport')(passport);

exports.getProfile = function(req,res){
    const token = getToken(req.headers)
    if(token){
        User.find({token:token})
        .select({name:1,username:1})
        .exec(function(err,user){
            if(err){
                return res.json({
                    err:err,
                    failurmessage:'Unable to fetch user detail'
                })
            }
            else{
                res.json({
                    code:200,
                    user:user,
                    success:true
                })
            }
        })
    }
    else{
        return res.json({
            code:403,        
            success: false, 
            msg: 'Unauthorized.'
        });
    }
}


getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } 
        else {
            return null;
        }
    } 
    else {
        return null;
    }
};