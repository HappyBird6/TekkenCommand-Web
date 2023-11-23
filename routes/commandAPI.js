const express = require('express');
const fs = require('fs');
const cors = require('cors')
const router = express.Router();
const path = require('path');

router.use(cors()) // 모든 요청에 대해 허용, 조건을 추가할 수 있음

router.get('/:version/:character', async (req, res) =>{
    let {
        version,
        character
    } = req.params;

    character = character.toLowerCase();

    if(character.match('list')){
        console.log('characterList');
        fs.readFile(`./data/character${version}/characterList.json`,`utf8`,(err,data)=>{
            if(err){
                console.error(err);
                res.status(500).send('Internal Server Error : characterList.json');
                return;
            }
    
            const characterList = JSON.parse(data);
            res.json(characterList);
        });
    }else{
        fs.readFile(`./data/character${version}/${character}.json`,'utf8',(err,data)=>{
            if(err){
                console.error(err);
                res.status(500).send(`Internal Server Error : ${character}.json 를 불러오는데 실패`);
                return;
            }
    
            const characterData = JSON.parse(data);
            res.json(characterData);
        });
    }
});

module.exports = { router };