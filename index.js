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
            res.cookie('userSeq',userTO.seq);
        }else{
            res.cookie('isLogin',0);
            res.cookie('userSeq',-1);
            res.cookie(USER_COOKIE_KEY, token, { maxAge: 0 });
        }
    }else{
        res.cookie('isLogin',0);
        res.cookie('userSeq',-1);
    }
        
    next();
});

//ROUTES
app.use('/user', require('./routes/user.js').router);
app.use('/favorite',require('./routes/favorite.js').router);
app.use('/preset',require('./routes/preset.js').router);
app.use('/command',require('./routes/command.js').router);
app.use('/comment', require('./routes/comment.js').router);
app.use('/db', require('./routes/db.js').router);
app.use('/commandAPI', require('./routes/commandAPI.js').router);

app.get('/',async (req,res)=>{
    // 메인페이지
    // isLogin - 0 : 로그인x, 1 : 로그인o
    res.cookie('page',0);
    res.cookie('character',0);
    
    res.render('index', {isLogin : req.cookies['isLogin'], nickname : req.nickname});
});

