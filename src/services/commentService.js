import con from "../db/db";
const rawData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

const getCommentById = (id) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM comments WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log(rawData(result[0]));
        return resolve(rawData(result[0]));
      }
    );
  });
};
export const addComment = (content, taskid) => {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO comments (content, taskid,timeStamp) VALUES (?, ?,?)",
      [content, taskid, new Date()],
      async(err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(await getCommentById(rawData(result).insertId)   );
      }
    );
  });
};
export const updateDescComment = (content, commentid) => {
  return new Promise((resolve, reject) => {
    con.query(
      "UPDATE   comments SET desc = ? WHERE id = ?",
      [content, commentid],
      async(err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result).length > 0 ? true : false);
      }
    );
  });
};
