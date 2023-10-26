const CommentDAO = require('../scripts/DAO/CommentDAO.js');
const express = require('express');

const bodyParser = require('body-parser');
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
    let comments = await CommentDAO.getComments(character,commNum)
    res.json(comments);
});
router.post('/vote',async(req,res)=>{
    if(!req.userTO) res.send("로그인 해야 합니다.");
    const commentInfo = req.body.recommendationInfo;
    const up = commentInfo.split('_')[0];
    const comm_seq = commentInfo.split('_')[1];
    const user_seq = req.userTO.seq;
    let flag = await CommentDAO.voteComment(up,comm_seq,user_seq);
    if(flag===1) res.send('추천이 성공적으로 처리되었습니다.');
    else if(flag===0) res.send('이미 추천 / 비추천한 댓글');
});

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/comments', async (req, res) => {
    // commentInfo = content_charName_commNum;
    const commentInfo = req.body.commentInfo;
    const content = commentInfo.split('_')[0];
    const charName = commentInfo.split('_')[1];
    const commNum = commentInfo.split('_')[2];

    if(!req.userTO){
        // 로그인 안되어있는 상태
        res.send('로그인해야 합니다.');
    }else{
        // flag = 1 성공 / 0 실패
        // console.log(`const flag = CommentDAO.insertComment(${req.userTO.id},${charName},${commNum},${content})`)
        try{
            let flag = await CommentDAO.insertComment(req.userTO,charName,commNum,content);
            if(flag===1) res.send('댓글이 성공적으로 처리되었습니다.');
            else if(flag===0) req.send('댓글 작성 실패');
            //console.log(flag);
        }catch(err){

        }finally{
        }
    }
});
module.exports = { router };