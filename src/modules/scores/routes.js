const promiseRouter = require("express-promise-router");
const router = promiseRouter();

const {createScore,findHighestScore,findScores,updateScore, findScoresByGameId}=require("./controllers");

router.post("/createScore",createScore);
router.post("/findHighestScore",findHighestScore);
router.post("/findScores",findScores);
router.post("/updateScore/:userName",updateScore);
router.post("/findScoresByGameId",findScoresByGameId);




module.exports=router