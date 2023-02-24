const { json } = require("express");
const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.get("/users", async (req, res) => {
  const filepath = "./users.json";

  const data = await fs.promises.readFile(filepath, "utf-8");
  const users = JSON.parse(data);
  res.status(200).json(users);
});

app.post("/users", async (req, res) => {
  const filepath = "./users.json";
  const data = await fs.promises.readFile(filepath, "utf-8");
  const users = JSON.parse(data);

  const newUser = req.body;
  users.push(newUser);

  const userJson = JSON.stringify(users);
  await fs.promises.writeFile(filepath, userJson, "utf-8");

  console.log(res);
  res.status(200).json(users);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  const filepath = "./users.json";
  const data = await fs.promises.readFile(filepath, "utf-8");
  const users = JSON.parse(data);

  const userIndex = users.findIndex((user) => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(users[userIndex]);
});

app.patch("/users/:id", async (req, res) => {
  const id = req.params.id;

  const filepath = "./users.json";
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
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  const filepath = "./users.json";
  const data = await fs.promises.readFile(filepath, "utf-8");
  let users = JSON.parse(data);

  users = users.filter((user) => user.id !== parseInt(id));

  const userJson = JSON.stringify(users);
  await fs.promises.writeFile(filepath, userJson, "utf-8");

  res.status(200).json();
});

app.get("/image", (req, res) => {
  const filepath = "./image.jpg";

  const stream = fs.createReadStream(filepath);
  stream.pipe(res);
});

app.get("/video", (req, res) => {
  const filepath = "./video.mp4";

  const stream = fs.createReadStream(filepath);
  stream.pipe(res);
});

// Listen on Incoming Request (http://localhost:3000)
app.listen(3000, () => {
  console.log("Server has been started");
});
