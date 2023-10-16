const fs = require('fs').promises;
const enc = require('./encryption.js');
const USERS_JSON_FILENAME='users.json';

// DATABASE
async function fetchAllUsers() {
    const data = await fs.readFile(USERS_JSON_FILENAME);
    const users = JSON.parse(data.toString());
    return users;
}

exports.fetchUser = async function(username) {
    const users = await fetchAllUsers();
    const user = users.find((user) => user.username === username);
    return user;
}

exports.createUser = async function(newUser) {
    console.log("암호화 시작 --- 기존password : "+newUser.password);
    const hashedPassword = await enc.encrypt(newUser.password, 10);
    // 10이라는 인자는 salt라고 부른는 값으로 이 값이 클수록 여러번 해시함수를 돌려 암호화속도를
    // 일부러 늦춰서 해킹 방지
    const users = await fetchAllUsers();
    const user = {
        ...newUser,
        password:hashedPassword
    };
    users.push(user);
    await fs.writeFile(USERS_JSON_FILENAME, JSON.stringify(users));
    return user;
}
exports.removeUser = async function(username) {
    const users = await fetchAllUsers();
    const index = users.findIndex(u => u.username === username);
    users.splice(index, 1);
    await fs.writeFile(USERS_JSON_FILENAME, JSON.stringify(users));
}