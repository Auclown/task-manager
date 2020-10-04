const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(input) {
      if (!isEmail(input)) {
        throw new Error("Invalid email address.");
      }
    },
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    maxlength: 16,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
});

module.exports = User = model("User", userSchema);
