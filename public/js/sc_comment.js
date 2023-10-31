const commentSections = {};

const currentURL = window.location.href;

async function displayComments(commNum) {
    let commentOutputFrame = document.getElementById(`commentOutput_${getCookie("character")}_${commNum}`);
    let commentInputFrame = document.getElementById(`commentInput_${getCookie("character")}_${commNum}`);
    const commentOutputState = commentOutputFrame.style.visibility;
    if (commentOutputState === "collapse") {
        commentOutputFrame.style.visibility = "initial";
        commentInputFrame.style.visibility = "initial";
    }
    else {
        commentOutputFrame.style.visibility = "collapse"
        commentInputFrame.style.visibility = "collapse"
        return;
    }
    await loadComments(commNum);
    commentOutputFrame.innerHTML = loadPage(0, commNum);
    commentInputFrame.innerHTML = 
    `<td colspan="5">
        <div>
            <input type="text" placeholder="댓글입력" name="comment" id="comment_${getCookie("character")}_${commNum}"></input>
            <input type="button" value="입력" onclick="inputComment(${commNum}); clearComment(${commNum})"/>
        </div>
    </td>`;
}
async function loadComments(commNum) {
    const sectionId = `${getCookie("character")}_${commNum}`;
    commentSections[sectionId] = [];
    await fetch(currentURL + `comment/${getCookie("character")}/${commNum}`)
        .then(response => response.json())
        .then(data => {
            commentSections[sectionId] = data;
        })
        .catch(error => {
            console.error('loadComments 호출 중 오류가 발생했습니다.', error);
        })
    
}
function loadPage(nowPage, commNum) {
    // 전달할 데이터를 정의하고 전송
    setCookie("nowPage",nowPage,1);
    let commentOutputFrame = document.getElementById(`commentOutput_${getCookie("character")}_${commNum}`);
    const sectionId = `${getCookie("character")}_${commNum}`;
    const comments = commentSections[sectionId];
    const pageSize = 5; // 페이지당 댓글 수
    const totalPages = Math.ceil(comments.length / pageSize);
    let skip = nowPage * pageSize;
    let cnt = 0;
    let html = `<td colspan = '5'><div id="commentList">`;
    for (let commentIdx in comments) {
        let comment = comments[commentIdx];
        if (skip > 0) {
            skip--;
            continue;
        }
        let up, down;
        if (cnt===pageSize) break;
        
        if (getCookie('isLogin')==1){
            up = `<a href="javascript:;" onclick="clickUp(true,${comment.seq},${commNum})">UP</a> : ${comment.up}`;
            down = `<a href="javascript:;" onclick="clickUp(false,${comment.seq},${commNum})">DOWN</a> : ${comment.down}`;
        }else{
            up = `UP : ${comment.up}`;
            down = `DOWN : ${comment.down}`;
        }
        html += `<div class="comment">`;
        html += `${comment.seq}/${comment.user_nickname} / ${comment.comment} /  ${comment.wdate} /`;
        html += up + '/' + down;
        html += `</div>`;
        cnt++;
    }
    html += `</div>`;
    html += `<div id="pagination">`;
    for (let page = 0; page < totalPages; page++) {
        let nextPage = page + 1;
        html += `<a href="javascript:;" onclick="loadPage(${page}, ${commNum})">${nextPage}</a>`;
    }
    html += `</div></td>`;
    return commentOutputFrame.innerHTML = html;
}
function inputComment(commNum) {
    let commentOutputFrame = document.getElementById(`commentOutput_${getCookie("character")}_${commNum}`);
    const comment = document.getElementById(`comment_${getCookie("character")}_${commNum}`);
    const commentInfo = comment.value+"_"+getCookie("character")+"_"+commNum;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'comment/comments', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = async function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = xhr.responseText;
            //console.log("res : " +response);
            //console.log("댓글 작성 성공");
            document.location.href="javascript:;"
            await loadComments(commNum);
            commentOutputFrame.innerHTML = loadPage(0, commNum);
        }
    };
    
    // 전달할 데이터를 정의하고 전송
    const data = `commentInfo=${encodeURIComponent(commentInfo)}`;
    xhr.send(data);
}

function clearComment(commNum){
    const comment = document.getElementById(`comment_${getCookie("character")}_${commNum}`);
    comment.value = "";
}

async function clickUp(up,commSeq,commNum){
    let commentOutputFrame = document.getElementById(`commentOutput_${getCookie("character")}_${commNum}`);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `comment/vote`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    const recommendationInfo = `${up}_${commSeq}`;
    xhr.onreadystatechange = async function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = xhr.responseText;
            
            document.location.href="javascript:;"
            await loadComments(commNum);
            commentOutputFrame.innerHTML = loadPage(getCookie("nowPage"), commNum);
        }
    };
    
    // 전달할 데이터를 정의하고 전송
    const data = `recommendationInfo=${encodeURIComponent(recommendationInfo)}`;
    xhr.send(data);
    
}