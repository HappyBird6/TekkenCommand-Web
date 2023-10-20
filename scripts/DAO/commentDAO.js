require('dotenv').config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER, 
    password: process.env.DBPASS,
    connectionLimit: 5
});
// 2. 스킬별로 댓글 개수를 렉이 안걸릴 정도로 제한하는 것 한 10000개 까지만?
// 누군가 db에 댓글을 쓰면 db갱신, 추천은 갱신x

exports.getComments = async function(charName,commNum){
    let conn, comments
    try{  
        conn = await pool.getConnection();
        conn.query('USE tekkencommandwebdb');
        
        comments = await conn.query(
            'SELECT user_seq, comment, wdate, up, down FROM comments WHERE char_name = ? and comm_num = ? order by seq desc limit 100',
            [charName,commNum]
        );
        //console.log(JSON.stringify(comments));
    }
    catch(err){}
    finally{
        if(conn) conn.release();
        return comments;
    }
}