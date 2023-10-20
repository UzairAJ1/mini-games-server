const mongoose = require("mongoose");

const userEngagementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UserEngagement = mongoose.model("UserEngagement", userEngagementSchema);

module.exports = {
    UserEngagement,
};


