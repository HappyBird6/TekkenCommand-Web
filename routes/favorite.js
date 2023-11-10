require('dotenv').config();
const CommentDAO = require('../scripts/DAO/CommentDAO.js');
const express = require('express');

const bodyParser = require('body-parser');
const jwt = require('../scripts/jwt.js');
const FavoriteDAO = require('../scripts/DAO/FavoirteDAO.js');
const router = express.Router();
const USER_COOKIE_KEY = process.env.USER_COOKIE_KEY;


router.get('/',async (req,res)=>{
    const token = req.cookies[USER_COOKIE_KEY];
    let userFavoriteData;
    if (token) {
        let userTO = jwt.verifyToken(token);
        userFavoriteData = await FavoriteDAO.selectFavoriteAll(req.cookies['userSeq']);
        console.log(userFavoriteData);
    }else{
        userFavoriteData = "값 없음";
    }
    res.cookie('character','');
    res.cookie('page',1);
    res.render('index',{userFavoriteData : userFavoriteData, isLogin : req.cookies['isLogin'], nickname : req.nickname});
});

module.exports = { router };