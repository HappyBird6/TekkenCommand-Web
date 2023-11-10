const setPage = async function (page) {
    switch (page) {
        case 0:
            // command 페이지
            break;
        case 1:
            // favorite 페이지
            fetchFavoriteAllData();
            break;
        case 2:
            // preset 페이지
            break;
        case 3:
            break;
        case 4:
            break;
        default:
            break;
    }
}