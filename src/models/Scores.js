const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userName: {
    type: String,
    ref: "Users",
    required: true
  },
  game_id: {
    type: String,
    ref: "Games",
    required: true
  },
  score: {
    type: String,
    ref: "Games",
    required: true
  },
  game_round: {
    type: Number,
    ref: "Users",
    default: 1
  },
  // Add a timestamp field to store the last time game_round was updated
  lastGameRoundUpdate: {
    type: Date,
    default: Date.now
  }
});

// Define a pre-save middleware to automatically update game_round
scoreSchema.pre("save", function (next) {
  const now = new Date();
  const timeSinceLastUpdate = now - this.lastGameRoundUpdate;
  const hoursSinceLastUpdate = timeSinceLastUpdate / (1000 * 60 * 60);

  // Increment game_round to 2 after 72 hours
  if (this.game_round === 1 && hoursSinceLastUpdate >= 72) {
    this.game_round = 2;
    this.lastGameRoundUpdate = now;
  }

  next();
});

const Scores = mongoose.model("Scores", scoreSchema);

module.exports = {
  Scores
};
