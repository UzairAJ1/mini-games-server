const mongoose = require("mongoose");

let GlobalSettingsSchema = new mongoose.Schema({
    zodiacLimit: {
        type: String,
        required: false,
        default: "",
        duplicate: false
    },
    likeInteractionLimit: {
        freeGifts: {
            type: String,
            required: false,
            default: "",
            duplicate: false
        },
        paidGifts: {
            type: String,
            required: false,
            default: "",
            duplicate: false
        },
        giftRenewalTime: {
            type: String,
            required: false,
            default: "",
            duplicate: false
        }
    },
    likeTimerLimit: {
        type: String,
        required: false,
        default: "",
        duplicate: false
    },

});
const GlobalSettings = mongoose.model("GlobalSettings", GlobalSettingsSchema);
module.exports = {
    GlobalSettings,
};
