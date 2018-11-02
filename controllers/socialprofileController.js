const User = require('../models/user.model');

exports.socialProfile = function(req,res){
    console.log(req.body.logintoken,"aaaaaaaaaaaaa")
    const sociallogintoken = req.body.logintoken;
    const token = getToken(req.headers)
    console.log(token,"qqqqqqqqqqqqqqqq")
    if(token && token==sociallogintoken){
        User.find({token:sociallogintoken})
        .select({name:1,username:1})
        .exec(function(err,user){
            console.log(user,"=================")
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
      } else {
        return null;
      }
    } else {
      return null;
    }
  };