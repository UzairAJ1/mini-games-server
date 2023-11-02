const express = require("express");
const requestLogger = require("morgan");
const cors = require("cors");





const indexRouter = require("./modules/index/routes");

const chatRouter = require("./modules/chat/routes");

// const engagementRouter = require("./modules/engagements/routes");



const app = express();





const path = require("path");
app.use(requestLogger("tiny"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());

app.use("/", indexRouter);

app.use("/chat", chatRouter);

app.use(function (error, req, res, next) {
  if (!res.headersSent && error.statusCode) {
    res.status(error.statusCode).send({
      error: error,
    });
  } else {
    next(error);
  }
});

module.exports = app;
