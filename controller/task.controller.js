const Task = require("../model/Task");

const taskController = {};

taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body;
    const { userId } = req;
    const newTask = new Task({ task, isComplete, author: userId });
    await newTask.save();
    res.status(200).json({ status: "ok", data: newTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

taskController.getTask = async (req, res) => {
  try {
    const taskList = await Task.find({}).populate("author");
    res.status(200).json({ status: "ok", data: taskList });
  } catch (err) {
    res.status(400).json({ status: "fali", error: err });
  }
};

taskController.updateCompleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id },
      [{ $set: { isComplete: { $not: "$isComplete" } } }],
      {
        new: true,
        updatePipeline: true,
      },
    );

    res.status(200).json({ status: "ok", data: updatedTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

taskController.deleteTask = async (req, res) => {
  try {
    // const delTask = await Task.deleteOne({ _id: req.params.id });
    const delTask = await Task.findByIdAndDelete(req.params.id);
    console.log(delTask);

    res.status(200).json({ status: "ok", data: delTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

module.exports = taskController;
