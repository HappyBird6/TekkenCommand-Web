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
    // 쿠키에 jwt 토큰
    const token = req.cookies[USER_COOKIE_KEY];
    if (token) {
        let userTO = jwt.verifyToken(token);
        if (userTO) {
            req.userTO = userTO;
        }
    }
    next();
});

app.use('/user', require('./routes/user.js').router);
app.use('/comment', require('./routes/comment.js').router);


//ROUTES
app.get('/', async (req, res) => {
    //res.sendFile(__dirname+"/public/views/index.ejs");

    if (req.userTO) {
        let userTO = await UserDAO.fetchUser(new UserDAO(req.userTO));
        
        if (userTO.nickname) {
            // db에 id 있음.
        } else {
            // 잘못된 인증정보.
        }
    } else {
    }
    res.render('index', { userTO: req.userTO });
});

