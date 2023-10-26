const UserTO = require('../TO/UserTO.js'); // TO 클래스를 가져옴
require('dotenv').config();
const mariadb = require('mariadb');
const enc = require('../encryption.js');

class UserDAO {
    static #pool;
    static #conn;
    constructor() {
        
    }
    static async initializePool() {
        // static 변수를 초기화하는 메서드를 추가합니다.
        if (UserDAO.#pool) {
            return;
        }
        UserDAO.#pool = mariadb.createPool({
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            connectionLimit: 5
        });
    }
    static async fetchUser(userTO) {
        try{
            this.initializePool();
            UserDAO.#conn = await UserDAO.#pool.getConnection();
            UserDAO.#conn.query('USE tekkencommandwebdb');
            //console.log(userTO.id);
            const users = await UserDAO.#conn.query("SELECT seq, id, password, nickname FROM users WHERE id=?", [userTO.id]);
            if(users.length===1){
                // id 하나 발견 성공
                //console.log("아이디 하나 select");
                userTO.seq = users[0].seq;
                userTO.id = users[0].id;
                userTO.nickname = users[0].nickname;
                userTO.password = users[0].password;
            }
        }
        catch(err){
            console.error('fetchUser 오류:', err);
        }
        finally{
            if(UserDAO.#conn)  UserDAO.#conn.release();
        }
        
        return userTO;
    }
    static async createUser(userTO) {
        try{
            this.initializePool();
            const hashedPassword = await enc.encrypt(userTO.password, 10);
            UserDAO.#conn = await UserDAO.#pool.getConnection();
            UserDAO.#conn.query('USE tekkencommandwebdb');
            const res = await UserDAO.#conn.query("INSERT INTO users (seq, id, password, nickname) VALUE (?, ?, ?, ?)", [0, userTO.id, hashedPassword,userTO.nickname]);
            if(res.affectedRows===1){
                //userTO = this.fetchUser(userTO); 
            }else{
                //console.log("createUser 실패");
                userTO = new UserTO();
            }
        }catch(err){}
        finally{
            if(UserDAO.#conn)  UserDAO.#conn.release();
        }
        return userTO;       
    }
    static async removeUser(userTO) {
        try{
            this.initializePool();
            UserDAO.#conn = await UserDAO.#pool.getConnection();
            UserDAO.#conn.query('USE tekkencommandwebdb');
            const res = await UserDAO.#conn.query("DELETE FROM users where id = ?", [userTO.id]);
            if(res==1){
                //console.log("removeUser 성공");
            }else{
                //console.log("removeUser 실패");
            }
        }catch(err){}
        finally{
            if(UserDAO.#conn) UserDAO.#conn.release();
        }
    }   
}

module.exports = UserDAO;