const express = require("express");
require("./db/connectDB");
const app = express();

app.use(express.json());

module.exports = app;
