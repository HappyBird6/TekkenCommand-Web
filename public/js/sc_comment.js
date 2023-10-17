let comments = [];
let commentOutput;
let commentInput;
function displayComments(num) {
    commentOutput = document.getElementById(`commentOutput_${num}`);
    commentInput = document.getElementById(`commentInput_${num}`);
    const commentOutputState = commentOutput.style.visibility;
    if (commentOutputState === "collapse") {
        commentOutput.style.visibility = "initial";
        commentInput.style.visibility = "initial";
    }
    else {
        commentOutput.style.visibility = "collapse"
        return;
    }
    const comments = loadComments(num);
    commentOutput.innerHTML = loadPage(0);
    commentInput.innerHTML = `<td colspan="5">댓글 입력란</td>`;
}
function loadComments(num) {
    //db에서 comments 불러와야됨.
    comments = [
        "댓글 1",
        "댓글 2",
        "댓글 3",
        "댓글 4",
        "댓글 5",
        "댓글 6",
        "댓글 7",
        "댓글 8",
        "댓글 9",
        "댓글 10",
        "댓글 11",
        "댓글 12",
        "댓글 13"
    ];
}
function loadPage(nowPage) {
    const pageSize = 5; // 페이지당 댓글 수
    const totalPages = Math.ceil(comments.length / pageSize);
    let html = `<div id="commentList">`;
    for (let i = nowPage * pageSize; i < (nowPage + 1) * pageSize && i < comments.length; i++) {
        html += `<div class="comment">`;
        html += comments[i];
        html += `</div>`;
    }
    html += `</div>`;
    html += `<div id="pagination">`;
    for (let page = 0; page < totalPages; page++) {
        let nextPage = page+1;
        html += `<a href="#" onclick="loadPage(${page})">${nextPage}</a>`;
    }
    html +=`</div>`;
    return commentOutput.innerHTML = html;
}