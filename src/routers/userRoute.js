const express = require("express");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

// Register new user
router.post("/new", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
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

// Get current logged in user
router.get("/profile", auth, async (req, res) => {
  res.send(req.user);
});

// Get all users
router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
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
    res.status(400).send(error);
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
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
