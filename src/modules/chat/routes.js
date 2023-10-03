const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { sendMessage } = require("./controllers");
const { getAllMessages } = require("./controllers");
router.post("/sendMessage", sendMessage);
router.post("/getAllMessages", getAllMessages);

module.exports = router;
