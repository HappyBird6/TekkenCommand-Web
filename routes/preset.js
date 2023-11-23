require('dotenv').config();
const CommentDAO = require('../scripts/DAO/CommentDAO.js');
const express = require('express');

const bodyParser = require('body-parser');
const jwt = require('../scripts/jwt.js');
const FavoriteDAO = require('../scripts/DAO/FavoirteDAO.js');
const router = express.Router();
const USER_COOKIE_KEY = process.env.USER_COOKIE_KEY;

router.get('/',async (req,res)=>{
    let data;
    if(jwt.verifyLoginState(req.cookies[USER_COOKIE_KEY])==null){
        data = [0];
    }else{
        //let presetData = await FavoriteDAO.selectFavoriteAll(req.cookies['userSeq']);
        //console.log(favoriteData);
        data = [1,[]];
    }
    res.cookie('character','0');
    res.cookie('page',2);
    res.json(data);
});


module.exports = { router };