require('dotenv').config();
const UserDAO = require('../scripts/DAO/UserDAO.js');
const UserTO = require('../scripts/TO/UserTO.js');
const jwt = require('../scripts/jwt.js');
const enc = require('../scripts/encryption.js');
const express = require('express');
const axios = require('axios');
const USER_COOKIE_KEY = process.env.USER_COOKIE_KEY;
const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN_REDIRECT_PATH = '/login_google/redirect';
const GOOGLE_LOGIN_REDIRECT_URI = 'http://localhost:3000/user' + GOOGLE_LOGIN_REDIRECT_PATH;
const GOOGLE_SIGNUP_REDIRECT_PATH = '/signup_google/redirect';
const GOOGLE_SIGNUP_REDIRECT_URI = 'http://localhost:3000/user' + GOOGLE_SIGNUP_REDIRECT_PATH;;
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

router.use('/', (req, res, next) => {
    const token = req.cookies[USER_COOKIE_KEY];
    
    if (token) {
        const id = jwt.verifyToken(token);
        if (id !== null) {
            req.id = id;
        } else {
            res.cookie(USER_COOKIE_KEY, token, { maxAge: 0 });
        }
    }
    next();
});

router.get('/login', async (req, res) => {
    res.redirect('/html/login.html');
});
router.post('/login/redirect', async (req, res) => {
    const { id, password } = req.body;
    let userTO = await UserDAO.fetchUser(new UserTO(id));
    if (!userTO.nickname) {
        // db에 아이디 없음
        res.status(400).send(`등록안된 사용자`);
        return;
    }

    const chkPassword = await enc.decrypt(password, userTO.password);
    if (!chkPassword) {
        // 패스워드 오류
        res.status(400).send("패스워드 오류");
        return;
    }
    // 로그인 성공, jwt 토큰 생성
    const token = jwt.generateToken(userTO);
    res.cookie(USER_COOKIE_KEY, token);
    res.redirect('/');
})

// 구글 로그인
router.get('/login_google', async (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`
    url += '&response_type=code'
    url += '&scope=email profile'

    res.redirect(url);
})
// 구글 로그인 redirect
router.get(GOOGLE_LOGIN_REDIRECT_PATH, async (req, res) => {
    try {
        const { code } = req.query;
        const resp = await axios.post(GOOGLE_TOKEN_URL, {
            // x-www-form-urlencoded(body) 형식
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_LOGIN_REDIRECT_URI,
            grant_type: 'authorization_code',
        });
        const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
            // Request Header에 Authorization 추가
            headers: {
                Authorization: `Bearer ${resp.data.access_token}`,
            },
        });
        const id = resp2.data.email;
        const password = resp2.data.id;
        // resp2.data.~~ 에서 정보 몇개를 db에서 체크.

        let userTO = await UserDAO.fetchUser(new UserTO(id));
    
        if (!userTO.nickname) {
            // db에 아이디 없음 -> db에 등록
            let newUser = new UserTO(id,password,"구글유저임시닉네임");

            user = await UserDAO.createUser(newUser); 
        }
        else {
            //console.log("기존 구글 유저");
            // db에 아이디 있음
            const chkPassword = await enc.decrypt(password, userTO.password);
            if (!chkPassword) {
                // 패스워드 오류
                //console.log("패스 워드 오류");
                // 패스워드 오류가 정상적으로라면 날 일이 없어야 하기때문에
                // 오류가 생긴다면 오류메세지 출력
                res.redirect('/');
                return;
            }
        }
        const token = jwt.generateToken(userTO); 
        res.cookie(USER_COOKIE_KEY, token);
    } catch (err) {
        //console.log("구글 로그인 오류");
        console.log(err);
    }finally{
        res.redirect('/');
    }

})
router.get('/signup', async (req, res) => {
    res.redirect('/html/signup.html');
})

router.post('/signup/redirect', async (req, res) => {
    const { nickname, id, password } = req.body;
    //console.log(id);
    let userTO = await UserDAO.fetchUser(new UserTO(id));

    if (userTO.nickname!=='') {
        // 아이디 중복 처리
        res.status(400).send(`duplicate id : ${id}`);
        return;
    }
    userTO.nickname = nickname;
    userTO.password = password;
    userTO = await UserDAO.createUser(userTO);

    const token = jwt.generateToken(userTO);
    res.cookie(USER_COOKIE_KEY, token);
    res.redirect('/');
})

router.get('/logout/redirect', async (req, res) => {
    res.clearCookie(USER_COOKIE_KEY);
    res.redirect('/');
})

module.exports = { router, USER_COOKIE_KEY };