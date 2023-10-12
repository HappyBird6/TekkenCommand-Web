const express = require('express');
const app = express();
const path = require('path');
const jwt = require('./scripts/jwt.js');
const USER_COOKIE_KEY = require('./routes/user.js').USER_COOKIE_KEY;
const cookieParser = require('cookie-parser'); // 쿠키
const db = require('./scripts/db.js');
const server = app.listen(3000, () => {
    console.log('Start Server / port:3000');
})

// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));


// Auth Middleware
app.use('/',(req, res, next)=>{
    const token = req.cookies[USER_COOKIE_KEY];

    if (token) {
        const username = jwt.verifyToken(token);
        if (username !== null) {
            req.username = username;
        }
    }
    next();
});

app.use('/user',require('./routes/user.js').router);


//ROUTES
app.get('/', async (req, res)=> {
    res.sendFile(__dirname+"/public/views/index.html");
    if(req.username){
        const user = await db.fetchUser(req.username);
        if(user){
            console.log("쿠키에 아이디 존재 o : "+user.username);
            return;
        }else{
            console.log("쿠키에 아이디 존재 x");
        }
    }
    // 쿠키에 존재하지 않는 경우, 로그인X
    //res.status(200).send();
    console.log("쿠키에 아이디 존재 x");
});
