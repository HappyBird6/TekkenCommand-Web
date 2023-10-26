require('dotenv').config();
const mariadb = require('mariadb');

// 누군가 db에 댓글을 쓰면 db갱신, 추천은 갱신x
class CommentDAO{
    static #pool;
    static #conn;
    static async initializePool() {
        if (CommentDAO.#pool) {
            return;
        }
        CommentDAO.#pool = mariadb.createPool({
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            connectionLimit: 5
        });
    }
    static async getComments(charName,commNum){
        let comments
        try{
            this.initializePool();
            CommentDAO.#conn = await CommentDAO.#pool.getConnection();
            CommentDAO.#conn.query('USE tekkencommandwebdb');
            
            comments = await CommentDAO.#conn.query(
                `SELECT seq, user_seq, user_nickname, comment, date_format(wdate,"%y.%m.%d %H:%i") wdate, up, down 
                FROM comments 
                WHERE char_name = ? and comm_num = ? 
                order by seq desc limit 100`,
                [charName,commNum]
            );
            return comments;
        }
        catch(err){}
        finally{
            if(CommentDAO.#conn) CommentDAO.#conn.release();
            
        }
        return [];
    }
    static async insertComment(userTO,charName,commNum,commentContent){
        let flag = 2;
        try{
            this.initializePool();
            CommentDAO.#conn = await CommentDAO.#pool.getConnection();
            CommentDAO.#conn.query('USE tekkencommandwebdb');
            const res = await CommentDAO.#conn.query(
                `INSERT into comments 
                VALUE(0,?,?,?,?,?,now(),0,0);
                `,
                [userTO.seq,userTO.nickname,charName,commNum,commentContent]
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
            if(CommentDAO.#conn) CommentDAO.#conn.release();
        }
        return flag;
    }
    static async voteComment(up,comment_seq,user_seq){
        let flag = 0;
        try{
            this.initializePool();
            CommentDAO.#conn = await CommentDAO.#pool.getConnection();
            CommentDAO.#conn.query('USE tekkencommandwebdb');
            
            let dUp = up==='true'? 1 : -1;
            const res = await CommentDAO.#conn.query(
                `
                INSERT into recommendation 
                VALUES(?,?,?);
                `,
                [comment_seq,user_seq,dUp]
            );
            if(res.affectedRows===1){
                flag = CommentDAO.updateUp(up,comment_seq);
            }else{
                flag = 0;
            }
        }catch(err){
            //console.log(err);
            return 0;
        }finally{
            if(CommentDAO.#conn) CommentDAO.#conn.release();
        }
        return flag;
    }
    static async updateUp(up,comment_seq){
        let flag = 0;
        try{           
            this.initializePool();
            CommentDAO.#conn = await CommentDAO.#pool.getConnection();
            CommentDAO.#conn.query('USE tekkencommandwebdb');        
            
            if(up==='true'){
                const res = await CommentDAO.#conn.query(
                    `
                    UPDATE comments 
                    SET up = up+1 
                    WHERE seq=?; 
                    `,
                    [comment_seq]
                );
                flag = res.affectedRows;
            }else if(up==='false'){

                const res = await CommentDAO.#conn.query(
                    `
                    UPDATE comments 
                    SET down = down + 1
                    WHERE seq=?; 
                    `,
                    [comment_seq]
                );
                flag = res.affectedRows;
            }
        }
        catch(err){}
        finally{
            if(CommentDAO.#conn) CommentDAO.#conn.release();
        }
        return flag;
    }
}


module.exports = CommentDAO;





// 추천 비추천시 이미 추천했는지 안했는지 검사
// 추천 비추천시 페이지 새로고침;