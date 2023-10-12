const express = require('express');
const fs = require('fs').promises;
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser'); // 쿠키
const jwt = require('./jwt.js');
const db = require('./db.js');
const enc = require('./encryption.js');



const USER_COOKIE_KEY = 'USER';

const server = app.listen(3000, () => {
    console.log('Start Server / port:3000');
})
// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));

// Auth Middleware
app.use((req, res, next) => {
    const token = req.cookies[USER_COOKIE_KEY];
      // 쿠키가 존재하면 유효한 토큰인지, 만료 기한이 안지났는지 검증
    if (token) {
        const username = jwt.verifyToken(token);
          // 완벽히 유효한 토큰인 경우 req.username에 반환 받은 username 저장
        if (username !== null) {
            req.username = username;
        }
    }
    next();
});

//ROUTES
app.get('/', async (req, res)=> {
    res.sendFile(__dirname+"/public/views/index.html");
    if(req.username){
        const user = await db.fetchUser(req.username);
        if(user){
            console.log("쿠키에 아이디 존재 o : "+user.username);
            return;
        }
    }
    // 쿠키에 존재하지 않는 경우, 로그인X
    //res.status(200).send();
    console.log("쿠키에 아이디 존재 x");
});

app.get('/login', async (req, res) => {
    res.redirect('/views/login.html');
});

app.post('/login_ok',async(req,res)=>{
    const { username, password } = req.body;
    const user = await db.fetchUser(username);
    if(!user){
        // db에 아이디 없음
        res.status(400).send(`등록안된 사용자`);
        console.log("/login_ok : 없는 아이디");
        return;
    }
    // db에 아이디 있음
    console.log("password : "+password);
    console.log("user.password : "+user.password);
    const chkPassword = await enc.decrypt(password,user.password);
    if(!chkPassword){
        // 패스워드 오류
        res.status(400).send("패스워드 오류");
        console.log("/login_ok : 패스워드 오류");
        return;
    }  
    console.log("로그인 성공");
    const token = jwt.generateToken(user.username);
    res.cookie(USER_COOKIE_KEY,token);
    res.redirect('/');
})

app.get('/signup',async(req,res)=>{
    res.redirect('/views/signup.html');
})

app.post('/signup_ok', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await db.fetchUser(username);

    if(user){
        // 아이디 중복 처리
        res.status(400).send(`duplicate username : ${username}`);
        console.log("아이디 중복");
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

