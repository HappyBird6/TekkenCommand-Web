async function fetchCommandData(character) {
    fetch(`/commandAPI/7/${character}`)
        .then(response => response.json())
        .then(data => {
            commandData = data;
            setCookie("character", character.replaceAll(' ', ''), 1);
            displayCommands();

        })
        .catch(error => {
            console.error('API 호출 중 오류가 발생했습니다.', error);
        });
}

async function fetchFavoritePage() {
    try {
        const response = await fetch(`/favorite`);
        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }
        
        const data = await response.json();
        if(data[0]===0){
            //비 로그인 상태
        }else{
            favoriteCharacterList = [];
            favoriteData = formatFavoriteData(data[1]);
            //console.log(favoriteData);
            favoriteData.forEach((v,k)=>{
                favoriteCharacterList.push(k);
            });
        }
        

    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
        return [];
    }
}
async function fetchCommandPage() {
    try {
        const response = await fetch(`/command`);
        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }
        
        const data = await response.json();
        if(data[0]===0){
            //비 로그인 상태
            
        }else{
            favoriteData = formatFavoriteData(data[1]);
        }
    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
        return [];
    }
}
async function fetchPresetPage() {
    try {
        const response = await fetch(`/preset`);
        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }
        
        const data = await response.json();
        if(data[0]===0){
            //비 로그인 상태
        }else{
            presetCharacterList = [];
            presetList = [];
            presetData = formatPresetData(data[1]);
            //console.log(presetData);

            presetData.forEach((v,k)=>{
                //presetCharacterList.push(k);
                v.forEach((v2,k2)=>{
                    presetCharacterList.push(k);
                    presetList.push(k2);
                })
            });
            // console.log(presetData);
            // console.log(presetCharacterList);
            
        }
        

    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
        return [];
    }
}
const formatFavoriteData = function(rows){
    let charSet = new Map();
    for(let i = 0;i<rows.length;i++){
        let charName = rows[i].char_name;
        if(!charSet.has(charName)){
            charSet.set(charName,new Set());
        }
        charSet.get(charName).add(rows[i].comm_num);
    }
    
    return charSet;
}
const formatPresetData = function(rows){
    let charSet = new Map();
    for(let i = 0;i<rows.length;i++){
        let charName = rows[i].char_name;
        let presetName = rows[i].name;
        let commNumInfoString = rows[i].comm_num_info.substring(0,rows[i].comm_num_info.length-1);
        let commNumList = commNumInfoString.split(",");
        let commNumSet = new Set(commNumList.map(Number));
        if(presetName==null) presetName = charName; 
        // DB에 넣을때 NULL로 안들어가게 하자
        // DB에 넣을때 중복 체크도

        if(!charSet.has(charName)){
            charSet.set(charName,new Map());
        }
        while(charSet.get(charName).has(presetName)){
            if(presetName.charAt(presetName.length-2)==="_"){
                let num = Number(presetName.charAt(presetName.length-1));
                num++;
                presetName = presetName.substring(0,presetName.length-1)+num;
            }else{
                presetName += "_2";
            }
        }
        charSet.get(charName).set(presetName,commNumSet);
    }
    
    return charSet;
}