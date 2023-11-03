const setLoginDialog = function(){
    const dialog = document.getElementById('dialog-login');
    const btnOpen = document.getElementById('btn-dialog-login');
    const btnClose = document.getElementById('btn-dialog-close');
    const navLogin = document.querySelector('#dialog-navigation li[name=login]');
    const navSignup = document.querySelector('#dialog-navigation li[name=signup]');
    const btnLogin = document.getElementById('btn-login');
    const btnSingup = document.getElementById('btn-signup');
    const loginForm = document.frmLogin;
    const passwordCheckPass = document.querySelector('.passwordcheck[name=pass]');
    const passwordCheckFail = document.querySelector('.passwordcheck[name=fail]');
    if(btnOpen!=null){
        btnOpen.addEventListener('click', function () {
            dialog.showModal();
            navLogin.click();
        });
    }
    
    btnClose.addEventListener('click', function () {
        dialog.close();
    });
    navLogin.addEventListener('click', function () {
        showLoginWidget();
        navSignup.style.color = 'white';
        navLogin.style.color = 'black';
        loginForm.action = "/user/login/redirect";
    });
    navSignup.addEventListener('click', function () {
        showSignupWidget();
        navLogin.style.color = 'white';
        navSignup.style.color = 'black';
        loginForm.action = "/user/signup/redirect";
        passwordCheckFail.style.display="";
    });
    
    btnLogin.addEventListener('click', function (e) {
        
    });
    
    btnSingup.addEventListener('click', function () {
        
    });
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
