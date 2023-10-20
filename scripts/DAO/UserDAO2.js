const UserTO = require('../TO/UserTO.js'); // TO 클래스를 가져옴
require('dotenv').config();
const mariadb = require('mariadb');
const enc = require('../encryption.js');


class UserDAO {
    users;
    #pool;
    #conn;
    constructor() {
        this.pool = mariadb.createPool({
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            connectionLimit: 5
        });


    }
    async #fetchAllUsers() {
        if (users) return users;
        let conn;
        try {
            console.log("저장된 users 없음. fetching DB");
            conn = await pool.getConnection();
            conn.query('USE tekkencommandwebdb');
            users = await conn.query('SELECT * FROM users');
            // JSON.stringify(rows)로 출력
        }
        finally {
            if (conn) conn.release();
            return users;
        }
    }
}

module.exports = UserDAO;