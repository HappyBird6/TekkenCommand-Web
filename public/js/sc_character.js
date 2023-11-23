function displayCharacters(searchValue = '') {
    const characterContainer = document.getElementById('character-container');
    characterContainer.innerHTML = '';

    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flexContainer');
    let targetData =[];
    switch(getCookie('page')){
        case '1':
            targetData = favoriteCharacterList;
            break;
        case '2':
            break;
        default:
            targetData = characterData;
            break;
    }
    for(let i=0;i<targetData.length;i++){
        const name = targetData[i];
        const nameTmp = name.toLowerCase();
        if (searchValue && !nameTmp.toLowerCase().startsWith(searchValue)) {
            continue;
        }
        const characterBox = document.createElement('div');
        characterBox.classList.add('characterBox');

        const info = document.createElement('p');
        info.textContent = name;

        characterBox.appendChild(info);
        characterBox.addEventListener('click', function () {
            if(favoriteData) favoriteCommandListByCharacter = favoriteData.get(name);
            fetchCommandData(name);

            highlightBox(this);
        });
        setCharacterImage(this);
        flexContainer.appendChild(characterBox);
    }
    characterContainer.appendChild(flexContainer);
} 
function handleSearch(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // 기본 엔터 동작 막기
        searchCharacter();
    }
}
function searchCharacter() {
    const characterInput = document.getElementById('characterInput');
    const character = characterInput.value;
    fetchCommandData(character);
}

function highlightBox(box){
    if(highlightedBox) highlightedBox.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0)";
    box.style.boxShadow = "0px 0px 5px 0px rgba(255,0,0,.8)";
    highlightedBox = box;
}
function setCharacterImage(box){
    //box.style.backgroundImage = "url('../assets/img/character/thumbnail/temp-character-thumbnail.jpg')";
}