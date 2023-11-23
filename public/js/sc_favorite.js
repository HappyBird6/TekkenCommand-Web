// 커맨드 번호와 favorite 유무를 확인해서 별의 html 출력
function getFavoriteHTML(commNum,isFavorite){
    let html = '';
    if(getCookie('isLogin')==1){
        // 로그인`
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
// 별 클릭시 db에 CRUD 요청
async function setFavorite(commNum){
    let star = document.getElementById(`favorite_${commNum}`);
    let starPath = ["star-fill.png","star-line.png"];
    let CRUD = '';
    let path = star.src.substring(star.src.length-13);
    if(path==starPath[0]) {
        star.src = star.src.substring(0,star.src.length-13) + starPath[1];
        CRUD = 'delete';
        switch(getCookie('page')){
            case '1':
                favoriteCommandListByCharacter.delete(commNum);
                break;
            case '2':
                break;
            default:
                break;
        }
    }
    else{   
        star.src = star.src.substring(0,star.src.length-13) + starPath[0];
        CRUD = 'insert';
        switch(getCookie('page')){
            case '1':
                favoriteCommandListByCharacter.add(commNum);
                break;
            case '2':
                break;
            default:
                break;
        }
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
