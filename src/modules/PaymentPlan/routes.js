const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  addPaymentPlan,
  getPaymentPlans,
  getPaymentPlanById,
  updatePaymentPlan,
  deletePaymentPlan,
} = require("./controller");

router.post("/", addPaymentPlan);
router.get("/", getPaymentPlans);
router.get("/:id", getPaymentPlanById);
router.put("/:id", updatePaymentPlan);
router.delete("/:id", deletePaymentPlan);

module.exports = router;
