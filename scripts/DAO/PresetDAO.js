const mariadb = require('mariadb');

class PresetDAO{
    static #pool;
    static #conn;
    static async initializePool() {
        if (PresetDAO.#pool) {
            return;
        }
        PresetDAO.#pool = mariadb.createPool({
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            connectionLimit: 5
        });
    }
    
}


module.exports = PresetDAO;