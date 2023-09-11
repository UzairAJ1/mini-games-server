const { GlobalSettings } = require("../../models/GlobalSettings"); // Adjust the path accordingly

async function setGlobalSettings(req, res) {
    const { likeTimerLimit, likeInteractionLimit, zodiacLimit } = req.body;
    console.log(req.body)
    try {
        // Find the existing global settings or create a new one if none exists
        const existingSettings = await GlobalSettings.findOneAndUpdate(
            {},
            {
                likeTimerLimit,
                likeInteractionLimit,
                zodiacLimit,
            },
            {
                upsert: true, // Create if not exists, update if exists
                new: true, // Return the updated document
            }
        );

        res.status(200).json({
            status: true,
            message: "Global settings updated successfully.",
            data: existingSettings,
        });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            status: false,
            message: "An error occurred while updating global settings.",
            data: null,
        });
    }
}

module.exports = {
    setGlobalSettings
};
