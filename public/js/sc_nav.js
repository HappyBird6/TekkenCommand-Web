function setNavCss(){
    const navTest = document.querySelectorAll("#main-navigation .text");

    for (var i = 0; i < navTest.length; i++) {
        navTest[i].addEventListener('mouseover', function () {
            NavMouseIn(this);
        });
        navTest[i].addEventListener('mouseout', function () {
            NavMouseOut(this);
        });
    }
}
function NavMouseIn(item){
   item.style.color="rgba(31, 100, 112)";
}  
function NavMouseOut(item){
    item.style.color="#ffffff";
}
function highlightNav(item){
    const text = item.querySelectorAll(".text");
    if(highlightedNav) {
        if(highlightedNav===text) {
            return;
        }

        highlightedNav.style.color="#ffffff";
        highlightedNav.setAttribute("highlighted","false");
    }

    text.style.color="rgba(31, 100, 112)";
    text.setAttribute("highlighted","true");

    highlightedNav = text;
}