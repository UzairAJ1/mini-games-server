const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
  addLike,
  deleteLike,
  getUserLikes,
  getLikes,
  deleteAllLikes,
  getUserLikesData,
  likesStats,
  getMatches,
} = require("./controllers");
// Create a new match
router.post("/matches");

// Get all matches
router.get("/matches");

// Get a specific match by ID
router.get("/matches/:id");

// Update a match by ID
router.put("/matches/:id");

// Delete a match by ID
router.delete("/matches/:id");

module.exports = router;
