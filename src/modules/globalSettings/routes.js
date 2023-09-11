const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
    setGlobalSettings
} = require("./controllers");

router.post("/globalSettings", setGlobalSettings);

module.exports = router;