const mongoose = require("mongoose");

let GlobalSettingsSchema = new mongoose.Schema({
  zodiacLimit: {
    type: Number,
    default: 10,
  },

  giftInteractionLimit: {
    freeGifts: {
      type: Number,
      default: 50,
    },

    paidGifts: {
      type: Number,
      default: 10,
    },

    giftRenewalTime: {
      type: Number,
      default: 24,
    },
  },
  likeLimit:{
    type:Number,
    default:10
  },

  likeTimerLimit: {
    type: Number,
    default: 20,
  },
});

const GlobalSettings = mongoose.model("GlobalSettings", GlobalSettingsSchema);

module.exports = {
  GlobalSettings,
};
