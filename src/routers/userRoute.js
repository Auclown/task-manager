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
    res.status(400).send(error);
  }
});

module.exports = router;
