function formatCommand(searchValue){
    let userCommand = searchValue.toLowerCase().split(' ').join('');
        userCommand = userCommand.substring(1);
        let formattedCommand = "";
        // 236 rp lp가 검색되었다 -> 236rplp고 236은 방향키 rplp는 버튼
        /* 
        236rplp에서
        숫자 -> 방향키
        영어 -> r,l로 시작하는 것 + n인것
        */
        for (let i = 0; i < userCommand.length; i++) {
            if (!isNaN(Number(userCommand[i]))) {
                // 방향키
                formattedCommand += "." + userCommand[i] + " ";
            } else {
                // 액션
                if (userCommand[i] == "l" || userCommand[i] == "r" || userCommand[i] == "a") {
                    let act = "";
                    if (i + 1 < userCommand.length) act = userCommand[i] + userCommand[i + 1];
                    switch (act) {
                        case "lp":
                            formattedCommand += "1 ";
                            break;
                        case "rp":
                            formattedCommand += "2 ";
                            break;
                        case "lk":
                            formattedCommand += "3 ";
                            break;
                        case "rk":
                            formattedCommand += "4 ";
                            break;
                        case "ap":
                            formattedCommand += "12 ";
                            break;
                        case "ak":
                            formattedCommand += "34 ";
                            break;
                        case "al":
                            formattedCommand += "13 ";
                            break;
                        case "ar":
                            formattedCommand += "24 ";
                            break;
                        case "ab":
                            formattedCommand += "1234 ";
                            break;
                    }
                    i++;
                } else {
                    if (userCommand[i] == "]" && formattedCommand[formattedCommand.length - 1] == " ") {
                        formattedCommand = formattedCommand.trimEnd();
                    }
                    formattedCommand += userCommand[i] + " ";
                }
            }
        }
        formattedCommand = formattedCommand.trimEnd();
        //console.log("formmated : " + formattedCommand);
        return formattedCommand;
}
async function displayCommands(searchValue = '') {
    const commandContainer = document.getElementById('command-container');
    commandContainer.innerHTML = '';

    // 즐겨 찾기 받아옴
    let favoriteList = await getFavoriteList();
    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flexContainer');
    if (searchValue.startsWith(".")) {
        let formattedCommand = formatCommand(searchValue);
        //커맨드로 검색
        for (let skill in commandData.skill) {
            let command = commandData.skill[skill];
            if (searchValue && !command.command.includes(formattedCommand)) {
                continue;
            }
            isFavorite = favoriteList.includes(command.number);
            flexContainer.appendChild(await createCommandTable(command,isFavorite));
        }
    } else {
        // 이름으로 검색
        for (let skill in commandData.skill) {
            const command = commandData.skill[skill];
            // console.log(command);
            const skillName = skill.toLowerCase().split(' ').join('');

            if (searchValue && !skillName.includes(searchValue.toLowerCase().split(' ').join(''))) {
                continue;
            }
            
            isFavorite = favoriteList.includes(command.number);
            flexContainer.appendChild(await createCommandTable(command,isFavorite));
        }
    }
    commandContainer.appendChild(flexContainer);
}

async function createCommandTable(command,isFavorite) {
    const command_table = document.createElement('table');
    command_table.classList.add('command_table');
    let favoriteHTML = getFavoriteHTML(command.number,isFavorite);
    
    command_table.innerHTML = `
    <table>
        <tr>
          <td class="command_num">${command.number}</td>
            <td colspan="2" class="command_name">${command.name_en}</td>
            <td colspan="2" class="favorite_check_star_td">
                <div class="favorite_check_box">
                    ${favoriteHTML}
                </div>
            </td>  
        </tr>
        <tr>
            <td rowspan="3"></td>
            <td rowspan="3" class="command">${commandToImg(command.command)}</td>
            <td rowspan="3">스크류</td>
            <td>데미지</td>
            <td>${command.damage}</td>
        </tr>
        <tr>
            <td>시작f</td>
            <td>${command.frame}</td>
        </tr>
        <tr>
            <td>방어f</td>
            <td>${command.blockedFrame}</td>
        </tr>
        <tr>
            <td>Stance</td>
            <td rowspan="2">${command.hitPosition}</td>
            <td rowspan="2" onclick="displayComments(${command.number})">COMMENT CLICK</td>
            <td>히트f</td>
            <td>${command.hitFrame}</td>
        </tr>
        <tr>
            <td>${command.stance}</td>
            <td>카운터f</td>
            <td>${command.counterHitFrame}</td>
        </tr>
    </table>
    <table>
        <tr style="visibility:collapse" class="commentTableFrame1" id="commentOutput_${getCookie("character")}_${command.number}"></tr>
        <tr style="visibility:collapse" class="commentTableFrame2" id="commentInput_${getCookie("character")}_${command.number}" ></tr>
    </table>
    `
    return command_table;
}

function commandToImg(cmd) {
    cmd += ' ';
    let imgHTML = "";
    let button = '';
    let index = 0;

    while (index < cmd.length) {
        let buttonHold = false;
        if (cmd[index] == '.') {
            // 방향키
            button = '.';
            let dirc = cmd[index + 1];
            let isHold = cmd[index + 2] == '+' ? true : false;
            if (isHold) {
                imgHTML += `<img src='./assets/img/direction_hold/${dirc}.svg' width=30>`
                index += 3;
                continue;
            } else {
                imgHTML += `<img src='./assets/img/direction/${dirc}.svg' width=30>`
                index += 2;
                continue;
            }
        } else if (cmd[index] == 'N') {
            // 중립
            imgHTML += "<img src='./assets/img/direction/n.svg' width=40>";
            index++;
            continue;
        } else if (!isNaN(cmd[index]) && cmd[index] != ' ') {
            // 숫자. 버튼
            button = '';
            for (let j = index; j < cmd.length; j++) {
                if (cmd[j] == '-') {
                    buttonHold = true;
                    break;
                }
                if (isNaN(cmd[j]) || cmd[j] == ' ') {
                    break;
                }
                button += cmd[j];
            }
            imgHTML += `<img src='./assets/img/button/${button}.svg' width=30>`
            index += button.length;
            if (buttonHold) {
                imgHTML += "hold";
                index++;
            }
        } else if (cmd[index] == ' ') {
            imgHTML += '&nbsp;'
            index++;
        } else {
            imgHTML += cmd[index];
            index++;
        }
    }
    return imgHTML;
}