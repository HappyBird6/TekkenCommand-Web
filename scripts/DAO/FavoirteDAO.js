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
    static async selectFavorite(userTO){
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
                [userTO.seq]
            );
            return rows;
        }
        catch(err){}
        finally{
            if(FavoriteDAO.#conn) FavoriteDAO.#conn.release();
            
        }
        return [];
    }
    static async insertFavorite(userTO,charName,commNum,commentContent){
        let flag = 2;
        try{
            this.initializePool();
            FavoriteDAO.#conn = await FavoriteDAO.#pool.getConnection();
            FavoriteDAO.#conn.query('USE tekkencommandwebdb');
            const res = await FavoriteDAO.#conn.query(
                `INSERT into favorite 
                VALUE(0,?,?,?);
                `,
                [userTO.seq,charName,commNum]
            );
            if(res.affectedRows===1){
                // 댓글 달기 성공
                flag = 1;
            }else{
                //console.log("000 댓글달기 실패");
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