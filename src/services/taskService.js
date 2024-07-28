import con from "../db/db";

const rawData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

const checkExistFirstTask = (taskColumnid, userid) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM tasks WHERE taskColumnID = ? and userID",
      [taskColumnid, userid],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.length > 0 ? true : false);
      }
    );
  });
};

const deleteTaskbyPosition = (taskColumnid, userid, taskPosition) => {
  return new Promise((resolve, reject) => {
    con.query(
      "DELETE FROM tasks WHERE taskColumnID = ? and userID = ? and position = ?",
      [taskColumnid, userid, taskPosition],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result.affectedRows > 0 ? true : false);
      }
    );
  });
};
const updateTaskByTaskColumn = (toTaskColumnid, taskid) => {
  return new Promise((resolve, reject) => {
    con.query(
      "update  tasks t set t.`taskColumnID`  = ? where   t.`id` = ?",
      [toTaskColumnid, taskid],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result.affectedRows > 0 ? true : false);
      }
    );
  });
};
const getPositionMax = (taskColumnid, userid) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT MAX(position) as max FROM tasks WHERE taskColumnID = ? and userID",
      [taskColumnid, userid],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result[0].max));
      }
    );
  });
};



const getCommentByTaskId = (taskid) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM comments WHERE taskID = ?",
      [taskid],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result));
      }
    );
  });
};
export const getTaskById = (id) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM tasks WHERE id = ?", [id], async (err, result) => {
      if (err) {
        return reject(err);
      }
      try {
        const task = rawData(result[0]);
        const comments = await getCommentByTaskId(task.id);
        task.comments = comments;
        resolve(task);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const handleDropSameRowFromIsLessThanTo = (
  taskColumnid,
  userid,
  fromPosition,
  taskid,
  toPosition
) => {
  return new Promise((resolve, reject) => {
    con.query(
      "UPDATE tasks SET position =  position - 1   WHERE taskColumnID = ? AND userID = ? and ( position > ? and position <= ?)",
      [taskColumnid, userid, fromPosition, toPosition],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (rawData(result).affectedRows > 0) {
          con.query(
            "UPDATE tasks SET position =  ?  WHERE id=?",
            [toPosition, taskid],

            (err, result) => {
              if (err) {
                return reject(err);
              }
              console.log("result", result);
              return resolve(rawData(result).affectedRows > 0 ? true : false);
            }
          );
        }
      }
    );
  });
};
const handleDropSameRowFromIsMoreThanTo = (
  taskColumnid,
  userid,
  fromPosition,
  taskid,
  toPosition
) => {
  return new Promise((resolve, reject) => {
    con.query(
      "UPDATE tasks SET position =  position +1   WHERE taskColumnID = ? AND userID = ? and ( position < ? and position >= ?)",
      [taskColumnid, userid, fromPosition, toPosition],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (rawData(result).affectedRows > 0) {
          con.query(
            "UPDATE tasks SET position =  ?  WHERE id=?",
            [toPosition, taskid],
            (err, result) => {
              if (err) {
                return reject(err);
              }
              console.log("result", result);
              return resolve(rawData(result).affectedRows > 0 ? true : false);
            }
          );
        }
      }
    );
  });
};

const getAllTaskCloumn = () => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM taskcolumns", (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(rawData(result));
    });
  });
};

const getTaskByTaskColumnID = (taskColumnID, userid) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM tasks WHERE taskColumnID = ? and userID = ? order by position asc",
      [taskColumnID, userid],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result));
      }
    );
  });
};

