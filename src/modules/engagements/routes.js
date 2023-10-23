const promiseRouter = require("express-promise-router");
const router = promiseRouter();

const { addEngagement } = require("./controllers");

router.post("/addEngagement", addEngagement);

module.exports = router;
