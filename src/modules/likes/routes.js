const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  addLike,
  deleteLike,
  getUserLikes,
  getLikes
} = require("./controllers");

router.post("/addLike", addLike);

router.post("/deleteLike", deleteLike);

router.post("/getUserLikes", getUserLikes);

router.post("/getLikes", getLikes);

module.exports = router;
