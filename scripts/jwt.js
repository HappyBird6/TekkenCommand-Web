require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // 보안상 소스코드에 포함시키면 안되고 .env 파일에 저장해서 주입
const EXP_TIME = 1000*60*60; // 한시간
// JWT
exports.generateToken = function(username){
    const token = jwt.sign({
        // 사용자 아이디 Payload에 저장
        username,
        // 60초뒤에 토큰 만료
        // 60초뒤에 새로고침하면 자동 로그아웃
        exp : Date.now()+EXP_TIME,
    },JWT_SECRET);

    return token;
}
exports.verifyToken = function(token){
    const decoded = jwt.verify(token,JWT_SECRET);

    if(decoded.exp < Date.now()){
        
        return null;
    }
    return decoded.username;
}