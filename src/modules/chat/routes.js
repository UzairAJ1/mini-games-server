const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { sendMessage } = require("./controllers");


router.post("/sendMessage", sendMessage);

module.exports = router;
