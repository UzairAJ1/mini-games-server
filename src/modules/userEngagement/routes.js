const promiseRouter = require("express-promise-router");
const router = promiseRouter();
const {
    createEngagement,
    getAllEngagements,
    getEngagementById,
    updateEngagementById,
    deleteEngagementById,
    filterEngagementsByTime
} = require("./controllers");

// Create a new match
router.post("/addEngagement", createEngagement);

// Get all matches
router.get("/getAllEngagements", getAllEngagements);

// Get a specific match by ID
router.get("/getEngagement/:id", getEngagementById);

// Update a match by ID
router.put("/updateEngagement/:id", updateEngagementById);

// Delete a match by ID
router.delete("/deleteEngagement/:id", deleteEngagementById);

// Filter by date
router.get("/filterByTime", filterEngagementsByTime);



module.exports = router;
