require('dotenv').config();
const CommentDAO = require('../scripts/DAO/CommentDAO.js');
const FavoriteDAO = require('../scripts/DAO/FavoirteDAO.js');

const express = require('express');
const router = express.Router();

router.get('/favorite/:CRUD/:userSeq/:character/:commNum',async (req,res)=>{
    let {
        CRUD,
        userSeq,
        character,
        commNum
    } = req.params;
    let rows;
    switch(CRUD){
        case 'select':
            let outputArray;
            if(character==0){
                //rows = await FavoriteDAO.selectFavoriteAll(req.cookies['userSeq']);
                //outputArray = formatData(rows);
            }else{
                rows = await FavoriteDAO.selectFavoriteByCharacter(userSeq,character);
                outputArray = rows.map(item => item.comm_num);
            }
            res.json(outputArray);
            return;
        case 'insert':
            console.log('db.js : insert favorite');
            rows = await FavoriteDAO.insertFavorite(userSeq,character,commNum);
            res.json('favorite : insert success');
            break;
        case 'delete':
            console.log('db.js : delete favorite');
            rows = await FavoriteDAO.deleteFavorite(userSeq,character,commNum);
            res.json('favorite : delete success');
            break;
        default :
            rows = 2;
            break;
    }
});

module.exports = { router };