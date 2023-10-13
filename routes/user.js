require('dotenv').config();
const db = require('../scripts/db.js');
const jwt = require('../scripts/jwt.js');
const enc = require('../scripts/encryption.js');
const express = require('express');

const router = express.Router();
const USER_COOKIE_KEY = 'USER';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN_REDIRECT_PATH = '/user/login_google/redirect';
const GOOGLE_LOGIN_REDIRECT_URI = 'http://localhost:3000'+GOOGLE_LOGIN_REDIRECT_PATH;
const GOOGLE_SIGNUP_REDIRECT_PATH = '/user/signup_google/redirect';
const GOOGLE_SIGNUP_REDIRECT_URI = 'http://localhost:3000'+GOOGLE_SIGNUP_REDIRECT_PATH;;
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';


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
    res.redirect('/html/login.html');
});
router.post('/login/redirect',async(req,res)=>{
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
    console.log("/login/redirect : 로그인 성공");
    const token = jwt.generateToken(user.username);
    res.cookie(USER_COOKIE_KEY,token);
    res.redirect('/');
})
router.get('/user/login_google',async(req,res)=>{
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`
    url += '&response_type=code'
    url += '&scope=email profile'    
	res.redirect(url);
})
router.get(GOOGLE_LOGIN_REDIRECT_PATH,async(req,res)=>{
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('ok');////////////여기서 부터 시작
})
router.get('/signup',async(req,res)=>{
    res.redirect('/html/signup.html');
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

module.exports = {router,USER_COOKIE_KEY};