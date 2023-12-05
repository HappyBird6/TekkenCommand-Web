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
            targetData = presetList;
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
            switch(getCookie('page')){
                case '1':
                    if(favoriteData) favoriteCommandListByCharacter = favoriteData.get(name);
                    break;
                case '2':
                    if(presetData) {
                        presetCommandListByCharacter = presetData.get(presetCharacterList[i]).get(name);
                    }
                    break;
                default:
                    if(favoriteData) favoriteCommandListByCharacter = favoriteData.get(name);
                    break;
            }
            if(getCookie('page')==='2'){
                // 프리셋일경우
                fetchCommandData(presetCharacterList[i].toLowerCase());
            }else{  
                fetchCommandData(name);
            }

            highlightBox(this);
        });
        characterBox.addEventListener('mouseover',function(){
            CBoxMouseIn(characterBox);
        });
        characterBox.addEventListener('mouseout',function(){
            CBoxMouseOut(characterBox);
        });
        setCharacterImage(characterBox,nameTmp);
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
    if(highlightedBox) {
        if(highlightedBox===box) {
            return;
        }
        
        // 기존 박스 원상복귀
        highlightedBox.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0)";
        highlightedBox.style.backgroundColor="rgba(245, 10, 100, 0.3)";
        highlightedBox.style.border="3px solid rgba(245,10,100)";
        highlightedBox.setAttribute("highlighted","false");
        var p = highlightedBox.querySelector('p');
        p.style.background = "linear-gradient(to left, rgba(245, 10, 100), rgba(255, 0, 0, 0))"
    }
    // 새로운 박스 하이라이트
    box.style.boxShadow = "0px 0px 25px 0px #1c5660";
    box.style.backgroundColor="rgba(31, 100, 112, 0.3)";
    box.style.border="3px solid rgba(31,100,112)";
    box.setAttribute("highlighted","true");
    // 기존 박스로 업데이트
    highlightedBox = box;
}
function setCharacterImage(box,name){
    box.style.backgroundImage = "url('../assets/img/character/thumbnail/"+name+".webp')";

}
function CBoxMouseIn(box){
    var p = box.querySelector('p');
    p.style.background = "linear-gradient(to left, rgba(31, 100, 112), rgba(255, 0, 0, 0))"
    p.style.backgroundSize = "100% 120%";
    p.style.backgroundRepeat = "no-repeat";

}  
function CBoxMouseOut(box){
    var p = box.querySelector('p');
    if(box.getAttribute("highlighted")!=="true"){
        p.style.background = "linear-gradient(to left, rgba(245, 10, 100), rgba(255, 0, 0, 0))"
        p.style.backgroundSize = "100% 120%";
        p.style.backgroundRepeat = "no-repeat";
    }
}