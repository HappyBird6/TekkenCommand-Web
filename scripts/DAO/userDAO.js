require('dotenv').config();
const mariadb = require('mariadb');
const enc = require('../encryption.js');

let users;

const pool = mariadb.createPool({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER, 
    password: process.env.DBPASS,
    connectionLimit: 5
});

// DATABASE
async function fetchAllUsers() {
    if(users) return users;
    let conn;
    try{
        console.log("저장된 users 없음. fetching DB");        
        conn = await pool.getConnection();
        conn.query('USE tekkencommandwebdb');
        users = await conn.query('SELECT * FROM users');
        // JSON.stringify(rows)로 출력
    }
    finally{
        if(conn) conn.release();
        return users;
    }
}

exports.fetchUser = async function(id) {
    const users = await fetchAllUsers();
    const user = users.find((user) => user.id === id);
    return user;
}

exports.createUser = async function(newUser) {
    // newUser = {
    //    id:~
    //    password:~
    //    nickname:~    
    // }
    let conn;
    const hashedPassword = await enc.encrypt(newUser.password, 10);
    try{
        conn = await pool.getConnection();
        conn.query('USE tekkencommandwebdb');
        const res = await conn.query("INSERT INTO users value (?, ?, ?, ?)", [0, newUser.id, hashedPassword,newUser.nickname]);
        if(res.affectedRows==1){
            console.log("createUser 성공");
            let user={
                id:newUser.id,
                nickname:newUser.nickname
            }
            users.push({
                ...user,
                password:hashedPassword
            });
            return user;
        }else{
            console.log("createUser 실패");
            return user={
                id:"X",
                nickname:"X"
            };
        }
    }catch(err){}
    finally{
        if(conn) conn.release();
    }       
}
exports.removeUser = async function(id) {
    const users = await fetchAllUsers();
    let conn;
    try{
        conn = await pool.getConnection();
        conn.query('USE tekkencommandwebdb');
        const res = await conn.query("DELETE FROM users where id = ?", [id]);
        if(res==1){
            console.log("removeUser 성공");
        }else{
            console.log("removeUser 실패");
        }
    }catch(err){}
    finally{
        if(conn) conn.release();
    }   
}
