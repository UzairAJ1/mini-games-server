const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  addFeature,
  getFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature,
} = require("./controller");

router.post("/", addFeature);
router.get("/", getFeatures);
router.get("/:id", getFeatureById);
router.put("/:id", updateFeature);
router.delete("/:id", deleteFeature);

module.exports = router;
