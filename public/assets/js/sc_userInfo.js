function createUserInfoHTML(userInfoData){
    const userInfoElement = document.getElementById('userInfo');
    let html = "";
    console.log("createUserInfoHTML");
    if(!userInfoData){
        // 로그인 ㄴㄴ 상태
        html = 
        `
            <button id="loginBtn" onclick="location.href='/user/login'">로그인하러 가기</button>
        `;
    }else{ 
        // 로그인 ㅇㅇ 상태
        html =
        `
            <p> username : ${userInfoData} <p>
            <button id="logoutBtn" onclick="location.href='/user/logout_ok'">로그아웃</button>
        `
    }
    userInfoElement.innerHTML = html;    
}