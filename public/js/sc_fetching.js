let commandData; // 전체 커맨드 목록과 데이터
let characterData; // 캐릭터 리스트 목록
let favoriteData;
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
async function fetchCharacterData() {
    fetch(`https://port-0-tekken-api-kvmh2mljs26e4k.sel4.cloudtype.app/tekkenAPI/command/7/list`)
        .then(response => response.json())
        .then(data => {
            characterData = data;
            //console.log(characterData.name);
            displayCharacters();
        })
        .catch(error => {
            console.error('캐릭터 리스트 호출 중 오류가 발생했습니다.', error);
        })
}
async function fetchFavoriteAllData() {
    try {

        const response = await fetch(`/db/favorite/select/${getCookie('userSeq')}/0/0`);
        if (!response.ok) {
            throw new Error('서버 응답이 실패했습니다.');
        }

        const data = await response.json();
        favoriteData = sortFavoriteData(data);
    } catch (error) {
        console.error('DB 호출 중 오류가 발생했습니다.', error);
        return [];
    }
}
const sortFavoriteData = async function(data){
    console.log(data);
    return data;
}

