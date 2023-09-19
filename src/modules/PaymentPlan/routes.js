const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  addPaymentPlan,
  getPaymentPlans,
  updatePaymentPlan,
  deletePaymentPlan,
} = require("./controller");

router.post("/paymentPlan", addPaymentPlan);
router.get("/paymentPlan", getPaymentPlans);
router.put("/paymentPlan/:id", updatePaymentPlan);
router.delete("/paymentPlan/:id", deletePaymentPlan);

module.exports = router;
