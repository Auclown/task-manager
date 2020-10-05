const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

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

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

module.exports = User = model("User", userSchema);
