const setPage = async function (page) {
    console.log(page);
    switch (page) {
        case 0:
            // command 페이지
            console.log("controller : setPage : command");
            await fetchCommandPage();
            break;
        case 1:
            // favorite 페이지
            console.log("controller : setPage : favorite");
            await fetchFavoritePage();
            break;
        case 2:
            // preset 페이지
            console.log("controller : setPage : preset");
            await fetchPresetPage();
            break;
        case 3:
            break;
        case 4:
            break;
        default:
            break;
    }
}

