const express           = require('express');
const ejs               = require('ejs');
const path              = require('path');
const cookieParser      = require('cookie-parser'); // 쿠키
const jwt               = require('./scripts/jwt.js');
const USER_COOKIE_KEY   = require('./routes/user.js').USER_COOKIE_KEY;
const db                = require('./scripts/db.js');

const app = express();
const server = app.listen(3000, () => {
    console.log('Start Server / port:3000');
})

// MIDDLEWARES
app.set('view engine', 'ejs');
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
    //res.sendFile(__dirname+"/public/views/index.ejs");
    if(req.username){
        console.log("쿠키에 req.username 존재 o : "+req.username);
        const user = await db.fetchUser(req.username);
        if(user){
            
        }else{
            
        }
    }else{
        console.log("쿠키에 req.username 존재x");
    }
    res.render('index', { username: req.username });
});
