const mariadb = require('mariadb');

class FavoriteDAO{
    static #pool;
    static #conn;
    static async initializePool() {
        if (FavoriteDAO.#pool) {
            return;
        }
        FavoriteDAO.#pool = mariadb.createPool({
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            connectionLimit: 5
        });
    }
    static async selectFavoriteAll(userSeq){
        let rows;
        try{
            this.initializePool();
            FavoriteDAO.#conn = await FavoriteDAO.#pool.getConnection();
            FavoriteDAO.#conn.query('USE tekkencommandwebdb');
            
            rows = await FavoriteDAO.#conn.query(
                `SELECT seq, char_name, comm_num 
                FROM favorite 
                WHERE user_seq = ? 
                order by char_name`,
                [userSeq]
            );
            return rows;
        }
        catch(err){}
        finally{
            if(FavoriteDAO.#conn) FavoriteDAO.#conn.release();
            
        }
        return [];
    }
    static async selectFavoriteByCharacter(userSeq,character){
        let rows;
        try{
            this.initializePool();
            FavoriteDAO.#conn = await FavoriteDAO.#pool.getConnection();
            FavoriteDAO.#conn.query('USE tekkencommandwebdb');
            
            rows = await FavoriteDAO.#conn.query(
                `SELECT comm_num 
                FROM favorite 
                WHERE user_seq = ? and char_name = ? 
                order by comm_num`,
                [userSeq,character]
            );
            return rows;
        }
        catch(err){}
        finally{
            if(FavoriteDAO.#conn) FavoriteDAO.#conn.release();
            
        }
        return [];
    }
    static async insertFavorite(userSeq,charName,commNum){
        let flag = 2;
        try{
            this.initializePool();
            FavoriteDAO.#conn = await FavoriteDAO.#pool.getConnection();
            FavoriteDAO.#conn.query('USE tekkencommandwebdb');
            const res = await FavoriteDAO.#conn.query(
                `INSERT into favorite 
                VALUE(0,?,?,?);
                `,
                [userSeq,charName,commNum]
            );
            if(res.affectedRows===1){
                flag = 1;
            }else{
                flag = 0;
            }
        }
        catch(err){}
        finally{
            if(FavoriteDAO.#conn) FavoriteDAO.#conn.release();
        }
        return flag;
    }
    static async deleteFavorite(userSeq,charName,commNum){
        let flag = 2;
        try{
            this.initializePool();
            FavoriteDAO.#conn = await FavoriteDAO.#pool.getConnection();
            FavoriteDAO.#conn.query('USE tekkencommandwebdb');
            const res = await FavoriteDAO.#conn.query(
                `Delete from favorite 
                Where user_seq = ? and char_name = ? and comm_num = ?;
                `,
                [userSeq,charName,commNum]
            );
            if(res.affectedRows===1){
                flag = 1;
            }else{
                flag = 0;
            }
        }
        catch(err){}
        finally{
            if(FavoriteDAO.#conn) FavoriteDAO.#conn.release();
        }
        return flag;
    }
}


module.exports = FavoriteDAO;