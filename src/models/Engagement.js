const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  engages: {
    type: Number,
    default: 0,
  },
});

const engagements = mongoose.model("engagements", engagementSchema);

module.exports = { engagements };
