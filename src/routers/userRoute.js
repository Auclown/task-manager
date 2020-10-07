const express = require("express");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/new", async (req, res) => {
  // console.log(req.method, req.path);
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/user/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/profile/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/logout_all", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/profile/me", auth, async (req, res) => {
  const allowedUpdates = ["username", "email", "password", "name"];
  const updates = Object.keys(req.params);
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    res.status(400).send({ error: { message: "Invalid update" } });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/profile/me", auth, async (req, res) => {
  try {
    await req.user.remove();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
