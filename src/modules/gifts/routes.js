const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  sendGift,
  deleteGift,
  getUserGifts,
  getGifts,
  deleteAllGifts,
  getUserGiftsData,
} = require("./controllers");

router.post("/sendGift", sendGift);

router.post("/deleteGift", deleteGift);

router.post("/getUserGifts", getUserGifts);

router.get("/getGifts", getGifts);

router.delete("/deleteAllGifts", deleteAllGifts)

router.post("/getUserGiftsData", getUserGiftsData)

module.exports = router;