const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Register new user
router.post("/new", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get one user
router.get("/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = User.findOne({ username });
    res.send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
