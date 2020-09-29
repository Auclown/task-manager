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

module.exports = router;
