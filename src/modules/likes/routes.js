const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  addLike,
  deleteLike,
  getUserLikes,
  getLikes,
  deleteAllLikes,
  getUserLikesData,
  likesStats,
} = require("./controllers");

router.post("/addLike", addLike);

router.post("/deleteLike", deleteLike);

router.post("/getUserLikes", getUserLikes);

router.get("/getLikes", getLikes);

router.delete("/deleteAllLikes", deleteAllLikes);

router.post("/getUserLikesData", getUserLikesData)

router.get("/likesStats", likesStats);

module.exports = router;
