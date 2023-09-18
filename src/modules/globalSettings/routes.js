const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const { setGlobalSettings, getGlobalSettings } = require("./controllers");

router.post("/globalSettings", setGlobalSettings);
router.get("/globalSettings", getGlobalSettings);

module.exports = router;
