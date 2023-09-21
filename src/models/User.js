const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
  type: String,
  text: String,
});

let UserSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    default: "",
    duplicate: false,
    required: true,
  },
  fullName: {
    type: String,
    default: "",
    duplicate: false,
  },
  dateOfBirth: {
    type: Date,
    default: "",
    duplicate: false,
  },
  gender: {
    type: String,
    default: "",
    duplicate: false,
  },
  interests: {
    type: Array,
    default: [],
    duplicate: false,
  },
  profileImages: {
    type: Array,
    default: [],
    duplicate: false,
  },
  discreetMode: {
    type: Boolean,
    default: false,
    duplicate: false,
  },
  subscriptionType: {
    type: String,
    default: "",
    duplicate: false,
  },
  aboutYou: {
    type: String,
    default: "",
    duplicate: false,
  },
  sexualOrientation: {
    type: String,
    default: "",
    duplicate: false,
  },
  lookingFor: {
    type: String,
    default: "",
    duplicate: false,
  },
  wantToSee: {
    type: String,
    default: "",
    duplicate: false,
  },
  distance: {
    type: String,
    default: "",
    duplicate: false,
  },
  ageRange: {
    type: Object,
    default: "",
    duplicate: false,
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  userType: {
    type: String,
    default: "user",
    duplicate: false,
    enum: ["user", "admin"],
  },
  location: {
    lat: {
      type: Number,
      default: null,
    },
    long: {
      type: Number,
      default: null,
    }
  },
  myGiftsCollection: [GiftSchema],
});
const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
};
