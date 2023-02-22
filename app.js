const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Chirag", email: "chirag@gmail.com" },
  { id: 2, name: "Abhishek", email: "abhishek@gmail.com" },
];

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.get("/users", (req, res) => {
  res.send(JSON.stringify(users));
});

app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);

  console.log(users);
  res.send("User has been uploaded");
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
