const express = require("express");
require("./db/connectDB");
const taskRoute = require("./routers/taskRoute");
const userRoute = require("./routers/userRoute");
const app = express();

app.use(express.json());
app.use("/tasks", taskRoute);
app.use("/users", userRoute);

module.exports = app;
