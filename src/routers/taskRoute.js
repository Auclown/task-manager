const express = require("express");
const Task = require("../models/Task");
const auth = require("../middlewares/auth");

const router = express.Router();

// Create new task
router.post("/new", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    author: req.user._id,
  });

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
router.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const author = req.user._id;

  try {
    const task = await Task.findOne({ _id, author });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all tasks of the current logged in user
router.get("/all", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed == "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] == "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update task
router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update" });
  }

  const _id = req.params.id;
  const author = req.user._id;

  try {
    const task = await Task.findOne({ _id, author });

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
router.delete("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const author = req.user._id;

  try {
    const task = Task.findOneAndDelete({ _id, author });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
