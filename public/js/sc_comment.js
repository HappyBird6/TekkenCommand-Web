let comments = [];
let commentOutput;
let commentInput;

const currentURL = window.location.href;

async function displayComments(character, commNum) {
    commentOutput = document.getElementById(`commentOutput_${commNum}`);
    commentInput = document.getElementById(`commentInput_${commNum}`);
    const commentOutputState = commentOutput.style.visibility;
    if (commentOutputState === "collapse") {
        commentOutput.style.visibility = "initial";
        commentInput.style.visibility = "initial";
    }
    else {
        commentOutput.style.visibility = "collapse"
        return;
    }
    await loadComments(character, commNum);
    commentOutput.innerHTML = loadPage(0);
    commentInput.innerHTML = `<td colspan="5">댓글 입력란</td>`;
}
async function loadComments(character, commNum) {
    //db에서 comments 불러와야됨.
    await fetch(currentURL + `comment/${character.replaceAll(' ','')}/${commNum}`)
        .then(response => response.json())
        .then(data => {
            comments = data;
        })
        .catch(error => {
            console.error('loadComments 호출 중 오류가 발생했습니다.', error);
        })
}
function loadPage(nowPage) {
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
        if (cnt===pageSize) break;
        html += `<div class="comment">`;
        html += `${comment.user_seq} / ${comment.comment} /  ${comment.wdate} / ${comment.up} / ${comment.down}`;
        html += `</div>`;
        cnt++;
    }
    // for (let i = nowPage * pageSize; i < (nowPage + 1) * pageSize && i < Object.keys(comments).length; i++) {
    //     html += `<div class="comment">`;
    //     html += comments.index
    //     html += `</div>`;
    // }
    html += `</div>`;
    html += `<div id="pagination">`;
    for (let page = 0; page < totalPages; page++) {
        let nextPage = page + 1;
        html += `<a href="javascript:;" onclick="loadPage(${page})">${nextPage}</a>`;
    }
    html += `</div></td>`;
    return commentOutput.innerHTML = html;
}