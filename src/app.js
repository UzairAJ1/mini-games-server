const express = require("express");
const requestLogger = require("morgan");
const cors = require("cors");





const indexRouter = require("./modules/index/routes");


const userRouter=require("./modules/user/routes");
const gameRouter=require("./modules/games/routes")
const scoreRouter=require("./modules/scores/routes");
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


app.use("/user",userRouter);
app.use("/game",gameRouter);
app.use("/score",scoreRouter);
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
