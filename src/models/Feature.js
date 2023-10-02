const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
  },
  description: {
    type: String,
    required: [true, "Please add description"],
  },
});

const Feature = mongoose.model("Feature", FeatureSchema);
module.exports = {
  Feature,
};
