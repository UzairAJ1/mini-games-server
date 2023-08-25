const promiseRouter = require("express-promise-router");
const router = promiseRouter();
router.get("/", function (req, res) {
  console.log("INSIDE API IS RUNNING");
  res.send({
    name: "API running ✅",
  });
});

module.exports = router;
