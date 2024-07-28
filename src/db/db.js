import mysql from 'mysql';
import db_connection from '../configs/db';

const pool = mysql.createPool({
  connectionLimit: 10, // Số kết nối tối đa trong pool
  ...db_connection
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection lost. Reconnecting...');
      // Bạn có thể thêm logic để thử lại kết nối nếu cần thiết
    } else {
      throw err;
    }
  } else {
    console.log("Connected to the database!");
    connection.release(); // Trả lại kết nối về pool sau khi hoàn thành
  }
});

export default pool;
