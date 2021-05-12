var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    const mongoose = require("mongoose");
    const User = mongoose.model("users");
    const keys = require("../config/keys");
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  //通过配置信息来生成jwt的请求，验证这个token
opts.secretOrKey = keys.secretOrKey;
 
module.exports = passport =>{
     passport.use(new JwtStrategy(opts,function(jwt_payload,done){
        // console.log(jwt_payload); // jwt_payload就是用户信息
        User.findById(jwt_payload.id)
            .then(user =>{
            	if(user){
            		return done(null,user);
            	}
            	return done(null,false);
            })
            .catch(err => console.log(err));
     }));
}