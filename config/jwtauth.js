const jwt = require('jsonwebtoken');
const config = require('./database');

module.exports = function(req,res,next){
    const token = getToken(req.headers);
    if(token){
        jwt.verify(token, config.secret, function (err, decoded){
            if(err){
                return res.json({
                    code:403,
                    success:false,
                    message:'Failed to authenticate user.'
                })
            }
            else{
                req.decoded = decoded;
                req.authenticated = true;
                next();
            }
        });
    }
    else{
        return res.json({
            code: 403, 
            success: false, 
            message: 'No token provided.' 
        });
    }
}

getToken = function (headers) {
    if (headers && headers.authorization) {
      let parted = headers.authorization.split(' ');
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