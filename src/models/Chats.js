const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chats = mongoose.model("Chat", chatSchema);

module.exports = {
  Chats,
};
