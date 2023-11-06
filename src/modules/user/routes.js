const promiseRouter = require("express-promise-router");
const router = promiseRouter();

const { createUser,updateUser,loginUser } = require("./controllers");

router.post("/createUser", createUser);

router.post("/updateUser/:userName",updateUser);

router.post("/loginUser",loginUser);


module.exports = router;