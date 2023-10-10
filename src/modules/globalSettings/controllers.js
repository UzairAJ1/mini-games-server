const { GlobalSettings } = require("../../models/GlobalSettings");

async function setGlobalSettings(req, res) {
  const { likeTimerLimit, likeInteractionLimit, zodiacLimit, paidGifts,
    giftRenewalTime, } = req.body;
  try {
    // Find the existing global settings or create a new one if none exists
    const updatedSettings = await GlobalSettings.findOneAndUpdate(
      {},
      {
        likeTimerLimit,
        likeInteractionLimit,
        zodiacLimit,
        paidGifts,
        giftRenewalTime,
      },
      {
        upsert: true, // Create if not exists, update if exists
        new: true, // Return the updated document
      }
    );

    res.status(200).json({
      status: true,
      message: "Global settings updated successfully.",
      data: updatedSettings,
    });
  } catch (error) {
    console.log("ERROR =====", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating global settings.",
      data: null,
    });
  }
}

const getGlobalSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.findOne();

    res.status(200).json({
      status: true,
      message: "Global Settings",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setGlobalSettings,
  getGlobalSettings,
};
