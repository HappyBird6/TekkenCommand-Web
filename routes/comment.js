require('dotenv').config();
const CommentDAO = require('../scripts/DAO/CommentDAO.js');
const express = require('express');

const bodyParser = require('body-parser');
const jwt = require('../scripts/jwt.js');
const router = express.Router();
const USER_COOKIE_KEY = process.env.USER_COOKIE_KEY;

router.get('/:character/:commNum',async(req,res)=>{
    let {
        character,
        commNum
    } = req.params;
    let comments = await CommentDAO.getComments(character,commNum)
    res.json(comments);
});
router.post('/vote',async(req,res)=>{
    if(req.cookies['isLogin']==0) {
        console.log('로그인 해야합니다.');
        return;
    }
    const commentInfo = req.body.recommendationInfo;
    const up       = commentInfo.split('_')[0];
    const comm_seq = commentInfo.split('_')[1];
    const token = req.cookies[USER_COOKIE_KEY];
    if (token) {
        let userTO = jwt.verifyToken(token);
        const user_seq = userTO.seq;
        let flag = await CommentDAO.voteComment(up,comm_seq,user_seq);
        if(flag===1)      res.send('추천이 성공적으로 처리되었습니다.');
        else if(flag===0) res.send('이미 추천 / 비추천한 댓글');
    }else{
        console.log("token 비유효");
    }
});

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/comments', async (req, res) => {
    // commentInfo = content_charName_commNum;
    const commentInfo = req.body.commentInfo;
    const content = commentInfo.split('_')[0];
    const charName = commentInfo.split('_')[1];
    const commNum = commentInfo.split('_')[2];

    const token = req.cookies[USER_COOKIE_KEY];
    if (token) {
        let userTO = jwt.verifyToken(token);
        try{
            let flag = await CommentDAO.insertComment(userTO,charName,commNum,content);
            if(flag===1)      res.send('댓글이 성공적으로 처리되었습니다.');
            else if(flag===0) req.send('댓글 작성 실패');
            //console.log(flag);
        }catch(err){

        }finally{
        }
    }else if(req.cookies['isLogin']==0){
        // 로그인 안되어있는 상태
        console.log('로그인해야 합니다.');
    }else{
        console.log('알수 없는 오류');
    }     
});
module.exports = { router };