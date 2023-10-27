require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser'); // 쿠키
const jwt = require('./scripts/jwt.js');
const USER_COOKIE_KEY = process.env.USER_COOKIE_KEY;
const SESSION_SECRET = process.env.SESSION_SECRET;
const UserDAO = require('./scripts/DAO/UserDAO.js');
const UserTO = require('./scripts/TO/UserTO.js');
const CommentDAO = require('./scripts/DAO/CommentDAO.js');

const app = express();
const server = app.listen(3000, () => {
    console.log('Start Server / port:3000');
})

// MIDDLEWARES
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// Auth Middleware
app.use('/', async (req, res, next) => {
    const token = req.cookies[USER_COOKIE_KEY];
    if (token) {
        let userTO = jwt.verifyToken(token);
        if (userTO) {
            res.cookie('isLogin',1);
            req.nickname = userTO.nickname;
        }else{
            res.cookie('isLogin',0);
            res.cookie(USER_COOKIE_KEY, token, { maxAge: 0 });
        }
    }    
    next();
});

app.use('/user', require('./routes/user.js').router);
app.use('/myPage',require('./routes/myPage.js').router);
app.use('/comment', require('./routes/comment.js').router);


//ROUTES
app.get('/', async (req, res) => {
    // 메인페이지
    // isLogin - 0 : 로그인x, 1 : 로그인o
    res.render('index', { isLogin : req.cookies['isLogin'], nickname : req.nickname });
});