export const dropSameRow = (
  taskColumnid,
  userid,
  taskid,
  fromPosition,
  toPosition
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (fromPosition < toPosition) {
        const result = await handleDropSameRowFromIsLessThanTo(
          taskColumnid,
          userid,
          fromPosition,
          taskid,
          toPosition
        );

        resolve(result);
      } else {
        console.log("có lọt vào đây không");
        const result = await handleDropSameRowFromIsMoreThanTo(
          taskColumnid,
          userid,
          fromPosition,
          taskid,
          toPosition
        );
        resolve(result);
      }
    } catch (error) {
      console.log("error 3", error);
      reject(error);
    }
  });
};
export const dropDifferenceRow = (
  fromTaskColumnid,
  toTaskColumnid,
  userid,
  taskid,
  fromPosition,
  toPosition
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isUpdate = await updateTaskByTaskColumn(toTaskColumnid, taskid);
      if (isUpdate) {
        con.query(
          "UPDATE tasks SET position = position -1 WHERE taskColumnID = ? AND userID = ? AND position > ?",
          [fromTaskColumnid, userid, fromPosition],
          (err, result) => {
            if (err) {
              return reject(err);
            }
          }
        );

        con.query(
          "UPDATE tasks SET position = position + 1 WHERE position >= ? and taskColumnID = ? AND userID = ?",
          [toPosition, toTaskColumnid, userid],
          (err, result) => {
            if (err) {
              return reject(err);
            }
            console.log("result ne hihihihihihihihi", result);
          }
        );
        con.query(
          "UPDATE tasks SET position = ? WHERE id = ?",
          [toPosition, taskid],
          (err, result) => {
            if (err) {
              return reject(err);
            }
            return resolve(result.affectedRows > 0);
          }
        );
      }
    } catch (error) {
      console.log("error 3", error);
      reject(error);
    }
  });
};
export const getTaskByUserId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let taskColumns = await getAllTaskCloumn();

      for (let i = 0; i < taskColumns.length; i++) {
        const tasks = await getTaskByTaskColumnID(taskColumns[i].id, id);
        taskColumns[i].tasks = tasks;
      }

      resolve(taskColumns);
    } catch (error) {
      return reject(error);
    }
  });
};
export const addTask = (taskColumnid, userid, taskname) => {
  return new Promise(async (resolve, reject) => {
    const existFirstTask = await checkExistFirstTask(taskColumnid, userid);

    const position = existFirstTask
      ? (await getPositionMax(taskColumnid, userid)) + 1
      : 0;

    con.query(
      "INSERT INTO tasks (taskColumnID, userID, name, position,createdAt,updatedAt) VALUES (?, ?, ?, ?,?,?)",
      [taskColumnid, userid, taskname, position, new Date(), new Date()],
      async (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(
          result.affectedRows > 0 ? await getTaskById(result.insertId) : false
        );
      }
    );
  });
};

export const removeTask = (taskColumnid, userid, taskPosition) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (taskPosition == 0) {
        await deleteTaskbyPosition(taskColumnid, userid, taskPosition);
        resolve(true);
      }
      const isRemove = await deleteTaskbyPosition(
        taskColumnid,
        userid,
        taskPosition
      );

      if (isRemove) {
        con.query(
          "UPDATE tasks SET position = position - 1 WHERE taskColumnID = ? AND userID = ? AND position > ?",
          [taskColumnid, userid, taskPosition],
          (err, result) => {
            if (err) {
              return reject(err);
            }

            return resolve(result.affectedRows > 0);
          }
        );
      } else {
        return resolve(false);
      }
    } catch (error) {
      return reject(error);
    }
  });
};
export const updateDescTask = (taskid, desc) => {
  return new Promise(async (resolve, reject) => {
    con.query(
      "update  tasks t set t.`desc`  = ? where  t.id = ?",
      [desc, taskid],
      async (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result).affectedRows > 0 ? true : false);
      }
    );
  });
};

export const updateNameTask = (taskid, name) => {
  return new Promise(async (resolve, reject) => {
    con.query(
      "update  tasks t set t.`name`  = ? where  t.id = ?",
      [name, taskid],
      async (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result).affectedRows > 0 ? true : false);
      }
    );
  });
};

export const updatePositionTask = (taskid, position) => {
  return new Promise(async (resolve, reject) => {
    con.query(
      "update  tasks t set t.position  = ? where  t.id = ?",
      [position, taskid],
      async (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(rawData(result).affectedRows > 0 ? true : false);
      }
    );
  });
};
