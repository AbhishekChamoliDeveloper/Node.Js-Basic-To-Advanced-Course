const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const globalErrorHandler = require("./utility/errorHandler");

dotenv.config();

const userRouter = require("./routers/userRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connect To Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", userRouter);

app.use(globalErrorHandler);

//Exporting
module.exports = app;
