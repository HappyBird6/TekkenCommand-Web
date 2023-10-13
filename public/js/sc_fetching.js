let commandData; // 전체 커맨드 목록과 데이터
let characterData; // 캐릭터 리스트 목록
function fetchCommandData(character) {
    fetch(`https://port-0-tekken-api-kvmh2mljs26e4k.sel4.cloudtype.app/tekkenAPI/command/7/${character}`)
        .then(response => response.json())
        .then(data => {
            // 전체 커맨드 목록 업데이트
            commandData = data;
            //console.log(commandData);
            displayCommands();
        })
        .catch(error => {
            console.error('API 호출 중 오류가 발생했습니다.', error);
        });
}
function fetchCharacterData() {
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