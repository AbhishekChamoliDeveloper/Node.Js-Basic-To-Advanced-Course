const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const userRouter = require("./routers/userRouter");

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connect To Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use("/", userRouter);

//Exporting
module.exports = app;
