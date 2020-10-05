const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = Task = model("Task", taskSchema);
