const express = require("express");
const userRouter = require("./routers/userRouter");

const app = express();

app.use(express.json());

app.use("/", userRouter);

//Exporting
module.exports = app;
