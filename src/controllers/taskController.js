import con from "../db/db";
import * as taskService from "..//services/taskService"




export const handleAddTask = async (req, res) => {
  const { taskColumnid, userid,taskname} = req.body;

  if (!taskname || !taskColumnid || !userid) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await taskService.addTask(taskColumnid,userid,taskname);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const handleRemoveTask = async (req, res) => {
  const { taskColumnid, userid,taskPosition} = req.body;

  if ( !taskColumnid || !userid) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await taskService.removeTask(taskColumnid,userid,taskPosition);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const handleDropSameRow = async (req, res) => {
  const { taskColumnid, userid,taskid,fromPosition,toPosition} = req.body;

  // if (  !taskColumnid || !userid || !fromPosition || !toPosition || !taskid) {
  //   return res.status(400).json({ message: "missing params" });
  // }

  try {
    const result = await taskService.dropSameRow(taskColumnid,userid,taskid,fromPosition,toPosition);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const handleDropdifferenceRow = async (req, res) => {
  const { fromTaskColumnid,toTaskColumnid, userid,taskid,fromPosition,toPosition} = req.body;

  try {
    const result = await taskService.dropDifferenceRow(fromTaskColumnid,toTaskColumnid, userid,taskid,fromPosition,toPosition);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleGetTaskByUserId = async (req, res) => {

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await taskService.getTaskByUserId(id);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const handleGetTaskbyId = async (req, res) => {

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await taskService.getTaskById(id);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const handeUpdateDesc = async (req, res) => {
  const { taskid, desc } = req.body;

  if (!taskid || !desc) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await taskService.updateDescTask(taskid, desc);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export const handeUpdateNameTask = async (req, res) => {
  const { taskid, nameTask } = req.body;

  if (!taskid || !nameTask) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await taskService.updateNameTask(taskid, nameTask);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const handeUpdatePosition = async (req, res) => {
  const { taskid, position } = req.body;

  if (!taskid) {
    return res.status(400).json({ message: "missing params" });
  }
  try {
    const result = await taskService.updateDescTask(taskid, position);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
