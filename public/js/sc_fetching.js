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
            favoriteData = formatData(data[1]);
            
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
            favoriteData = formatData(data[1]);
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
            //favoriteCharacterList = [];
            //favoriteData = formatData(data[1]);
            
            //favoriteData.forEach((v,k)=>{
            //    favoriteCharacterList.push(k);
            //});
        }
        

    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
        return [];
    }
}
const formatData = function(rows){
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
