const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = Task = model("Task", taskSchema);
