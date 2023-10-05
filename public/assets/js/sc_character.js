function displayCharacters(searchValue = '') {
    const characterList = document.querySelector('.characterList');
    characterList.innerHTML = '';

    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flexContainer');

    for (const name in characterData.name) {
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
            fetchCommandData(name);
        });

        flexContainer.appendChild(characterBox);
    }
    characterList.appendChild(flexContainer);
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