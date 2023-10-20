const COMMENTDB = require('../scripts/DAO/commentDAO.js');
const express = require('express');

const jwt = require('../scripts/jwt.js');
const router = express.Router();
const USER_COOKIE_KEY = 'USER';

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

router.get('/:character/:commNum',async(req,res)=>{
    let {
        character,
        commNum
    } = req.params;
    let comments = await COMMENTDB.getComments(character,commNum)
    res.json(comments);
});
module.exports = { router };