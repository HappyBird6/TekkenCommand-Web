require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserTO = require('../scripts/TO/UserTO.js');
const JWT_SECRET = process.env.JWT_SECRET; // 보안상 소스코드에 포함시키면 안되고 .env 파일에 저장해서 주입
const EXP_TIME = 1000*60*200; // 200분
// JWT
const generateToken = function(userTO){
    const token = jwt.sign({
        userTO_JSON : userTO.toJSON(),
        exp : Date.now()+EXP_TIME,
    },JWT_SECRET);
    return token;
}
const verifyToken = function(token){
    const decoded = jwt.verify(token,JWT_SECRET);
    if(decoded.exp < Date.now()){
        return null;
    }

    return UserTO.fromJSON(decoded.userTO_JSON);
}
const verifyLoginState = function(key){
    if(key){
        let userTO = verifyToken(key);
        if(userTO) return userTO;
        else return null;
    }else{
        return null;
    }
}
module.exports = {EXP_TIME, generateToken, verifyToken, verifyLoginState};