const express = require("express");
require("./db/connectDB");
const taskRouter = require("./routers/taskRoute");
const userRouter = require("./routers/userRoute");
const app = express();

app.use(express.json());
app.use("/tasks", taskRouter);
app.use("/users", userRouter);

module.exports = app;
