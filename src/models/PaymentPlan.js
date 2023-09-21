const mongoose = require("mongoose");

let PaymentPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add paln name"],
  },

  description: {
    type: String,
    required: [true, "Please add paln description"],
  },

  amount: {
    type: Number,
    required: [true, "Please add amount"],
  },

  likesLimit: {
    type: Number,
    required: [true, "Please add likes limit"],
  },

  spinsLimit: {
    type: Number,
    required: [true, "Please add spins limit"],
  },

  giftsLimit: {
    type: Number,
    required: [true, "Please add gifts limit"],
  },

  resetDuration: {
    type: Number,
    required: [true, "Please add reset duration"],
  },

  seeLikes: {
    type: Boolean,
    required: true,
  },

  transactionId: {
    type: String,
    required: [true, "Please add transaction id"],
  },
});

const PaymentPlan = mongoose.model("PaymentPlan", PaymentPlanSchema);
module.exports = {
  PaymentPlan,
};
