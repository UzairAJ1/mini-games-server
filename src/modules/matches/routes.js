const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  createMatch,
  getAllMatches,
  getMatchById,
  updateMatchById,
  deleteMatchById
} = require("./controllers");

// Create a new match
router.post("/matches", createMatch);

// Get all matches
router.get("/matches", getAllMatches);

// Get a specific match by ID
router.get("/matches/:id", getMatchById);

// Update a match by ID
router.put("/matches/:id", updateMatchById);

// Delete a match by ID
router.delete("/matches/:id", deleteMatchById);

module.exports = router;
