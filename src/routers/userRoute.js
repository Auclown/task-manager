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

// Update user
router.patch("/:username", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password", "name"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update." });
  }

  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.send(404).send({ error: "User not found" });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete user
router.delete("/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = User.findOneAndDelete({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
