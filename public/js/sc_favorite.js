function getFavoriteHTML(commNum,isFavorite){
    let html = '';
    if(getCookie('isLogin')==1){
        // 로그인
        if(!isFavorite){
            html = `
            <a href="javascript:;" onclick="setFavorite(${commNum},${isFavorite})"><img src="./assets/img/star/star-line.png" id="favorite_${commNum}"></a>
            `;
        }else{
            html = `
            <a href="javascript:;" onclick="setFavorite(${commNum},${isFavorite})"><img src="./assets/img/star/star-fill.png" id="favorite_${commNum}"></a>
            `;
        }
    }else{
        // 비 로그인
        html = `<img src="./assets/img/star/star-line.png" id="favorite_${commNum}">`
    }
    
    return html;
}
async function getFavoriteList(){
    try {
        const response = await fetch(`/db/favorite/select/${getCookie('userSeq')}/${getCookie('character')}/0`);
        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
        return [];
    }
}
async function setFavorite(commNum){
    let star = document.getElementById(`favorite_${commNum}`);
    let starPath = ["star-fill.png","star-line.png"];
    let CRUD = '';
    let path = star.src.substring(star.src.length-13);
    if(path==starPath[0]) {
        star.src = star.src.substring(0,star.src.length-13) + starPath[1];
        CRUD = 'delete';
    }
    else{   
        star.src = star.src.substring(0,star.src.length-13) + starPath[0];
        CRUD = 'insert';
    }                      
    try {
        const response = await fetch(`/db/favorite/${CRUD}/${getCookie('userSeq')}/${getCookie('character')}/${commNum}`);
        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }
    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
    }
}
async function setPageFavorite(){
    
}