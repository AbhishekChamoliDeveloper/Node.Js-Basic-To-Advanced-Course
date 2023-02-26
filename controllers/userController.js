const User = require("../models/userModel");

// Getting All Users Informatins
exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    totalUser: users.length,
    data: users,
  });
};

// Creating New User
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({ name, email, password });

  res.status(201).json({
    message: "User has been Created",
    data: newUser,
  });
};

// Getting User By Id
exports.getUserById = async (req, res) => {
  const id = req.params.id;

  const user = await User.find({ _id: id });

  if (!user) {
    res.status(404).json({ message: "User not founed" });
  }

  res.status(200).json({
    data: user,
  });
};

// Updating By Id
exports.updateUserById = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    new: true,
  });

  res.status(202).json({
    data: updatedUser,
  });
};

// Deleting User by Id
exports.deleteUserById = async (req, res) => {
  const id = req.params.id;

  await User.deleteOne({ _id: id });

  res.status(204).json({});
};
