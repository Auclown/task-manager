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

module.exports = router;
