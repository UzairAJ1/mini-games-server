const promiseRouter = require("express-promise-router");
const router = promiseRouter();

const { createUser,updateUser } = require("./controllers");

router.post("/createUser", createUser);

router.post("/updateUser/:user_id",updateUser);

module.exports = router;