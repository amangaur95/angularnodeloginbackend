const User = require('../models/user.model');

exports.getProfile = function(req,res){
    User.findOne({_id:req.params.id})
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