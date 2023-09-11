const express = require("express");
const requestLogger = require("morgan");
const cors = require("cors");
const indexRouter = require("./modules/index/routes");
const userRouter = require("./modules/user/routes")
const likeRouter = require("./modules/likes/routes")
const globalSettingsRouter = require("./modules/globalSettings/routes")
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
app.use("/images", express.static(path.join(__dirname, "Images")));
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/like", likeRouter);
app.use("/global", globalSettingsRouter);


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
