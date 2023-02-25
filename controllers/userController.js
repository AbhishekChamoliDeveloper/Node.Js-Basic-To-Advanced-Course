const fs = require("fs");
const path = require("path");

// Global Filepath
const filepath = path.join(__dirname, "../data", "users.json");

// Getting All Users Informatins
exports.getAllUsers = async (req, res) => {
  const data = await fs.promises.readFile(filepath, "utf-8");
  const users = JSON.parse(data);
  res.status(200).json(users);
};

// Creating New User
exports.createUser = async (req, res) => {
  const data = await fs.promises.readFile(filepath, "utf-8");
  const users = JSON.parse(data);

  const newUser = req.body;
  users.push(newUser);

  const userJson = JSON.stringify(users);
  await fs.promises.writeFile(filepath, userJson, "utf-8");

  res.status(200).json(users);
};

// Getting User By Id
exports.getUserById = async (req, res) => {
  const id = req.params.id;

  const data = await fs.promises.readFile(filepath, "utf-8");
  const users = JSON.parse(data);

  const userIndex = users.findIndex((user) => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(users[userIndex]);
};

// Updating By Id
exports.updateUserById = async (req, res) => {
  const id = req.params.id;

  const data = await fs.promises.readFile(filepath, "utf-8");
  const users = JSON.parse(data);

  const userIndex = users.findIndex((user) => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;

  const userJson = JSON.stringify(users);
  await fs.promises.writeFile(filepath, userJson, "utf-8");

  res.status(202).json(updatedUser);
};

// Deleting User by Id
exports.deleteUserById = async (req, res) => {
  const id = req.params.id;

  const data = await fs.promises.readFile(filepath, "utf-8");
  let users = JSON.parse(data);

  users = users.filter((user) => user.id !== parseInt(id));

  const userJson = JSON.stringify(users);
  await fs.promises.writeFile(filepath, userJson, "utf-8");

  res.status(200).json();
};
