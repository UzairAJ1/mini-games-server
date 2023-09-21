const { Feature } = require("../../models/Feature");

const addFeature = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      res.status(400).json("All fields are required.");
    }

    const feature = await Feature.create({ name, description });

    res.status(200).json({
      status: true,
      message: "Feature added successfully.",
      data: feature,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to create feature." });
  }
};

const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find();

    res.status(200).json({
      status: true,
      message: "Features retrieved successfully.",
      data: features,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve features." });
  }
};

const getFeatureById = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findById(id);

    if (!feature) {
      res.status(404).json({
        status: false,
        message: "Feature not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature retrieved successfully.",
      data: feature,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve feature.",
    });
  }
};

const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeature = req.body;

    const feature = await Feature.findByIdAndUpdate(id, updatedFeature, {
      new: true,
    });

    if (!feature) {
      return res
        .status(404)
        .json({ success: false, error: "Feature not found." });
    }

    res.status(200).json({
      success: true,
      message: "Feature updated successfully",
      data: feature,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update feature.",
    });
  }
};

const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params.id;

    const deleteFeature = await Feature.findByIdAndRemove(id);

    if (!deleteFeature) {
      res.status(404).json({
        success: false,
        error: "Feature not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature deleted successfully.",
      data: deleteFeature,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete feature.",
    });
  }
};

module.exports = {
  addFeature,
  getFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature,
};
