const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
require("dotenv").express();
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", indexRouter);

const mongoURI = MONGODB_URI_PROD;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log("DB connection fail", err);
  });

app.listen(5000, () => {
  console.log("server on Port: 5000");
});
