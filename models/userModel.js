const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
    trim: true,
    min: 2,
    max: 40,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    trim: true,
    validate: {
      validator: validator.default.isEmail,
      message: "Email is not valid",
    },
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 18,
    trim: true,
  },
  profile: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
