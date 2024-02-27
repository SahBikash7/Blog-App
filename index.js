require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const indexRouter = require("./routes/index");

const PORT = Number(process.env.PORT);

const app = express();

mongoose.connect(process.env.DB).then(() => {
  console.log("Database is connected!!!");
});

app.use(express.json());

app.use(morgan("dev"));

app.use(express.static("public"));

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  err = err ? err.toString() : "Something Went Wrong!!!";
  res.status(500).json({ msg: `Error : ${err}` });
});

app.listen(PORT, () => {
  console.log(
    `The application is running at PORT : ${PORT} at URL:"https://localhost:${PORT}`
  );
});
