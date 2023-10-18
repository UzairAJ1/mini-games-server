const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  matchedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  isChatEnabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Matches = mongoose.model("Match", matchSchema);

module.exports = {
  Matches,
};
