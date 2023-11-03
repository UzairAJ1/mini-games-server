const promiseRouter = require("express-promise-router");
const router = promiseRouter();

const {createScore,findHighestScore,findScores,updateScore}=require("./controllers");

router.post("/createScore",createScore);
router.post("/findHighestScore",findHighestScore);
router.post("/findScores",findScores);
router.post("/updateScore/:userId",updateScore);

module.exports=router