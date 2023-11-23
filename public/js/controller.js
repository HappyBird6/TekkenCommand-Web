const setPage = async function (page) {
    switch (page) {
        case 0:
            // command 페이지
            console.log("controller : setPage : command");
            await fetchCommandPage();
            displayCharacters();
            document.getElementById('command-container').innerHTML='';
            break;
        case 1:
            // favorite 페이지
            console.log("controller : setPage : favorite");
            if(getCookie('isLogin')==='0'){
                console.log("로그인이 안되어 있어 favorite Page 열람 불가");
                setPage(0);
            }else{
                await fetchFavoritePage();
                displayCharacters();
                document.getElementById('command-container').innerHTML='';
            }
            break;
        case 2:
            // preset 페이지
            console.log("controller : setPage : preset");
            if(getCookie('isLogin')==='0'){
                console.log("로그인이 안되어 있어 preset Page 열람 불가");
                setPage(0);
            }else{
                await fetchPresetPage();
                displayCharacters();
                document.getElementById('command-container').innerHTML='';
            }
            
            break;
        case 3:
            break;
        case 4:
            break;
        default:
            break;
    }
}

