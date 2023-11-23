const setLoginDialog = function(){
    const dialog = document.getElementById('dialog-login');
    const btnOpen = document.getElementById('btn-dialog-login');
    const btnClose = document.getElementById('btn-dialog-close');
    const navLogin = document.querySelector('#dialog-navigation li[name=login]');
    const navSignup = document.querySelector('#dialog-navigation li[name=signup]');
    const btnLogin = document.getElementById('btn-login');
    const btnSingup = document.getElementById('btn-signup');
    const frmLogin = document.frmLogin;
    const pwcFail = document.querySelector('.verifyContraints[name=pwc-fail]');
    const pwcPass = document.querySelector('.verifyContraints[name=pwc-pass]');
    const inputId = document.getElementById('id');
    const inputPassword = document.getElementById('password');
    const inputPasswordCheck = document.getElementById('passwordCheck');
    const inputNickname = document.getElementById('nickname');
    const idPass = document.querySelector('.verifyContraints[name=id-pass]');
    const idFail = document.querySelector('.verifyContraints[name=id-fail]');
    const pwPass = document.querySelector('.verifyContraints[name=pw-pass]');
    const pwFail = document.querySelector('.verifyContraints[name=pw-fail]');
    
    
    if(btnOpen!=null){
        btnOpen.addEventListener('click', function () {
            frmLogin.reset();
            dialog.showModal();
            navLogin.click();
        });
    }
    
    btnClose.addEventListener('click', function () {
        dialog.close();
    });
    navLogin.addEventListener('click', function () {
        showLoginWidget();
        frmLogin.reset();
        
        inputId.setAttribute('logintype','login');
        inputPassword.setAttribute('logintype','login');
        
        inputId.placeholder="";
        inputPassword.placeholder="";
        
        navSignup.style.color = 'black';
        navLogin.style.color = 'white';
        
        idFail.style.display="none";
        idPass.style.display="none";
        pwFail.style.display="none";
        pwPass.style.display="none";
        pwcFail.style.display="none";
        pwcPass.style.display="none";
    });
    navSignup.addEventListener('click', function () {
        showSignupWidget();
        frmLogin.reset();
       
        inputId.setAttribute('logintype','signup');
        inputPassword.setAttribute('logintype','signup');
        
        inputId.placeholder="8~15 only with letter,number";
        inputPassword.placeholder="10~20 with letter + number";
        inputPasswordCheck.placeholder="";
        inputNickname.placeholder="4~10 only with letter,number";
       
        navLogin.style.color = 'black';
        navSignup.style.color = 'white';
        
        idFail.style.display="none";
        idFail.title = "";
        idPass.style.display="none";  
        pwFail.style.display="none";
        pwFail.title = "";
        pwPass.style.display="none";
        pwcFail.style.display="";
        pwcPass.style.display="none";  
    });
    
    btnLogin.addEventListener('click', async function (e) {
        e.preventDefault();
        try {
            const response = await fetch(`/user/login?id=${inputId.value}&password=${inputPassword.value}`);
            if (!response.ok) {
                throw new Error('서버 응답이 실패했습니다.');
            }
            const flag = await response.json();
            switch (flag.flag){
                case 1:
                    console.log("아이디 없음");
                    break;
                case 2:
                    console.log("비번 오류");
                    break;
                case 0:
                    window.location.href = "/";
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('DB 호출 중 오류가 발생했습니다.', error);
        }
    });
    
    btnSingup.addEventListener('click', async function (e) {
        e.preventDefault();
        if(!verifyIdContraints()) return;
        if(!verifyPasswordContraints()) return;
        if(!verifyNicknameContraints()) return;
        
        if(!comparePassword()){
            return;
        }
        
        try {
            const response = await fetch(`/user/signup?id=${inputId.value}&password=${inputPassword.value}&nickname=${inputNickname.value}`);
            if (!response.ok) {
                throw new Error('서버 응답이 실패했습니다.');
            }
            const flag = await response.json();
            switch (flag.flag){
                case 1:
                    console.log("아이디 중복");
                    break;
                case 2:
                    console.log("닉네임 중복");
                    break;
                case 0:
                    window.location.href = "/";
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('DB 호출 중 오류가 발생했습니다.', error);
        }
    });
    inputPassword.addEventListener('oninput',function(){
        //comparePassword();
    })
    inputPasswordCheck.addEventListener('oninput',function(){
        
    })

}
const showLoginWidget = function () {
    const signupContents = document.querySelectorAll('.signup');
    const loginContents = document.querySelectorAll('.login');
    signupContents.forEach(function (i) {
        i.style.display = "none";
    })
    loginContents.forEach(function (i) {
        i.style.display = "";
        
    })
}
const showSignupWidget = function () {
    const signupContents = document.querySelectorAll('.signup');
    const loginContents = document.querySelectorAll('.login');
    loginContents.forEach(function (i) {
        i.style.display = "none";
    })
    signupContents.forEach(function (i) {
        i.style.display = "";
    })
}

const comparePassword = function(){
    const password1 = document.getElementById('password').value;
    const password2 = document.getElementById('passwordCheck').value;
    const passwordCheckPass = document.querySelector('.verifyContraints[name=pwc-pass]');
    const passwordCheckFail = document.querySelector('.verifyContraints[name=pwc-fail]');
    if(password1==='' || password2===''){   
        passwordCheckFail.style.display = "";
        passwordCheckPass.style.display = "none";
        return false;
    }
    let check = (password1 === password2);

    if(!check){
        passwordCheckFail.style.display = "";
        passwordCheckPass.style.display = "none";
    }else{
        passwordCheckFail.style.display = "none";
        passwordCheckPass.style.display = "";
    }
    return check;
}

const verifyIdContraints = function(){
    // 회원가입 시 아이디 조건체크
    const idPass = document.querySelector('.verifyContraints[name=id-pass]');
    const idFail = document.querySelector('.verifyContraints[name=id-fail]');
    const inputId = document.getElementById('id');      
    if(inputId.getAttribute('logintype')=='login'){
        return;
    }
    const val = inputId.value;
    if(val=='') return false;
    if(val.search(/\W|\s/g) > -1){
        idFail.style.display="";
        idFail.title = "특수문자 입력";
        idPass.style.display="none";
        return false;
    }
    if(val.length<8 || val.length>15){
        idFail.style.display="";
        idFail.title = "아이디 길이 오류";
        idPass.style.display="none";
        return false;
    }
    idFail.style.display="none";
    idPass.style.display="";
    return true;
}
const verifyPasswordContraints = function(){
    // 회원가입 시 비밀번호 조건 체크
    const pwPass = document.querySelector('.verifyContraints[name=pw-pass]');
    const pwFail = document.querySelector('.verifyContraints[name=pw-fail]');
    const inputPassword = document.getElementById('password');

    if(inputPassword.getAttribute('logintype')=='login'){
        return;
    }
    let chk = false; // 숫자 + 문자의 조합인지
    let haveNum = false;
    let haveChar= false;
    const val = inputPassword.value;
    if(val.search(/\W|\s/g) > -1){
        pwFail.style.display="";
        pwFail.title = "특수문자 입력";
        pwPass.style.display="none";
        return false;
    }
    if(val.length<10 || val.length>20){
        pwFail.style.display="";
        pwFail.title = "비밀번호 길이 오류";
        pwPass.style.display="none";
        return false;
    }
    for(let i = 0;i<val.length;i++){
        if(haveNum && haveChar){
            chk = true;
            break;
        }
        if(!isNaN(val[i])){
            haveNum = true;
        }else{
            haveChar = true;
        }
    }
    if(haveNum && haveChar){
        chk = true;
    }
    if(!chk){
        pwFail.style.display="";
        pwFail.title = "비밀번호 조합 오류, 문자와숫자를 함께";
        pwPass.style.display="none";
        return false;
    }
    pwFail.style.display="none";
    pwPass.style.display="";
    return true
}
const verifyNicknameContraints = function(){
    // 회원가입 시 닉네임 조건 체크
    const inputNickname = document.getElementById('nickname');
    const nckPass = document.querySelector('.verifyContraints[name=nck-pass]');
    const nckFail = document.querySelector('.verifyContraints[name=nck-fail]');
    
    const val = inputNickname.value;
    if(val=='') return false;
    if(val.search(/\W|\s/g) > -1){
        nckFail.style.display="";
        nckFail.title = "특수문자 입력";
        nckPass.style.display="none";
        return false;
    }
    if(val.length<4 || val.length>10){
        nckFail.style.display="";
        nckFail.title = "아이디 길이 오류";
        nckPass.style.display="none";
        return false;
    }
    nckFail.style.display="none";
    nckPass.style.display="";
    return true;
}