const promiseRouter = require("express-promise-router");
const router = promiseRouter();

const {createGame,findGame,findAllGames}=require("./controllers");

router.post("/createGame",createGame);
router.post("/findGame",findGame);
router.get("/findAllGames",findAllGames);

module.exports=router;