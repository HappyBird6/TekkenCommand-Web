const db = require('../scripts/db.js');
const jwt = require('../scripts/jwt.js');
const enc = require('../scripts/encryption.js');
const express = require('express');

const router = express.Router();
const USER_COOKIE_KEY = 'USER';


router.use('/',(req, res, next)=>{
    const token = req.cookies[USER_COOKIE_KEY];

    if (token) {
        const username = jwt.verifyToken(token);
        if (username !== null) {
            req.username = username;
        }else{
            res.cookie(USER_COOKIE_KEY,token,{maxAge : 0});
        }
    }
    next();
});

router.get('/login', async (req, res) => {
    res.redirect('/views/login.html');
});

router.post('/login_ok',async(req,res)=>{
    const { username, password } = req.body;
    const user = await db.fetchUser(username);
    if(!user){
        // db에 아이디 없음
        res.status(400).send(`등록안된 사용자`);
        console.log("/login_ok : 없는 아이디");
        return;
    }
    // db에 아이디 있음
    const chkPassword = await enc.decrypt(password,user.password);
    if(!chkPassword){
        // 패스워드 오류
        res.status(400).send("패스워드 오류");
        console.log("/login_ok : 패스워드 오류");
        return;
    }  
    console.log("/login_ok : 로그인 성공");
    const token = jwt.generateToken(user.username);
    res.cookie(USER_COOKIE_KEY,token);
    res.redirect('/');
})

router.get('/signup',async(req,res)=>{
    res.redirect('/views/signup.html');
})

router.post('/signup_ok', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await db.fetchUser(username);

    if(user){
        // 아이디 중복 처리
        res.status(400).send(`duplicate username : ${username}`);
        console.log("/signup_ok : 아이디 중복");
        return;
    }
    const newUser={
        username,
        password,
    };
    await db.createUser(newUser);
    
    const token = jwt.generateToken(newUser.username);
    res.cookie(USER_COOKIE_KEY,token);
    res.redirect('/');
})

router.get('/logout_ok', async (req, res) => {
    res.clearCookie(USER_COOKIE_KEY);
    res.redirect('/');
})
router.get('/userinfo',async(req,res)=>{
    console.log("/userinfo : "+req.username);
    const user = await db.fetchUser(req.username);
    if(!user){
        console.log("/userinfo : 로그인 안됨");
        return;
    }
    res.json(req.username);
})

module.exports = {router,USER_COOKIE_KEY};