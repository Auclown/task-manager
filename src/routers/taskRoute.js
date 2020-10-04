const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create new task
router.post("/new", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get one task
router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = Task.findOne({ _id });
    res.send(task);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Update task
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update" });
  }

  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id });

    if (!task) {
      return res.send(404).send({ error: "Task not found" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = Task.findOneAndDelete({ _id });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
