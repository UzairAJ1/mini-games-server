const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema({
  gifterUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gift: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Gifts = mongoose.model("Gift", giftSchema);

module.exports = {
  Gifts,
};
