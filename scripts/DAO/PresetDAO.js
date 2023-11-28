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
    static async selectPresetSeq(userSeq){
        // Preset Mapper에서 preset_seq 가져오기
        let rows=[];
        try{
            this.initializePool();
            PresetDAO.#conn = await PresetDAO.#pool.getConnection();
            PresetDAO.#conn.query('USE tekkencommandwebdb');
            
            rows = await PresetDAO.#conn.query(
                `SELECT preset_seq 
                FROM preset_mapper 
                WHERE user_seq = ?`,
                [userSeq]
            );
        }
        catch(err){}
        finally{
            if(PresetDAO.#conn) PresetDAO.#conn.release();
        }
        return rows;
    }
    static async selectPreset(list){
        let rows = [];

        let strList = "(";
        for(let i in list){
            strList += list[i]+",";
        }
        strList = strList.substring(0,strList.length-1);
        strList += ")";

        try{
            this.initializePool();
            PresetDAO.#conn = await PresetDAO.#pool.getConnection();
            PresetDAO.#conn.query('USE tekkencommandwebdb');
            
            rows = await PresetDAO.#conn.query(
                `SELECT name, char_name, comm_num_info 
                FROM preset 
                WHERE seq in `+strList
            );
        }
        catch(err){}
        finally{
            if(PresetDAO.#conn) PresetDAO.#conn.release();
        }
        return rows;
    }
}


module.exports = PresetDAO;