async function fetchCommandData(character) {
    fetch(`https://port-0-tekken-api-kvmh2mljs26e4k.sel4.cloudtype.app/tekkenAPI/command/7/${character}`)
        .then(response => response.json())
        .then(data => {
            // 전체 커맨드 목록 업데이트
            commandData = data;
            setCookie("character", character.replaceAll(' ', ''), 1);
            //console.log(commandData);
            displayCommands();

        })
        .catch(error => {
            console.error('API 호출 중 오류가 발생했습니다.', error);
        });
}
async function fetchFavoriteAllData() {
    try {
        const response = await fetch(`/db/favorite/select/${getCookie('userSeq')}/0/0`);
        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }

        const data = await response.json();
        favoriteData = data;
        //{"Alisa":[1,2,3],"Asuka":[1]}
    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
        return [];
    }
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
            displayCharacters();
            document.getElementById('command-container').innerHTML='';
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
        displayCharacters();
        document.getElementById('command-container').innerHTML='';
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
            charSet.set(charName,[]);
        }
        charSet.get(charName).push(rows[i].comm_num);
    }
    
    return charSet;
}
